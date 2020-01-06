import { Injectable, OnDestroy } from '@angular/core';
import { pluck, shareReplay } from 'rxjs/operators';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Observable, Subscription } from 'rxjs';

interface WithLikes {
  likesCount: number
}

interface Author extends WithLikes {
  id: number
  name: string
}

interface Article extends WithLikes {
  id: number
  title: string
  lastUpdate: string
  author?: Author
}


@Injectable({
  providedIn: 'root'
})
export class ArticlesService implements OnDestroy {
  private subscription = new Subscription();
  private updates = this.apollo.subscribe<Article>({
    query: NEW_LIKE
  });

  private articlesQuery = this.apollo.watchQuery<{ articles: Article[] }>({
    query: ARTICLES_QUERY
  });
  private articles = this.articlesQuery.valueChanges.pipe(
    pluck('data', 'articles'),
    shareReplay({ bufferSize: 1, refCount: true })
  );
  private updatesReady = false;

  constructor(
    private apollo: Apollo
  ) {
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  getArticles(): Observable<Article[]> {
    this.setupUpdates();
    return this.articles;
  }

  like(article: any) {
    return this.apollo.mutate({
      mutation: LIKE_ARTICLE,
      variables: {
        id: article.id
      },
      optimisticResponse: {
        __typename: 'Mutation',
        like: {
          __typename: 'Article',
          id: article.id,
          likesCount: article.likesCount + 1,
          lastUpdate: new Date().toISOString()
        }
      }
    });
  }

  private setupUpdates() {
    if (this.updatesReady) return;

    this.subscription.add(
      this.updates.subscribe()
    );

    const unsubscribe = this.articlesQuery.subscribeToMore<{ newArticle: Article }>({
      document: NEW_ARTICLE,
      updateQuery: (
        prev: { articles: Article[] },
        { subscriptionData }
      ): { articles: Article[] } => {
        if (!subscriptionData.data) {
          return prev;
        }
        const article = subscriptionData.data.newArticle;
        return {
          ...prev,
          articles: [...prev.articles, article]
        };
      }
    });
    this.subscription.add(unsubscribe);
    this.updatesReady = true;
  }

}

const ArticleData = gql`
  fragment ArticleData on Article {
    id
    title
    likesCount
    lastUpdate
  }
`;
const AuthorData = gql`
  fragment AuthorData on Author {
    id
    name
    likesCount
  }
`;

const ARTICLES_QUERY = gql`
  query article {
    articles {
      ...ArticleData
      author {
        ...AuthorData
      }
    }
  }
  ${ArticleData}
  ${AuthorData}
`;

export const LIKE_ARTICLE = gql`
  mutation like($id: ID){
    like(article: $id) {
      id
      lastUpdate
      likesCount
    }
  }
`;

export const NEW_ARTICLE = gql`
  subscription {
    newArticle {
      ...ArticleData
      author {
        ...AuthorData
      }
    }
  }
  ${ArticleData}
  ${AuthorData}
`;

const NEW_LIKE = gql`
  subscription {
    likesCountChanged {
      id
      likesCount
      lastUpdate
      author {
        ...AuthorData
      }
    }
  }
  ${AuthorData}
`;

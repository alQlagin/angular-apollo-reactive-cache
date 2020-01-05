import { Injectable, OnDestroy } from '@angular/core';
import { pluck, shareReplay } from 'rxjs/operators';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService implements OnDestroy {
  private subscription = new Subscription();
  private updates = this.apollo.subscribe({
    query: NEW_LIKE
  });

  private articlesQuery = this.apollo.watchQuery<any>({
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

  getArticles() {
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
          likesCount: article.likesCount + 1
        }
      }
    });
  }

  private setupUpdates() {
    if (this.updatesReady) return;

    this.subscription.add(
      this.updates.subscribe()
    );

    const unsubscribe = this.articlesQuery.subscribeToMore({
      document: NEW_ARTICLE,
      updateQuery: (prev: any, { subscriptionData }) => {
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

const ARTICLES_QUERY = gql`
  query article {
    articles {
      id
      title
      likesCount
      author {
        id
        name
        likesCount
      }
    }
  }`;

export const LIKE_ARTICLE = gql`
  mutation like($id: ID){
    like(article: $id) {
      id
      likesCount
    }
  }`;

export const NEW_ARTICLE = gql`
  subscription {
    newArticle {
      id
      title
      likesCount
      author {
        id
        name
        likesCount
      }
    }
  }`;

const NEW_LIKE = gql`subscription {
  likesCountChanged {
    id
    likesCount
    author {
      id
      likesCount
    }
  }
}`;

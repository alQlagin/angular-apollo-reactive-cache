import { Args, Mutation, Parent, Query, ResolveProperty, Resolver, Subscription } from '@nestjs/graphql';
import { Article, ArticleService } from './article.service';
import { AuthorService } from './author.service';
import { PubSub } from 'graphql-subscriptions';

const NEW_ARTICLE = 'NEW_ARTICLE';
const LIKE_ARTICLE = 'LIKE_ARTICLE';

@Resolver('Article')
export class ArticleResolver {
  private pubsub = new PubSub();

  constructor(
    private articleService: ArticleService,
    private authorService: AuthorService
  ) {
  }

  @Query()
  articles() {
    return this.articleService.getArticles();
  }

  @Mutation()
  async postArticle(@Args('data') { title, author }) {
    const article = await this.articleService.post({ title, author: +author });
    this.pubsub.publish(NEW_ARTICLE, article);
    return article;
  }

  @Mutation()
  async like(@Args('article') id) {
    const article = await this.articleService.like(+id);
    this.pubsub.publish(LIKE_ARTICLE, article);
    return article;
  }

  @Subscription('newArticle', {
    resolve: value => value
  })
  newArticle() {
    return this.pubsub.asyncIterator(NEW_ARTICLE);
  }

  @Subscription('likesCountChanged', {
    resolve: value => value
  })
  likesCountChanged() {
    return this.pubsub.asyncIterator(LIKE_ARTICLE);
  }

  @ResolveProperty()
  author(@Parent() article: Article) {
    return this.authorService.findById(+article.author);
  }

  @ResolveProperty()
  lastUpdate(@Parent() article: Article) {
    try {
      return article.lastUpdate.toISOString();
    } catch (e) {
      return null;
    }
  }
}

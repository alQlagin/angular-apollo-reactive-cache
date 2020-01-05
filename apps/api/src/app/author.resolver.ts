import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { Author } from './author.service';
import { ArticleService } from './article.service';

@Resolver('Author')
export class AuthorResolver {
  constructor(
    private articleService: ArticleService
  ) {
  }

  @ResolveProperty()
  articles(@Parent() author: Author) {
    return this.articleService.findByAuthor(author.id);
  }

  @ResolveProperty()
  async likesCount(@Parent() author: Author) {
    const articles = await this.articleService.findByAuthor(author.id);
    return articles.reduce((likes, article) => likes + article.likesCount, 0);
  }
}

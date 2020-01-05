import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { resolve } from 'path';
import { ArticleService } from './article.service';
import { AuthorService } from './author.service';
import { ArticleResolver } from './article.resolver';
import { AuthorResolver } from './author.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      debug: true,
      typePaths: [resolve(__dirname, 'gql', '**/*.graphql')],
      installSubscriptionHandlers: true
    })
  ],
  controllers: [],
  providers: [
    ArticleService,
    AuthorService,
    ArticleResolver,
    AuthorResolver
  ]
})
export class AppModule {}

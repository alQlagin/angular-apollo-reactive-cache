import { Component } from '@angular/core';
import { ArticlesService } from '../services/articles.service';

@Component({
  selector: 'angular-apollo-reactive-cache-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css'],
  providers: [ArticlesService]
})
export class ArticlesComponent {
  articles = this.articlesService.getArticles();

  constructor(
    private articlesService: ArticlesService
  ) {
  }

  like(article: any) {
    this.articlesService.like(article).subscribe();
  }
}

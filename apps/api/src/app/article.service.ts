import { Injectable } from '@nestjs/common';
import { timer } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

export interface Article {
  id: number
  title: string
  likesCount: number
  lastUpdate: Date
  author: number
}

@Injectable()
export class ArticleService {
  private lastId = 3;
  private list: Article[] = [{
    id: 1,
    title: 'First Article',
    likesCount: 0,
    lastUpdate: new Date(),
    author: 1
  }, {
    id: 2,
    title: 'Second Article',
    likesCount: 0,
    lastUpdate: new Date(),
    author: 2
  }, {
    id: 3,
    title: 'Third Article',
    likesCount: 0,
    lastUpdate: new Date(),
    author: 1
  }];

  async getArticles() {
    return this.list;
  }

  async like(id: Article['id']) {
    const article = this.findById(id);
    if (!article) return;
    return timer(5000).pipe(
      tap(() => {
        article.likesCount++;
        article.lastUpdate = new Date();
      }),
      mapTo(article)
    ).toPromise();
  }

  private findById(id: number) {
    return this.list.find(item => item.id === id);
  }

  findByAuthor(author: Article['author']) {
    return this.list.filter(item => item.author === author);
  }

  async post(data: Pick<Article, 'author' | 'title'>) {
    const article: Article = {
      id: ++this.lastId,
      likesCount: 0,
      lastUpdate: new Date(),
      ...data
    };
    this.list.push(article);
    return article;
  }
}

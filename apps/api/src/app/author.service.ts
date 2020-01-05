import { Injectable } from '@nestjs/common';

export interface Author {
  id: number
  name: string
}

@Injectable()
export class AuthorService {
  private list: Author[] = [{
    id: 1,
    name: 'Alex'
  }, {
    id: 2,
    name: 'Denis'
  }];

  findById(id: Author['id']) {
    return this.list.find(item => item.id === id);
  }
}

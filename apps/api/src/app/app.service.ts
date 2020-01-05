import { Injectable } from '@nestjs/common';
import { Message } from '@angular-apollo-reactive-cache/api-interfaces';

@Injectable()
export class AppService {
  getData(): Message {
    return { message: 'Welcome to api!' };
  }
}

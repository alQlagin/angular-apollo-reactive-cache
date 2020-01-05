import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { ArticlesComponent } from './articles/articles.component';

@NgModule({
  declarations: [AppComponent, ArticlesComponent],
  imports: [BrowserModule, HttpClientModule, GraphQLModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

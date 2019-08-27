import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { MessageBoxComponent } from './message-box/message-box.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    ChatWindowComponent,
    MessageBoxComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component } from '@angular/core';
import { CometChatService } from './comet-chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  // public loggedIn: Observable<string> = this.chatService.getSignedIn();

  // constructor(private chatService: CometChatService) {}
}

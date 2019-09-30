import { Component } from '@angular/core';
import { CometChatService } from '../comet-chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  public loggedIn: Observable<string> = this.chatService.getSignedIn();

  constructor(private chatService: CometChatService) {}
}

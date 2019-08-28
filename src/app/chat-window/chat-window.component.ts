import { Component } from '@angular/core';
import { CometChatService } from '../comet-chat.service';
import { Observable } from 'rxjs';
import { scan, map } from 'rxjs/operators';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent {

  public typingIndicator: Observable<boolean> = this.chatService.getTypingIndicator().pipe(map(val => val.typing));
  public who: Observable<string> = this.chatService.getTypingIndicator().pipe(map(val => val.who));

  public messages: Observable<string[]> = this.chatService.getMessages().pipe(
    scan<string>((acc, curr) => [...acc, curr], [])
  );

  constructor(private chatService: CometChatService) {}
}

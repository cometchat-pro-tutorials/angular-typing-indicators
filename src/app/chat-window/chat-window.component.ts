import { Component } from '@angular/core';
import { CometChatService } from '../comet-chat.service';
import { Observable } from 'rxjs';
import { scan, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent {

  public typingIndicator: Observable<boolean> = this.chatService.getTypingIndicator().pipe(map(val => val.length > 0));
  public who: Observable<string> = this.chatService.getTypingIndicator().pipe(filter(val => val.length > 0), map(val => {
    switch(val.length) {
      case 1: return `${val[0]} is typing`;
      case 2: return `${val[0]} and ${val[1]} are typing`;
      default: return `Many poeple are typing`;
    }
  }));

  public messages: Observable<string[]> = this.chatService.getMessages().pipe(
    scan<string>((acc, curr) => [...acc, curr], [])
  );

  constructor(private chatService: CometChatService) {}
}

import { Component, ViewChild, ElementRef } from '@angular/core';
import { CometChatService } from '../comet-chat.service';
import { Observable } from 'rxjs';
import { scan, map, filter, tap } from 'rxjs/operators';

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

  public messages: Observable<any[]> = this.chatService.getMessages().pipe(
    scan<any>((acc, curr) => [...acc, curr], [])
  );

  @ViewChild('conversation', { static: true })
  private conversationContainer: ElementRef;

  constructor(private chatService: CometChatService) {
  }

  public ngOnInit(): void {
    this.messages.pipe(tap(() => {
      this.conversationContainer.nativeElement.scrollTop = this.conversationContainer.nativeElement.scrollHeight;
    })).subscribe();
  }
}

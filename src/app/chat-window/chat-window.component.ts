import { Component, OnInit } from '@angular/core';
import { CometChatService } from '../comet-chat.service';
import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {


  public messages: Observable<string[]> = this.chatService.getMessages().pipe(
    scan<string>((acc, curr) => [...acc, curr], [])
  );

  constructor(private chatService: CometChatService) {}

  ngOnInit() {
  }

}

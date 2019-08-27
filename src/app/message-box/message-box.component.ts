import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CometChatService } from '../comet-chat.service';
import { tap, delay } from 'rxjs/operators';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {

  public messageForm = new FormGroup({
    message: new FormControl('', Validators.required)
  });

  constructor(private chatService: CometChatService) { }

  public send():void {
    this.chatService.sendMessage(this.messageForm.value['message']);
    this.chatService.endTyping();
    this.messageForm.reset();
  }

  ngOnInit() {
    this.messageForm.valueChanges.pipe(
      tap(() => this.chatService.startTyping()),
      delay(3000),
      tap(() => this.chatService.endTyping())
    ).subscribe();
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CometChatService } from '../comet-chat.service';
import { tap, debounceTime } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss']
})
export class MessageBoxComponent implements OnInit {

  public messageForm = new FormGroup({
    message: new FormControl('Type something', Validators.required)
  });

  public touched: Subject<boolean> = new BehaviorSubject(false);

  constructor(private chatService: CometChatService) { }

  public send():void {
    this.chatService.sendMessage(this.messageForm.value['message']);
    this.chatService.endTyping();
    this.messageForm.reset();
  }

  public onFocus(): void {
    if(this.messageForm.controls['message'].value === 'Type something') {
      this.touched.next(true);
      this.messageForm.reset();
    }
  }

  ngOnInit() {
    console.log(this.messageForm.touched);
    this.messageForm.valueChanges.pipe(
      tap(() => this.chatService.startTyping()),
      debounceTime(1500),
      tap(() =>  this.chatService.endTyping())
    ).subscribe();
  }

}

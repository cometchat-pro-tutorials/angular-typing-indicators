import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CometChatService } from '../comet-chat.service';

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
    
    console.log(this.messageForm.value['message']);
    this.chatService.sendMessage(this.messageForm.value['message']);
    this.messageForm.reset();
  }
  ngOnInit() {
  }

}

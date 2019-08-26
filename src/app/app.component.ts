import { Component } from '@angular/core';
import { CometChatService } from './comet-chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'comet-chat';
  public loggedIn: Observable<string>;

  constructor(private chatService: CometChatService) {}

  public ngOnInit(): void {
    this.loggedIn = this.chatService.getSignedIn();
  }

  public switchHero(): void {
    this.chatService.switchHero();
  }
}

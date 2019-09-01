import { Injectable } from '@angular/core';
import { CometChat } from "@cometchat-pro/chat"
import { environment } from 'src/environments/environment';
import { Observable, ReplaySubject, Subject, from, BehaviorSubject } from 'rxjs';
import { filter, flatMap, tap } from 'rxjs/operators';

@Injectable({
 providedIn: 'root'
})

export class CometChatService {
 private initialized: Subject<boolean> = new ReplaySubject();
 private signedIn$: Subject<string> = new ReplaySubject();
 private messages$: Subject<any> = new ReplaySubject();
 private actualImage: string;
 private whoIsTypingArr: string[] = [];
 private whoIsTyping$: Subject<string[]> = new BehaviorSubject([]);

 constructor() {
   CometChat.init(environment.appId).then(_ => {
     console.log('Comet Chat initialized.');
     this.initialized.next(true);
   }, error => {
     console.log('Initialization error: ' + error);
   });

   this.initialized.pipe(filter(val => val)).subscribe(() => {
     let uid = prompt("select hero");
        this.login(uid).subscribe(loggedIn => this.actualImage = loggedIn.avatar);
   });
  }

 public login(uid: string): Observable<any> {
   uid = uid.toLowerCase();
   return this.initialized.pipe(filter(v => v), flatMap(() => {
     return from(CometChat.login(uid, environment.apiKey)).pipe(tap(() => {
       this.signedIn$.next(uid);

       CometChat.addMessageListener('messageListener', new CometChat.MessageListener({
         onTextMessageReceived: message => {
           this.messages$.next({name: message.sender.name, image: message.sender.avatar, message: message.text, arrived:true});
         },
         onTypingStarted: (who) => {
           if(this.whoIsTypingArr.indexOf(who.sender.name) > -1)
            return;
           this.whoIsTypingArr.push(who.sender.name);
           this.whoIsTyping$.next(this.whoIsTypingArr);
          },
         onTypingEnded: (who) => {
          //  console.log(who);
           this.whoIsTypingArr.splice(this.whoIsTypingArr.findIndex(val => val === who.sender.name), 1);
           this.whoIsTyping$.next(this.whoIsTypingArr);
          }
       }));
     }));
   }));
  } 

 public getSignedIn(): Observable<string> {
   return this.signedIn$;
 }

 public sendMessage(content: string): void {
  this.messages$.next({image: this.actualImage, message: content, arrived: false});
   
  let message = new CometChat.TextMessage('supergroup', content, CometChat.MESSAGE_TYPE.TEXT, CometChat.RECEIVER_TYPE.GROUP);

   CometChat.sendMessage(message).catch(console.log);
 }

 public getMessages(): Observable<string> {
   return this.messages$;
 }

 public startTyping(): void {
  CometChat.startTyping(new CometChat.TypingIndicator('supergroup', CometChat.RECEIVER_TYPE.GROUP, {}));
 }

 public endTyping(): void {
  CometChat.endTyping(new CometChat.TypingIndicator('supergroup', CometChat.RECEIVER_TYPE.GROUP, {}));
 }

 public getTypingIndicator(): Observable<any> {
   return this.whoIsTyping$;
 }
}
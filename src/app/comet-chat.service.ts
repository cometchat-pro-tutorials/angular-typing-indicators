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
 private signedIn: string;
 private signedIn$: Subject<string> = new ReplaySubject();
  private isSomeoneTyping$: Subject<any> = new ReplaySubject();
  private isTyping: boolean;
 private messages$: Subject<any> = new ReplaySubject();
 private actualImage: string;

 constructor() {
   CometChat.init(environment.appId).then(_ => {
     console.log('Comet Chat initialized.');
     this.initialized.next(true);
   }, error => {
     console.log('Initialization error: ' + error);
   });

   this.initialized.pipe(filter(val => val)).subscribe(() => {
        this.login('superhero1').subscribe(loggedIn => this.actualImage = loggedIn.avatar);
   });
  }

 public login(uid: string): Observable<any> {
   uid = uid.toLowerCase();
   return this.initialized.pipe(filter(v => v), flatMap(() => {
     return from(CometChat.login(uid, environment.apiKey)).pipe(tap((loggedIn) => {
       this.signedIn = uid;
       this.signedIn$.next(this.signedIn);

       CometChat.addMessageListener('messageListener', new CometChat.MessageListener({
         onTextMessageReceived: message => {
           console.log(message);
           this.messages$.next({image: message.sender.avatar, message: message.text, arrived:true});
         },
         onTypingStarted: (who) => this.isSomeoneTyping$.next({who: who.sender.name, typing: true}),
         onTypingEnded: (who) => this.isSomeoneTyping$.next(({who: who.sender.name, typing: false}))
       }));

     }));
   }));
  } 

 public getSignedIn(): Observable<string> {
   return this.signedIn$;
 }

 public switchHero(): void {
   if (this.signedIn == 'superhero1') {
    this.login('superhero2').subscribe(loggedIn => this.actualImage = loggedIn.avatar);
   } else {
     this.login('superhero1').subscribe(loggedIn => this.actualImage = loggedIn.avatar);
   }
 }

 public sendMessage(content: string): void {
  this.messages$.next({image: this.actualImage, message: content, arrived: false});
   
  let message = new CometChat.TextMessage(this.getReceiver(), content, CometChat.MESSAGE_TYPE.TEXT, CometChat.RECEIVER_TYPE.USER);

   CometChat.sendMessage(message).catch(console.log);
 }

 public getMessages(): Observable<string> {
   return this.messages$;
 }

 private getReceiver(): string {
  return this.signedIn == 'superhero1'?'superhero2':'superhero1';
 }

 public startTyping(): void {
   if (this.isTyping)
    return;
   this.isTyping = true;
  CometChat.startTyping(new CometChat.TypingIndicator(this.getReceiver(), CometChat.RECEIVER_TYPE.USER, {}));
 }

 public endTyping(): void {
   if (!this.isTyping)
    return;
    this.isTyping = false;
  CometChat.endTyping(new CometChat.TypingIndicator(this.getReceiver(), CometChat.RECEIVER_TYPE.USER, {}));
 }

 public getTypingIndicator(): Observable<any> {
   return this.isSomeoneTyping$;
 }
}
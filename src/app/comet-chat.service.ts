import { Injectable } from '@angular/core';
import { CometChat } from "@cometchat-pro/chat"
import { environment } from 'src/environments/environment';
import { Observable, ReplaySubject, Subject, from } from 'rxjs';
import { filter, flatMap, tap } from 'rxjs/operators';

@Injectable({
 providedIn: 'root'
})

export class CometChatService {
 private initialized: Subject<boolean> = new ReplaySubject();
 private signedIn: string;
 private signedIn$: Subject<string> = new ReplaySubject();

 private messages$: Subject<string> = new ReplaySubject();

 constructor() {
   CometChat.init(environment.appId).then(_ => {
     console.log('Comet Chat initialized.');
     this.initialized.next(true);
   }, error => {
     console.log('Initialization error: ' + error);
   });

   this.initialized.pipe(filter(val => val)).subscribe(() => {
        this.login('superhero1').subscribe();
   });
  }

 public login(uid: string): Observable<any> {
   uid = uid.toLowerCase();
   return this.initialized.pipe(filter(v => v), flatMap(() => {
     return from(CometChat.login(uid, environment.apiKey)).pipe(tap(() => {
       this.signedIn = uid;
       this.signedIn$.next(this.signedIn);

       CometChat.addMessageListener('messageListener', new CometChat.MessageListener({
         onTextMessageReceived: message => {
           this.messages$.next(message.text);
         }
       }))
     }));
   }));
  } 

 public getSignedIn(): Observable<string> {
   return this.signedIn$;
 }

 public switchHero(): void {
   if (this.signedIn == 'superhero1') {
    this.login('superhero2').subscribe();
   } else {
     this.login('superhero1').subscribe();
   }
 }


 public sendMessage(content: string): void {
  this.messages$.next(`Me: ${content}`);
   content = `${this.signedIn}: ${content}`;
   const receiver = this.signedIn == 'superhero1'?'superhero2':'superhero1';
   let message = new CometChat.TextMessage(receiver, content, CometChat.MESSAGE_TYPE.TEXT, CometChat.RECEIVER_TYPE.USER);

   CometChat.sendMessage(message).catch(console.log);
 }

 public getMessages(): Observable<string> {
   return this.messages$;
 }
}
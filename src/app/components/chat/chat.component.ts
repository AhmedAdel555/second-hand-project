import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { FormControl } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { combineLatest, filter, map, of, startWith, switchMap, tap } from 'rxjs';
import { User } from '../../models/user';
import { ChatsService } from '../../services/chats.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {

  @ViewChild('endOfChat') endOfChat!: ElementRef;

  user$ = this.usersService.currentUserProfile$;

  searchControl = new FormControl('');
  chatListControl = new FormControl();
  messageControl =new FormControl('');

  users$ = combineLatest([this.usersService.allUsers$ ,
     this.user$,
      this.searchControl.valueChanges.pipe(startWith(''))
    ]).pipe(
      map(([users, user, searchString]) => users.filter(u => u.displayName && u.displayName.toLowerCase().includes(searchString!.toLowerCase()) && u.uid !== user?.uid))
  );

  myChats$ = this.chatsService.myChats$;

  selectedChat$ = combineLatest([
    this.chatListControl.valueChanges,
    this.myChats$
  ]).pipe(
    map(([value, chats]) => chats.find(c => c.id === value[0]))
  )
    
    messages$ = this.chatListControl.valueChanges.pipe(
      map(value => value[0]),
      switchMap(chatId => this.chatsService.getChatMessages$(chatId)),
      tap(() =>{
        this.scrollToBottom();
      })
    )

  constructor(private authService : AuthenticationService , private usersService: UsersService, private chatsService: ChatsService){ }
   
   ngOnInit(): void {
    this.usersService.allUsers$.subscribe(
      (
        auser 
      ) => {console.log(auser)}
    );
   }

   createChat(otherUser: User){
     this.chatsService.isExistingChat(otherUser?.uid).pipe(
      switchMap(chatId => {
        if(chatId)
          {
            return of(chatId);
          }
        else{
          return this.chatsService.createChat(otherUser);
        }  

      })
     ).subscribe(chatId =>
      {
        this.chatListControl.setValue([chatId]);
      }
     )
   }
    
   sendMessage(){
    const message = this.messageControl.value;
    const selectedChatId =this.chatListControl.value[0];

    if (message && selectedChatId) {
      this.chatsService.addChatMessage(selectedChatId, message).subscribe( () => {
        this.scrollToBottom();
      } );
      this.messageControl.setValue('');
    }
   }

  scrollToBottom(){

    setTimeout( () => {
      if (this.endOfChat){
        this.endOfChat.nativeElement.scrollIntoView({behavior:"smooth"})
      }
    }, 100);
    
}

}

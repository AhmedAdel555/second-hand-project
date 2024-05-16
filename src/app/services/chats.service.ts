import { Injectable } from '@angular/core';
import { Firestore, Timestamp, addDoc, collection, collectionData, doc, orderBy, query, updateDoc, where } from '@angular/fire/firestore';
import { User } from '../models/user';
import { Observable, concatMap, map, take } from 'rxjs';
import { UsersService } from './users.service';
import { Chat, Message } from '../models/chats';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  constructor(private firestore: Firestore , private usersService : UsersService) { }

  createChat(otherUser: User): Observable<string> {
    const ref = collection(this.firestore, 'chats');
    return this.usersService.currentUserProfile$.pipe(
        take(1),
        concatMap(user => {

            const data = {
                userIds: [user?.uid, otherUser?.uid],
                users: [
                    {
                        displayName: user?.displayName ?? '',
                        photoURL: user?.photoURL ?? ''
                    },
                    {
                        displayName: otherUser?.displayName ?? '',
                        photoURL: otherUser?.photoURL ?? ''
                    }
                ]
            };

            console.log('Data to be added:', data);

            return addDoc(ref, data);
        }),
        map(ref => ref.id)
    );
}
 
  get myChats$(): Observable<Chat[]>{
    const ref = collection(this.firestore, 'chats');
    return this.usersService.currentUserProfile$.pipe(
      concatMap((user) => {
        const myQuery = query(ref, where('userIds', 'array-contains', user?.uid))
        return collectionData(myQuery, { idField: 'id'}).pipe(
          map(chats => this.addChatNameAndPic(user?.uid ?? '', chats as Chat[]))
        ) as Observable<Chat[]>
      })
    )
  }
   
  addChatMessage(chatId: string, message: string): Observable<any>{
    const ref = collection(this.firestore, 'chats' , chatId , 'messages');
    const chatRef = doc(this.firestore, 'chats', chatId );
    const today =Timestamp.fromDate(new Date());
    return this.usersService.currentUserProfile$.pipe(
      take(1),
      concatMap((user) => addDoc(ref , {
        text: message,
        senderId: user?.uid,
        sendDate: today
      })),
      concatMap(() => updateDoc(chatRef, {lastMessage:message , lastMessageDate: today}))
    );
  }
   getChatMessages$(chatId: string): Observable<Message[]>{
    const ref = collection(this.firestore , 'chats' , chatId , 'messages');
    const queryAll =query(ref , orderBy('sendDate','asc'));
    return collectionData(queryAll) as Observable<Message[]>
   }

   isExistingChat(OtherUserId :string) : Observable<string | null>
  {
     return this.myChats$.pipe(
      take(1),
      map(chats => {
        for(let i=0;i<chats.length; i++)
          {
            if(chats[i].userIds.includes(OtherUserId))
              {
                return chats[i].id;
              }
          }
          return null;
      })
     )

  }

  addChatNameAndPic(currentUserId: string, chats: Chat[]): Chat[]{
  chats.forEach(chat => {
    const otherIndex = chat.userIds.indexOf(currentUserId) ===0 ? 1 : 0;
    const { displayName, photoURL} =chat.users[otherIndex];
    chat.chatName = displayName;
    chat.chatPic = photoURL;
  })
  return chats;
 }
}
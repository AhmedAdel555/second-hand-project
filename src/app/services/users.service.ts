import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, query, setDoc, updateDoc,} from '@angular/fire/firestore';
import { User } from '../models/user';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private firestore: Firestore, private authService: AuthenticationService) { }

  get currentUserProfile$(): Observable<User | null>{
    return this.authService.currentUser$.pipe(
     switchMap(user => {
       if(!user?.uid){
         return of(null);
       }
       const ref = doc(this.firestore, 'users', user.uid);
       return docData(ref) as Observable<User>;
     })
    )
 }

  get allUsers$(): Observable<User[]>{
    const ref = collection(this.firestore, 'users');
    const queryAll = query(ref);
    return collectionData(queryAll) as Observable<User[]>;
  } 

  addUser(user: User): Observable<any>{
    const ref = doc(this.firestore, 'users', user.uid)
    return from(setDoc(ref, user));
  }

  updateUser(user: User): Observable<any>{
    const ref = doc(this.firestore, 'users', user.uid)
    return from(updateDoc(ref , {...user}));
  }
}


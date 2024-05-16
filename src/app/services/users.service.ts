import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, getFirestore, query, setDoc, updateDoc,} from '@angular/fire/firestore';
import { RatingFeedback, User } from '../models/user';
import { Observable, from, map, of, switchMap, take } from 'rxjs';
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

  getUserById(uid: string): Observable<User | null> {
    const ref = doc(this.firestore, 'users', uid);
    return docData(ref) as Observable<User>
  }

  addRatingAndFeedback(uid: string, ratingFeedback: RatingFeedback): Observable<any> {
    return this.getUserById(uid).pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return of(null);
        }
        const updatedUser: User = {
          ...user,
          rate: this.calculateAverageRating(user, ratingFeedback.rating),
          ratingsFeedbacks: [...(user.ratingsFeedbacks || []), ratingFeedback] // Add new feedback to existing feedback
        };
        return this.updateUser(updatedUser); // Update user document in Firestore
      })
    );
  }

  private calculateAverageRating(user: User, newRating: number): number {
    if (!user.rate) {
      return newRating;
    }
    let totalRatings = (user.ratingsFeedbacks || []).reduce((total, ratingFeedback) => {
      return total + ratingFeedback.rating;
    }, 0);
    totalRatings += newRating;
    let newAverageRating = 0;
    if(user.ratingsFeedbacks?.length){
      newAverageRating = totalRatings / (user.ratingsFeedbacks.length + 1)
    }
    return newAverageRating;
  }
}


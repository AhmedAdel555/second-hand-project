// wishlist.service.ts

import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  docData,
  getDocs,
  query,
  setDoc,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  constructor(private firestore: Firestore) {}

  getWishlist(userId: string): Observable<any[]> {
    // Reference to the user's wishlist collection
    const wishlistCollectionRef = collection(
      this.firestore,
      `users/${userId}/wishlist`
    );

    const q = query(wishlistCollectionRef);
    return new Observable<any[]>((subscriber) => {
      getDocs(q)
        .then((querySnapshot) => {
          const wishlistItems: any[] | undefined = [];
          querySnapshot.forEach((doc) => {
            wishlistItems.push(doc.data());
          });
          subscriber.next(wishlistItems);
        })
        .catch((error) => {
          subscriber.error(error);
        });
    });
  }

  removeFromWishlist(userId: string, itemId: string): Promise<void> {
    // Reference to the user's wishlist document to be deleted
    const wishlistDocRef = doc(
      this.firestore,
      `users/${userId}/wishlist/${itemId}`
    );

    // Delete the document
    return deleteDoc(wishlistDocRef);
  }

  // Check if product is in wishlist
  productInWishlist(userId: string, productId: string): Observable<boolean> {
    const wishlistDocRef = doc(
      this.firestore,
      `users/${userId}/wishlist/${productId}`
    );
    return docData(wishlistDocRef).pipe(
      map((data) => !!data) // Convert to boolean
    );
  }

  addToWishlist(productId: string): Observable<any> {
    const wishlistDocRef = doc(this.firestore, 'wishlist', productId);
    const data = { productId, addedAt: new Date().toISOString() };
    return from(setDoc(wishlistDocRef, data));
  }
}

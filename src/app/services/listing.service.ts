// listing.service.ts

import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListingService {

  constructor(private firestore: Firestore) { }

  createListing(listingData: any): Observable<any> {
    const ref = doc(this.firestore, 'listings', listingData.userId);
    return from(setDoc(ref, listingData));
  }
  
}

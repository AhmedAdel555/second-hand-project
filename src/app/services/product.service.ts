import { inject, Injectable } from '@angular/core';
import { Firestore, collection, doc, query, DocumentData, DocumentSnapshot, collectionData, docData, setDoc, updateDoc, addDoc, where, deleteDoc } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';

import { Product } from '../models/products';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  
  firestore = inject(Firestore);
  productsCollectionRef = collection(this.firestore, 'products');

  getProducts(): Observable<Product[]> {
    return collectionData(this.productsCollectionRef,  {
      idField: 'id',
    }) as Observable<Product[]>;
  }

  getProductById(productId: string): Observable<Product | undefined> {
    const productDocRef = doc(this.firestore, 'products', productId);
    return docData(productDocRef, {
      idField: 'id',
    }) as Observable<Product>
  }

  addProduct(product: Product):Observable<any> {
    return from(addDoc(this.productsCollectionRef, product).then((response) => response.id));
  }

  getLikedProductsByUser(user: User): Observable<Product[]> {
    if(user.likedProductsIds && user.likedProductsIds.length > 0){
      const likedProductsQuery = query(this.productsCollectionRef, where('__name__', 'in', user.likedProductsIds));
      return collectionData(likedProductsQuery, { idField: 'id' }) as Observable<Product[]>;
    }
    return of([]);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    console.log(category)
    const productsQuery = query(collection(this.firestore, 'products'), where('category', '==', category));
    return collectionData(productsQuery, { idField: 'id' }) as Observable<Product[]>;
  }

  searchProductsByTitle(title: string): Observable<Product[]> {
    const lowerCaseTitle = title.toLowerCase().trim();
    const productsQuery = query(collection(this.firestore, 'products'), 
        where('title', '>=', lowerCaseTitle),
        where('title', '<=', lowerCaseTitle + '\uf8ff')
    );
    return collectionData(productsQuery, { idField: 'id' }) as Observable<Product[]>;
  }

  getProductsBySellerId(sellerId: string): Observable<Product[]> {
    const productsQuery = query(
      this.productsCollectionRef,
      where('sellerId', '==', sellerId)
    );
    return collectionData(productsQuery, { idField: 'id' }) as Observable<Product[]>;
  }

  deleteProduct(productId: string): Observable<void> {
    const productDocRef = doc(this.firestore, 'products', productId);
    return from(deleteDoc(productDocRef));
  }

  
  updateProductStatus(productId: string, newStatus: 'sold' | 'not sold'): Observable<void> {
    const productDocRef = doc(this.firestore, 'products', productId);
    return from(updateDoc(productDocRef, { status: newStatus }));
  }
}

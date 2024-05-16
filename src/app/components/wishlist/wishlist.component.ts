import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { Product } from '../../models/products';
import { ProductService } from '../../services/product.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(
    private userService: UsersService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.updateWishlistItems();
  }

  toggleWishlistIcon(productId: string | undefined) {
    this.userService.currentUserProfile$.pipe(take(1)).subscribe((user) => {
      if (user && productId) {
        if (user.likedProductsIds && user.likedProductsIds.length > 0) 
        {
          if (!user.likedProductsIds.includes(productId)) {
            user.likedProductsIds = [...user?.likedProductsIds, productId];
          } else {
            user.likedProductsIds = user.likedProductsIds.filter((id) => {
              return id !== productId;
            });
          }
        } 
        else {
          user.likedProductsIds = [productId];
        }
        this.userService.updateUser(user).subscribe(() => {
          this.updateWishlistItems();
        });
      }
    });
  }

  updateWishlistItems() {
    this.userService.currentUserProfile$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.productService
          .getLikedProductsByUser(user)
          .subscribe((products) => {
            this.wishlistItems = products;
          });
      }
    });
  }
}

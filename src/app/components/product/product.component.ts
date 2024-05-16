import { Component, Input, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/products';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product?: Product;

  isInWishlist = false;

  constructor(private productService: ProductService,
    private userService: UsersService,
    private route: ActivatedRoute,
    private naviagetionRouter: Router
  ) {}

  ngOnInit(): void {
    // Fetch the product data from ProductService
    this.productService.getProductById(this.route.snapshot.params['id']).subscribe(product => {
     console.log(product);
     if (product?.id) {
      this.product = product;
      this.doesProductInWithList(product.id)
     }else{
      this.naviagetionRouter.navigate(['/']);
     }
  });
  }

  toggleWishlistIcon(productId: string | undefined) {
    this.userService.currentUserProfile$.pipe(take(1)).subscribe((user) => {
      if(user && productId){
        if(user.likedProductsIds && user.likedProductsIds.length > 0){
          if(!user.likedProductsIds.includes(productId)){
            user.likedProductsIds = [...user?.likedProductsIds, productId]
          }
          else{
            user.likedProductsIds = user.likedProductsIds.filter((id)=>{
              return id !== productId;
            })
          }
        }
        else{
          user.likedProductsIds = [productId]
        }
        this.userService.updateUser(user);
        this.doesProductInWithList(productId);
      }
    })
  }

  doesProductInWithList(productId: string){
    this.userService.currentUserProfile$.subscribe((user) => {
      if(user?.likedProductsIds?.includes(productId)){
        this.isInWishlist = true;
      }
      else{
        this.isInWishlist = false;
      }
    })
  }
 
}

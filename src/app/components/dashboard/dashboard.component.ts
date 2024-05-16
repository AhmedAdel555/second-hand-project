import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/products';
import { ProductService } from '../../services/product.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  userProducts: Product[]  = [];

  numberOfItemSold: number = 0;

  constructor(private productService: ProductService, private userService: UsersService) {}

  ngOnInit(): void {
    this.userService.currentUserProfile$.subscribe((user) => {
      if(user?.uid)
      this.productService.getProductsBySellerId(user.uid)
    .subscribe((produsts) => {
      this.userProducts = produsts
      this.numberOfItemSold = produsts.filter(product => product.status === 'sold').length;
    })
    })
  }

  deleteProduct(productId: string | undefined){
    if(productId){
      this.productService.deleteProduct(productId)
      .subscribe(() => {
        this.userService.currentUserProfile$.subscribe((user) => {
          if(user?.uid)
          this.productService.getProductsBySellerId(user.uid)
        .subscribe((produsts) => {
          this.userProducts = produsts
        })
        })
      })
    }
  }

  makeProductSold(productId: string | undefined){
    if(productId){
      this.productService.updateProductStatus(productId, 'sold').subscribe(() => {
        this.userService.currentUserProfile$.subscribe((user) => {
          if(user?.uid)
          this.productService.getProductsBySellerId(user.uid)
        .subscribe((produsts) => {
          this.userProducts = produsts
        })
        })    
      });
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/products';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit{

  products: Product[] = [];

  constructor(private productService:ProductService, private router: ActivatedRoute){}

  ngOnInit(): void {
    this.router.queryParams.subscribe((params) => {

      const param1: string = params['category'];
      const param2: string = params['title'];
      
      if(param1){
        this.productService.getProductsByCategory(param1).subscribe((products) => {
          console.log(products)
          this.products = products;
        })
      }
      else if(param2){
        this.productService.searchProductsByTitle(param2).subscribe((products) => {
          this.products = products;
        })
      }else{
        this.productService.getProducts().subscribe((products) => {
          this.products = products;
        })
      }
    });
  }
}

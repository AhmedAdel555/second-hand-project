import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/products';
import { ProductService } from '../../services/product.service';
import { UsersService } from '../../services/users.service';import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  userProducts: Product[] = [];

  numberOfItemSold: number = 0;

  public chart: any;

  constructor(
    private productService: ProductService,
    private userService: UsersService
  ) {}

  ngOnInit(): void {
    this.userService.currentUserProfile$.subscribe((user) => {
      if (user?.uid)
        this.productService
          .getProductsBySellerId(user.uid)
          .subscribe((produsts) => {
            this.userProducts = produsts;
            this.numberOfItemSold = produsts.filter(
              (product) => product.status === 'sold'
            ).length;
            this.createChart();
          });
    });
  }

  deleteProduct(productId: string | undefined) {
    if (productId) {
      this.productService.deleteProduct(productId).subscribe(() => {
        this.userService.currentUserProfile$.subscribe((user) => {
          if (user?.uid)
            this.productService
              .getProductsBySellerId(user.uid)
              .subscribe((produsts) => {
                this.userProducts = produsts;
              });
        });
      });
    }
  }

  makeProductSold(productId: string | undefined) {
    if (productId) {
      this.productService
        .updateProductStatus(productId, 'sold')
        .subscribe(() => {
          this.userService.currentUserProfile$.subscribe((user) => {
            if (user?.uid)
              this.productService
                .getProductsBySellerId(user.uid)
                .subscribe((produsts) => {
                  this.userProducts = produsts;
                });
          });
        });
    }
  }

  createChart() {
  
    let summry : {
       "Electronics": number,
       "Clothing": number,
        "Books": number,
        "Furniture": number
    } = {
      "Electronics": 0,
      "Clothing": 0,
      "Books": 0,
      "Furniture": 0
    }
    this.userProducts.forEach((product) => {
          summry[product.category] += 1
    })
    

    this.chart = new Chart('MyChart', {
      type: 'pie', //this denotes tha type of chart
      data: {
        // values on X-Axis
        labels: ['Electronics', 'Clothing', 'Books', 'Furniture'],
        datasets: [
          {
            label: 'My Categories',
            data: [summry.Electronics, summry.Clothing, summry.Books, summry.Furniture],
            backgroundColor: ['red', 'green', 'orange', 'blue'],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }
}

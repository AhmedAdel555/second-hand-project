import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/products';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'], // Corrected 'styleUrl' to 'styleUrls'
})
export class ProfileComponent implements OnInit {

  profileUser: User | undefined;

  userProducts: Product[] = [];

  stars = [1,2,3,4,5]

  rating: number = 0;

  constructor(
    private router: Router,
    private userService: UsersService,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get('id');
      if (userId) {
        this.userService.getUserById(userId).pipe(untilDestroyed(this)).subscribe((user) => {
          if (user) {
            this.profileUser = user;
            this.rating = user.rate ? user.rate : 0 ;
            console.log(user.rate);
            this.productService.getProductsBySellerId(userId)
            .subscribe((products) => {
              this.userProducts = products;
            })
          } else {
            this.router.navigate(['']);
          }
        });
      } else {
        this.router.navigate(['']);
      }
    });
  }
}

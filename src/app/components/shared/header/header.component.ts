import { Component } from '@angular/core';
import { AuthenticationService } from '../../../services/authentication.service';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  user$= this.usersServices.currentUserProfile$;

  constructor(private authService: AuthenticationService , private router: Router, private usersServices: UsersService){ }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['']);
    });
  }

  search(title: string){
    this.router.navigate([`/products`], { queryParams: { title: title } });
  }
}

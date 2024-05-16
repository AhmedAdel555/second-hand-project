import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/signup/signup.component';
import { canActivate, redirectLoggedInTo,redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { ProfileComponent } from './components/profile/profile.component';
import { ListingCreationComponent } from './components/listing-creation/listing-creation.component';
import { ProductDetailsComponent } from './components/product/product.component';
import {WishlistComponent}from './components/wishlist/wishlist.component'
import { LayoutComponent } from './components/layout/layout.component';
import { ProductsComponent } from './components/products/products.component';
import { ChatComponent } from './components/chat/chat.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToHome = () => redirectLoggedInTo([''])

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectToHome)
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    ...canActivate(redirectToHome)
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
      },
      {
        path: 'products',
        component: ProductsComponent,
        ...canActivate(redirectToLogin)
      },
      {
        path: 'profile',
        component: ProfileComponent,
        ...canActivate(redirectToLogin)
      },
      {
        path: 'create',
        component: ListingCreationComponent,
        ...canActivate(redirectToLogin)
      },
      {
        path: 'products/:id',
        component: ProductDetailsComponent,
        ...canActivate(redirectToLogin)
      },
      {
        path: 'wishlist',
        component: WishlistComponent,
        ...canActivate(redirectToLogin)
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        ...canActivate(redirectToLogin)
      },
    ]
  },
  {
    path: 'chats',
    component: ChatComponent,
    ...canActivate(redirectToLogin)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

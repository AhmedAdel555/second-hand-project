import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../environments/environment';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatMenuModule } from '@angular/material/menu';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { ProfileComponent } from './components/profile/profile.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list'
import { MatDividerModule } from '@angular/material/divider';
import { ListingCreationComponent } from './components/listing-creation/listing-creation.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ProductDetailsComponent} from './components/product/product.component';
import { LayoutComponent } from './components/layout/layout.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import {MatCardModule} from '@angular/material/card';
import { ProductsComponent } from './components/products/products.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { ChatComponent } from './components/chat/chat.component';
import { DateDisplayPipe } from './pips/date-display.pipe';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { AccountComponent } from './components/account/account.component';
import { RatingComponent } from './components/rating/rating.component';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    HomeComponent,
    ProfileComponent,
    ListingCreationComponent,
    ProductDetailsComponent,
    LayoutComponent,
    WishlistComponent,
    ProductsComponent,
    ChatComponent,
    DateDisplayPipe,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    AccountComponent,
    RatingComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
    MatMenuModule,
    MatMenuTrigger,
    MatAutocompleteModule,
    MatListModule,
    MatDividerModule,
    CommonModule,
    FormsModule,
    MatCardModule, 
    MatButtonModule,
    MatGridListModule,
    MatFormFieldModule,
    MatNativeDateModule,
  ],
  providers: [
    provideAnimationsAsync(),
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

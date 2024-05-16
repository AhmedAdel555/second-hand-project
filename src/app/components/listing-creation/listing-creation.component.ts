import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ImageUploadService } from '../../services/image-upload.service';
import { ProductService } from '../../services/product.service';
import { cateoryType, Product } from '../../models/products';

@Component({
  selector: 'app-listing-creation',
  templateUrl: './listing-creation.component.html',
  styleUrl: './listing-creation.component.css'
})
export class ListingCreationComponent {
  title: string = '';
  description: string = '';
  price: number = 0;
  image!: File;
  imageUrl: string = '';
  category: cateoryType = 'Electronics'; // Define a property for category
  categories: cateoryType[] = ['Electronics', 'Clothing', 'Books', 'Furniture']; // Example categories

  constructor(
    private authService: AuthenticationService,
    private imageUploadService: ImageUploadService,
    private productService: ProductService
  ) {}

  createListing() {
    const currentUser = this.authService.currentUser$;
    if (currentUser) {
      currentUser.subscribe(user => {
        if (user) {
          const product: Product = {
            title: this.title,
            description: this.description,
            price: this.price,
            imageUrl: this.imageUrl,
            sellerId: user.uid,
            category: this.category,
            status: 'not sold'
          };

          this.productService.addProduct(product).subscribe(() => {
            this.title = '';
            this.description = '';
            this.price = 0;
            this.imageUrl = '';
          }, error => {
            console.error('Error creating listing: ', error);
          });
        }
      });
    }
  }

  onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.imageUploadService.uploadImage(file, file.name).subscribe(url => {
        console.log(url)
        this.imageUrl = url;
      }, error => {
        console.error('Error uploading image: ', error);
      });
    }
  }
}

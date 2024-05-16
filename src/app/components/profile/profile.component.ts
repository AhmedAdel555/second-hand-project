import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ImageUploadService } from '../../services/image-upload.service';
import { HotToastService } from '@ngneat/hot-toast';
import { concatMap } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { User } from '../../models/user';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  user$ =this.usersServices.currentUserProfile$

  profileForm = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl(''),
    displayName: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    address: new FormControl('')
  });
  
  constructor(private authService : AuthenticationService ,private toast: HotToastService, private imageUploadService : ImageUploadService, private usersServices: UsersService){}

   ngOnInit(): void {
    this.usersServices.currentUserProfile$.pipe(
      untilDestroyed(this)
    ).subscribe((user) => {
      this.profileForm.patchValue({ ...user });
    })
   }

   uploadImage(event: any , user: User){
    this.imageUploadService.uploadImage(event.target.files[0], `images/profile/${user.uid}`).pipe(
      this.toast.observe(
        {
          loading: 'Image is being uploaded ...',
          success: 'Image uploaded!',
          error: 'There was an error in uploading'
        }
      ),
      concatMap((photoURL) => this.usersServices.updateUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: photoURL
      }))
    ).subscribe();
   }
   saveProfile(){
    const profileData = this.profileForm.value;
    const userData: User = {
      uid: profileData.uid || '', // Assuming uid cannot be null or undefined
      email: profileData.uid || '', // Assuming uid cannot be null or undefined
      displayName: profileData.displayName || '', // Assuming displayName cannot be null or undefined
      firstName: profileData.firstName || '', // Assuming firstName cannot be null or undefined
      lastName: profileData.lastName || '', // Assuming lastName cannot be null or undefined
      phone: profileData.phone || '', // Assuming phone cannot be null or undefined
      address: profileData.address || '', // Assuming address cannot be null or undefined
  };

    this.usersServices.updateUser(userData).pipe(
      this.toast.observe({
       loading: 'Updating Data...',
       success: 'Data has been updated',
       error: 'There was an error in updating the profile'
      })
        ).subscribe();
    
   }
}
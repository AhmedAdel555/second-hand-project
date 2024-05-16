import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { RatingFeedback } from '../../models/user';


@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css'
})
export class RatingComponent implements OnInit {
  

  stars = [1,2,3,4,5]
  rating = 0;

  comment: string  = "";

  constructor(private userService: UsersService, private router: ActivatedRoute, private route : Router){}

  updateRating(index: number){
    this.rating = index
  }

  onSubmit() {
    
    const id = this.router.snapshot.paramMap.get('id');
    
    this.userService.currentUserProfile$
    .subscribe((user) => {
      if(user){
        const newRating: RatingFeedback = {
          feedback : this.comment,
          rating : this.rating,
          ratedBy : user?.uid
        }
        console.log("hhh")
        if(id){
          console.log("hhh")
          this.userService.addRatingAndFeedback(id, newRating)
          .subscribe(() => {
            console.log("feedback added")
            this.route.navigate([`/profile/${id}`]);
          })
        }
      }
      
    })

  }

  ngOnInit(): void {
    
  }
}
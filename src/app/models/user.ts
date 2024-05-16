export interface User {
  uid: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName? :string;
  photoURL?: string;
  phone?: string;
  address?: string;
  likedProductsIds?: string[];
  ratingsFeedbacks?: RatingFeedback[];
  rate?: number; 
}

export interface RatingFeedback {
  rating: number;
  feedback: string;
  ratedBy: string;
}

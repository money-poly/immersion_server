export class CreateReviewDto {
  postIdx: number;
  restaurantIdx: number;
  content: string;
  score: number;
  image: string[];
}

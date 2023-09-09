import { Injectable, NotFoundException } from "@nestjs/common";
import { ReviewInterface } from "./review.interface";
import { Review } from "resource/db/entities/Review";
import { CreateReviewDto } from "../dto/create-review.dto";
import { UpdateReviewDto } from "../dto/update-review.dto";
import { CustomReviewCommandRepository } from "../repository/review-command.repository";
import { CustomReviewQueryRepository } from "../repository/review-query.repository";
import { UserLoginDto } from "src/users/dto/user-login.dto";
import { ErrorResponse } from "src/aop/exception/error-reponse";

@Injectable()
export class ReviewtIml implements ReviewInterface {
  constructor(
    private readonly customReviewCommandRepository: CustomReviewCommandRepository,
    private readonly customReviewQueryRepository: CustomReviewQueryRepository,
    private errorResponse: ErrorResponse
  ) {}

  //6-1 모든 리뷰 조회
  async getAllReview(): Promise<Review[]> {
    return await this.customReviewQueryRepository.reviewfind();
  }

  //6-2특정리뷰 조회
  async getoneReview(reviewIdx: number): Promise<Review> {
    const review = await this.customReviewQueryRepository.reviewonefind(
      reviewIdx
    );

    if (!review) {
      throw this.errorResponse.notExistReview(reviewIdx);
    }

    return review;
  }

  //6-3리뷰 작성
  async createReview(
    user: UserLoginDto,
    createReviewDto: CreateReviewDto
  ): Promise<any> {
    return this.customReviewCommandRepository.createReview(
      user,
      createReviewDto
    );
  }

  //6-4 특정리뷰 수정
  async updateReview(
    reviewIdx: number,
    updateReviewDto: UpdateReviewDto
  ): Promise<any> {
    const review = await this.customReviewQueryRepository.reviewonefind(
      reviewIdx
    );

    if (!review) {
      throw this.errorResponse.notExistReview(reviewIdx);
    }

    return this.customReviewCommandRepository.updateReview(
      reviewIdx,
      updateReviewDto
    );
  }

  // 6-5특정 리뷰 삭제
  async deleteReview(reviewIdx: number): Promise<Review> {
    const review = await this.customReviewQueryRepository.reviewonefind(
      reviewIdx
    );

    if (!review) {
      throw this.errorResponse.notExistReview(reviewIdx);
    }
    return this.customReviewCommandRepository.delete(reviewIdx);
  }
}

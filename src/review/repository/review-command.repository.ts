//creat,update,delete            save 관련
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Repository } from "typeorm";
import { Review } from "resource/db/entities/Review";
import { UserLoginDto } from "src/users/dto/user-login.dto";
import { CreateReviewDto } from "../dto/create-review.dto";
import { UpdateReviewDto } from "../dto/update-review.dto";
import { ReviewImage } from "resource/db/entities/ReviewImage";

@Injectable()
export class CustomReviewCommandRepository {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>
  ) {}

  async createReview(
    user: UserLoginDto,
    createReviewDto: CreateReviewDto
  ): Promise<any> {
    const queryRunner =
      this.reviewRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const review = queryRunner.manager.getRepository(Review).create();
      (review.userIdx = user.userIdx),
        (review.restaurantIdx = createReviewDto.restaurantIdx),
        (review.content = createReviewDto.content),
        (review.score = createReviewDto.score);
      await queryRunner.manager.getRepository(Review).save(review);

      // 이미지 링크 리스트로 받아서 하나씩 저장
      const imagePromises = createReviewDto.image.map(async (imagePath) => {
        const image = queryRunner.manager.getRepository(ReviewImage).create();
        image.reviewIdx = review.reviewIdx;
        image.imagePath = imagePath;
        await queryRunner.manager.getRepository(ReviewImage).save(image);
      });

      await Promise.all(imagePromises);

      await queryRunner.commitTransaction();
      return { ...review, imagePath: createReviewDto.image };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async updateReview(
    reviewIdx: number,
    updateReviewDto: UpdateReviewDto
  ): Promise<any> {
    const queryRunner =
      this.reviewRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const review = await queryRunner.manager
        .getRepository(Review)
        .findOne({ where: { reviewIdx } });

      const { content, score } = updateReviewDto;

      review.content = content;
      review.score = score;

      await queryRunner.manager.getRepository(Review).save(review);

      if (updateReviewDto.image) {
        // 이미지 있던거 전부 삭제
        await queryRunner.manager
          .getRepository(ReviewImage)
          .delete({ reviewIdx });

        // 받아온 이미지 새로 저장
        const imagePromises = updateReviewDto.image.map(async (imagePath) => {
          const image = queryRunner.manager.getRepository(ReviewImage).create();
          image.reviewIdx = reviewIdx;
          image.imagePath = imagePath;
          await queryRunner.manager.getRepository(ReviewImage).save(image);
        });

        await Promise.all(imagePromises);
      }

      await queryRunner.commitTransaction();

      return { ...review, imagePath: updateReviewDto.image };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(reviewIdx: number): Promise<Review> {
    const queryRunner =
      this.reviewRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const review = await queryRunner.manager
        .getRepository(Review)
        .findOne({ where: { reviewIdx } });

      // 이미지 먼저 삭제
      await queryRunner.manager
        .getRepository(ReviewImage)
        .delete({ reviewIdx });

      await queryRunner.manager.getRepository(Review).delete(reviewIdx);

      await queryRunner.commitTransaction();
      return review;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

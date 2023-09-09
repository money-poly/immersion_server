"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomReviewCommandRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Review_1 = require("../../../resource/db/entities/Review");
const ReviewImage_1 = require("../../../resource/db/entities/ReviewImage");
let CustomReviewCommandRepository = class CustomReviewCommandRepository {
    constructor(reviewRepository) {
        this.reviewRepository = reviewRepository;
    }
    async createReview(user, createReviewDto) {
        const queryRunner = this.reviewRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const review = queryRunner.manager.getRepository(Review_1.Review).create();
            (review.userIdx = user.userIdx),
                (review.restaurantIdx = createReviewDto.restaurantIdx),
                (review.content = createReviewDto.content),
                (review.score = createReviewDto.score);
            await queryRunner.manager.getRepository(Review_1.Review).save(review);
            const imagePromises = createReviewDto.image.map(async (imagePath) => {
                const image = queryRunner.manager.getRepository(ReviewImage_1.ReviewImage).create();
                image.reviewIdx = review.reviewIdx;
                image.imagePath = imagePath;
                await queryRunner.manager.getRepository(ReviewImage_1.ReviewImage).save(image);
            });
            await Promise.all(imagePromises);
            await queryRunner.commitTransaction();
            return Object.assign(Object.assign({}, review), { imagePath: createReviewDto.image });
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async updateReview(reviewIdx, updateReviewDto) {
        const queryRunner = this.reviewRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const review = await queryRunner.manager
                .getRepository(Review_1.Review)
                .findOne({ where: { reviewIdx } });
            const { content, score } = updateReviewDto;
            review.content = content;
            review.score = score;
            await queryRunner.manager.getRepository(Review_1.Review).save(review);
            if (updateReviewDto.image) {
                await queryRunner.manager
                    .getRepository(ReviewImage_1.ReviewImage)
                    .delete({ reviewIdx });
                const imagePromises = updateReviewDto.image.map(async (imagePath) => {
                    const image = queryRunner.manager.getRepository(ReviewImage_1.ReviewImage).create();
                    image.reviewIdx = reviewIdx;
                    image.imagePath = imagePath;
                    await queryRunner.manager.getRepository(ReviewImage_1.ReviewImage).save(image);
                });
                await Promise.all(imagePromises);
            }
            await queryRunner.commitTransaction();
            return Object.assign(Object.assign({}, review), { imagePath: updateReviewDto.image });
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async delete(reviewIdx) {
        const queryRunner = this.reviewRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const review = await queryRunner.manager
                .getRepository(Review_1.Review)
                .findOne({ where: { reviewIdx } });
            await queryRunner.manager
                .getRepository(ReviewImage_1.ReviewImage)
                .delete({ reviewIdx });
            await queryRunner.manager.getRepository(Review_1.Review).delete(reviewIdx);
            await queryRunner.commitTransaction();
            return review;
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
};
CustomReviewCommandRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Review_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomReviewCommandRepository);
exports.CustomReviewCommandRepository = CustomReviewCommandRepository;
//# sourceMappingURL=review-command.repository.js.map
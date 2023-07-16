import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "../../resource/db/entities/Post";
import { PostController } from "./controller/post.controller";
import { PostService } from "./service/post.service";
import { Image } from "../../resource/db/entities/Image";
import { AwsService } from "src/aop/utils/aws.service";
import { User } from "../../resource/db/entities/User";
import { Comment } from "../../resource/db/entities/Comment";
import { LikePost } from "../../resource/db/entities/LikePost";

@Module({
  imports: [TypeOrmModule.forFeature([Post, Image, User, Comment, LikePost])],
  controllers: [PostController],
  providers: [PostService, AwsService],
})
export class PostModule {}

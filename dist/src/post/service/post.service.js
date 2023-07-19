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
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Post_1 = require("../../../resource/db/entities/Post");
const Image_1 = require("../../../resource/db/entities/Image");
const aws_service_1 = require("../../aop/utils/aws.service");
const User_1 = require("../../../resource/db/entities/User");
const Comment_1 = require("../../../resource/db/entities/Comment");
const LikePost_1 = require("../../../resource/db/entities/LikePost");
let PostService = class PostService {
    constructor(postRepository, imageRepository, userRepository, likePostRepository, commentRepository, awsService, dataSource) {
        this.postRepository = postRepository;
        this.imageRepository = imageRepository;
        this.userRepository = userRepository;
        this.likePostRepository = likePostRepository;
        this.commentRepository = commentRepository;
        this.awsService = awsService;
        this.dataSource = dataSource;
    }
    async createPost(user, category, title, content, files) {
        const queryRunner = this.postRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const loginUser = await this.userRepository.findOne({
                where: { userIdx: user.userIdx },
            });
            const post = new Post_1.Post();
            post.userIdx = user.userIdx;
            post.category = category;
            post.title = title;
            post.content = this.validateContent(content);
            const savedPost = await queryRunner.manager.save(post);
            const pathArray = [];
            const imagePromise = files.map(async (file) => {
                const s3Object = await this.awsService.uploadFileToS3("post", file);
                const image = new Image_1.Image();
                image.postIdx = savedPost.postIdx;
                image.path = this.awsService.getAwsS3FileUrl(s3Object.key);
                pathArray.push(image.path);
                image.imageName = file.originalname;
                image.size = file.size;
                image.Type = file.mimetype;
                image.imageKey = s3Object.key;
                return queryRunner.manager.save(image);
            });
            await Promise.all(imagePromise);
            await queryRunner.commitTransaction();
            return Object.assign(Object.assign({}, savedPost), { nickName: loginUser.nickName, imagePath: pathArray, commentList: [] });
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(page, pageSize) {
        if (page <= 0 || pageSize <= 0) {
            throw new common_1.HttpException({ message: "Page and pageSize must be greater than 0." }, 201);
        }
        const manager = this.dataSource.manager;
        const offset = (page - 1) * pageSize;
        const posts = await manager.find(Post_1.Post, {
            skip: offset,
            take: pageSize,
        });
        const result = await Promise.all(posts.map(async (post) => {
            const user = await manager.findOne(User_1.User, {
                where: { userIdx: post.userIdx },
            });
            const nickName = user ? user.nickName : "";
            const images = await manager.find(Image_1.Image, {
                where: { postIdx: post.postIdx },
            });
            const imagePath = images.map((image) => image.path);
            const comments = await manager.find(Comment_1.Comment, {
                where: { postIdx: post.postIdx },
            });
            const commentList = comments.map((comment) => comment);
            return Object.assign(Object.assign({}, post), { nickName,
                imagePath,
                commentList });
        }));
        return result;
    }
    async findIdPost(userIdx) {
        const posts = await this.postRepository.find({
            where: { userIdx },
        });
        const readonlyPosts = [];
        for (const post of posts) {
            const user = await this.userRepository.findOne({
                where: { userIdx: post.userIdx },
            });
            const nickName = user ? user.nickName : "";
            const images = await this.imageRepository.find({
                where: { postIdx: post.postIdx },
            });
            const imagePath = images.map((image) => image.path);
            const Comments = await this.commentRepository.find({
                where: { postIdx: post.postIdx },
            });
            const commentList = Comments.map((comment) => comment);
            const readonlyPost = Object.assign(Object.assign({}, post), { nickName,
                imagePath,
                commentList });
            readonlyPosts.push(readonlyPost);
        }
        return readonlyPosts;
    }
    async findCategoryPost(category) {
        console.log(category);
        const posts = await this.postRepository.find({
            where: { category: category },
        });
        const readonlyPosts = [];
        for (const post of posts) {
            const user = await this.userRepository.findOne({
                where: { userIdx: post.userIdx },
            });
            const nickName = user ? user.nickName : "";
            const images = await this.imageRepository.find({
                where: { postIdx: post.postIdx },
            });
            const imagePath = images.map((image) => image.path);
            const Comments = await this.commentRepository.find({
                where: { postIdx: post.postIdx },
            });
            const commentList = Comments.map((comment) => comment);
            const readonlyPost = Object.assign(Object.assign({}, post), { nickName,
                imagePath,
                commentList });
            readonlyPosts.push(readonlyPost);
        }
        return readonlyPosts;
    }
    async postLike(user, postIdx) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const editpost = await this.postRepository.findOne({
                where: { postIdx },
            });
            editpost.likeNum += 1;
            const likeEditPost = await queryRunner.manager.save(editpost);
            const likePost = new LikePost_1.LikePost();
            likePost.postIdx = postIdx;
            likePost.userIdx = user.userIdx;
            await queryRunner.manager.save(likePost);
            const images = await this.imageRepository.find({
                where: { postIdx },
            });
            const imagePath = images.map((image) => image.path);
            const Comments = await this.commentRepository.find({
                where: { postIdx },
            });
            const commentList = Comments.map((comment) => comment);
            const readonlyPost = Object.assign(Object.assign({}, likeEditPost), { nickName: user.nickName, imagePath,
                commentList });
            await queryRunner.commitTransaction();
            console.log("성공");
            return readonlyPost;
        }
        catch (error) {
            console.log("실패");
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            console.log("실패?");
            await queryRunner.release();
        }
    }
    async postLikeCancel(user, postIdx) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const editpost = await this.postRepository.findOne({
                where: { postIdx },
            });
            editpost.likeNum -= 1;
            const likeEditPost = await queryRunner.manager.save(editpost);
            await this.likePostRepository.delete({ userIdx: user.userIdx });
            const images = await this.imageRepository.find({
                where: { postIdx },
            });
            const imagePath = images.map((image) => image.path);
            const Comments = await this.commentRepository.find({
                where: { postIdx },
            });
            const commentList = Comments.map((comment) => comment);
            const readonlyPost = Object.assign(Object.assign({}, likeEditPost), { nickName: user.nickName, imagePath,
                commentList });
            await queryRunner.commitTransaction();
            return readonlyPost;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    validateContent(content) {
        const maxContentLength = 5;
        const contentWithoutEmojis = content.replace(/[\u{1F600}-\u{1F6FF}]/gu, "");
        const contentWithoutSpecialChars = contentWithoutEmojis.replace(/[^\w\s]/gi, "");
        const contentWithoutSpecialCharsAndSpaces = contentWithoutSpecialChars.replace(/\s/g, "");
        if (contentWithoutSpecialCharsAndSpaces.length > maxContentLength) {
            throw new common_1.HttpException({ message: "Content length exceeds the maximum allowed limit." }, 201);
        }
        return contentWithoutSpecialChars;
    }
};
PostService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Post_1.Post)),
    __param(1, (0, typeorm_1.InjectRepository)(Image_1.Image)),
    __param(2, (0, typeorm_1.InjectRepository)(User_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(LikePost_1.LikePost)),
    __param(4, (0, typeorm_1.InjectRepository)(Comment_1.Comment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        aws_service_1.AwsService,
        typeorm_2.DataSource])
], PostService);
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map
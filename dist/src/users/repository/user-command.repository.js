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
exports.CustomUserCommandRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const User_1 = require("../../../resource/db/entities/User");
const nestjs_redis_1 = require("@liaoliaots/nestjs-redis");
const ioredis_1 = require("ioredis");
let CustomUserCommandRepository = class CustomUserCommandRepository {
    constructor(redis, userRepository) {
        this.redis = redis;
        this.userRepository = userRepository;
    }
    async signUp(userInfo, queryRunner = undefined) {
        const { email, nickName, phone, password, fcmtoken } = userInfo;
        const user = new User_1.User();
        user.email = email;
        user.nickName = nickName;
        user.phone = phone;
        user.password = password;
        user.fcmtoken = fcmtoken;
        const repository = queryRunner ? queryRunner.manager.getRepository(User_1.User) : this.userRepository;
        const newUser = await repository.save(user);
        return newUser;
    }
    async storeRefreshToken(userInfo, refreshToken, queryRunner = undefined) {
        userInfo.refreshToken = refreshToken;
        const repository = queryRunner ? queryRunner.manager.getRepository(User_1.User) : this.userRepository;
        const newUser = await repository.save(userInfo);
        return newUser;
    }
    async storeAccessTokenToRedis(userInfo, accessToken, queryRunner = undefined) {
        try {
            const key = `access_token:${userInfo.userIdx}`;
            await this.redis.hmset(key, { token: accessToken });
        }
        catch (error) {
            throw new Error(`Failed to store access token in Redis: ${error.message}`);
        }
    }
};
CustomUserCommandRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, nestjs_redis_1.InjectRedis)()),
    __param(1, (0, typeorm_1.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [ioredis_1.default,
        typeorm_2.Repository])
], CustomUserCommandRepository);
exports.CustomUserCommandRepository = CustomUserCommandRepository;
//# sourceMappingURL=user-command.repository.js.map
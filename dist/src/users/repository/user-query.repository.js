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
exports.CustomUserQueryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const User_1 = require("../../../resource/db/entities/User");
const typeorm_2 = require("typeorm");
const error_reponse_1 = require("../../aop/exception/error-reponse");
let CustomUserQueryRepository = class CustomUserQueryRepository {
    constructor(userRepository, errorResponse) {
        this.userRepository = userRepository;
        this.errorResponse = errorResponse;
    }
    async getByUserIdx(userIdx, queryRunner = undefined) {
        const repository = queryRunner ? queryRunner.manager.getRepository(User_1.User) : this.userRepository;
        const user = await repository.findOne({ where: { userIdx } });
        return user;
    }
    async getByEmail(email, queryRunner = undefined) {
        const repository = queryRunner ? queryRunner.manager.getRepository(User_1.User) : this.userRepository;
        const user = await repository.findOne({ where: { email } });
        return user;
    }
    async getByRefreshToken(email, queryRunner = undefined) {
        const repository = queryRunner ? queryRunner.manager.getRepository(User_1.User) : this.userRepository;
        const user = await repository.findOne({ where: { email } });
        return user;
    }
    async findAllFcm() {
        const users = await this.userRepository.find();
        if (users.length === 0) {
            throw this.errorResponse.notExistFCM;
        }
        const fcmTokens = users.reduce((result, user) => {
            result[user.userIdx] = user.fcmtoken;
            return result;
        }, {});
        return { fcmTokens };
    }
    async getFCMByUserIdx(userIdx) {
        const user = await this.userRepository.findOne({ where: { userIdx } });
        const fcmToken = (user === null || user === void 0 ? void 0 : user.fcmtoken) || null;
        return fcmToken;
    }
};
CustomUserQueryRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(User_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        error_reponse_1.ErrorResponse])
], CustomUserQueryRepository);
exports.CustomUserQueryRepository = CustomUserQueryRepository;
//# sourceMappingURL=user-query.repository.js.map
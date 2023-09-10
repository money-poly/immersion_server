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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_user_dto_1 = require("../dto/create-user.dto");
const users_service_1 = require("../service/users.service");
const auth_service_1 = require("../../auth/service/auth.service");
const user_login_dto_1 = require("../dto/user-login.dto");
const jwt_guard_1 = require("../../auth/utils/jwt/jwt.guard");
const user_decorator_1 = require("../../aop/decorators/user.decorator");
const use_interceptors_decorator_1 = require("@nestjs/common/decorators/core/use-interceptors.decorator");
const success_interceptor_1 = require("../../aop/interceptors/success.interceptor");
const exception_filters_decorator_1 = require("@nestjs/common/decorators/core/exception-filters.decorator");
const http_exception_filter_1 = require("../../aop/exception/http-exception.filter");
const positiveInt_pipe_1 = require("../../aop/pipes/positiveInt.pipe");
const jwt_refresh_gaurd_1 = require("../../auth/utils/jwt/jwt-refresh.gaurd");
let UsersController = class UsersController {
    constructor(usersService, authService) {
        this.usersService = usersService;
        this.authService = authService;
    }
    async create(dto) {
        return await this.usersService.create(dto);
    }
    login(data) {
        return this.authService.login(data);
    }
    getAccessTokenByRefreshToken() {
        return this.authService.refreshAccessToken();
    }
    logout() {
        return this.authService.logout();
    }
    findAllFCM() {
        return this.usersService.getAllFCM();
    }
    findFCM(userIdx) {
        return this.usersService.getFcmByUserIdx(userIdx);
    }
    getCurrentUser(user) {
        return user;
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "회원가입" }),
    (0, use_interceptors_decorator_1.UseInterceptors)(success_interceptor_1.SuccessInterceptor),
    (0, exception_filters_decorator_1.UseFilters)(http_exception_filter_1.HttpExceptionFilter),
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "로그인" }),
    (0, use_interceptors_decorator_1.UseInterceptors)(success_interceptor_1.SuccessInterceptor),
    (0, exception_filters_decorator_1.UseFilters)(http_exception_filter_1.HttpExceptionFilter),
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_login_dto_1.UserLoginDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: "refresh token으로 access token 재발급",
        description: "1.access-token은 이미 만료되서 에러 2.jwt-refresh gaurd(refresh-secret) 검증 3.refresh token DB 검증 4.access-token이 리턴됨."
    }),
    (0, swagger_1.ApiBody)({
        description: 'post swagger',
        type: user_login_dto_1.UserLoginDto,
    }),
    (0, common_1.UseGuards)(jwt_refresh_gaurd_1.JwtRefreshAuthGuard),
    (0, common_1.Post)("refreshToken"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAccessTokenByRefreshToken", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "로그아웃" }),
    (0, use_interceptors_decorator_1.UseInterceptors)(success_interceptor_1.SuccessInterceptor),
    (0, exception_filters_decorator_1.UseFilters)(http_exception_filter_1.HttpExceptionFilter),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)("logout"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "모든 FCM 토큰 조회" }),
    (0, use_interceptors_decorator_1.UseInterceptors)(success_interceptor_1.SuccessInterceptor),
    (0, exception_filters_decorator_1.UseFilters)(http_exception_filter_1.HttpExceptionFilter),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)("get/allFcm"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAllFCM", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "개인 FCM 토큰 조회" }),
    (0, use_interceptors_decorator_1.UseInterceptors)(success_interceptor_1.SuccessInterceptor),
    (0, exception_filters_decorator_1.UseFilters)(http_exception_filter_1.HttpExceptionFilter),
    (0, common_1.Get)("get/fcm/:userIdx"),
    __param(0, (0, common_1.Param)("userIdx", common_1.ParseIntPipe, positiveInt_pipe_1.PositiveIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findFCM", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: "인증확인:현재유저 가져오기" }),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getCurrentUser", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)("유저 API"),
    (0, common_1.Controller)("user"),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        auth_service_1.AuthService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map
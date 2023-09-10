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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const login_case_implement_1 = require("../inferface/login-case.implement");
const local_login_implement_1 = require("../inferface/local-login.implement");
let AuthService = class AuthService {
    constructor(loginCaseImpl, loginLocalImpl) {
        this.loginCaseImpl = loginCaseImpl;
        this.loginLocalImpl = loginLocalImpl;
    }
    async login(data) {
        return await this.loginCaseImpl.getTokenByCase(data.email, data.password, data.loginType, data.token);
    }
    async refreshAccessToken(req, res) {
        if (await this.loginLocalImpl.CheckRT(refreshToken, userIdx)) {
            const token = this.loginLocalImpl.getAccessToken(payload);
            res.cookie('access-token', token);
        }
    }
    async logout() {
        return await this.loginLocalImpl.setAccessTokenExpired();
    }
};
__decorate([
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "refreshAccessToken", null);
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [login_case_implement_1.LoginImpl,
        local_login_implement_1.LocalLoginStrategy])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map
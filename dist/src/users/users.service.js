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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../../mymodel/entities/user.entity");
let UsersService = class UsersService {
    constructor(userRepository, dataSource) {
        this.userRepository = userRepository;
        this.dataSource = dataSource;
    }
    async create(id, nickname, phone, enrolldate, password) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const hashedPassword = await bcrypt.hash(password, 12);
        try {
            const userid = await this.userRepository.findOne({ where: { id } });
            if (userid) {
                throw new common_1.ForbiddenException("이미 존재하는 id 입니다");
            }
            const phoneNum = await this.userRepository.findOne({ where: { phone } });
            if (phoneNum) {
                throw new common_1.ForbiddenException("이미 존재하는 번호 입니다");
            }
            const user = new user_entity_1.User();
            (user.id = id),
                (user.nickname = nickname),
                (user.phone = phone),
                (user.enrolldate = enrolldate),
                (user.password = hashedPassword),
                await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();
        }
        catch (error) {
            console.error(error);
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async login(_id, _password) {
        throw new Error("Method not implemented");
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map
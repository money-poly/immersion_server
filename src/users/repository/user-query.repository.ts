import {
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../../resource/db/entities/User";
import { Repository, QueryRunner } from "typeorm";
import { ErrorResponse } from "src/aop/exception/error-reponse";

@Injectable()
export class CustomUserQueryRepository {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private errorResponse : ErrorResponse
  ) {} 

  async getByUserIdx(userIdx: number, queryRunner: QueryRunner | undefined = undefined) {
    const repository = queryRunner ? queryRunner.manager.getRepository(User) : this.userRepository;
    const user = await repository.findOne({ where: { userIdx } });
    
    return user;
  }

  async getByEmail(email: string, queryRunner: QueryRunner | undefined = undefined) {
    const repository = queryRunner ? queryRunner.manager.getRepository(User) : this.userRepository;
    const user = await repository.findOne({ where: { email }});
    
    return user;
  }

  async getByRefreshToken(email: string, queryRunner: QueryRunner | undefined = undefined) {
    const repository = queryRunner ? queryRunner.manager.getRepository(User) : this.userRepository;
    const user = await repository.findOne({ where: { email }});
    
    return user;
  }

  // 모든 fcmtoken 반환
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

  async getFCMByUserIdx(userIdx: number) {
    const user = await this.userRepository.findOne({ where: { userIdx } });
    const fcmToken = user?.fcmtoken || null;

    return fcmToken;
  }
}

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../../../resource/db/entities/User";
import { Repository } from "typeorm";
import { UserInterface } from "./user.interface";
import { CreateUserDto } from "../dto/create-user.dto";
import { CustomUserCommandRepository } from "../repository/user-command.repository";
import { CustomUserQueryRepository } from "../repository/user-query.repository";
import { ErrorResponse } from "src/aop/exception/error-reponse";
import { LikePost } from "resource/db/entities/LikePost";

@Injectable()
export class UserImpl implements UserInterface {
  constructor(
    private readonly customUserCommandRepository: CustomUserCommandRepository,
    private readonly customUserQueryRepository: CustomUserQueryRepository,
    @InjectRepository(User)
    private userEntityRepository: Repository<User>,
    private errorResponse: ErrorResponse
  ) {}

  // 1-1 회원가입
  async createUser(userInfo: CreateUserDto): Promise<{ userIdx: string }> {
    const hashedPassword = await bcrypt.hash(userInfo.password, 12);
    const existUser = await this.customUserQueryRepository.getByEmail(
      userInfo.email
    );
    if (!existUser) {
      const newUser = await this.customUserCommandRepository.signUp({
        ...userInfo,
        password: hashedPassword
      });
      return { userIdx: newUser.userIdx.toString() };
    } else {
      this.errorResponse.duplicateByEmail();
    }
  }

  // 1-5 모든 FCM 토큰 조회
  async getAllFCM(): Promise<Record<"fcmTokens", object>> {
    const allFcmtoken = await this.customUserQueryRepository.findAllFcm();
    return allFcmtoken;
  }

  // 1-6 개인 FCM 토큰 조회
  async getFCMByUserIdx(userIdx: number): Promise<Record<"fcmToken", string>> {
    await this.customUserQueryRepository.getByUserIdx(userIdx);
    const fcmToken = await this.customUserQueryRepository.getFCMByUserIdx(
      userIdx
    );
    return { fcmToken };
  }
}

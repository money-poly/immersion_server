import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryRunner } from 'typeorm';
import { User } from '../../../resource/db/entities/User';
import { InjectRedis } from "@liaoliaots/nestjs-redis";
import Redis from "ioredis";

@Injectable()
export class CustomUserCommandRepository {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  // 새로운 user 저장
  public async signUp<T extends Record<string, any>>(
    userInfo: T,
    queryRunner: QueryRunner | undefined = undefined
  ) {
    const { email, nickName, phone, password, fcmtoken } = userInfo;
    const user = new User();
    user.email = email;
    user.nickName = nickName;
    user.phone = phone;
    user.password = password;
    user.fcmtoken = fcmtoken;

    const repository = queryRunner ? queryRunner.manager.getRepository(User) : this.userRepository;

    const newUser = await repository.save(user);

    return newUser;
  }

  public async storeRefreshToken<T extends Record<string, any>>(
    userInfo: User,
    refreshToken: string,
    queryRunner: QueryRunner | undefined = undefined
  ) {
    userInfo.refreshToken = refreshToken; // db에 refreshtoken update

    const repository = queryRunner ? queryRunner.manager.getRepository(User) : this.userRepository;

    const newUser = await repository.save(userInfo);

    return newUser;
  }

  public async storeAccessTokenToRedis<T extends Record<string, any>>(
    userInfo: User,
    accessToken: string,
    queryRunner: QueryRunner | undefined = undefined
  ) { 
    try {
    // Create a key for the user's access token hash with a prefix (e.g., "access_token:")
    const key = `access_token:${userInfo.userIdx}`;

    // Set the access token in the Redis hash
    await this.redis.hmset(key, { token: accessToken });

  } catch (error) {
    throw new Error(`Failed to store access token in Redis: ${error.message}`);
    }
  }
}

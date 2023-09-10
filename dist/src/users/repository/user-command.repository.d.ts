import { Repository, QueryRunner } from 'typeorm';
import { User } from '../../../resource/db/entities/User';
import Redis from "ioredis";
export declare class CustomUserCommandRepository {
    private readonly redis;
    private readonly userRepository;
    constructor(redis: Redis, userRepository: Repository<User>);
    signUp<T extends Record<string, any>>(userInfo: T, queryRunner?: QueryRunner | undefined): Promise<User>;
    storeRefreshToken<T extends Record<string, any>>(userInfo: User, refreshToken: string, queryRunner?: QueryRunner | undefined): Promise<User>;
    storeAccessTokenToRedis<T extends Record<string, any>>(userInfo: User, accessToken: string, queryRunner?: QueryRunner | undefined): Promise<void>;
}

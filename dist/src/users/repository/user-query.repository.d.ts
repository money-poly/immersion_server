import { User } from "../../../resource/db/entities/User";
import { Repository, QueryRunner } from "typeorm";
import { ErrorResponse } from "src/aop/exception/error-reponse";
export declare class CustomUserQueryRepository {
    private readonly userRepository;
    private errorResponse;
    constructor(userRepository: Repository<User>, errorResponse: ErrorResponse);
    getByUserIdx(userIdx: number, queryRunner?: QueryRunner | undefined): Promise<User>;
    getByEmail(email: string, queryRunner?: QueryRunner | undefined): Promise<User>;
    getByRefreshToken(email: string, queryRunner?: QueryRunner | undefined): Promise<User>;
    findAllFcm(): Promise<{
        fcmTokens: {};
    }>;
    getFCMByUserIdx(userIdx: number): Promise<string>;
}

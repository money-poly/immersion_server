import { LoginImpl } from "../inferface/login-case.implement";
import { LocalLoginStrategy } from "../inferface/local-login.implement";
import { UserLoginDto } from "src/users/dto/user-login.dto";
import { Request, Response } from "express";
export declare class AuthService {
    private loginCaseImpl;
    private loginLocalImpl;
    constructor(loginCaseImpl: LoginImpl, loginLocalImpl: LocalLoginStrategy);
    login(data: UserLoginDto): Promise<any>;
    refreshAccessToken(req: Request, res: Response): Promise<void>;
    logout(): string;
}

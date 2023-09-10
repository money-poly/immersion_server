import { CreateUserDto } from "../dto/create-user.dto";
import { UsersService } from "../service/users.service";
import { AuthService } from "src/auth/service/auth.service";
import { UserLoginDto } from "src/users/dto/user-login.dto";
export declare class UsersController {
    private usersService;
    private readonly authService;
    constructor(usersService: UsersService, authService: AuthService);
    create(dto: CreateUserDto): Promise<{
        userIdx: string;
    }>;
    login(data: UserLoginDto): Promise<any>;
    getAccessTokenByRefreshToken(): Promise<void>;
    logout(): string;
    findAllFCM(): Promise<Record<"fcmTokens", object>>;
    findFCM(userIdx: number): Promise<Record<"fcmToken", string>>;
    getCurrentUser(user: any): any;
}

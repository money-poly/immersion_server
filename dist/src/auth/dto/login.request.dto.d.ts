import { User } from "mymodel/entities/User";
declare const LoginRequestDto_base: import("@nestjs/common").Type<Pick<User, "email" | "password">>;
export declare class LoginRequestDto extends LoginRequestDto_base {
}
export {};
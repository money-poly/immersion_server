import { Injectable, Req, Res } from "@nestjs/common";
import { LoginImpl } from "../inferface/login-case.implement";
import { LocalLoginStrategy } from "../inferface/local-login.implement";
import { UserLoginDto } from "src/users/dto/user-login.dto";
import { JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";

@Injectable()
export class AuthService {
  constructor(
    private loginCaseImpl: LoginImpl, 
    private loginLocalImpl: LocalLoginStrategy
    ) {}

  async login(data: UserLoginDto): Promise<any> {
      return await this.loginCaseImpl.getTokenByCase(data.email, data.password, data.loginType, data.token);
  }

  async refreshAccessToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if(await this.loginLocalImpl.CheckRT(refreshToken, userIdx)){
      const token = this.loginLocalImpl.getAccessToken(payload);
      res.cookie('access-token', token);
    }
  }

  async logout(): string {
    return await this.loginLocalImpl.setAccessTokenExpired();
  }
}
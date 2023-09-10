import { IsString, IsEmail, IsNotEmpty, Matches } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  nickName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{11}$/)
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  fcmToken: string;

  @IsString()
  refreshToken: string;
}

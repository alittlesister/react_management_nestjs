import { IsNotEmpty, MaxLength, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  userName: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}

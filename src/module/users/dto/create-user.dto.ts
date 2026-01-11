import {
  IsNotEmpty,
  MaxLength,
  IsString,
  MinLength,
  IsEmail,
  IsMobilePhone,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  userName: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  nickName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @IsEmail()
  email: string;

  @IsMobilePhone('zh-CN')
  phone: string;

  @IsString()
  created_by: string;

  @IsString()
  updated_by: string;
}

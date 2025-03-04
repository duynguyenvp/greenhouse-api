import { IsString, IsAlphanumeric, IsOptional, IsEnum } from 'class-validator';
import { ROLES_ENUM } from '../db/roles';

export class CreateUserDTO {
  @IsString()
  name: string;

  @IsAlphanumeric()
  username: string;

  @IsString()
  password: string;

  @IsEnum(ROLES_ENUM)
  @IsOptional()
  role?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

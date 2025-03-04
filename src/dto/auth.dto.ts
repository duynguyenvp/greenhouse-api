import { IsAlphanumeric, MinLength, IsOptional } from "class-validator";
import UserDTO from "./user.dto";

export class RegisterInputDTO {
  @IsOptional()
  name: string;
  @IsAlphanumeric()
  username: string;
  phone_number: string;
  @MinLength(6)
  password: string;
}

export class LoginInputDTO {
  @IsAlphanumeric()
  username: string;
  password: string;
}

export class LoginResponseDTO {
  token: string;
  refreshToken: string;
  user: UserDTO;
}

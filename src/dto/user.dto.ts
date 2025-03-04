import { IsOptional, IsPhoneNumber, Length } from "class-validator";

export default class UserDTO {
  id: number;
  name: string;
  username: string;
  role: string;
  phone?: string;

  constructor();
  constructor(
    id: number,
    name: string,
    username: string,
    role: string,
    phone?: string
  );

  constructor(
    id?: number,
    name?: string,
    username?: string,
    role?: string,
    phone?: string
  ) {
    if (id && name && username && role) {
      this.id = id;
      this.name = name;
      this.username = username;
      this.role = role;
      this.phone = phone;
    } else {
      this.id = 0;
      this.name = "";
      this.username = "";
      this.role = "";
      this.phone = undefined;
    }
  }

  static createUserFromRawData(rawData: any) {
    return new UserDTO(
      rawData.user_id,
      rawData.user_name,
      rawData.user_username,
      rawData.user_role,
      rawData.user_phone
    );
  }
}

export class UpdateUserInputDTO {
  id: number;
  @Length(1, 255)
  name: string;
  @IsOptional()
  username?: string;
  @IsOptional()
  @IsPhoneNumber("VI")
  phone?: string;
}

export type UserSimpleDTO = {
  id?: number,
  username?: string,
  role?: string,
}
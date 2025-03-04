import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

import {
  LoginInputDTO,
  LoginResponseDTO,
  RegisterInputDTO
} from "../dto/auth.dto";
import { UserSimpleDTO } from "../dto/user.dto";
import logger from "../logger";
import UserDTO from "../dto/user.dto";
import UserRepository from "../db/repositories/userRepository";
import { User } from "src/db/models/User";

const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY || "this is a scret key";
const tokenExpiresIn = parseInt(process.env.TOKEN_EXPIRES_IN || "600");
const refreshTokenExpiresIn = Number(process.env.REFRESH_TOKEN_EXPIRES_IN);

export default class AuthController {
  private userRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async login(input: LoginInputDTO): Promise<LoginResponseDTO> {
    const { username, password } = input;

    // Tìm nhân viên theo email
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new Error("User not found");
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(String(password), user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    return this.createLoginResponse(user);
  }

  async profile(user: UserSimpleDTO | null): Promise<UserDTO | null> {
    if (!user || !user.id) return null;
    try {
      const exitingUser = await this.userRepository.findById(user.id);
      if (!exitingUser) return null;
      return exitingUser;
    } catch (error) {
      logger.error("Failed to retrieve user profile", error);
      return null;
    }
  }

  async register(input: RegisterInputDTO): Promise<UserDTO> {
    const { name, username, phone_number, password } = input;
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = this.userRepository.createUser({
      name,
      username,
      phone: phone_number,
      password: hashedPassword
    });
    return user;
  }

  async refreshToken(refreshToken: string): Promise<LoginResponseDTO> {
    if (!refreshToken) {
      throw new Error("Access Denied. No refresh token provided.");
    }
    try {
      const decoded = jwt.verify(refreshToken, AUTH_SECRET_KEY) as JwtPayload;
      if (decoded.type !== "refresh") {
        throw new Error("Invalid refresh token type");
      }
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new Error("Invalid refresh token.");
      }
      return this.createLoginResponse(user);
    } catch (error) {
      throw error;
    }
  }

  private createLoginResponse(user: User) {
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role
    };
    const accessToken = jwt.sign(
      {
        ...payload,
        type: "access"
      },
      AUTH_SECRET_KEY,
      {
        expiresIn: tokenExpiresIn
      }
    );
    const newRefreshToken = jwt.sign(
      {
        ...payload,
        type: "refresh"
      },
      AUTH_SECRET_KEY,
      {
        expiresIn: refreshTokenExpiresIn
      }
    );
    return {
      token: accessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
        phone: user.phone
      }
    };
  }
}

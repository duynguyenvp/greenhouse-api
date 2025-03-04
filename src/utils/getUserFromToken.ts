import jwt from "jsonwebtoken";
import { UserSimpleDTO } from "../dto/user.dto";
import dataSource from "../db/dataSource";
import { User } from "../db/models/User";

const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY || "this is a scret key";
export function getUserFromToken(token: string): Promise<UserSimpleDTO | null> {
  if (!token) {
    return Promise.resolve(null);
  }
  return new Promise((resolve, reject) => {
    const formatedToken = token.replace("Bearer ", "").replace("bearer ", "");
    jwt.verify(
      formatedToken,
      AUTH_SECRET_KEY,
      async (err: any, decoded: any) => {
        if (err) {
          reject(err);
        }
        if (!decoded || decoded.type !== "access") {
          reject(new Error("Invalid token type"));
        } else {
          const user = await dataSource
            .getRepository(User)
            .findOne({ where: { id: decoded.userId } });
          resolve({
            id: user?.id,
            username: user?.username,
            role: user?.role
          });
        }
      }
    );
  });
}

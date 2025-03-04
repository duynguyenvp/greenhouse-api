import jwt, { TokenExpiredError } from "jsonwebtoken";
import logger from "../logger";
import dataSource from "../db/dataSource";
import { User } from "../db/models/User";

const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY || "this is a scret key";

const catchError = (err: any, res: any) => {
  if (err instanceof TokenExpiredError) {
    logger.error("Access Token was expired:" + JSON.stringify(err));
    return res.error("Access Token was expired!", 401);
  }

  logger.error("Unauthorized:" + JSON.stringify(err));
  return res.error("Unauthorized!", 401);
};

const verifyToken = (req: any, res: any, next: any) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.error("Access Denied. No token provided.", 403);
  }

  const formatedToken = token.replace("Bearer ", "").replace("bearer ", "");
  jwt.verify(formatedToken, AUTH_SECRET_KEY, async (err: any, decoded: any) => {
    if (err) {
      return catchError(err, res);
    }
    const user = await dataSource
      .getRepository(User)
      .findOne({ where: { id: decoded.userId } });
    if (!user) {
      return catchError("User not found", res);
    }
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };
    next();
  });
};

export default verifyToken;

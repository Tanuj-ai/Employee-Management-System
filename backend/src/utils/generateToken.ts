import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  role: string;
}

export const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};
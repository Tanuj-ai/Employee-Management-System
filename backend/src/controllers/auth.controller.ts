import { Request, Response } from "express";
import User from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { generateToken } from "../utils/generateToken";
import { loginSchema } from "../validators/auth.validator";

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);

  const user = await User.findOne({
    email: data.email,
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await user.comparePassword(data.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("token");

  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export const me = asyncHandler(async (req: any, res: Response) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    user,
  });
});
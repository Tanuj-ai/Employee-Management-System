import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import User, { UserRole } from "../models/User";

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    const existing = await User.findOne({
      email: "admin@ems.com",
    });

    if (existing) {
      console.log("✅ Super Admin already exists.");
      process.exit(0);
    }

    await User.create({
      email: "admin@ems.com",
      password: "admin123",
      role: UserRole.SUPER_ADMIN,
    });

    console.log("🎉 Super Admin created successfully!");
    console.log("Email: admin@ems.com");
    console.log("Password: admin123");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();
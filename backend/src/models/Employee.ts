import mongoose, { Document, Schema } from "mongoose";
import { UserRole } from "./User";

export enum EmployeeStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IEmployee extends Document {
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: Date;
  status: EmployeeStatus;
  role: UserRole;
  reportingManager?: mongoose.Types.ObjectId;
  profileImage?: string;
  photo?: string;
  isDeleted: boolean;
}

const EmployeeSchema = new Schema<IEmployee>(
  {
    employeeId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
      min: 0,
    },

    joiningDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(EmployeeStatus),
      default: EmployeeStatus.ACTIVE,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.EMPLOYEE,
    },

    reportingManager: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },

    profileImage: {
      type: String,
      default: "",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    photo: {
      type: String,
      default: ""
    },
  },
  {
    timestamps: true,
  }
);

EmployeeSchema.index({
  name: "text",
  email: "text",
});

export default mongoose.model<IEmployee>("Employee", EmployeeSchema);
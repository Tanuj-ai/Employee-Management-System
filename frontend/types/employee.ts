export interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  salary: number;
  joiningDate: string;
  status: "ACTIVE" | "INACTIVE";
  role: "SUPER_ADMIN" | "HR_MANAGER" | "EMPLOYEE";
  profileImage: string;
  photo?: string;
}
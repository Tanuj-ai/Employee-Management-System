import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportEmployeesToExcel = (employees: any[]) => {
  const data = employees.map((emp) => ({
    Employee_ID: emp.employeeId,
    Name: emp.name,
    Email: emp.email,
    Phone: emp.phone,
    Department: emp.department,
    Designation: emp.designation,
    Salary: emp.salary,
    Status: emp.status,
    Joining_Date: new Date(emp.joiningDate).toLocaleDateString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Employees"
  );

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, "employees.xlsx");
};
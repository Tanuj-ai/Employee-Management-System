import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Employee } from "@/types/employee";

export const exportEmployeesToPDF = (employees: Employee[]) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Employee Management Report", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [[
      "Employee ID",
      "Name",
      "Email",
      "Department",
      "Designation",
      "Status",
    ]],
    body: employees.map((emp) => [
      emp.employeeId,
      emp.name,
      emp.email,
      emp.department,
      emp.designation,
      emp.status,
    ]),
  });

  doc.save("employees.pdf");
};
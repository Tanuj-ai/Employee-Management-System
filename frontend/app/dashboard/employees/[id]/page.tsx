import EmployeeProfile from "@/components/employees/EmployeeProfile";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EmployeeProfilePage({
  params,
}: PageProps) {
  const { id } = await params;

  return <EmployeeProfile employeeId={id} />;
}
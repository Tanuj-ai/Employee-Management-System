import OrganizationTree from "@/components/organization/OrganizationTree";

export default function OrganizationPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Organization Structure
      </h1>

      <OrganizationTree />
    </div>
  );
}
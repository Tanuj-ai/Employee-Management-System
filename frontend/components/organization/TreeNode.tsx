"use client";

interface TreeNodeProps {
  node: {
    _id: string;
    employeeId: string;
    name: string;
    designation: string;
    department: string;
    children: any[];
  };
}

export default function TreeNode({ node }: TreeNodeProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Employee Card */}
      <div className="bg-white rounded-xl shadow-md border p-4 w-64 text-center hover:shadow-lg transition">
        <h3 className="font-bold text-lg">{node.name}</h3>

        <p className="text-sm text-gray-600">{node.employeeId}</p>

        <p className="text-blue-600 font-medium mt-1">
          {node.designation}
        </p>

        <p className="text-gray-500 text-sm">
          {node.department}
        </p>
      </div>

      {/* Children */}
      {node.children.length > 0 && (
        <>
          <div className="w-px h-8 bg-gray-400"></div>

          <div className="flex gap-8 mt-4">
            {node.children.map((child) => (
              <TreeNode
                key={child._id}
                node={child}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
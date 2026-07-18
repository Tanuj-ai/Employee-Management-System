"use client";

import { useEffect, useState } from "react";
import { organizationTree } from "@/services/employee";
import TreeNode from "./TreeNode";

interface EmployeeNode {
  _id: string;
  employeeId: string;
  name: string;
  designation: string;
  department: string;
  children: EmployeeNode[];
}

export default function OrganizationTree() {
  const [tree, setTree] = useState<EmployeeNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTree();
  }, []);

  const fetchTree = async () => {
    try {
      const res = await organizationTree();
      setTree(res.data);
    } catch (error) {
      console.error("Failed to load organization tree:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading organization tree...
      </div>
    );
  }

  return (
    <div className="overflow-x-auto p-6">
      <div className="flex justify-center gap-12">
        {tree.map((node) => (
          <TreeNode
            key={node._id}
            node={node}
          />
        ))}
      </div>
    </div>
  );
}
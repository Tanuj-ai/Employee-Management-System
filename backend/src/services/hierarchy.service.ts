import Employee from "../models/Employee";

/**
 * Returns true if assigning managerId as the manager of employeeId
 * would create a circular reference.
 */
export const hasCircularReference = async (
  employeeId: string,
  managerId: string
): Promise<boolean> => {
  let current = await Employee.findById(managerId);

  while (current) {
    if (current._id.toString() === employeeId) {
      return true;
    }

    if (!current.reportingManager) {
      return false;
    }

    current = await Employee.findById(current.reportingManager);
  }

  return false;
};
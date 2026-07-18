import Counter from "../models/Counter";

export const generateEmployeeId = async (): Promise<string> => {

  const counter = await Counter.findOneAndUpdate(
    { name: "employee" },
    { $inc: { sequence: 1 } },
    {
      upsert: true,
      new: true,
    }
  );

  return `EMP${String(counter.sequence).padStart(4, "0")}`;
};

import type { NextApiRequest, NextApiResponse } from "next";
import { updateTask, deleteTask, completeTask } from "@/modules/taskManager";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const taskId = parseInt(id as string, 10);

  if (req.method === "PUT") {
    const updatedTask = req.body;
    updateTask(taskId, updatedTask);
    res.status(200).json({ message: "Task updated successfully" });
  } else if (req.method === "DELETE") {
    deleteTask(taskId);
    res.status(200).json({ message: "Task deleted successfully" });
  } else if (req.method === "PATCH") {
    completeTask(req.body.title);
    res.status(200).json({ message: "Task marked as completed" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

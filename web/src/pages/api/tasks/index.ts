import type { NextApiRequest, NextApiResponse } from "next";
import { getAllTasks, getActiveTasks, createTask } from "@/modules/taskManager";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    if (req.query.active === "true") {
      res.status(200).json(getActiveTasks());
    } else {
      res.status(200).json(getAllTasks());
    }
  } else if (req.method === "POST") {
    const { title, description, persona, group } = req.body;
    createTask(title, description, persona, group);
    res.status(201).json({ message: "Task created successfully" });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

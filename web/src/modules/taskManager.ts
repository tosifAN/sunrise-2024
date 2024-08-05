import Task from "@/model/Task";
import { initialTasks } from "@/utils/TaskList";

let tasks: Task[] = [...initialTasks];

export function initializeTasks() {
  tasks = [...initialTasks];
}

export function getActiveTasks(): Task[] {
  return tasks.filter(task => task.stage === 'To-Do' || task.stage === 'In Progress');
}

export function getCompletedTasks(): Task[] {
  return tasks.filter(task => task.stage === 'Completed');
}

export function getAllTasks(): Task[] {
  return tasks;
}

export function completeTask(taskId: number): void {
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    task.stage = 'Completed';
  }
}

export function createTask(title: string, description: string, persona: string, group: number): void {
  const newId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
  const newTask = new Task(newId, title, description, persona, group, 'To-Do');
  tasks.push(newTask);
}

export function updateTask(taskId: number, updatedTask: Partial<Omit<Task, 'id'>>): void {
  const taskIndex = tasks.findIndex(task => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
  }
}

export function deleteTask(taskId: number): void {
  tasks = tasks.filter(task => task.id !== taskId);
}

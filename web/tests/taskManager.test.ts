import { 
  initializeTasks, 
  getActiveTasks, 
  getCompletedTasks, 
  getAllTasks, 
  completeTask, 
  createTask, 
  updateTask, 
  deleteTask 
} from "../src/modules/taskManager";

import { initialTasks } from "@/utils/TaskList";
import Task from "@/model/Task";

describe("Task Manager Functions", () => {
  beforeEach(() => {
    initializeTasks();
  });

  test("should initialize tasks correctly", () => {
    expect(getAllTasks()).toEqual(initialTasks);
  });

  test("should return active tasks correctly", () => {
    const activeTasks = getActiveTasks();
    const expectedActiveTasks = initialTasks.filter(task => task.stage === 'To-Do' || task.stage === 'In Progress');
    expect(activeTasks).toEqual(expectedActiveTasks);
  });

  test("should return completed tasks correctly", () => {
    const completedTasks = getCompletedTasks();
    const expectedCompletedTasks = initialTasks.filter(task => task.stage === 'Completed');
    expect(completedTasks).toEqual(expectedCompletedTasks);
  });

  test("should complete a task correctly", () => {
    const taskId = initialTasks[0].id;
    completeTask(taskId);
    const updatedTask = getAllTasks().find(task => task.id === taskId);
    expect(updatedTask?.stage).toBe('Completed');
  });

  test("should not have Group 2 tasks before completing Group 1 tasks", () => {
    const group1Tasks = initialTasks.filter(task => task.group === 1);
    group1Tasks.forEach(task => completeTask(task.id));
    const group2Tasks = getActiveTasks().filter(task => task.group === 2);
    expect(group2Tasks.length).toBe(2);
  });

  test("should create a task correctly", () => {
    const initialCount = getAllTasks().length;
    createTask('New Task', 'Description for new task', 'Persona', 1);
    expect(getAllTasks().length).toBe(initialCount + 1);
    const newTask = getAllTasks().find(task => task.title === 'New Task');
    expect(newTask).toBeDefined();
    expect(newTask?.title).toBe('New Task');
    expect(newTask?.description).toBe('Description for new task');
    expect(newTask?.persona).toBe('Persona');
    expect(newTask?.group).toBe(1);
    expect(newTask?.stage).toBe('To-Do');
  });

  test("should update a task correctly", () => {
    const taskId = initialTasks[0].id;
    const updatedTitle = 'Updated Title';
    updateTask(taskId, { title: updatedTitle });
    const updatedTask = getAllTasks().find(task => task.id === taskId);
    expect(updatedTask?.title).toBe(updatedTitle);
  });

  test("should delete a task correctly", () => {
    const taskId = initialTasks[0].id;
    deleteTask(taskId);
    const taskAfterDeletion = getAllTasks().find(task => task.id === taskId);
    expect(taskAfterDeletion).toBeUndefined();
  });

  test("should fetch all tasks correctly", () => {
    const allTasks = getAllTasks();
    expect(allTasks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Initial Setup' }),
        expect.objectContaining({ title: 'Basic Introduction' }),
        expect.objectContaining({ title: 'Basic Git' }),
        expect.objectContaining({ title: 'Git Collaboration' }),
        expect.objectContaining({ title: 'JavaScript Basics' }),
        expect.objectContaining({ title: 'JavaScript Project' }),
        expect.objectContaining({ title: 'API Introduction' }),
        expect.objectContaining({ title: 'API Consumption' }),
        expect.objectContaining({ title: 'Final Project' }),
        expect.objectContaining({ title: 'Project Presentation' })
      ])
    );
  });

  test("should enforce task completion order", () => {
    const initialSetupTask = initialTasks.find(task => task.title === 'Initial Setup');
    const basicIntroTask = initialTasks.find(task => task.title === 'Basic Introduction');
    
    if (initialSetupTask && basicIntroTask) {
      completeTask(initialSetupTask.id);
      completeTask(basicIntroTask.id);
    }

    const activeTasks = getActiveTasks();
    const group2Tasks = initialTasks.filter(task => task.group === 2);
    group2Tasks.forEach(task => {
      expect(activeTasks).toContainEqual(expect.objectContaining({ id: task.id }));
    });
  });

  test("should create multiple new tasks correctly", () => {
    const initialCount = getAllTasks().length;
    createTask('New Task 1', 'Description for new task 1', 'Persona', 1);
    createTask('New Task 2', 'Description for new task 2', 'Persona', 1);
    expect(getAllTasks().length).toBe(initialCount + 2);

    const newTask1 = getAllTasks().find(task => task.title === 'New Task 1');
    const newTask2 = getAllTasks().find(task => task.title === 'New Task 2');
    expect(newTask1).toBeDefined();
    expect(newTask2).toBeDefined();
  });
});

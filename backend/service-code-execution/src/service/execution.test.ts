import { expect, it } from 'vitest';
import { IsolatedExecutionService } from './execution';

it('should execute code', async () => {
  const service = new IsolatedExecutionService();
  const result = await service.executeCode('console.log("Hello, world!");');
  expect(result.stdout).toEqual(['Hello, world!']);
});

it('should handle errors', async () => {
  const service = new IsolatedExecutionService();
  const result = await service.executeCode('throw new Error("Test error");');
  expect(result.stderr).toEqual(['Test error']);
});

const sampleCode = `
// Define a simple Task class
class Task {
    constructor(id, title, completed = false) {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.createdAt = new Date();
    }

    toggle() {
        this.completed = !this.completed;
    }
}

// Create a task manager
class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(title) {
        const id = this.tasks.length + 1;
        const task = new Task(id, title);
        this.tasks.push(task);
        return task;
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.toggle();
            return true;
        }
        return false;
    }

    getSummary() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        
        return {
            total,
            completed,
            pending,
            completionRate: total ? (completed / total * 100).toFixed(1) + '%' : '0%'
        };
    }
}

// Create instance and add some tasks
const manager = new TaskManager();

// Add several tasks
console.log("Adding tasks...");
const tasks = [
    "Learn JavaScript",
    "Master Node.js",
    "Study React",
    "Practice TypeScript",
    "Build a project"
];

tasks.forEach(title => {
    const task = manager.addTask(title);
    console.log(\`Created task: \${task.id} - \${task.title}\`);
});

// Toggle some tasks as completed
console.log("\\nCompleting some tasks...");
[1, 3, 5].forEach(id => {
    manager.toggleTask(id);
    console.log(\`Toggled task \${id}\`);
});

// Get and display summary
console.log("\\nTask Summary:");
const summary = manager.getSummary();
Object.entries(summary).forEach(([key, value]) => {
    console.log(\`\${key}: \${value}\`);
});

// Display all tasks with their status
console.log("\\nDetailed Task List:");
manager.tasks.forEach(task => {
    console.log(\`[\${task.completed ? 'X' : ' '}] \${task.id}. \${task.title}\`);
});

// Return the final state of the task manager
manager;
`;

const sampleCodeResult = `Adding tasks...
Created task: 1 - Learn JavaScript
Created task: 2 - Master Node.js
Created task: 3 - Study React
Created task: 4 - Practice TypeScript
Created task: 5 - Build a project

Completing some tasks...
Toggled task 1
Toggled task 3
Toggled task 5

Task Summary:
total: 5
completed: 3
pending: 2
completionRate: 60.0%

Detailed Task List:
[X] 1. Learn JavaScript
[ ] 2. Master Node.js
[X] 3. Study React
[ ] 4. Practice TypeScript
[X] 5. Build a project`;

it('should execute sample code', async () => {
  const service = new IsolatedExecutionService();
  const result = await service.executeCode(sampleCode);
  expect(result.stdout.join('\n')).toEqual(sampleCodeResult);
});

it('should crash when code is invalid', async () => {
  const service = new IsolatedExecutionService();
  const result = await service.executeCode('invalid code');
  expect(result.error).toBeDefined();
});

it('should handle timeout', async () => {
  const service = new IsolatedExecutionService();
  const result = await service.executeCode('while (true) {}', 100);
  expect(result.error).toBeDefined();
  expect(result.error).toContain('Script execution timed out');
});

it('should error when language is not supported', async () => {
  const service = new IsolatedExecutionService();
  const result = await service.executeCode('type Hello = string;');
  expect(result.error).toBeDefined();
});

const sampleTypeScriptCode = `
// Define custom types
interface BaseEntity {
    id: number;
    createdAt: Date;
    updatedAt: Date;
}

// Enum for priority levels
enum Priority {
    Low = "LOW",
    Medium = "MEDIUM",
    High = "HIGH",
    Critical = "CRITICAL"
}

// Enum for task status
enum TaskStatus {
    Todo = "TODO",
    InProgress = "IN_PROGRESS",
    Review = "REVIEW",
    Done = "DONE"
}

// Interface for task
interface Task extends BaseEntity {
    title: string;
    description: string;
    priority: Priority;
    status: TaskStatus;
    tags: string[];
    assignee?: string;
    dueDate?: Date;
}

// Type guard
function isTask(obj: any): obj is Task {
    return obj 
        && typeof obj.title === 'string'
        && typeof obj.description === 'string'
        && Object.values(Priority).includes(obj.priority)
        && Object.values(TaskStatus).includes(obj.status);
}

// Generic class for managing collections
class Collection<T extends BaseEntity> {
    protected items: Map<number, T>;

    constructor() {
        this.items = new Map<number, T>();
    }

    add(item: T): void {
        this.items.set(item.id, item);
    }

    get(id: number): T | undefined {
        return this.items.get(id);
    }

    getAll(): T[] {
        return Array.from(this.items.values());
    }

    delete(id: number): boolean {
        return this.items.delete(id);
    }

    count(): number {
        return this.items.size;
    }
}

// Task manager extending generic collection
class TaskManager extends Collection<Task> {
    private currentId: number = 1;

    createTask(
        title: string,
        description: string,
        priority: Priority,
        tags: string[] = [],
        assignee?: string,
        dueDate?: Date
    ): Task {
        const now = new Date();
        const task: Task = {
            id: this.currentId++,
            title,
            description,
            priority,
            status: TaskStatus.Todo,
            tags,
            assignee,
            dueDate,
            createdAt: now,
            updatedAt: now
        };
        
        this.add(task);
        return task;
    }

    updateStatus(id: number, status: TaskStatus): boolean {
        const task = this.get(id);
        if (task) {
            task.status = status;
            task.updatedAt = new Date();
            return true;
        }
        return false;
    }

    findByStatus(status: TaskStatus): Task[] {
        return this.getAll().filter(task => task.status === status);
    }

    findByPriority(priority: Priority): Task[] {
        return this.getAll().filter(task => task.priority === priority);
    }

    findByAssignee(assignee: string): Task[] {
        return this.getAll().filter(task => task.assignee === assignee);
    }

    getTasksByTag(tag: string): Task[] {
        return this.getAll().filter(task => task.tags.includes(tag));
    }

    getSummary(): Record<string, number> {
        const summary: Record<TaskStatus, number> = {
            [TaskStatus.Todo]: 0,
            [TaskStatus.InProgress]: 0,
            [TaskStatus.Review]: 0,
            [TaskStatus.Done]: 0
        };

        this.getAll().forEach(task => {
            summary[task.status]++;
        });

        return summary;
    }
}

// Create instance and test functionality
const manager = new TaskManager();

// Create some tasks
console.log("Creating tasks...");
const task1 = manager.createTask(
    "Implement Authentication",
    "Set up JWT authentication for the API",
    Priority.High,
    ["backend", "security"],
    "Alice"
);

const task2 = manager.createTask(
    "Design Dashboard",
    "Create wireframes for the main dashboard",
    Priority.Medium,
    ["frontend", "design"],
    "Bob",
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
);

const task3 = manager.createTask(
    "Setup CI/CD",
    "Configure GitHub Actions for automated deployment",
    Priority.Critical,
    ["devops", "automation"],
    "Charlie"
);

// Update some statuses
console.log("\\nUpdating task statuses...");
manager.updateStatus(task1.id, TaskStatus.InProgress);
manager.updateStatus(task2.id, TaskStatus.Review);
manager.updateStatus(task3.id, TaskStatus.InProgress);

// Display various queries
console.log("\\nTasks by Status (In Progress):");
manager.findByStatus(TaskStatus.InProgress).forEach(task => {
    console.log(\`[\${task.priority}] \${task.title} (Assigned to: \${task.assignee})\`);
});

console.log("\\nTasks by Priority (Critical):");
manager.findByPriority(Priority.Critical).forEach(task => {
    console.log(\`[\${task.status}] \${task.title}\`);
});

console.log("\\nTasks by Tag (backend):");
manager.getTasksByTag("backend").forEach(task => {
    console.log(\`\${task.title} - \${task.description}\`);
});

// Display summary
console.log("\\nTask Summary:");
const summary = manager.getSummary();
Object.entries(summary).forEach(([status, count]) => {
    console.log(\`\${status}: \${count}\`);
});

// Return the manager instance
manager;
type Hello = string;
`;

const sampleTypeScriptCodeResult = `Creating tasks...

Updating task statuses...

Tasks by Status (In Progress):
[HIGH] Implement Authentication (Assigned to: Alice)
[CRITICAL] Setup CI/CD (Assigned to: Charlie)

Tasks by Priority (Critical):
[IN_PROGRESS] Setup CI/CD

Tasks by Tag (backend):
Implement Authentication - Set up JWT authentication for the API

Task Summary:
TODO: 0
IN_PROGRESS: 2
REVIEW: 1
DONE: 0`;

it('should execute sample TypeScript code', async () => {
  const service = new IsolatedExecutionService();
  const result = await service.executeCode(
    sampleTypeScriptCode,
    1000,
    'typescript'
  );
  expect(result.stdout.join('\n')).toEqual(sampleTypeScriptCodeResult);
});

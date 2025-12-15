'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/lib/types';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { ScheduleView } from '@/components/ScheduleView';
import { AIPlanExplanation } from '@/components/AIPlanExplanation';
import { generateWeekSchedule } from '@/lib/scheduler';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      // Convert date strings back to Date objects
      const tasksWithDates = parsed.map((task: any) => ({
        ...task,
        deadline: new Date(task.deadline),
        createdAt: new Date(task.createdAt),
      }));
      setTasks(tasksWithDates);
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem('tasks')) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Generate the weekly schedule
  const weekSchedule = generateWeekSchedule(tasks);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI Daily Planner</h1>
          <p className="text-muted-foreground">
            Maximize your limited time across school, practice, and two businesses
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <div className="space-y-6">
            <TaskForm onAddTask={handleAddTask} />
            <AIPlanExplanation tasks={tasks} />
          </div>
          <div>
            <TaskList
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </div>

        <div className="mt-6">
          <ScheduleView schedule={weekSchedule} />
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Managing: School (M-F 8am-3pm) • Practice (M-F 3:30pm-5:30pm) • Sleep (10pm-6am)
          </p>
          <p className="mt-2">
            Tasks auto-scored by deadline, revenue, urgency, and energy • AI explains priorities
          </p>
        </footer>
      </div>
    </div>
  );
}

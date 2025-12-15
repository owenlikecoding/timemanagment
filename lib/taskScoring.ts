import { Task, EnergyLevel } from './types';
import { differenceInDays, differenceInHours } from 'date-fns';

/**
 * Score a task based on multiple factors:
 * - Deadline urgency (closer deadlines score higher)
 * - Revenue potential (higher revenue scores higher)
 * - User-defined urgency (1-10 scale)
 * - Energy required (lower energy tasks can be scheduled more flexibly)
 */
export function scoreTask(task: Task, currentTime: Date = new Date()): number {
  let score = 0;

  // Deadline score (0-40 points)
  // Tasks due sooner get higher scores
  const hoursUntilDeadline = differenceInHours(task.deadline, currentTime);
  if (hoursUntilDeadline < 0) {
    // Overdue - very high priority
    score += 40;
  } else if (hoursUntilDeadline < 24) {
    // Due today
    score += 35;
  } else if (hoursUntilDeadline < 48) {
    // Due tomorrow
    score += 30;
  } else if (hoursUntilDeadline < 72) {
    // Due in 2-3 days
    score += 25;
  } else if (hoursUntilDeadline < 168) {
    // Due this week
    score += 20;
  } else {
    // Due later - diminishing returns
    score += Math.max(0, 15 - Math.floor(hoursUntilDeadline / 168));
  }

  // Revenue score (0-30 points)
  // Prioritize cash-generating tasks
  if (task.revenue) {
    if (task.business === 'palmetto-home-care') {
      // Cash-now business gets a boost
      score += Math.min(30, (task.revenue / 100) * 1.5);
    } else {
      // Long-term business (Nirvo AI)
      score += Math.min(25, task.revenue / 100);
    }
  }

  // User urgency score (0-20 points)
  // User-defined urgency on 1-10 scale
  score += (task.urgency / 10) * 20;

  // Energy penalty (0-10 points adjustment)
  // High energy tasks get slight penalty to be scheduled in optimal time slots
  const energyScores: Record<EnergyLevel, number> = {
    'low': 10,
    'medium': 5,
    'high': 0
  };
  score += energyScores[task.energyRequired];

  return score;
}

/**
 * Sort tasks by their priority score
 */
export function sortTasksByPriority(tasks: Task[]): Task[] {
  return tasks
    .filter(task => !task.completed)
    .sort((a, b) => scoreTask(b) - scoreTask(a));
}

/**
 * Simple AI explanation generator (no external API)
 * Explains why tasks are ordered the way they are
 */
export function generatePlanExplanation(tasks: Task[]): string {
  if (tasks.length === 0) {
    return "You have no tasks scheduled. Great job staying on top of things!";
  }

  const topTask = tasks[0];
  const score = scoreTask(topTask);
  const hoursUntilDeadline = differenceInHours(topTask.deadline, new Date());

  let explanation = `Your top priority is "${topTask.title}". `;

  // Explain deadline
  if (hoursUntilDeadline < 24) {
    explanation += "It's due very soon (within 24 hours), so I've prioritized it first. ";
  } else if (hoursUntilDeadline < 72) {
    explanation += "It's due in the next few days, making it urgent. ";
  }

  // Explain revenue
  if (topTask.revenue && topTask.revenue > 0) {
    if (topTask.business === 'palmetto-home-care') {
      explanation += `This task can generate $${topTask.revenue} immediately for Palmetto Home Care, which helps with cash flow. `;
    } else {
      explanation += `This contributes $${topTask.revenue} to Nirvo AI's long-term growth. `;
    }
  }

  // Explain urgency
  if (topTask.urgency >= 8) {
    explanation += "You marked this as highly urgent. ";
  }

  // Overall strategy
  const cashTasks = tasks.filter(t => t.business === 'palmetto-home-care').length;
  const growthTasks = tasks.filter(t => t.business === 'nirvo-ai').length;

  explanation += `\n\nYour schedule balances ${cashTasks} cash-generating tasks for Palmetto Home Care with ${growthTasks} long-term growth tasks for Nirvo AI, while respecting your locked school, practice, and sleep times.`;

  return explanation;
}

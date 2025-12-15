import { TimeBlock, Task, ScheduledTask, DaySchedule, WeekSchedule } from './types';
import { scoreTask, sortTasksByPriority } from './taskScoring';
import { 
  addDays, 
  startOfWeek, 
  endOfWeek, 
  isBefore
} from 'date-fns';

/**
 * Default fixed time blocks for a student
 * These are locked and cannot be used for tasks
 */
export function getDefaultFixedBlocks(): TimeBlock[] {
  const blocks: TimeBlock[] = [];
  let id = 0;

  // School: Monday-Friday 8:00 AM - 3:00 PM
  for (let day = 1; day <= 5; day++) {
    blocks.push({
      id: `fixed-${id++}`,
      day,
      startHour: 8,
      startMinute: 0,
      endHour: 15,
      endMinute: 0,
      type: 'school',
      locked: true,
      title: 'School'
    });
  }

  // Practice: Monday-Friday 3:30 PM - 5:30 PM
  for (let day = 1; day <= 5; day++) {
    blocks.push({
      id: `fixed-${id++}`,
      day,
      startHour: 15,
      startMinute: 30,
      endHour: 17,
      endMinute: 30,
      type: 'practice',
      locked: true,
      title: 'Practice'
    });
  }

  // Sleep: Every day 10:00 PM - 6:00 AM (next day)
  for (let day = 0; day <= 6; day++) {
    blocks.push({
      id: `fixed-${id++}`,
      day,
      startHour: 22,
      startMinute: 0,
      endHour: 23,
      endMinute: 59,
      type: 'sleep',
      locked: true,
      title: 'Sleep'
    });
    blocks.push({
      id: `fixed-${id++}`,
      day,
      startHour: 0,
      startMinute: 0,
      endHour: 6,
      endMinute: 0,
      type: 'sleep',
      locked: true,
      title: 'Sleep'
    });
  }

  return blocks;
}

/**
 * Calculate available time blocks by subtracting fixed blocks from the day
 */
export function calculateAvailableBlocks(day: number, fixedBlocks: TimeBlock[]): TimeBlock[] {
  const dayFixedBlocks = fixedBlocks
    .filter(b => b.day === day)
    .sort((a, b) => {
      const aStart = a.startHour * 60 + a.startMinute;
      const bStart = b.startHour * 60 + b.startMinute;
      return aStart - bStart;
    });

  const availableBlocks: TimeBlock[] = [];
  let currentMinute = 6 * 60; // Start at 6:00 AM
  const endMinute = 22 * 60; // End at 10:00 PM

  for (const fixedBlock of dayFixedBlocks) {
    const fixedStart = fixedBlock.startHour * 60 + fixedBlock.startMinute;
    const fixedEnd = fixedBlock.endHour * 60 + fixedBlock.endMinute;

    // Skip sleep blocks in the morning (already handled by starting at 6 AM)
    if (fixedEnd <= currentMinute) continue;
    // Skip if fixed block is after our end time
    if (fixedStart >= endMinute) break;

    // If there's a gap before this fixed block, create an available block
    if (fixedStart > currentMinute && currentMinute < endMinute) {
      const gapStart = currentMinute;
      const gapEnd = Math.min(fixedStart, endMinute);
      
      if (gapEnd - gapStart >= 30) { // Only create blocks >= 30 minutes
        availableBlocks.push({
          id: `available-${day}-${gapStart}`,
          day,
          startHour: Math.floor(gapStart / 60),
          startMinute: gapStart % 60,
          endHour: Math.floor(gapEnd / 60),
          endMinute: gapEnd % 60,
          type: 'available',
          locked: false
        });
      }
    }

    currentMinute = Math.max(currentMinute, fixedEnd);
  }

  // Add remaining time after last fixed block
  if (currentMinute < endMinute) {
    availableBlocks.push({
      id: `available-${day}-${currentMinute}`,
      day,
      startHour: Math.floor(currentMinute / 60),
      startMinute: currentMinute % 60,
      endHour: Math.floor(endMinute / 60),
      endMinute: endMinute % 60,
      type: 'available',
      locked: false
    });
  }

  return availableBlocks;
}

/**
 * Schedule tasks into available time blocks
 * Uses the scoring algorithm to prioritize tasks
 */
export function scheduleTasksToBlocks(
  tasks: Task[],
  availableBlocks: TimeBlock[],
  startDate: Date
): ScheduledTask[] {
  const sortedTasks = sortTasksByPriority(tasks);
  const scheduledTasks: ScheduledTask[] = [];
  const remainingBlocks = [...availableBlocks];

  for (const task of sortedTasks) {
    // Find the best block for this task
    let bestBlock: TimeBlock | null = null;
    let bestBlockIndex = -1;

    for (let i = 0; i < remainingBlocks.length; i++) {
      const block = remainingBlocks[i];
      const blockDuration = (block.endHour * 60 + block.endMinute) - 
                           (block.startHour * 60 + block.startMinute);

      // Check if block is large enough
      if (blockDuration >= task.estimatedMinutes) {
        // Prefer blocks closer to deadline
        const blockDate = addDays(startDate, block.day);
        if (!bestBlock || isBefore(blockDate, addDays(startDate, bestBlock.day))) {
          bestBlock = block;
          bestBlockIndex = i;
        }
      }
    }

    if (bestBlock) {
      const score = scoreTask(task);
      scheduledTasks.push({
        task,
        block: bestBlock,
        score
      });

      // Update or remove the block
      const blockDuration = (bestBlock.endHour * 60 + bestBlock.endMinute) - 
                           (bestBlock.startHour * 60 + bestBlock.startMinute);
      
      if (blockDuration > task.estimatedMinutes) {
        // Split the block
        const newStartMinute = (bestBlock.startHour * 60 + bestBlock.startMinute) + task.estimatedMinutes;
        remainingBlocks[bestBlockIndex] = {
          ...bestBlock,
          startHour: Math.floor(newStartMinute / 60),
          startMinute: newStartMinute % 60,
          id: `${bestBlock.id}-remaining`
        };
      } else {
        // Remove the block entirely
        remainingBlocks.splice(bestBlockIndex, 1);
      }
    }
  }

  return scheduledTasks;
}

/**
 * Generate a weekly schedule
 */
export function generateWeekSchedule(
  tasks: Task[],
  startDate: Date = new Date(),
  fixedBlocks?: TimeBlock[]
): WeekSchedule {
  const weekStart = startOfWeek(startDate);
  const weekEnd = endOfWeek(startDate);
  const fixed = fixedBlocks || getDefaultFixedBlocks();

  const days: DaySchedule[] = [];
  const allAvailableBlocks: TimeBlock[] = [];

  // Create day schedules
  for (let day = 0; day < 7; day++) {
    const dayDate = addDays(weekStart, day);
    const availableBlocks = calculateAvailableBlocks(day, fixed);
    allAvailableBlocks.push(...availableBlocks);

    days.push({
      day,
      date: dayDate,
      blocks: [...fixed.filter(b => b.day === day), ...availableBlocks],
      scheduledTasks: []
    });
  }

  // Schedule tasks
  const scheduledTasks = scheduleTasksToBlocks(tasks, allAvailableBlocks, weekStart);

  // Assign scheduled tasks to days
  for (const scheduledTask of scheduledTasks) {
    const daySchedule = days.find(d => d.day === scheduledTask.block.day);
    if (daySchedule) {
      daySchedule.scheduledTasks.push(scheduledTask);
    }
  }

  return {
    startDate: weekStart,
    endDate: weekEnd,
    days
  };
}

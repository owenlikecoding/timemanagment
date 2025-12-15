export type Business = 'nirvo-ai' | 'palmetto-home-care';

export type EnergyLevel = 'low' | 'medium' | 'high';

export type TimeBlock = {
  id: string;
  day: number; // 0-6 (Sunday-Saturday)
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  type: 'school' | 'practice' | 'sleep' | 'available';
  locked: boolean;
  title?: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  deadline: Date;
  estimatedMinutes: number;
  business?: Business;
  revenue?: number; // Expected revenue
  urgency: number; // 1-10
  energyRequired: EnergyLevel;
  completed: boolean;
  scheduledBlockId?: string;
  createdAt: Date;
  userId?: string;
};

export type ScheduledTask = {
  task: Task;
  block: TimeBlock;
  score: number;
};

export type DaySchedule = {
  day: number;
  date: Date;
  blocks: TimeBlock[];
  scheduledTasks: ScheduledTask[];
};

export type WeekSchedule = {
  startDate: Date;
  endDate: Date;
  days: DaySchedule[];
};

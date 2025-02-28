
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface HabitCompletion {
  date: string; // ISO string format
  completed: boolean;
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  frequency: Frequency;
  weekDays?: WeekDay[]; // For weekly habits
  monthDays?: number[]; // For monthly habits
  customDays?: string[]; // For custom frequency, ISO string dates
  createdAt: string;
  updatedAt: string;
  completions: Record<string, HabitCompletion>; // Key is ISO date string
  streak: number;
  bestStreak: number;
  totalCompletions: number;
  reminder?: string; // Time in 24h format HH:MM
  category?: string;
  archived?: boolean;
}

export interface HabitStats {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
  completionRate: number; // Percentage
  lastCompletedDate?: string;
}

export interface CategoryWithStats {
  name: string;
  habitCount: number;
  completionRate: number;
  habits: Habit[];
}

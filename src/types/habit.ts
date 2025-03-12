
export type Frequency = 'daily' | 'weekly' | 'monthly' | 'custom';

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type Difficulty = 'easy' | 'medium' | 'hard';

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
  difficulty?: Difficulty; // New field
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

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string; // ISO string date
  achieved: boolean;
  createdAt: string;
  updatedAt: string;
  habits?: Habit[];
}

export interface Milestone {
  id: string;
  habitId: string;
  milestoneType: 'streak' | 'completion' | 'consistency';
  milestoneValue: number;
  achievedAt: string;
  celebrated: boolean;
}

export interface MomentumIndex {
  value: number; // 0-100
  trend: number; // Percentage change
  lastUpdated: string;
}

export interface UserConnection {
  id: string;
  userId: string;
  connectedUserId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'blocked';
  createdAt: string;
  updatedAt: string;
  // User details if populated
  userDetails?: {
    displayName?: string;
    profileImage?: string;
  };
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  category?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  joinedAt: string;
  role: 'admin' | 'moderator' | 'member';
  // User details if populated
  userDetails?: {
    displayName?: string;
    profileImage?: string;
  };
}

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  createdBy: string;
  groupId?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  participantCount?: number;
}

export interface ChallengeParticipant {
  id: string;
  challengeId: string;
  userId: string;
  joinedAt: string;
  status: 'active' | 'completed' | 'abandoned';
  // User details if populated
  userDetails?: {
    displayName?: string;
    profileImage?: string;
  };
}

export interface SocialPost {
  id: string;
  userId: string;
  content?: string;
  habitId?: string;
  challengeId?: string;
  visibility: 'public' | 'connections' | 'private';
  createdAt: string;
  updatedAt: string;
  // Populated fields
  userDetails?: {
    displayName?: string;
    profileImage?: string;
  };
  habitDetails?: Habit;
  challengeDetails?: Challenge;
  likes?: number;
  comments?: number;
  shares?: number;
  userLiked?: boolean;
}

export interface PostInteraction {
  id: string;
  postId: string;
  userId: string;
  interactionType: 'like' | 'comment' | 'share';
  commentContent?: string;
  createdAt: string;
  // Populated fields
  userDetails?: {
    displayName?: string;
    profileImage?: string;
  };
}

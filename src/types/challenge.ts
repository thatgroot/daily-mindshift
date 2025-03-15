
export type ChallengeCategory = 'fitness' | 'mindfulness' | 'productivity' | 'learning' | 'social' | 'health';

export type ChallengeStatus = 'not_started' | 'in_progress' | 'completed' | 'failed';

export type ChallengeReward = {
  type: 'badge' | 'points' | 'unlock' | 'achievement';
  value: string | number;
  description?: string;
};

export type ChallengeMilestone = {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  completed: boolean;
};

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number; // in days
  startDate?: string;
  endDate?: string;
  status: ChallengeStatus;
  progress: number; // 0-100
  milestones: ChallengeMilestone[];
  rewards: ChallengeReward[];
  participants?: number;
  icon?: string;
}

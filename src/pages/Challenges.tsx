import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Star, Target, Flame, Award, CheckCheck, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Challenge, ChallengeCategory } from '@/types/challenge';
import { Link, useNavigate } from 'react-router-dom';

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: '30 Days of Meditation',
    description: 'Meditate for at least 10 minutes every day for 30 days to build a lasting mindfulness habit.',
    category: 'mindfulness',
    difficulty: 'beginner',
    duration: 30,
    status: 'not_started',
    progress: 0,
    milestones: [
      {
        id: 'm1',
        name: 'First Week',
        description: 'Complete 7 days of meditation',
        target: 7,
        current: 0,
        completed: false
      },
      {
        id: 'm2',
        name: 'Two Week Streak',
        description: 'Complete 14 consecutive days',
        target: 14,
        current: 0,
        completed: false
      },
      {
        id: 'm3',
        name: 'Full Month',
        description: 'Complete all 30 days',
        target: 30,
        current: 0,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'badge',
        value: 'Zen Master',
        description: 'Earned for completing the 30-day meditation challenge'
      },
      {
        type: 'points',
        value: 500
      }
    ],
    participants: 1248,
    icon: 'mindfulness'
  },
  {
    id: '2',
    title: 'Couch to 5K',
    description: 'Transform from a couch potato to a 5K runner in 8 weeks with this progressive training program.',
    category: 'fitness',
    difficulty: 'intermediate',
    duration: 56,
    status: 'not_started',
    progress: 0,
    milestones: [
      {
        id: 'm1',
        name: 'Week 1 Complete',
        description: 'Finish first week of training',
        target: 3,
        current: 0,
        completed: false
      },
      {
        id: 'm2',
        name: 'First 2K',
        description: 'Run 2K without stopping',
        target: 1,
        current: 0,
        completed: false
      },
      {
        id: 'm3',
        name: 'Final 5K',
        description: 'Complete your first 5K run',
        target: 1,
        current: 0,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'badge',
        value: 'Road Runner',
        description: 'Congratulations on your first 5K!'
      },
      {
        type: 'achievement',
        value: 'Running Enthusiast'
      }
    ],
    participants: 3567,
    icon: 'fitness'
  },
  {
    id: '3',
    title: 'Digital Detox Weekend',
    description: 'Spend a weekend disconnecting from digital devices and reconnecting with the physical world.',
    category: 'health',
    difficulty: 'beginner',
    duration: 2,
    status: 'not_started',
    progress: 0,
    milestones: [
      {
        id: 'm1',
        name: 'Preparation',
        description: 'Set up auto-replies and notify contacts',
        target: 1,
        current: 0,
        completed: false
      },
      {
        id: 'm2',
        name: 'Day One',
        description: 'Complete first day without digital devices',
        target: 1,
        current: 0,
        completed: false
      },
      {
        id: 'm3',
        name: 'Full Weekend',
        description: 'Complete the entire weekend detox',
        target: 1,
        current: 0,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'badge',
        value: 'Digital Detox Champion',
        description: 'Successfully completed a weekend without screens'
      }
    ],
    participants: 926,
    icon: 'health'
  },
  {
    id: '4',
    title: 'Learn a New Skill in 21 Days',
    description: 'Commit to learning a new skill by practicing for at least 30 minutes daily for 21 days.',
    category: 'learning',
    difficulty: 'intermediate',
    duration: 21,
    status: 'not_started',
    progress: 0,
    milestones: [
      {
        id: 'm1',
        name: 'First Week',
        description: 'Complete 7 days of learning',
        target: 7,
        current: 0,
        completed: false
      },
      {
        id: 'm2',
        name: 'Two Week Milestone',
        description: 'Complete 14 days of learning',
        target: 14,
        current: 0,
        completed: false
      },
      {
        id: 'm3',
        name: 'Full Course',
        description: 'Complete all 21 days',
        target: 21,
        current: 0,
        completed: false
      }
    ],
    rewards: [
      {
        type: 'badge',
        value: 'Skill Master',
        description: 'Mastered a new skill in 21 days'
      },
      {
        type: 'points',
        value: 300
      }
    ],
    participants: 2134,
    icon: 'learning'
  }
];

const getChallengeIcon = (category: ChallengeCategory) => {
  switch (category) {
    case 'fitness':
      return <Flame className="h-6 w-6 text-orange-500" />;
    case 'mindfulness':
      return <Star className="h-6 w-6 text-purple-500" />;
    case 'productivity':
      return <CheckCheck className="h-6 w-6 text-blue-500" />;
    case 'learning':
      return <Award className="h-6 w-6 text-yellow-500" />;
    case 'social':
      return <Trophy className="h-6 w-6 text-pink-500" />;
    case 'health':
      return <Target className="h-6 w-6 text-green-500" />;
    default:
      return <Trophy className="h-6 w-6 text-primary" />;
  }
};

const getDifficultyColor = (difficulty: Challenge['difficulty']) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'intermediate':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'advanced':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'expert':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const ChallengeCard: React.FC<{ challenge: Challenge }> = ({ challenge }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/challenge/${challenge.id}`);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer" onClick={handleCardClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getChallengeIcon(challenge.category)}
            <CardTitle className="text-lg">{challenge.title}</CardTitle>
          </div>
          <span className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
            getDifficultyColor(challenge.difficulty)
          )}>
            {challenge.difficulty}
          </span>
        </div>
        <CardDescription className="line-clamp-2">{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{challenge.duration} days</span>
            <span>{challenge.participants} participants</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${challenge.progress}%` }}></div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {challenge.rewards.map((reward, index) => (
              <div key={index} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                {reward.type === 'badge' && <span>🏆 {reward.value}</span>}
                {reward.type === 'points' && <span>✨ {reward.value} pts</span>}
                {reward.type === 'unlock' && <span>🔓 {reward.value}</span>}
                {reward.type === 'achievement' && <span>🌟 {reward.value}</span>}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button 
          className="w-full flex justify-between items-center"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/challenge/${challenge.id}`);
          }}
        >
          <span>
            {challenge.status === 'not_started' ? 'Start Challenge' : 
             challenge.status === 'in_progress' ? 'Continue' : 
             challenge.status === 'completed' ? 'View Details' : 'Try Again'}
          </span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const Challenges: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  
  const filteredChallenges = filter === 'all' 
    ? mockChallenges 
    : mockChallenges.filter(challenge => challenge.category === filter);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Challenges</h1>
        <p className="text-muted-foreground">
          Complete challenges to earn rewards and build consistency in your habits.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="mb-6 overflow-x-auto">
          <TabsList className="p-1">
            <TabsTrigger onClick={() => setFilter('all')} value="all">All</TabsTrigger>
            <TabsTrigger onClick={() => setFilter('fitness')} value="fitness">Fitness</TabsTrigger>
            <TabsTrigger onClick={() => setFilter('mindfulness')} value="mindfulness">Mindfulness</TabsTrigger>
            <TabsTrigger onClick={() => setFilter('productivity')} value="productivity">Productivity</TabsTrigger>
            <TabsTrigger onClick={() => setFilter('learning')} value="learning">Learning</TabsTrigger>
            <TabsTrigger onClick={() => setFilter('social')} value="social">Social</TabsTrigger>
            <TabsTrigger onClick={() => setFilter('health')} value="health">Health</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </TabsContent>

        {['fitness', 'mindfulness', 'productivity', 'learning', 'social', 'health'].map(category => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Layout>
  );
};

export default Challenges;

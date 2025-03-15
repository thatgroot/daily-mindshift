import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Flame, Award, CheckCheck, ChevronLeft, Users, Calendar, Clock } from 'lucide-react';
import { Challenge, ChallengeCategory } from '@/types/challenge';

// Reusing the mock data from Challenges.tsx for this example
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
      return <Flame className="h-8 w-8 text-orange-500" />;
    case 'mindfulness':
      return <Star className="h-8 w-8 text-purple-500" />;
    case 'productivity':
      return <CheckCheck className="h-8 w-8 text-blue-500" />;
    case 'learning':
      return <Award className="h-8 w-8 text-yellow-500" />;
    case 'social':
      return <Trophy className="h-8 w-8 text-pink-500" />;
    case 'health':
      return <Target className="h-8 w-8 text-green-500" />;
    default:
      return <Trophy className="h-8 w-8 text-primary" />;
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

const ChallengeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);
  
  // Find the selected challenge
  const challenge = mockChallenges.find(c => c.id === id);
  
  if (!challenge) {
    return (
      <Layout>
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold">Challenge not found</h1>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/challenges')}
          >
            Go back to Challenges
          </Button>
        </div>
      </Layout>
    );
  }

  const handleStartChallenge = () => {
    setIsJoining(true);
    // In a real app, you would update the challenge status in the database
    setTimeout(() => {
      setIsJoining(false);
      // For now, just navigate back to challenges
      navigate('/challenges');
    }, 1500);
  };

  return (
    <Layout>
      <Button 
        variant="ghost" 
        className="mb-4 pl-0"
        onClick={() => navigate('/challenges')}
      >
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Challenges
      </Button>
      
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {getChallengeIcon(challenge.category)}
          <h1 className="text-3xl font-bold">{challenge.title}</h1>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
            {challenge.difficulty}
          </span>
          <span className="inline-flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" /> {challenge.duration} days
          </span>
          <span className="inline-flex items-center text-sm text-muted-foreground">
            <Users className="mr-1 h-4 w-4" /> {challenge.participants} participants
          </span>
        </div>
        
        <p className="text-muted-foreground">{challenge.description}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenge.milestones.map((milestone, index) => (
                  <div key={milestone.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{milestone.name}</h3>
                        <p className="text-sm text-muted-foreground">{milestone.description}</p>
                      </div>
                      <div className="bg-primary/10 text-primary rounded-full px-2 py-1 text-sm">
                        {milestone.current}/{milestone.target}
                      </div>
                    </div>
                    <Progress value={(milestone.current / milestone.target) * 100} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Tips for Success</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Start with small, achievable goals to build momentum</li>
                <li>Create a specific time in your schedule for this challenge</li>
                <li>Track your progress daily using the app</li>
                <li>Join the community discussion for motivation and tips</li>
                <li>Remember why you started when facing challenges</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{challenge.progress}%</h3>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
              
              <Progress value={challenge.progress} className="h-2 mb-4" />
              
              {challenge.status === 'not_started' && (
                <Button 
                  className="w-full" 
                  onClick={handleStartChallenge} 
                  disabled={isJoining}
                >
                  {isJoining ? 'Joining...' : 'Start Challenge'}
                </Button>
              )}
              
              {challenge.status === 'in_progress' && (
                <Button className="w-full">Log Progress</Button>
              )}
              
              {challenge.status === 'completed' && (
                <div className="text-center p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Trophy className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="font-medium text-green-800 dark:text-green-300">Challenge Completed!</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenge.rewards.map((reward, index) => (
                  <div key={index} className="flex items-center p-3 border rounded-lg">
                    {reward.type === 'badge' && <Trophy className="h-8 w-8 text-yellow-500 mr-3" />}
                    {reward.type === 'points' && <Star className="h-8 w-8 text-purple-500 mr-3" />}
                    {reward.type === 'unlock' && <Award className="h-8 w-8 text-blue-500 mr-3" />}
                    {reward.type === 'achievement' && <Award className="h-8 w-8 text-green-500 mr-3" />}
                    <div>
                      <p className="font-medium">{reward.type === 'points' ? `${reward.value} Points` : String(reward.value)}</p>
                      {reward.description && <p className="text-sm text-muted-foreground">{reward.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ChallengeDetail;

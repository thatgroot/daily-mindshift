import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Target, Flame, Award, CheckCheck, ChevronLeft, Users, Calendar, Clock, GraduationCap, ListChecks, MessageSquare, Plus, Info, CheckCircle2 } from 'lucide-react';
import { Challenge, ChallengeCategory, DailyCheckIn } from '@/types/challenge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { format, addDays, isBefore, isToday, parseISO } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';

const mockChallenges: Challenge[] = [
  // ... keep existing mockChallenges array
];

const mockExpertTips = {
  // ... keep existing mockExpertTips object
};

const mockSteps = {
  // ... keep existing mockSteps object
};

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
  const [openMilestones, setOpenMilestones] = useState<Record<string, boolean>>({});
  const [steps, setSteps] = useState(mockSteps);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [todayChecked, setTodayChecked] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  
  const challenge = mockChallenges.find(c => c.id === id);
  
  useEffect(() => {
    if (challenge) {
      const today = format(new Date(), 'yyyy-MM-dd');
      let updatedChallenge = { ...challenge };
      
      if (!updatedChallenge.dailyCheckIns) {
        updatedChallenge.dailyCheckIns = {};
      }
      
      setActiveChallenge(updatedChallenge);
      
      if (updatedChallenge.dailyCheckIns[today]?.completed) {
        setTodayChecked(true);
      }
    }
  }, [challenge]);
  
  if (!challenge || !activeChallenge) {
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
    
    const today = new Date();
    const endDate = addDays(today, challenge.duration);
    
    const updatedChallenge = {
      ...activeChallenge,
      status: 'in_progress' as ChallengeStatus,
      startDate: today.toISOString(),
      endDate: endDate.toISOString()
    };
    
    setTimeout(() => {
      setActiveChallenge(updatedChallenge);
      setIsJoining(false);
      
      toast({
        title: "Challenge Started!",
        description: `You've joined the ${challenge.title} challenge.`,
      });
    }, 1000);
  };

  const toggleMilestone = (milestoneId: string) => {
    setOpenMilestones(prev => ({
      ...prev,
      [milestoneId]: !prev[milestoneId]
    }));
  };

  const toggleStep = (milestoneId: string, stepId: string) => {
    setSteps(prev => {
      const updatedSteps = { ...prev };
      const milestoneSteps = [...updatedSteps[milestoneId as keyof typeof updatedSteps]];
      const stepIndex = milestoneSteps.findIndex(step => step.id === stepId);
      
      if (stepIndex !== -1) {
        milestoneSteps[stepIndex] = {
          ...milestoneSteps[stepIndex],
          completed: !milestoneSteps[stepIndex].completed
        };
        updatedSteps[milestoneId as keyof typeof updatedSteps] = milestoneSteps;
      }
      
      return updatedSteps;
    });
  };

  const handleDailyCheckIn = () => {
    if (activeChallenge.status !== 'in_progress') {
      toast({
        title: "Start the challenge first",
        description: "You need to start the challenge before checking in.",
        variant: "destructive"
      });
      return;
    }
    
    setCheckingIn(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    const isAlreadyChecked = activeChallenge.dailyCheckIns?.[today]?.completed || false;
    
    const updatedCheckIns = {
      ...activeChallenge.dailyCheckIns,
      [today]: {
        date: today,
        completed: !isAlreadyChecked,
        notes: ""
      }
    };
    
    const totalDays = activeChallenge.duration;
    const completedDays = Object.values(updatedCheckIns).filter(day => day.completed).length;
    const newProgress = Math.round((completedDays / totalDays) * 100);
    
    const updatedMilestones = activeChallenge.milestones.map(milestone => {
      let current = milestone.current;
      
      if (!isAlreadyChecked && milestone.current < milestone.target) {
        current += 1;
      } else if (isAlreadyChecked && milestone.current > 0) {
        current -= 1;
      }
      
      return {
        ...milestone,
        current,
        completed: current >= milestone.target
      };
    });
    
    const updatedChallenge = {
      ...activeChallenge,
      dailyCheckIns: updatedCheckIns,
      progress: newProgress,
      milestones: updatedMilestones,
      status: newProgress >= 100 ? 'completed' : 'in_progress'
    };
    
    setTimeout(() => {
      setActiveChallenge(updatedChallenge);
      setTodayChecked(!isAlreadyChecked);
      setCheckingIn(false);
      
      toast({
        title: isAlreadyChecked ? "Check-in removed" : "Activity completed!",
        description: isAlreadyChecked 
          ? "Your daily check-in has been removed." 
          : "Great job completing today's activity!",
      });
    }, 600);
  };

  const renderCheckInHistory = () => {
    if (!activeChallenge.dailyCheckIns || Object.keys(activeChallenge.dailyCheckIns).length === 0) {
      return (
        <p className="text-center text-muted-foreground py-3">
          No activity recorded yet.
        </p>
      );
    }
    
    const checkIns = Object.entries(activeChallenge.dailyCheckIns)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .slice(0, 7);
    
    return (
      <div className="space-y-2">
        {checkIns.map(([date, checkIn]) => (
          <div key={date} className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center">
              {checkIn.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <div className="h-5 w-5 border rounded-full mr-2" />
              )}
              <span>{format(parseISO(date), 'MMM dd, yyyy')}</span>
            </div>
            <span className={checkIn.completed ? "text-green-600 font-medium" : "text-muted-foreground"}>
              {checkIn.completed ? "Completed" : "Missed"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const getStatusInfo = () => {
    if (!activeChallenge.startDate) {
      return {
        label: "Not started",
        color: "text-muted-foreground"
      };
    }
    
    const startDate = parseISO(activeChallenge.startDate);
    const endDate = activeChallenge.endDate ? parseISO(activeChallenge.endDate) : addDays(startDate, activeChallenge.duration);
    const today = new Date();
    
    if (isBefore(endDate, today) && activeChallenge.progress < 100) {
      return {
        label: "Expired",
        color: "text-destructive"
      };
    }
    
    switch (activeChallenge.status) {
      case 'completed':
        return {
          label: "Completed",
          color: "text-green-600"
        };
      case 'in_progress':
        return {
          label: "In Progress",
          color: "text-blue-600"
        };
      case 'failed':
        return {
          label: "Failed",
          color: "text-destructive"
        };
      default:
        return {
          label: "Not Started",
          color: "text-muted-foreground"
        };
    }
  };

  const statusInfo = getStatusInfo();

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
          {getChallengeIcon(activeChallenge.category)}
          <h1 className="text-3xl font-bold">{activeChallenge.title}</h1>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(activeChallenge.difficulty)}`}>
            {activeChallenge.difficulty}
          </span>
          <span className="inline-flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" /> {activeChallenge.duration} days
          </span>
          <span className="inline-flex items-center text-sm text-muted-foreground">
            <Users className="mr-1 h-4 w-4" /> {activeChallenge.participants} participants
          </span>
          <span className={`inline-flex items-center text-sm ${statusInfo.color}`}>
            <CheckCircle2 className="mr-1 h-4 w-4" /> {statusInfo.label}
          </span>
        </div>
        
        <p className="text-muted-foreground">{activeChallenge.description}</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeChallenge.status === 'in_progress' && (
            <Card className="border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-lg">
                  <CheckCircle2 className="mr-2 h-5 w-5 text-primary" />
                  Daily Check-in
                </CardTitle>
                <CardDescription>
                  Mark your activity as complete for today
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-between border p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {getChallengeIcon(activeChallenge.category)}
                    </div>
                    <div>
                      <h3 className="font-medium">Today's Activity</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={todayChecked ? "text-green-600 font-medium" : "text-muted-foreground"}>
                      {todayChecked ? "Completed" : "Not completed"}
                    </span>
                    <Switch
                      checked={todayChecked}
                      onCheckedChange={handleDailyCheckIn}
                      disabled={checkingIn}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t">
                <div className="w-full">
                  <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                  {renderCheckInHistory()}
                </div>
              </CardFooter>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ListChecks className="mr-2 h-5 w-5 text-primary" />
                Milestones
              </CardTitle>
              <CardDescription>
                Complete these milestones to successfully finish the challenge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeChallenge.milestones.map((milestone) => (
                  <Collapsible
                    key={milestone.id}
                    open={openMilestones[milestone.id]}
                    onOpenChange={() => toggleMilestone(milestone.id)}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <CollapsibleTrigger className="flex items-center gap-2 text-left">
                            <h3 className="font-medium">{milestone.name}</h3>
                            <ChevronLeft className={`h-4 w-4 transition-transform ${openMilestones[milestone.id] ? 'rotate-90' : '-rotate-90'}`} />
                          </CollapsibleTrigger>
                          <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                        </div>
                        <div className="bg-primary/10 text-primary rounded-full px-2 py-1 text-sm">
                          {milestone.current}/{milestone.target}
                        </div>
                      </div>
                      <Progress value={(milestone.current / milestone.target) * 100} className="h-2" />
                    </div>
                    
                    <CollapsibleContent>
                      <div className="border-t px-4 py-3 bg-muted/20">
                        <h4 className="font-medium flex items-center mb-2">
                          <Info className="h-4 w-4 mr-2 text-primary" />
                          Steps to Complete
                        </h4>
                        <div className="space-y-3 mb-4">
                          {steps[milestone.id as keyof typeof steps]?.map((step) => (
                            <div key={step.id} className="flex items-start space-x-2">
                              <Checkbox 
                                id={step.id} 
                                checked={step.completed}
                                onCheckedChange={() => toggleStep(milestone.id, step.id)}
                                className="mt-0.5"
                              />
                              <Label
                                htmlFor={step.id}
                                className={`${step.completed ? 'line-through text-muted-foreground' : ''}`}
                              >
                                {step.text}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-t px-4 py-3 bg-primary/5">
                        <h4 className="font-medium flex items-center mb-2">
                          <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                          Expert Recommendations
                        </h4>
                        <div className="space-y-3">
                          {mockExpertTips[milestone.id as keyof typeof mockExpertTips]?.map((expertTip) => (
                            <Card key={expertTip.id} className="border bg-card">
                              <CardContent className="p-3">
                                <div className="flex items-start gap-2">
                                  <MessageSquare className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm">{expertTip.tip}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      <strong>{expertTip.name}</strong> · {expertTip.role}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate('/challenges')}>
                <Plus className="mr-2 h-4 w-4" />
                Browse More Challenges
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-primary" />
                Tips for Success
              </CardTitle>
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
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-primary" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{activeChallenge.progress}%</h3>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
              
              <Progress value={activeChallenge.progress} className="h-2 mb-4" />
              
              {activeChallenge.status === 'not_started' && (
                <Button 
                  className="w-full" 
                  onClick={handleStartChallenge} 
                  disabled={isJoining}
                >
                  {isJoining ? 'Joining...' : 'Start Challenge'}
                </Button>
              )}
              
              {activeChallenge.status === 'in_progress' && (
                <Button 
                  className="w-full"
                  onClick={handleDailyCheckIn}
                  disabled={checkingIn}
                >
                  {checkingIn 
                    ? 'Updating...' 
                    : todayChecked 
                      ? 'Mark Today as Incomplete' 
                      : 'Complete Today\'s Activity'
                  }
                </Button>
              )}
              
              {activeChallenge.status === 'completed' && (
                <div className="text-center p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Trophy className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="font-medium text-green-800 dark:text-green-300">Challenge Completed!</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-primary" />
                Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeChallenge.rewards.map((reward, index) => (
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

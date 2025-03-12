
import React, { useState } from 'react';
import { useHabits } from '@/contexts/HabitContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HabitCard from './HabitCard';
import HabitForm from './HabitForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Flame, 
  Plus, 
  TrendingUp, 
  Award, 
  LayoutGrid, 
  Loader2,
  Sparkles,
  Bell,
  MessageSquare,
  Watch,
  LineChart,
  Trophy,
  BookOpen,
  Lock
} from 'lucide-react';
import { Habit } from '@/types/habit';
import StatsCard from './StatsCard';
import AnimatedCounter from './AnimatedCounter';
import { useAuth } from '@/contexts/AuthContext';
// Import new visualization components
import ActivityHeatmap from './ActivityHeatmap';
import HabitCorrelations from './HabitCorrelations';
import HabitMatrix from './HabitMatrix';

const Dashboard: React.FC = () => {
  const { habits, getHabitsByCategory, shouldCompleteToday, getCompletionStatus, loading, error } = useHabits();
  const { user } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("today");
  
  const { completed, total } = getCompletionStatus();
  const categorizedHabits = getHabitsByCategory();
  
  const todayHabits = habits.filter(habit => shouldCompleteToday(habit));
  const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.bestStreak), 0);
  const totalCompletions = habits.reduce((sum, habit) => sum + habit.totalCompletions, 0);
  
  const openCreateForm = () => {
    setSelectedHabit(undefined);
    setFormOpen(true);
  };
  
  const openEditForm = (habit: Habit) => {
    setSelectedHabit(habit);
    setFormOpen(true);
  };

  // Mock data for AI features
  const aiRecommendations = [
    { id: 1, name: "Morning Meditation", description: "Based on your sleep patterns", category: "Wellness" },
    { id: 2, name: "Evening Reading", description: "Matches your productivity cycles", category: "Personal Growth" },
    { id: 3, name: "Hydration Reminder", description: "Aligned with your activity levels", category: "Health" }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your habits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-destructive mb-4">⚠️</div>
        <h3 className="text-xl font-medium mb-2">Something went wrong</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <Button onClick={openCreateForm} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Habit
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Progress"
          value={`${completed}/${total}`}
          description={`${Math.round((completed / (total || 1)) * 100)}% complete`}
          icon={<Calendar className="h-5 w-5" />}
          ringValue={completed}
          ringMax={total}
        />
        
        <StatsCard
          title="Current Streak"
          value={habits.reduce((max, habit) => Math.max(max, habit.streak), 0).toString()}
          description="days in a row"
          icon={<Flame className="h-5 w-5" />}
          trend={+5}
        />
        
        <StatsCard
          title="Longest Streak"
          value={longestStreak.toString()}
          description="days consecutive"
          icon={<Award className="h-5 w-5" />}
        />
        
        <StatsCard
          title="Total Completions"
          value={<AnimatedCounter value={totalCompletions} />}
          description="habits completed"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={+12}
        />
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ActivityHeatmap habits={habits} />
        <HabitCorrelations habits={habits} />
        <HabitMatrix habits={habits} />
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full justify-start">
          <TabsTrigger value="today">Today's Habits</TabsTrigger>
          <TabsTrigger value="all">All Habits</TabsTrigger>
          <TabsTrigger value="ai-features">AI Features</TabsTrigger>
        </TabsList>
        
        {/* Today's Habits Tab */}
        <TabsContent value="today" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Habits
            </h2>
            <Badge variant="outline" className="font-normal">
              {completed}/{total} Completed
            </Badge>
          </div>
          
          {todayHabits.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-muted-foreground mb-4">No habits scheduled for today.</p>
                <Button onClick={openCreateForm} variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add Your First Habit
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {todayHabits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} onEdit={() => openEditForm(habit)} />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* All Habits Tab */}
        <TabsContent value="all" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 mb-4">
              <LayoutGrid className="h-5 w-5" />
              All Habits
            </h2>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                {Object.keys(categorizedHabits).map((category) => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {habits.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                      <p className="text-muted-foreground mb-4">You haven't created any habits yet.</p>
                      <Button onClick={openCreateForm} variant="outline" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Add Your First Habit
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-3">
                    {habits.map((habit) => (
                      <HabitCard key={habit.id} habit={habit} onEdit={() => openEditForm(habit)} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {Object.entries(categorizedHabits).map(([category, categoryHabits]) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  <div className="grid gap-3">
                    {categoryHabits.map((habit) => (
                      <HabitCard key={habit.id} habit={habit} onEdit={() => openEditForm(habit)} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </TabsContent>
        
        {/* AI Features Tab */}
        <TabsContent value="ai-features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* AI-Driven Habit Recommendations */}
            <Card className="overflow-hidden rounded-xl transition-all duration-200 hover:shadow-md border-primary/10">
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  AI Habit Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">Personalized habit suggestions based on your behavior patterns.</p>
                <div className="space-y-3">
                  {aiRecommendations.map(rec => (
                    <div key={rec.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">{rec.name}</p>
                        <p className="text-xs text-muted-foreground">{rec.description}</p>
                      </div>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Plus className="h-3.5 w-3.5" /> Add
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Adaptive Reminders */}
            <Card className="overflow-hidden rounded-xl transition-all duration-200 hover:shadow-md border-primary/10">
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Bell className="h-5 w-5 text-accent" />
                  Adaptive Reminders
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">Smart notifications that adjust based on your activity patterns.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Morning Meditation</p>
                      <p className="text-xs text-muted-foreground">Adjusted to 7:15 AM (15 min earlier)</p>
                    </div>
                    <Badge variant="outline">Optimized</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">Evening Workout</p>
                      <p className="text-xs text-muted-foreground">Moved to 6:30 PM based on your schedule</p>
                    </div>
                    <Badge variant="outline">Optimized</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Voice & Chatbot Integration */}
            <Card className="overflow-hidden rounded-xl transition-all duration-200 hover:shadow-md border-primary/10">
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-accent" />
                  Voice & Chatbot Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">Log habits and get coaching via voice or chat.</p>
                <div className="rounded-lg border p-4 mb-2">
                  <div className="flex flex-col space-y-2">
                    <div className="bg-muted p-2 rounded-lg text-sm self-start max-w-[80%]">
                      How are you doing with your reading habit?
                    </div>
                    <div className="bg-primary/10 p-2 rounded-lg text-sm self-end max-w-[80%]">
                      I read for 20 minutes today
                    </div>
                    <div className="bg-muted p-2 rounded-lg text-sm self-start max-w-[80%]">
                      Great job! That's 3 days in a row now. Keep it up!
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Message your habit assistant..." 
                    className="flex-1 px-3 py-2 text-sm rounded-l-md border" 
                  />
                  <Button size="sm" className="rounded-l-none">Send</Button>
                </div>
              </CardContent>
            </Card>

            {/* Biofeedback & Wearable Integration */}
            <Card className="overflow-hidden rounded-xl transition-all duration-200 hover:shadow-md border-primary/10">
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Watch className="h-5 w-5 text-accent" />
                  Wearable Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">Connect your devices for automatic habit tracking.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Apple Watch</p>
                        <p className="text-xs text-muted-foreground">Steps, sleep, workouts</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Connect</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">F</div>
                      <div>
                        <p className="font-medium">Fitbit</p>
                        <p className="text-xs text-muted-foreground">Heart rate, sleep, activity</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Connect</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Predictive Analytics */}
            <Card className="overflow-hidden rounded-xl transition-all duration-200 hover:shadow-md border-primary/10">
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-accent" />
                  Predictive Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">Insights and forecasts on your habit formation.</p>
                <div className="h-40 bg-muted/30 rounded-lg mb-3 flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">Interactive charts will appear here</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Meditation consistency:</span>
                    <span className="font-medium text-green-500">87% (improving)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Expected habit formation:</span>
                    <span className="font-medium">~14 more days</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Challenge probability:</span>
                    <span className="font-medium text-orange-500">Medium on weekends</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom Challenges & Social Leaderboards */}
            <Card className="overflow-hidden rounded-xl transition-all duration-200 hover:shadow-md border-primary/10">
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-accent" />
                  Challenges & Leaderboards
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">Create challenges and compete with friends.</p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">30-Day Meditation Challenge</h3>
                      <Badge variant="secondary">12 participants</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">1. Sarah J.</span>
                        <span className="font-medium">27/30 days</span>
                      </div>
                      <div className="flex justify-between text-sm bg-accent/10 p-1 rounded">
                        <span className="flex items-center">2. You</span>
                        <span className="font-medium">25/30 days</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">3. Mark T.</span>
                        <span className="font-medium">22/30 days</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">Create Challenge</Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Journaling */}
            <Card className="overflow-hidden rounded-xl transition-all duration-200 hover:shadow-md border-primary/10">
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-accent" />
                  AI-Powered Journaling
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">Personalized reflections and progress summaries.</p>
                <div className="p-3 rounded-lg border mb-3">
                  <h3 className="font-medium mb-2">Today's Reflection</h3>
                  <p className="text-sm">You've been consistent with your morning routine this week! Your meditation streak is at 5 days, and you've increased your reading time by 15%. Consider adding a short walk to complement your morning routine.</p>
                </div>
                <Button size="sm" className="w-full">View Full Journal</Button>
              </CardContent>
            </Card>

            {/* Focus Mode & Habit Stacking */}
            <Card className="overflow-hidden rounded-xl transition-all duration-200 hover:shadow-md border-primary/10 md:col-span-2">
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Focus Mode & Habit Stacking
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">Group your habits for optimal routines.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border">
                    <h3 className="font-medium mb-2">Morning Routine</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-1 h-6 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm">Meditation (5 min)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1 h-6 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-sm">Journal (10 min)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1 h-6 bg-purple-500 rounded-full mr-2"></div>
                        <span className="text-sm">Reading (15 min)</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">Start Routine</Button>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <h3 className="font-medium mb-2">Evening Routine</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <div className="w-1 h-6 bg-orange-500 rounded-full mr-2"></div>
                        <span className="text-sm">Stretching (10 min)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1 h-6 bg-indigo-500 rounded-full mr-2"></div>
                        <span className="text-sm">Gratitude (5 min)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-1 h-6 bg-pink-500 rounded-full mr-2"></div>
                        <span className="text-sm">Read fiction (20 min)</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">Start Routine</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Offline Mode & Enhanced Privacy */}
            <Card className="overflow-hidden rounded-xl transition-all duration-200 hover:shadow-md border-primary/10">
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Lock className="h-5 w-5 text-accent" />
                  Offline & Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">Enhanced security with end-to-end encryption.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                          <path d="M9 12l2 2 4-4M5 12a7 7 0 0 1 7-7 7 7 0 0 1 7 7 7 7 0 0 1-7 7 7 7 0 0 1-7-7z"/>
                        </svg>
                      </div>
                      <span className="text-sm">Offline Mode</span>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                      </div>
                      <span className="text-sm">End-to-End Encryption</span>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      </div>
                      <span className="text-sm">Data Protection</span>
                    </div>
                    <Badge className="bg-green-500">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expert Content & Coaching */}
            <Card className="overflow-hidden rounded-xl transition-all duration-200 hover:shadow-md border-primary/10">
              <CardHeader className="bg-primary/5 pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  Expert Content & Coaching
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-4">Access specialized coaching and exclusive content.</p>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-accent text-white text-xs py-0.5 px-2">
                      Premium
                    </div>
                    <h3 className="font-medium">Habit Master Class</h3>
                    <p className="text-xs text-muted-foreground mb-2">By Dr. James Clear</p>
                    <p className="text-sm mb-2">Learn the science behind habit formation from the author of "Atomic Habits".</p>
                    <Button size="sm" className="w-full">Access Course</Button>
                  </div>
                  <div className="p-3 rounded-lg border relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-accent text-white text-xs py-0.5 px-2">
                      Premium
                    </div>
                    <h3 className="font-medium">1:1 Coaching Sessions</h3>
                    <p className="text-xs text-muted-foreground mb-2">With certified habit coaches</p>
                    <p className="text-sm mb-2">Personalized guidance to develop your habit systems.</p>
                    <Button size="sm" className="w-full">Book Session</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Habit Form Dialog */}
      <HabitForm 
        open={formOpen} 
        onOpenChange={setFormOpen} 
        habit={selectedHabit} 
      />
    </div>
  );
};

export default Dashboard;

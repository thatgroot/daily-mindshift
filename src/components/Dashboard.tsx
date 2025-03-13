
import React, { useState } from 'react';
import { useHabits } from '@/contexts/HabitContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HabitCard from './HabitCard';
import HabitForm from './HabitForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Flame, 
  Plus, 
  TrendingUp, 
  Award, 
  LayoutGrid, 
  Loader2
} from 'lucide-react';
import { Habit } from '@/types/habit';
import StatsCard from './StatsCard';
import AnimatedCounter from './AnimatedCounter';
import { useAuth } from '@/contexts/AuthContext';
import ActivityHeatmap from './ActivityHeatmap';
import HabitCorrelations from './HabitCorrelations';
import HabitMatrix from './HabitMatrix';
import ProgressSnapshot from './ProgressSnapshot';

const Dashboard: React.FC = () => {
  const { habits, getHabitsByCategory, shouldCompleteToday, getCompletionStatus, loading, error } = useHabits();
  const { user } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("today");
  
  const { completed, total } = getCompletionStatus();
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
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
      {/* Modern Header with Unified Layout */}
      <div className="flex justify-between items-center gap-4 flex-col sm:flex-row">
        <div className="flex items-center gap-4 w-full">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Dashboard</h1>
            <p className="text-muted-foreground mt-1 font-medium">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          </div>
          <div className="flex gap-2 items-center">
            <ProgressSnapshot />
            <Button onClick={openCreateForm} className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
              <Plus className="h-4 w-4" /> New Habit
            </Button>
          </div>
        </div>
      </div>
      
      {/* Today's Progress Bar */}
      <div className="relative pt-1">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">Today's Progress</div>
          <div className="text-sm font-medium">{completionRate}%</div>
        </div>
        <Progress value={completionRate} className="h-2" />
      </div>
      
      {/* Stats Overview - Scrollable Row */}
      <div className="flex overflow-x-auto pb-2 gap-4 snap-x">
        <div className="snap-center min-w-[250px] shrink-0">
          <StatsCard
            title="Today's Progress"
            value={`${completed}/${total}`}
            description={`${completionRate}% complete`}
            icon={<Calendar className="h-5 w-5" />}
            ringValue={completed}
            ringMax={total}
          />
        </div>
        
        <div className="snap-center min-w-[250px] shrink-0">
          <StatsCard
            title="Current Streak"
            value={habits.reduce((max, habit) => Math.max(max, habit.streak), 0).toString()}
            description="days in a row"
            icon={<Flame className="h-5 w-5" />}
            trend={+5}
          />
        </div>
        
        <div className="snap-center min-w-[250px] shrink-0">
          <StatsCard
            title="Longest Streak"
            value={longestStreak.toString()}
            description="days consecutive"
            icon={<Award className="h-5 w-5" />}
          />
        </div>
        
        <div className="snap-center min-w-[250px] shrink-0">
          <StatsCard
            title="Total Completions"
            value={<AnimatedCounter value={totalCompletions} />}
            description="habits completed"
            icon={<TrendingUp className="h-5 w-5" />}
            trend={+12}
          />
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full justify-start bg-background/50 backdrop-blur-sm border p-1 rounded-xl">
          <TabsTrigger value="today" className="rounded-lg">Today's Habits</TabsTrigger>
          <TabsTrigger value="all" className="rounded-lg">All Habits</TabsTrigger>
          <TabsTrigger value="insights" className="rounded-lg">Insights</TabsTrigger>
        </TabsList>
        
        {/* Today's Habits Tab */}
        <TabsContent value="today" className="space-y-4 animate-in slide-in-from-left-1">
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
            <Card className="overflow-hidden border border-dashed rounded-xl">
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-3">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <p className="text-muted-foreground mb-4">No habits scheduled for today.</p>
                <Button onClick={openCreateForm} variant="outline" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add Your First Habit
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 animate-in fade-in-50">
              {todayHabits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} onEdit={() => openEditForm(habit)} />
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* All Habits Tab */}
        <TabsContent value="all" className="space-y-4 animate-in slide-in-from-right-1">
          <div>
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 mb-4">
              <LayoutGrid className="h-5 w-5" />
              All Habits
            </h2>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4 inline-flex bg-background/50 backdrop-blur-sm border p-1 rounded-xl">
                <TabsTrigger value="all" className="rounded-lg">All</TabsTrigger>
                {Object.keys(categorizedHabits).map((category) => (
                  <TabsTrigger key={category} value={category} className="rounded-lg">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {habits.length === 0 ? (
                  <Card className="overflow-hidden border border-dashed rounded-xl">
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="rounded-full bg-primary/10 p-3 mb-3">
                        <LayoutGrid className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-muted-foreground mb-4">You haven't created any habits yet.</p>
                      <Button onClick={openCreateForm} variant="outline" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Add Your First Habit
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-3 animate-in fade-in-50">
                    {habits.map((habit) => (
                      <HabitCard key={habit.id} habit={habit} onEdit={() => openEditForm(habit)} />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              {Object.entries(categorizedHabits).map(([category, categoryHabits]) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  <div className="grid gap-3 animate-in fade-in-50">
                    {categoryHabits.map((habit) => (
                      <HabitCard key={habit.id} habit={habit} onEdit={() => openEditForm(habit)} />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </TabsContent>
        
        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6 animate-in slide-in-from-right-1">
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5" />
            Data Insights
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-3 overflow-hidden rounded-xl hover:shadow-md transition-all">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-lg font-medium">Activity Overview</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ActivityHeatmap habits={habits} />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2 overflow-hidden rounded-xl hover:shadow-md transition-all">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-lg font-medium">Habit Correlations</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <HabitCorrelations habits={habits} />
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden rounded-xl hover:shadow-md transition-all">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-lg font-medium">Habit Matrix</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <HabitMatrix habits={habits} />
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
      
      {/* Inspirational Quote Footer */}
      <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
        <p className="italic">
          "Success is the sum of small efforts, repeated day in and day out."
        </p>
        <p className="mt-1 font-medium">— Robert Collier</p>
      </div>
    </div>
  );
};

export default Dashboard;

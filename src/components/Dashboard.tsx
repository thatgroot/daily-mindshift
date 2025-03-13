
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
  Loader2,
  CircleCheck,
  BarChart4
} from 'lucide-react';
import { Habit } from '@/types/habit';
import StatsCard from './StatsCard';
import AnimatedCounter from './AnimatedCounter';
import { useAuth } from '@/contexts/AuthContext';
import ActivityHeatmap from './ActivityHeatmap';
import HabitCorrelations from './HabitCorrelations';
import HabitMatrix from './HabitMatrix';
import ProgressSnapshot from './ProgressSnapshot';
import { useAnimate } from '@/hooks/use-animate';

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

  // Animation classes
  const headerClasses = useAnimate({
    initialClass: 'opacity-0 translate-y-4',
    animateClass: 'opacity-100 translate-y-0',
    delay: 100
  });

  const statsClasses = useAnimate({
    initialClass: 'opacity-0 translate-y-4',
    animateClass: 'opacity-100 translate-y-0',
    delay: 200
  });

  const tabsClasses = useAnimate({
    initialClass: 'opacity-0 translate-y-4',
    animateClass: 'opacity-100 translate-y-0',
    delay: 300
  });

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
      <div className={`flex justify-between items-center gap-4 transition-all duration-500 ${headerClasses}`}>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Today</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{format(new Date(), 'EEEE, MMMM d')}</p>
        </div>
        <Button onClick={openCreateForm} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4">
          <Plus className="h-5 w-5" />
        </Button>
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
      <div className={`flex overflow-x-auto pb-2 gap-3 snap-x transition-all duration-500 ${statsClasses}`}>
        <div className="snap-center min-w-[130px] w-[130px] shrink-0">
          <StatsCard
            title="Days"
            value={completed}
            icon={<Calendar className="h-4 w-4" />}
            colorClass="text-blue-500"
          />
        </div>
        
        <div className="snap-center min-w-[130px] w-[130px] shrink-0">
          <StatsCard
            title="Streak"
            value={habits.reduce((max, habit) => Math.max(max, habit.streak), 0)}
            icon={<Flame className="h-4 w-4" />}
            colorClass="text-orange-500"
            isStreakCounter={true}
          />
        </div>
        
        <div className="snap-center min-w-[130px] w-[130px] shrink-0">
          <StatsCard
            title="Weeks"
            value={Math.floor(totalCompletions / 7)}
            icon={<Calendar className="h-4 w-4" />}
            colorClass="text-pink-500"
          />
        </div>
        
        <div className="snap-center min-w-[130px] w-[130px] shrink-0">
          <StatsCard
            title="Total"
            value={totalCompletions}
            icon={<BarChart4 className="h-4 w-4" />}
            colorClass="text-purple-500"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-500 ${tabsClasses}`}>
        <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 w-full grid grid-cols-3 h-10 bg-muted/30 rounded-lg p-1">
            <TabsTrigger value="today" className="rounded-md text-sm">Today</TabsTrigger>
            <TabsTrigger value="all" className="rounded-md text-sm">All Habits</TabsTrigger>
            <TabsTrigger value="insights" className="rounded-md text-sm">Insights</TabsTrigger>
          </TabsList>
          
          {/* Today's Habits Tab */}
          <TabsContent value="today" className="space-y-3 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Today's Habits</h2>
              <Badge variant="outline" className="font-normal">
                {completed}/{total}
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
              <div>
                {todayHabits.map((habit, index) => (
                  <HabitCard 
                    key={habit.id} 
                    habit={habit} 
                    onEdit={() => openEditForm(habit)}
                    className={`transition-all duration-500 animate-in`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* All Habits Tab */}
          <TabsContent value="all" className="space-y-4 animate-in fade-in-50">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <LayoutGrid className="h-5 w-5" />
                All Habits
              </h2>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4 inline-flex bg-muted/30 p-1 rounded-lg">
                  <TabsTrigger value="all" className="rounded-md text-xs">All</TabsTrigger>
                  {Object.keys(categorizedHabits).map((category) => (
                    <TabsTrigger key={category} value={category} className="rounded-md text-xs">
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
                    <div>
                      {habits.map((habit) => (
                        <HabitCard key={habit.id} habit={habit} onEdit={() => openEditForm(habit)} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                {Object.entries(categorizedHabits).map(([category, categoryHabits]) => (
                  <TabsContent key={category} value={category} className="space-y-4">
                    <div>
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
          <TabsContent value="insights" className="space-y-6 animate-in fade-in-50">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5" />
              Data Insights
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              <Card className="overflow-hidden rounded-xl hover:shadow-md transition-all">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-base font-medium">Activity Overview</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <ActivityHeatmap habits={habits} />
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden rounded-xl hover:shadow-md transition-all">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-base font-medium">Habit Correlations</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <HabitCorrelations habits={habits} />
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden rounded-xl hover:shadow-md transition-all">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-base font-medium">Habit Matrix</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <HabitMatrix habits={habits} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
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

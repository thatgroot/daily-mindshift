
import React, { useState } from 'react';
import { useHabits } from '@/contexts/HabitContext';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HabitCard from './HabitCard';
import ProgressRing from './ProgressRing';
import HabitForm from './HabitForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Flame, Plus, TrendingUp, Award, LayoutGrid } from 'lucide-react';
import { Habit } from '@/types/habit';
import StatsCard from './StatsCard';
import AnimatedCounter from './AnimatedCounter';

const Dashboard: React.FC = () => {
  const { habits, getHabitsByCategory, shouldCompleteToday, getCompletionStatus } = useHabits();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | undefined>(undefined);
  
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
      
      {/* Today's Habits */}
      <div>
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
      </div>
      
      {/* All Habits By Category */}
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

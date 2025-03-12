
import React, { useState } from 'react';
import { useHabits } from '@/contexts/HabitContext';
import { useNavigate } from 'react-router-dom';
import HabitCard from './HabitCard';
import HabitForm from './HabitForm';
import StatsCard from './StatsCard';
import MomentumIndex from './MomentumIndex';
import HabitMatrix from './HabitMatrix';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Activity, Calendar, Loader2, Award, Target, Zap, TrendingUp, Users } from 'lucide-react';

const Dashboard = () => {
  const { habits, loading, error, getCompletionStatus } = useHabits();
  const navigate = useNavigate();
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [showHabitForm, setShowHabitForm] = useState(false);

  const activeHabits = habits.filter(h => !h.archived);
  const { completed, total } = getCompletionStatus();

  // Calculate statistics
  const calculateStats = () => {
    const totalHabits = activeHabits.length;
    const completedToday = completed;
    const totalStreaks = activeHabits.reduce((sum, h) => sum + h.streak, 0);
    const avgStreak = totalHabits > 0 ? Math.round(totalStreaks / totalHabits) : 0;
    const bestStreak = Math.max(...activeHabits.map(h => h.bestStreak), 0);
    
    return {
      totalHabits,
      completedToday,
      avgStreak,
      bestStreak
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10">
        <h2 className="text-xl font-semibold text-destructive">Error</h2>
        <p className="text-muted-foreground mt-2">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          variant="outline" 
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent p-6 rounded-xl">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">Track your progress and build better habits</p>
        </div>
        <Button 
          onClick={() => setShowHabitForm(true)} 
          className="rounded-full shadow-lg hover:shadow-primary/25 transition-all duration-300" 
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Habit
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Today's Progress"
          value={`${completed}/${total}`}
          description="Habits completed today"
          icon={<Activity className="h-4 w-4" />}
          ringValue={completed}
          ringMax={total || 1}
        />
        
        <StatsCard
          title="Active Habits"
          value={stats.totalHabits}
          description="Total habits being tracked"
          icon={<Target className="h-4 w-4" />}
          trend={12}
        />
        
        <MomentumIndex />
        
        <StatsCard
          title="Best Streak"
          value={stats.bestStreak}
          description="Days in your best streak"
          icon={<Award className="h-4 w-4" />}
          trend={8}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="today" className="w-full">
        <TabsList className="w-full justify-start mb-6 bg-background border">
          <TabsTrigger value="today">Today's Habits</TabsTrigger>
          <TabsTrigger value="matrix">Habit Matrix</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          {activeHabits.length === 0 ? (
            <div className="text-center p-10 border rounded-xl bg-muted/20">
              <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No habits yet</h3>
              <p className="text-muted-foreground mt-1 mb-4">Create your first habit to get started</p>
              <Button 
                onClick={() => setShowHabitForm(true)} 
                variant="outline"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Habit
              </Button>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {activeHabits.map((habit) => (
                  <HabitCard 
                    key={habit.id} 
                    habit={habit} 
                    onEdit={() => {
                      setEditingHabit(habit.id);
                      setShowHabitForm(true);
                    }}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="matrix">
          <HabitMatrix />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Streak Analysis
              </h3>
              <p className="text-muted-foreground mb-4">
                Your average streak is {stats.avgStreak} days
              </p>
              {/* Add streak visualization here */}
            </div>

            <div className="p-6 rounded-xl border bg-card">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Productivity Peak
              </h3>
              <p className="text-muted-foreground">
                You're most productive in the morning
              </p>
              {/* Add time-based completion chart here */}
            </div>

            <div className="p-6 rounded-xl border bg-card">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Community Comparison
              </h3>
              <p className="text-muted-foreground">
                You're in the top 20% of consistent users
              </p>
              {/* Add community comparison chart here */}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Habit Form Dialog */}
      <HabitForm
        open={showHabitForm}
        onOpenChange={setShowHabitForm}
        habit={editingHabit ? habits.find(h => h.id === editingHabit) : undefined}
      />
    </div>
  );
};

export default Dashboard;

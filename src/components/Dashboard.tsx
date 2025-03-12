
import React, { useState } from 'react';
import { useHabits } from '@/contexts/HabitContext';
import { useNavigate } from 'react-router-dom';
import HabitCard from './HabitCard';
import HabitForm from './HabitForm';
import StatsCard from './StatsCard';
import MomentumIndex from './MomentumIndex';
import HabitMatrix from './HabitMatrix';
import { Button } from '@/components/ui/button';
import { PlusCircle, Activity, Calendar, Loader2, Award } from 'lucide-react';

const Dashboard = () => {
  const { habits, loading, error, getCompletionStatus } = useHabits();
  const navigate = useNavigate();

  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [showHabitForm, setShowHabitForm] = useState(false);

  const activeHabits = habits.filter(h => !h.archived);
  const { completed, total } = getCompletionStatus();

  const getToday = () => {
    const today = new Date();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    return `${daysOfWeek[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}`;
  };

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">{getToday()}</p>
        </div>
        <Button 
          onClick={() => setShowHabitForm(true)} 
          className="rounded-full" 
          size="sm"
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
          value={activeHabits.length}
          description="Total habits being tracked"
          icon={<Calendar className="h-4 w-4" />}
        />
        
        <MomentumIndex />
        
        <StatsCard
          title="Longest Streak"
          value={Math.max(...habits.map(h => h.bestStreak), 0)}
          description="Days in your best streak"
          icon={<Award className="h-4 w-4" />}
          trend={12}
        />
      </div>

      {/* Habit Matrix */}
      <HabitMatrix />

      {/* Today's Habits */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Today's Habits</h2>
        {activeHabits.length === 0 ? (
          <div className="text-center p-10 border rounded-xl bg-muted/20">
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
        )}
      </div>

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

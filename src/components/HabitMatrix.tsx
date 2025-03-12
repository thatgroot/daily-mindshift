
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Habit } from '@/types/habit';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { GridIcon } from 'lucide-react';

interface HabitMatrixProps {
  habits: Habit[];
}

const HabitMatrix: React.FC<HabitMatrixProps> = ({ habits }) => {
  // Filter to show only active habits
  const activeHabits = habits.filter(h => !h.archived);
  
  // Group habits by category
  const habitsByCategory = activeHabits.reduce<Record<string, Habit[]>>((acc, habit) => {
    const category = habit.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(habit);
    return acc;
  }, {});
  
  // Determine strength levels for each habit
  const getHabitStrength = (habit: Habit): number => {
    // Calculate strength based on streak and total completions
    const streakFactor = habit.streak / 30; // 30 days as a benchmark
    const completionsFactor = habit.totalCompletions / 100; // 100 completions as a benchmark
    
    // Simple weighted average
    const strength = (streakFactor * 0.7) + (completionsFactor * 0.3);
    
    // Return a value between 0 and 1
    return Math.min(Math.max(strength, 0), 1);
  };
  
  // Get color based on habit strength
  const getStrengthColor = (strength: number): string => {
    if (strength < 0.2) return 'bg-blue-100 dark:bg-blue-900';
    if (strength < 0.4) return 'bg-blue-200 dark:bg-blue-800';
    if (strength < 0.6) return 'bg-blue-300 dark:bg-blue-700';
    if (strength < 0.8) return 'bg-blue-400 dark:bg-blue-600';
    return 'bg-blue-500 dark:bg-blue-500';
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <GridIcon className="h-5 w-5 text-accent" />
          Habit Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {Object.keys(habitsByCategory).length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p>No habits to display</p>
            <p className="text-sm mt-1">Add habits to see them in the matrix</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(habitsByCategory).map(([category, habits]) => (
              <div key={category} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">{category}</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {habits.map(habit => {
                    const strength = getHabitStrength(habit);
                    const colorClass = getStrengthColor(strength);
                    
                    return (
                      <TooltipProvider key={habit.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="aspect-square flex flex-col items-center justify-center rounded-md p-2 cursor-pointer hover:opacity-90 transition-opacity border border-border bg-card">
                              <div className={`w-3 h-3 mb-1 rounded-full ${colorClass}`} />
                              <span className="text-xs font-medium truncate w-full text-center">{habit.name}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <div className="space-y-1">
                              <p className="font-medium">{habit.name}</p>
                              <p className="text-xs">Streak: {habit.streak} days</p>
                              <p className="text-xs">Total: {habit.totalCompletions} completions</p>
                              <p className="text-xs">Strength: {Math.round(strength * 100)}%</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="pt-3 text-xs text-muted-foreground text-center italic border-t border-border mt-4">
              Habit strength is based on streak length and total completions
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitMatrix;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Habit } from '@/types/habit';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { CalendarIcon, ChevronRightIcon, GridIcon } from 'lucide-react';
import { Button } from './ui/button';

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
  
  // Get GitHub-style color based on habit strength
  const getStrengthColor = (strength: number): string => {
    if (strength < 0.15) return 'bg-[#ebedf0] dark:bg-[#161b22]';
    if (strength < 0.3) return 'bg-[#9be9a8] dark:bg-[#0e4429]';
    if (strength < 0.5) return 'bg-[#40c463] dark:bg-[#006d32]';
    if (strength < 0.75) return 'bg-[#30a14e] dark:bg-[#26a641]';
    return 'bg-[#216e39] dark:bg-[#39d353]';
  };
  
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-background to-background/90 shadow-md border-muted/40">
      <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-accent" />
          Habit Matrix
          <Button variant="ghost" size="sm" className="ml-auto text-xs gap-1 opacity-80 hover:opacity-100">
            View all habits <ChevronRightIcon className="h-3 w-3" />
          </Button>
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
                            <div className="aspect-square flex flex-col items-center justify-center rounded-md p-2 cursor-pointer hover:opacity-90 transition-all border border-border bg-card hover:shadow-md">
                              <div className={`w-full h-full ${colorClass} rounded-md mb-1.5 flex items-center justify-center`} />
                              <span className="text-xs font-medium truncate w-full text-center">{habit.name}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-card/95 backdrop-blur-sm border border-border">
                            <div className="space-y-1">
                              <p className="font-medium">{habit.name}</p>
                              <div className="flex items-center gap-1.5 text-xs">
                                <div className={`w-3 h-3 rounded-sm ${colorClass}`}></div>
                                <p>Streak: {habit.streak} days</p>
                              </div>
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
              <div className="flex items-center justify-center gap-2 pt-2">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-[#ebedf0] dark:bg-[#161b22]"></div>
                  <div className="w-3 h-3 rounded-sm bg-[#9be9a8] dark:bg-[#0e4429]"></div>
                  <div className="w-3 h-3 rounded-sm bg-[#40c463] dark:bg-[#006d32]"></div>
                  <div className="w-3 h-3 rounded-sm bg-[#30a14e] dark:bg-[#26a641]"></div>
                  <div className="w-3 h-3 rounded-sm bg-[#216e39] dark:bg-[#39d353]"></div>
                </div>
                <span>More</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitMatrix;

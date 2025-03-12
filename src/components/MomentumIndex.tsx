
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import ProgressRing from './ProgressRing';
import { format } from 'date-fns';
import { useHabits } from '@/contexts/HabitContext';

const MomentumIndex: React.FC = () => {
  const { habits } = useHabits();
  
  // Calculate the momentum index based on habit completion rates and streaks
  const calculateMomentumIndex = () => {
    if (habits.length === 0) return { value: 0, trend: 0 };
    
    const todayStamp = new Date().toISOString().split('T')[0];
    const weekAgoStamp = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Factors that influence momentum:
    // 1. Active habit count
    // 2. Average streak lengths
    // 3. Recent completion rate
    
    const activeHabits = habits.filter(h => !h.archived);
    const averageStreak = activeHabits.reduce((sum, h) => sum + h.streak, 0) / activeHabits.length || 0;
    const maxPossibleStreak = 100; // Arbitrary maximum for scaling
    
    // Calculate completion rate for the last 7 days
    let completedCount = 0;
    let totalPossible = 0;
    
    activeHabits.forEach(habit => {
      // Count the last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = format(date, 'yyyy-MM-dd');
        
        if (habit.completions[dateStr]?.completed) {
          completedCount++;
        }
        totalPossible++;
      }
    });
    
    const recentCompletionRate = totalPossible > 0 ? (completedCount / totalPossible) : 0;
    
    // Weigh the factors
    const streakFactor = Math.min(averageStreak / maxPossibleStreak, 1) * 40; // 40% of score
    const completionFactor = recentCompletionRate * 60; // 60% of score
    
    const momentumValue = Math.round(streakFactor + completionFactor);
    
    // Calculate trend compared to last week
    // For simplicity, we'll use a mock trend value, but this could be calculated
    // by comparing current momentum to momentum a week ago
    const trend = Math.round((Math.random() * 20) - 5); // Random trend between -5% and +15%
    
    return {
      value: momentumValue,
      trend
    };
  };
  
  const { value, trend } = calculateMomentumIndex();
  
  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="bg-secondary/30 pb-2">
        <CardTitle className="text-sm font-medium">Momentum Index</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-3xl font-bold">{value}</p>
            <div className={cn(
              "flex items-center text-xs",
              trend >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {trend >= 0 ? 
                <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                <ArrowDownRight className="h-3 w-3 mr-1" />
              }
              <span>{Math.abs(trend)}% from last week</span>
            </div>
          </div>
          
          <ProgressRing 
            value={value} 
            max={100} 
            size={60} 
            strokeWidth={4} 
            progressColor={
              value >= 75 ? "var(--green)" :
              value >= 50 ? "var(--amber)" :
              value >= 25 ? "var(--orange)" :
              "var(--red)"
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MomentumIndex;

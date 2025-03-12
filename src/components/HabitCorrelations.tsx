
import React, { useMemo } from 'react';
import { Habit } from '@/types/habit';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { TrendingUp } from 'lucide-react';

interface HabitCorrelationsProps {
  habits: Habit[];
}

const HabitCorrelations: React.FC<HabitCorrelationsProps> = ({ habits }) => {
  // Find habits that have the highest correlation by looking at completion patterns
  const correlations = useMemo(() => {
    if (habits.length < 2) return [];
    
    const correlationData: { habit1: string; habit2: string; score: number; description: string }[] = [];
    
    // Compare each habit with others to find correlations
    for (let i = 0; i < habits.length; i++) {
      for (let j = i + 1; j < habits.length; j++) {
        const habit1 = habits[i];
        const habit2 = habits[j];
        
        // Get all dates where either habit was completed
        const allDates = new Set([
          ...Object.keys(habit1.completions),
          ...Object.keys(habit2.completions)
        ]);
        
        let bothCompleted = 0;
        let onlyHabit1 = 0;
        let onlyHabit2 = 0;
        let neitherCompleted = 0;
        
        allDates.forEach(date => {
          const h1Completed = habit1.completions[date]?.completed || false;
          const h2Completed = habit2.completions[date]?.completed || false;
          
          if (h1Completed && h2Completed) bothCompleted++;
          else if (h1Completed && !h2Completed) onlyHabit1++;
          else if (!h1Completed && h2Completed) onlyHabit2++;
          else neitherCompleted++;
        });
        
        // Calculate correlation (simplified version)
        const total = allDates.size;
        if (total === 0) continue;
        
        // Simple correlation score (could be improved with actual statistical correlation)
        const correlationScore = (bothCompleted + neitherCompleted) / total;
        
        if (correlationScore > 0.3) {  // Only show meaningful correlations
          let description = "";
          if (correlationScore > 0.7) {
            description = "Strong correlation";
          } else if (correlationScore > 0.5) {
            description = "Moderate correlation";
          } else {
            description = "Weak correlation";
          }
          
          correlationData.push({
            habit1: habit1.name,
            habit2: habit2.name,
            score: correlationScore,
            description
          });
        }
      }
    }
    
    // Sort by correlation score
    return correlationData.sort((a, b) => b.score - a.score).slice(0, 5);
  }, [habits]);
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          Habit Correlations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {correlations.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p>Need more habit data to show correlations</p>
            <p className="text-sm mt-1">Complete habits regularly to see patterns</p>
          </div>
        ) : (
          <div className="space-y-4">
            {correlations.map((correlation, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                      style={{ width: `${correlation.score * 100}%` }}
                    />
                  </div>
                </div>
                <div className="w-24 text-right">
                  <div className="text-sm font-medium">{Math.round(correlation.score * 100)}%</div>
                  <div className="text-xs text-muted-foreground">{correlation.description}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{correlation.habit1}</div>
                  <div className="text-xs text-muted-foreground">+</div>
                  <div className="text-sm font-medium">{correlation.habit2}</div>
                </div>
              </div>
            ))}
            <div className="pt-3 text-xs text-muted-foreground text-center italic border-t border-border mt-4">
              Habits that are often completed together or skipped together
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitCorrelations;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Habit } from '@/types/habit';
import { TrendingUpIcon, ArrowRightIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';

interface HabitRelationshipMatrixProps {
  habits: Habit[];
}

interface Correlation {
  habit1: string;
  habit2: string;
  score: number;
  description: string;
  type: 'positive' | 'negative';
}

const HabitRelationshipMatrix: React.FC<HabitRelationshipMatrixProps> = ({ habits }) => {
  const [view, setView] = useState<'matrix' | 'list'>('list');
  const [correlationType, setCorrelationType] = useState<'positive' | 'negative' | 'all'>('all');
  
  // Generate correlation data
  const correlations = React.useMemo(() => {
    if (habits.length < 2) return [];
    
    const data: Correlation[] = [];
    
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
        
        // Simple correlation score (-1 to 1)
        const correlationScore = ((bothCompleted + neitherCompleted) - (onlyHabit1 + onlyHabit2)) / total;
        
        if (Math.abs(correlationScore) > 0.2) {  // Only show meaningful correlations
          let description = "";
          const type = correlationScore > 0 ? 'positive' : 'negative';
          const absScore = Math.abs(correlationScore);
          
          if (absScore > 0.7) {
            description = type === 'positive' ? "Strong positive correlation" : "Strong negative correlation";
          } else if (absScore > 0.5) {
            description = type === 'positive' ? "Moderate positive correlation" : "Moderate negative correlation";
          } else {
            description = type === 'positive' ? "Weak positive correlation" : "Weak negative correlation";
          }
          
          data.push({
            habit1: habit1.name,
            habit2: habit2.name,
            score: correlationScore,
            description,
            type
          });
        }
      }
    }
    
    // Sort by absolute correlation score
    return data.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));
  }, [habits]);
  
  const filteredCorrelations = correlations.filter(c => {
    if (correlationType === 'all') return true;
    return c.type === correlationType;
  });
  
  // Function to determine color based on correlation score
  const getCorrelationColor = (score: number) => {
    if (score > 0.7) return 'bg-green-500 dark:bg-green-600';
    if (score > 0.4) return 'bg-green-400 dark:bg-green-500';
    if (score > 0.2) return 'bg-green-300 dark:bg-green-400';
    if (score < -0.7) return 'bg-red-500 dark:bg-red-600';
    if (score < -0.4) return 'bg-red-400 dark:bg-red-500';
    if (score < -0.2) return 'bg-red-300 dark:bg-red-400';
    return 'bg-gray-300 dark:bg-gray-600';
  };
  
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-card to-card/95 shadow-md border-muted/40">
      <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <TrendingUpIcon className="h-5 w-5 text-accent" />
            Habit Correlations
          </CardTitle>
          <Select 
            value={correlationType} 
            onValueChange={(value) => setCorrelationType(value as 'positive' | 'negative' | 'all')}
          >
            <SelectTrigger className="h-8 w-36 text-xs bg-black/20 backdrop-blur-sm border-gray-800">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Correlations</SelectItem>
              <SelectItem value="positive">Positive Only</SelectItem>
              <SelectItem value="negative">Negative Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {correlations.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <p>Need more habit data to show correlations</p>
            <p className="text-sm mt-1">Complete habits regularly to see patterns</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-end mb-2">
              <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value as 'matrix' | 'list')}>
                <ToggleGroupItem value="matrix" className="text-xs">Matrix View</ToggleGroupItem>
                <ToggleGroupItem value="list" className="text-xs">List View</ToggleGroupItem>
              </ToggleGroup>
            </div>
          
            {view === 'list' ? (
              <div className="space-y-3">
                {filteredCorrelations.length === 0 ? (
                  <div className="text-center text-muted-foreground p-4">
                    No correlations found for the selected filter
                  </div>
                ) : (
                  filteredCorrelations.map((correlation, index) => (
                    <div 
                      key={index} 
                      className={`rounded-lg p-4 ${
                        correlation.score > 0 
                          ? 'bg-green-500/10 border border-green-500/20' 
                          : 'bg-red-500/10 border border-red-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 font-medium">
                          {correlation.habit1} 
                          <ArrowRightIcon className="h-4 w-4 text-muted-foreground" /> 
                          {correlation.habit2}
                        </div>
                        <div className={`${
                          correlation.score > 0 ? 'text-green-500' : 'text-red-500'
                        } font-medium`}>
                          {correlation.score > 0 ? '+' : ''}{Math.round(correlation.score * 100)}%
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {correlation.score > 0 
                          ? `Completing ${correlation.habit1} increases your likelihood of completing ${correlation.habit2}` 
                          : `Completing ${correlation.habit1} decreases your likelihood of completing ${correlation.habit2}`
                        } by {Math.round(Math.abs(correlation.score * 100))}%
                      </p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-950 rounded-xl overflow-hidden">
                <div className="text-center text-muted-foreground mb-4">
                  Matrix view will show correlations between all habits
                </div>
                <div className="text-center mt-10 text-muted-foreground">
                  This is a placeholder for the matrix view visualization
                </div>
              </div>
            )}
            
            <div className="pt-3 text-xs text-muted-foreground text-center italic border-t border-border mt-4">
              {correlations.length} correlations found based on your habit completion patterns
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HabitRelationshipMatrix;

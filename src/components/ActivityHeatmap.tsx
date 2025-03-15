
import React, { useMemo } from 'react';
import { format, parseISO, eachDayOfInterval, subDays, startOfWeek, addDays } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Calendar } from 'lucide-react';
import { Habit, HabitCompletion } from '@/types/habit';

interface ActivityHeatmapProps {
  habits: Habit[];
  days?: number;
}

const ActivityHeatmap: React.FC<ActivityHeatmapProps> = ({ habits, days = 91 }) => {
  const today = new Date();
  
  const dateRange = useMemo(() => {
    const startDate = subDays(today, days - 1);
    return eachDayOfInterval({ start: startDate, end: today });
  }, [days, today]);
  
  const activityByDate = useMemo(() => {
    const activity: Record<string, { total: number; completed: number }> = {};
    
    // Initialize all dates with zero activity
    dateRange.forEach(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      activity[dateKey] = { total: 0, completed: 0 };
    });
    
    // Fill in the activity data
    habits.forEach(habit => {
      Object.entries(habit.completions).forEach(([dateStr, completion]) => {
        if (activity[dateStr]) {
          activity[dateStr].total += 1;
          if (completion.completed) {
            activity[dateStr].completed += 1;
          }
        }
      });

      // Also add days where habits should be completed
      dateRange.forEach(date => {
        const dateKey = format(date, 'yyyy-MM-dd');
        const dayOfWeek = format(date, 'EEEE').toLowerCase();
        const dayOfMonth = date.getDate();
        
        let shouldCount = false;
        
        switch (habit.frequency) {
          case 'daily':
            shouldCount = true;
            break;
          case 'weekly':
            shouldCount = habit.weekDays?.includes(dayOfWeek as any) || false;
            break;
          case 'monthly':
            shouldCount = habit.monthDays?.includes(dayOfMonth) || false;
            break;
          default:
            shouldCount = false;
        }
        
        if (shouldCount) {
          activity[dateKey].total += 1;
        }
      });
    });
    
    return activity;
  }, [habits, dateRange]);
  
  const getActivityColor = (date: Date): string => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const data = activityByDate[dateKey];
    
    if (!data || data.total === 0) return 'bg-gray-100 dark:bg-gray-800';
    
    const completion = data.completed / data.total;
    
    if (completion === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (completion < 0.25) return 'bg-emerald-100 dark:bg-emerald-900';
    if (completion < 0.5) return 'bg-emerald-200 dark:bg-emerald-800';
    if (completion < 0.75) return 'bg-emerald-300 dark:bg-emerald-700';
    if (completion < 1) return 'bg-emerald-400 dark:bg-emerald-600';
    return 'bg-emerald-500 dark:bg-emerald-500';
  };
  
  // Create a grid of weeks (columns) and days (rows)
  const renderHeatmapGrid = () => {
    // Group days into weeks
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    // Start from the earliest date in our date range
    const firstDate = dateRange[0];
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDate.getDay();
    
    // Fill in any missing days at the start of the first week
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null as any);
    }
    
    dateRange.forEach(date => {
      currentWeek.push(date);
      
      // If we've reached the end of a week (Saturday), start a new week
      if (date.getDay() === 6) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    // Add any remaining days in the last week
    if (currentWeek.length > 0) {
      // Fill in any missing days at the end of the last week
      while (currentWeek.length < 7) {
        currentWeek.push(null as any);
      }
      weeks.push(currentWeek);
    }
    
    // Day labels
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="w-full overflow-x-auto">
        <div className="flex mb-1">
          <div className="w-8"></div> {/* Empty space for alignment */}
          {weeks.map((_, weekIndex) => (
            <div key={`week-${weekIndex}`} className="flex-shrink-0 w-4 text-xs text-center text-muted-foreground">
              {weekIndex + 1 === Math.ceil(weeks.length / 4) || 
               weekIndex + 1 === Math.ceil(weeks.length / 2) || 
               weekIndex + 1 === Math.ceil(weeks.length * 3 / 4) || 
               weekIndex + 1 === weeks.length 
                ? format(weeks[weekIndex].find(d => d !== null) || new Date(), 'MMM') 
                : ''}
            </div>
          ))}
        </div>
        
        <div className="grid grid-flow-col auto-cols-min gap-1">
          {/* Day labels on the left */}
          <div className="grid grid-rows-7 gap-1">
            {dayLabels.map(day => (
              <div key={day} className="h-4 w-8 flex items-center justify-end pr-2">
                <span className="text-xs text-muted-foreground">{day}</span>
              </div>
            ))}
          </div>
          
          {/* Main grid of cells */}
          {weeks.map((week, weekIndex) => (
            <div key={`week-${weekIndex}`} className="grid grid-rows-7 gap-1">
              {week.map((date, dayIndex) => {
                if (!date) {
                  return <div key={`empty-${weekIndex}-${dayIndex}`} className="h-4 w-4 rounded-sm bg-transparent" />;
                }
                
                const dateKey = format(date, 'yyyy-MM-dd');
                const data = activityByDate[dateKey];
                const tooltipText = data 
                  ? `${format(date, 'MMM d, yyyy')}: ${data.completed}/${data.total} completed`
                  : format(date, 'MMM d, yyyy');
                  
                return (
                  <TooltipProvider key={dateKey}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={`h-4 w-4 rounded-sm ${getActivityColor(date)} cursor-pointer transition-colors hover:opacity-80`} />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs font-medium">
                        {tooltipText}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent" />
          Activity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="p-2">
          {renderHeatmapGrid()}
        </div>
        <div className="flex items-center justify-end mt-2 gap-2">
          <span className="text-xs text-muted-foreground">Less</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-3 rounded-sm bg-emerald-100 dark:bg-emerald-900" />
            <div className="h-3 w-3 rounded-sm bg-emerald-200 dark:bg-emerald-800" />
            <div className="h-3 w-3 rounded-sm bg-emerald-300 dark:bg-emerald-700" />
            <div className="h-3 w-3 rounded-sm bg-emerald-400 dark:bg-emerald-600" />
            <div className="h-3 w-3 rounded-sm bg-emerald-500 dark:bg-emerald-500" />
          </div>
          <span className="text-xs text-muted-foreground">More</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityHeatmap;

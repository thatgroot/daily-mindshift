
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
  
  const startOfLastWeek = startOfWeek(today, { weekStartsOn: 1 });
  
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
  
  const renderHeatmapGrid = () => {
    // Create 7 rows for days of the week
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Group dates by week
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    dateRange.forEach((date, index) => {
      const dayOfWeek = format(date, 'E');
      
      if (dayOfWeek === 'Mon' && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      
      currentWeek.push(date);
      
      if (index === dateRange.length - 1) {
        weeks.push(currentWeek);
      }
    });
    
    // Ensure we have 7 days in each week by adding null for missing days
    weeks.forEach(week => {
      const firstDayInWeek = format(week[0], 'E');
      const firstDayIndex = weekdays.findIndex(day => day === firstDayInWeek);
      
      for (let i = 0; i < firstDayIndex; i++) {
        week.unshift(null as any);
      }
      
      while (week.length < 7) {
        week.push(null as any);
      }
    });
    
    return (
      <div className="grid grid-rows-7 grid-flow-col gap-1">
        {weekdays.map((day, rowIndex) => (
          <div key={day} className="grid grid-cols-1 gap-1">
            <div className="flex items-center justify-end mr-2 text-xs text-muted-foreground">
              {day}
            </div>
            {weeks.map((week, colIndex) => {
              const date = week[rowIndex];
              if (!date) return <div key={`empty-${colIndex}-${rowIndex}`} className="h-3 w-3 rounded-sm bg-transparent" />;
              
              const dateKey = format(date, 'yyyy-MM-dd');
              const data = activityByDate[dateKey];
              const tooltipText = data 
                ? `${format(date, 'MMM d, yyyy')}: ${data.completed}/${data.total} completed`
                : format(date, 'MMM d, yyyy');
                
              return (
                <TooltipProvider key={dateKey}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`h-3 w-3 rounded-sm ${getActivityColor(date)} cursor-pointer transition-colors hover:opacity-80`} />
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

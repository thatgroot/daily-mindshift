
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useHabits } from '@/contexts/HabitContext';
import { format, subDays, isSameDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const HabitMatrix: React.FC = () => {
  const { habits, isHabitCompletedForDate } = useHabits();
  const activeHabits = habits.filter(h => !h.archived);
  
  // Generate dates for the last 14 days
  const generateDates = () => {
    const dates = [];
    for (let i = 13; i >= 0; i--) {
      dates.push(subDays(new Date(), i));
    }
    return dates;
  };
  
  const dates = generateDates();
  
  const formatDayLabel = (date: Date) => {
    return format(date, 'd');
  };
  
  const formatWeekdayLabel = (date: Date) => {
    return format(date, 'EEE');
  };
  
  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };
  
  const showHabitName = (str: string) => {
    if (str.length > 20) {
      return str.substring(0, 18) + '...';
    }
    return str;
  };

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="bg-secondary/30 pb-2">
        <CardTitle className="text-sm font-medium">Habit Matrix</CardTitle>
      </CardHeader>
      <CardContent className="p-4 overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[150px_repeat(14,1fr)] gap-1">
            {/* Header row with dates */}
            <div className="text-xs text-muted-foreground"></div>
            {dates.map((date, i) => (
              <div 
                key={i}
                className={cn(
                  "text-center text-xs",
                  isToday(date) ? "font-bold text-foreground" : "text-muted-foreground"
                )}
              >
                <div>{formatWeekdayLabel(date)}</div>
                <div>{formatDayLabel(date)}</div>
              </div>
            ))}
            
            {/* Habit rows */}
            {activeHabits.map((habit) => (
              <React.Fragment key={habit.id}>
                <div className="text-xs py-1 pr-4 truncate">
                  {showHabitName(habit.name)}
                </div>
                
                {dates.map((date, i) => {
                  const isCompleted = isHabitCompletedForDate(habit, date);
                  
                  return (
                    <TooltipProvider key={i}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "w-6 h-6 mx-auto rounded-sm",
                              isCompleted 
                                ? cn("bg-accent", habit.color ? habit.color.replace('bg-', 'bg-') : '') 
                                : "bg-muted",
                              isToday(date) ? "ring-1 ring-accent/50" : ""
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{habit.name}</p>
                          <p className="text-xs">{format(date, 'PP')}</p>
                          <p className="text-xs font-medium">
                            {isCompleted ? 'Completed' : 'Not completed'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitMatrix;

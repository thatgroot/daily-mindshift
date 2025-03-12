
import React from 'react';
import Layout from '@/components/Layout';
import { HabitProvider } from '@/contexts/HabitContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { useHabits } from '@/contexts/HabitContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const WeekView = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const { habits, isHabitCompletedForDate, shouldCompleteToday } = useHabits();

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endOfCurrentWeek = endOfWeek(currentDate, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startOfCurrentWeek, end: endOfCurrentWeek });

  const previousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const nextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  const getDayHabits = (date: Date) => {
    return habits.filter(habit => {
      switch (habit.frequency) {
        case 'daily':
          return true;
        case 'weekly':
          const weekDay = format(date, 'EEEE').toLowerCase();
          return habit.weekDays?.includes(weekDay as any);
        // Add other cases for different frequencies as needed
        default:
          return false;
      }
    });
  };

  // GitHub-style color function
  const getGithubStyleColor = (completed: number, total: number) => {
    if (total === 0) return "bg-muted";
    const ratio = completed / total;
    if (ratio === 0) return "bg-muted";
    if (ratio < 0.25) return "bg-[#0e4429] border-[#0e4429]";
    if (ratio < 0.5) return "bg-[#006d32] border-[#006d32]";
    if (ratio < 0.75) return "bg-[#26a641] border-[#26a641]";
    return "bg-[#39d353] border-[#39d353]";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Calendar</h1>
          <p className="text-muted-foreground mt-1">View your habits by date</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={previousWeek} className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={today} className="rounded-full">
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={nextWeek} className="rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-card to-background border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-accent" />
            <span>{format(startOfCurrentWeek, 'MMMM d')} - {format(endOfCurrentWeek, 'MMMM d, yyyy')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {days.map((day) => {
              const isToday = isSameDay(day, new Date());
              const dayHabits = getDayHabits(day);
              const completed = dayHabits.filter(h => isHabitCompletedForDate(h, day)).length;

              return (
                <div 
                  key={day.toString()} 
                  className={cn(
                    "flex flex-col items-center p-2 rounded-lg transition-all duration-200",
                    isToday 
                      ? "bg-accent/10 border border-accent"
                      : "bg-card hover:shadow-sm border border-border hover:border-accent/50"
                  )}
                >
                  <div className="text-sm font-medium mb-1">{format(day, 'EEE')}</div>
                  <div className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full mb-2",
                    isToday ? "bg-accent text-accent-foreground" : ""
                  )}>
                    {format(day, 'd')}
                  </div>
                  {dayHabits.length > 0 ? (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs text-white",
                        getGithubStyleColor(completed, dayHabits.length)
                      )}
                    >
                      {completed}/{dayHabits.length}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">No habits</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 space-y-4">
            {days.map((day) => {
              const dayHabits = getDayHabits(day);
              if (dayHabits.length === 0) return null;

              return (
                <div key={day.toString()} className="border-t pt-4">
                  <h3 className="font-medium mb-2">{format(day, 'EEEE, MMMM d')}</h3>
                  <div className="space-y-2">
                    {dayHabits.map(habit => {
                      const isCompleted = isHabitCompletedForDate(habit, day);
                      return (
                        <div 
                          key={habit.id} 
                          className={cn(
                            "p-3 rounded-lg border flex items-center transition-all duration-200",
                            isCompleted 
                              ? "bg-gradient-to-r from-accent/10 to-accent/5 border-accent/40" 
                              : "hover:bg-muted/20"
                          )}
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full mr-3",
                            habit.color || "bg-accent"
                          )} />
                          <span>{habit.name}</span>
                          {isCompleted && (
                            <Badge 
                              className="ml-auto" 
                              variant="outline"
                              style={{ backgroundColor: "#39d353", color: "white", borderColor: "#39d353" }}
                            >
                              Completed
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const CalendarPage = () => {
  return (
    <HabitProvider>
      <Layout>
        <WeekView />
      </Layout>
    </HabitProvider>
  );
};

export default CalendarPage;

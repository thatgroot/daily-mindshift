
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { HabitProvider } from '@/contexts/HabitContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, subDays, addMonths, subMonths, setDate, getDate, getDaysInMonth, startOfMonth, endOfMonth, getDay, isSameDay, isSameMonth, addWeeks, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { useHabits } from '@/contexts/HabitContext';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const { habits, isHabitCompletedForDate, shouldCompleteToday } = useHabits();
  const today = new Date();

  // Filter to get only active habits for the selected habit
  const [selectedHabit, setSelectedHabit] = useState<string | null>(
    habits.length > 0 ? habits[0].name : null
  );

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Function to get GitHub-style color based on completion ratio
  const getCompletionColor = (day: Date) => {
    if (isSameDay(day, today)) return 'calendar-day-today';
    
    const dayHabits = habits.filter(habit => shouldCompleteToday(habit, day));
    if (dayHabits.length === 0) return '';
    
    const completedCount = dayHabits.filter(h => isHabitCompletedForDate(h, day)).length;
    const ratio = completedCount / dayHabits.length;
    
    if (ratio === 0) return '';
    if (ratio <= 0.25) return 'bg-blue-100 dark:bg-blue-900/30';
    if (ratio <= 0.5) return 'bg-blue-200 dark:bg-blue-800/40';
    if (ratio <= 0.75) return 'bg-blue-300 dark:bg-blue-700/50';
    if (ratio < 1) return 'bg-blue-400 dark:bg-blue-600/60';
    return 'bg-blue-500 dark:bg-blue-500/70 text-white';
  };

  // Generate days for the monthly calendar
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const monthDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Group days into weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  monthDays.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Get all habits or filtered by name
  const filteredHabits = selectedHabit 
    ? habits.filter(h => h.name === selectedHabit)
    : habits;

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-2 mb-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground text-sm">View your habit completion history</p>
        </div>
      </div>

      {/* Tabs for habit selection */}
      <Tabs defaultValue={selectedHabit || "all"} onValueChange={(value) => setSelectedHabit(value === "all" ? null : value)}>
        <div className="overflow-x-auto pb-2">
          <TabsList className="bg-muted/30 h-9 mb-6">
            <TabsTrigger value="all" className="text-xs h-7 px-3">
              All Habits
            </TabsTrigger>
            {habits.map((habit) => (
              <TabsTrigger key={habit.id} value={habit.name} className="text-xs h-7 px-3">
                {habit.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="space-y-6">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={handlePrevMonth} className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday} className="h-8">
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Month view calendar */}
          <div className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 border">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={i} className="text-center py-2 text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div>
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7">
                  {week.map((day, dayIndex) => {
                    const isToday = isSameDay(day, today);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const completionColor = getCompletionColor(day);
                    
                    return (
                      <div 
                        key={dayIndex}
                        className={cn(
                          "aspect-square flex items-center justify-center text-sm relative",
                          !isCurrentMonth && "text-muted-foreground/50",
                          isToday && "font-bold"
                        )}
                      >
                        <div 
                          className={cn(
                            "calendar-day",
                            completionColor,
                            isToday && !completionColor && "calendar-day-today"
                          )}
                        >
                          {format(day, 'd')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Habit completion legend */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mt-4">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-blue-100 dark:bg-blue-900/30"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-200 dark:bg-blue-800/40"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-300 dark:bg-blue-700/50"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-400 dark:bg-blue-600/60"></div>
              <div className="w-3 h-3 rounded-sm bg-blue-500 dark:bg-blue-500/70"></div>
            </div>
            <span>More</span>
          </div>

          {/* Habit List */}
          <div className="space-y-4 mt-6">
            <h3 className="font-medium text-lg">Habit Details</h3>
            {filteredHabits.map(habit => (
              <Card key={habit.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">{habit.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
                    {Array.from({ length: 30 }, (_, i) => {
                      const date = subDays(today, 29 - i);
                      const isCompleted = isHabitCompletedForDate(habit, date);
                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div 
                            className={cn(
                              "w-6 h-6 rounded-sm",
                              isCompleted 
                                ? "bg-blue-500 dark:bg-blue-500" 
                                : "bg-gray-100 dark:bg-gray-700"
                            )}
                          ></div>
                          <span className="text-xs text-muted-foreground mt-1">
                            {format(date, 'MMM d')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                    <span>Current streak: {habit.streak} days</span>
                    <span>Longest streak: {habit.bestStreak} days</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Tabs>
    </div>
  );
};

const CalendarPage = () => {
  return (
    <HabitProvider>
      <Layout>
        <CalendarView />
      </Layout>
    </HabitProvider>
  );
};

export default CalendarPage;

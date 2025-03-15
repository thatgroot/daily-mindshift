
import React from 'react';
import Layout from '@/components/Layout';
import { HabitProvider } from '@/contexts/HabitContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Calendar, Flame, PieChart, TrendingUp } from 'lucide-react';
import { useHabits } from '@/contexts/HabitContext';
import { format, subDays } from 'date-fns';
import { PieChart as RechartPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import ProgressRing from '@/components/ProgressRing';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

const Analytics = () => {
  const { habits, getHabitsByCategory } = useHabits();
  
  // Category distribution data
  const categorizedHabits = getHabitsByCategory();
  const categoryData = Object.keys(categorizedHabits).map((category, index) => ({
    name: category,
    value: categorizedHabits[category].length,
    color: COLORS[index % COLORS.length]
  }));
  
  // Completion trend data (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    const formattedDate = format(date, 'yyyy-MM-dd');
    const completed = habits.reduce((count, habit) => {
      if (habit.completions[formattedDate]?.completed) {
        return count + 1;
      }
      return count;
    }, 0);
    
    return {
      date: format(date, 'MM/dd'),
      completed,
      total: habits.length,
    };
  }).reverse();
  
  // Habit performance data
  const habitPerformance = habits.map(habit => {
    const totalDays = Object.keys(habit.completions).length;
    const completionRate = habit.totalCompletions / (totalDays || 1) * 100;
    
    return {
      name: habit.name,
      streak: habit.streak,
      bestStreak: habit.bestStreak,
      completionRate: Math.round(completionRate),
      color: habit.color || COLORS[0]
    };
  }).sort((a, b) => b.completionRate - a.completionRate);
  
  // Calculate overall stats
  const totalCompletions = habits.reduce((sum, habit) => sum + habit.totalCompletions, 0);
  const averageCompletionRate = habits.length 
    ? Math.round(habits.reduce((sum, habit) => {
        const totalDays = Object.keys(habit.completions).length;
        const rate = habit.totalCompletions / (totalDays || 1) * 100;
        return sum + rate;
      }, 0) / habits.length) 
    : 0;
  const bestStreak = habits.reduce((max, habit) => Math.max(max, habit.bestStreak), 0);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Insights into your habit performance</p>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" /> Overall Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ProgressRing 
              value={averageCompletionRate} 
              max={100} 
              showPercentage={true} 
              label="Average"
              size={120}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="h-4 w-4" /> Best Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-4xl font-bold">{bestStreak}</div>
            <p className="text-sm text-muted-foreground">Consecutive days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Total Completions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-4xl font-bold">{totalCompletions}</div>
            <p className="text-sm text-muted-foreground">Habits completed</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" /> Habit Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted-foreground">
                  No data available
                </div>
              )}
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="text-sm">{category.name}: {category.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* 7-Day Trend */}
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> 7-Day Completion Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#8884d8" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Habit Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Habit Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habitPerformance.map((habit) => (
              <div key={habit.name} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", habit.color)} />
                    <h3 className="font-medium">{habit.name}</h3>
                  </div>
                  <div className="text-sm font-medium">
                    {habit.completionRate}% Completion
                  </div>
                </div>
                
                <div className="w-full bg-secondary rounded-full h-2.5">
                  <div 
                    className="bg-accent h-2.5 rounded-full" 
                    style={{ width: `${habit.completionRate}%` }}
                  />
                </div>
                
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <div>Current Streak: {habit.streak} days</div>
                  <div>Best Streak: {habit.bestStreak} days</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AnalyticsPage = () => {
  return (
    <HabitProvider>
      <Layout>
        <Analytics />
      </Layout>
    </HabitProvider>
  );
};

export default AnalyticsPage;

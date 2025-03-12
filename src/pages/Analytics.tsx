
import React from 'react';
import Layout from '@/components/Layout';
import { HabitProvider } from '@/contexts/HabitContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Calendar, Flame, PieChart, TrendingUp, LineChart, Clock, Activity } from 'lucide-react';
import { useHabits } from '@/contexts/HabitContext';
import { format, subDays } from 'date-fns';
import { PieChart as RechartPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart as RechartLineChart, Line } from 'recharts';
import { cn } from '@/lib/utils';
import ProgressRing from '@/components/ProgressRing';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

// GitHub-style colors for the calendar heatmap
const GITHUB_COLORS = {
  level0: 'rgba(22, 27, 34, 0)',
  level1: '#0e4429',
  level2: '#006d32',
  level3: '#26a641',
  level4: '#39d353',
};

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
  
  // Streak trend data (last 14 days)
  const streakTrend = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), 13 - i);
    return {
      date: format(date, 'MM/dd'),
      streak: Math.floor(Math.random() * 10) + 1, // Simulated data
    };
  });
  
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
  
  // Generate heatmap data (GitHub-style)
  const generateHeatmapData = () => {
    const days = 52 * 7; // One year
    return Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - i - 1);
      const dateStr = format(date, 'yyyy-MM-dd');
      const value = Math.floor(Math.random() * 5); // 0-4 for intensity levels
      
      return {
        date: dateStr,
        value,
        display: format(date, 'MMM d')
      };
    });
  };
  
  const heatmapData = generateHeatmapData();
  
  const getHeatmapCellColor = (value: number) => {
    if (value === 0) return GITHUB_COLORS.level0;
    if (value === 1) return GITHUB_COLORS.level1;
    if (value === 2) return GITHUB_COLORS.level2;
    if (value === 3) return GITHUB_COLORS.level3;
    return GITHUB_COLORS.level4;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-r from-accent-foreground to-primary bg-clip-text text-transparent">Analytics</h1>
          <p className="text-muted-foreground mt-1">Insights into your habit performance</p>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/10 border-none shadow-sm">
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
        
        <Card className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/10 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" /> Best Streak
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">{bestStreak}</div>
            <p className="text-sm text-muted-foreground">Consecutive days</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/10 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-green-500" /> Total Completions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">{totalCompletions}</div>
            <p className="text-sm text-muted-foreground">Habits completed</p>
          </CardContent>
        </Card>
      </div>
      
      {/* GitHub-style activity heatmap */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" /> Activity Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto pb-4">
            <div className="flex flex-wrap min-w-[800px]">
              {Array.from({ length: 52 }).map((_, weekIndex) => (
                <div key={weekIndex} className="flex flex-col">
                  {Array.from({ length: 7 }).map((_, dayIndex) => {
                    const dataIndex = weekIndex * 7 + dayIndex;
                    const data = dataIndex < heatmapData.length ? heatmapData[dataIndex] : null;
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className="w-3 h-3 m-0.5 rounded-sm" 
                        style={{ backgroundColor: data ? getHeatmapCellColor(data.value) : GITHUB_COLORS.level0 }}
                        title={data ? `${data.display}: ${data.value} activities` : ''}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end items-center mt-2 gap-2">
            <span className="text-xs text-muted-foreground">Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div 
                key={level} 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: getHeatmapCellColor(level) }}
              />
            ))}
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card className="overflow-hidden bg-gradient-to-br from-background to-muted/10 border-none shadow-sm">
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
        <Card className="overflow-hidden bg-gradient-to-br from-background to-muted/10 border-none shadow-sm">
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
        
        {/* Streak Trend */}
        <Card className="overflow-hidden bg-gradient-to-br from-background to-muted/10 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" /> Streak Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartLineChart data={streakTrend}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="streak" stroke="#ff7300" activeDot={{ r: 8 }} />
                </RechartLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Time of Day Analysis */}
        <Card className="overflow-hidden bg-gradient-to-br from-background to-muted/10 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" /> Completion Time Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p>Most active time: Morning (6AM - 10AM)</p>
                <p className="text-sm text-muted-foreground mt-2">Complete more habits in the morning for best results.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Habit Performance */}
      <Card className="bg-gradient-to-br from-background to-muted/10 border-none shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" /> Habit Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {habitPerformance.map((habit) => (
              <div key={habit.name} className="border rounded-lg p-4 hover:bg-muted/5 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-3 h-3 rounded-full", habit.color)} />
                    <h3 className="font-medium">{habit.name}</h3>
                  </div>
                  <div className="text-sm font-medium">
                    {habit.completionRate}% Completion
                  </div>
                </div>
                
                <div className="w-full bg-secondary rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="h-2.5 rounded-full transition-all duration-1000" 
                    style={{ 
                      width: `${habit.completionRate}%`,
                      backgroundColor: habit.completionRate < 25 ? '#0e4429' :
                                      habit.completionRate < 50 ? '#006d32' :
                                      habit.completionRate < 75 ? '#26a641' : '#39d353'
                    }}
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

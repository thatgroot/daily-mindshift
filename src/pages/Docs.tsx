
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, User, BarChart, Settings, Plus, Check, Repeat, TrendingUp } from 'lucide-react';
import ProgressRing from '@/components/ProgressRing';
import HabitCard from '@/components/HabitCard';
import StatsCard from '@/components/StatsCard';
import { Habit } from '@/types/habit';

// Sample data for demos
const sampleHabit: Habit = {
  id: 'sample-1',
  name: 'Morning Meditation',
  description: 'Meditate for 10 minutes every morning',
  frequency: 'daily',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  category: 'Wellness',
  color: 'bg-purple-200 dark:bg-purple-900',
  streak: 7,
  bestStreak: 14,
  totalCompletions: 32,
  completions: {}
};

const DocsPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto pb-16">
        <div className="text-center py-6">
          <h1 className="text-4xl font-bold mb-4">Daily Routines - Habit Tracker</h1>
          <p className="text-xl text-muted-foreground">Documentation & Feature Showcase</p>
        </div>

        <img 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80" 
          alt="Daily Routines Banner" 
          className="w-full h-64 object-cover rounded-xl mb-8"
        />

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>
            Daily Routines is a modern habit tracking application designed to help you build consistent habits, 
            track your progress, and improve your daily routine. With a clean, intuitive interface inspired by 
            Google's Material Design, Daily Routines makes it easy to create, track, and analyze your habits.
          </p>

          <h2 className="flex items-center gap-2 mt-8 mb-4">
            <span className="p-2 bg-primary/10 rounded-full"><User className="h-5 w-5 text-primary" /></span>
            Dashboard
          </h2>
          
          <p>
            The dashboard is your home base for managing habits. Here you can see your daily habits, track completions, 
            and view your progress overview.
          </p>

          <div className="mt-6 mb-8 p-6 border rounded-xl bg-card/50">
            <h3 className="text-xl font-medium mb-4">Dashboard Demo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <StatsCard
                title="Today's Progress"
                value="3/5"
                description="60% complete"
                icon={<Calendar className="h-5 w-5" />}
                ringValue={3}
                ringMax={5}
              />
              <StatsCard
                title="Current Streak"
                value="7"
                description="days in a row"
                icon={<Repeat className="h-5 w-5" />}
                trend={+5}
              />
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-3">Today's Habits</h4>
              <HabitCard habit={sampleHabit} onEdit={() => {}} />
            </div>
          </div>

          <h2 className="flex items-center gap-2 mt-8 mb-4">
            <span className="p-2 bg-primary/10 rounded-full"><Plus className="h-5 w-5 text-primary" /></span>
            Creating Habits
          </h2>
          
          <p>
            Creating a new habit is simple with our intuitive form. You can specify the habit name, description, frequency, 
            category, and even set reminders.
          </p>

          <div className="mt-6 mb-8 p-6 border rounded-xl bg-card/50">
            <h3 className="text-xl font-medium mb-4">Create Habit Demo</h3>
            <Card className="max-w-lg mx-auto">
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Habit Name</p>
                  <div className="p-2 border rounded-md">Morning Meditation</div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Frequency</p>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Daily</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Category</p>
                  <Badge>Wellness</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Color</p>
                  <div className="flex gap-2">
                    {['bg-purple-200', 'bg-blue-200', 'bg-green-200', 'bg-red-200'].map((color, i) => (
                      <div key={i} className={`w-6 h-6 rounded-full ${color} ${i === 0 ? 'ring-2 ring-primary' : ''}`} />
                    ))}
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  <Button>Create Habit</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="flex items-center gap-2 mt-8 mb-4">
            <span className="p-2 bg-primary/10 rounded-full"><Calendar className="h-5 w-5 text-primary" /></span>
            Calendar View
          </h2>
          
          <p>
            The calendar view shows your habits organized by date, allowing you to see your schedule and track 
            completions over time.
          </p>

          <div className="mt-6 mb-8 p-6 border rounded-xl bg-card/50">
            <h3 className="text-xl font-medium mb-4">Calendar Demo</h3>
            <div className="grid grid-cols-7 gap-2 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="font-medium text-sm">{day}</div>
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`aspect-square rounded-md flex flex-col items-center justify-center p-2 
                  ${i % 2 === 0 ? 'bg-primary/10' : 'border'}`}
                >
                  <span className="text-sm font-medium">{i + 1}</span>
                  <div className="mt-1 flex gap-1">
                    {i % 3 === 0 && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
                    {i % 2 === 0 && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="flex items-center gap-2 mt-8 mb-4">
            <span className="p-2 bg-primary/10 rounded-full"><BarChart className="h-5 w-5 text-primary" /></span>
            Analytics
          </h2>
          
          <p>
            Get insights into your habit performance with detailed analytics including completion rates, 
            streaks, and trends over time.
          </p>

          <div className="mt-6 mb-8 p-6 border rounded-xl bg-card/50">
            <h3 className="text-xl font-medium mb-4">Analytics Demo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-lg font-medium mb-2">Completion Rate</h4>
                  <div className="flex justify-center py-4">
                    <ProgressRing value={78} max={100} size={120} strokeWidth={10} />
                  </div>
                  <p className="text-center text-muted-foreground">78% of habits completed</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h4 className="text-lg font-medium mb-2">Weekly Trend</h4>
                  <div className="h-[140px] flex items-end justify-between px-2 pt-6 pb-2">
                    {[60, 75, 45, 80, 70, 65, 90].map((value, i) => (
                      <div 
                        key={i} 
                        className="w-8 bg-primary/80 rounded-t-sm" 
                        style={{ height: `${value}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-between px-2 text-xs text-muted-foreground">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day}>{day}</div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <h2 className="flex items-center gap-2 mt-8 mb-4">
            <span className="p-2 bg-primary/10 rounded-full"><Settings className="h-5 w-5 text-primary" /></span>
            Settings
          </h2>
          
          <p>
            Customize your experience in the settings page, including theme preferences, 
            notification settings, and data management options.
          </p>

          <div className="mt-6 mb-8 p-6 border rounded-xl bg-card/50">
            <h3 className="text-xl font-medium mb-4">Settings Demo</h3>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
              </TabsList>
              <TabsContent value="general" className="space-y-4">
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <span>Dark Mode</span>
                  <div className="w-10 h-5 bg-primary rounded-full"></div>
                </div>
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <span>First Day of Week</span>
                  <Badge variant="outline">Monday</Badge>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <h2 className="flex items-center gap-2 mt-8 mb-4">
            <span className="p-2 bg-primary/10 rounded-full"><TrendingUp className="h-5 w-5 text-primary" /></span>
            Habit Tracking
          </h2>
          
          <p>
            Track your habits effectively with features like streak counting, completion history, 
            and visual progress indicators.
          </p>

          <div className="mt-6 mb-8">
            <h3 className="text-xl font-medium mb-4">Example Habits</h3>
            <div className="space-y-3">
              <HabitCard 
                habit={{
                  ...sampleHabit,
                  id: 'demo-1',
                  name: 'Morning Meditation',
                  category: 'Wellness'
                }} 
                onEdit={() => {}} 
              />
              <HabitCard 
                habit={{
                  ...sampleHabit,
                  id: 'demo-2',
                  name: 'Read for 30 minutes',
                  category: 'Learning',
                  streak: 12,
                  color: 'bg-blue-200 dark:bg-blue-900',
                }} 
                onEdit={() => {}} 
              />
            </div>
          </div>

          <h2>Technical Information</h2>
          <p>
            Daily Routines is built with modern web technologies to provide a smooth, responsive experience:
          </p>
          <ul>
            <li>React for the UI components</li>
            <li>TypeScript for type safety</li>
            <li>Tailwind CSS for styling</li>
            <li>shadcn/ui components for the interface</li>
            <li>Recharts for data visualization</li>
            <li>date-fns for date management</li>
          </ul>

          <div className="border-t mt-8 pt-6">
            <p className="text-center text-muted-foreground">
              Thank you for using Daily Routines! We hope it helps you build positive habits and improve your daily life.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DocsPage;

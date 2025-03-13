
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { HabitProvider } from '@/contexts/HabitContext';
import { useHabits } from '@/contexts/HabitContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Frequency, WeekDay } from '@/types/habit';

const DAYS_OF_WEEK: WeekDay[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const CATEGORIES = [
  'Health',
  'Fitness',
  'Learning',
  'Work',
  'Wellness',
  'Productivity',
  'Personal',
  'Social',
];

const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'very-hard', label: 'Very Hard' },
];

const PROGRESS_TYPES = [
  { value: 'binary', label: 'Binary (Done/Not Done)' },
  { value: 'scale', label: 'Scale (0-100%)' },
  { value: 'count', label: 'Count (Number)' },
];

const COLORS = [
  { name: 'Purple', value: 'bg-purple-200 dark:bg-purple-900' },
  { name: 'Blue', value: 'bg-blue-200 dark:bg-blue-900' },
  { name: 'Green', value: 'bg-green-200 dark:bg-green-900' },
  { name: 'Cyan', value: 'bg-cyan-200 dark:bg-cyan-900' },
  { name: 'Yellow', value: 'bg-yellow-200 dark:bg-yellow-900' },
  { name: 'Red', value: 'bg-red-200 dark:bg-red-900' },
  { name: 'Pink', value: 'bg-pink-200 dark:bg-pink-900' },
  { name: 'Gray', value: 'bg-gray-200 dark:bg-gray-900' },
];

const NewHabitForm = () => {
  const navigate = useNavigate();
  const { addHabit } = useHabits();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState<Frequency>('daily');
  const [weekDays, setWeekDays] = useState<WeekDay[]>(['monday', 'wednesday', 'friday']);
  const [category, setCategory] = useState('Personal');
  const [reminder, setReminder] = useState('');
  const [color, setColor] = useState(COLORS[0].value);
  const [difficulty, setDifficulty] = useState('medium');
  const [duration, setDuration] = useState(10);
  const [progressType, setProgressType] = useState('binary');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  
  const handleWeekDayToggle = (day: WeekDay) => {
    if (weekDays.includes(day)) {
      setWeekDays(weekDays.filter((d) => d !== day));
    } else {
      setWeekDays([...weekDays, day]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Habit name is required",
        variant: "destructive",
      });
      return;
    }
    
    if (frequency === 'weekly' && weekDays.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one day of the week",
        variant: "destructive",
      });
      return;
    }
    
    const habitData = {
      name,
      description,
      frequency,
      weekDays: frequency === 'weekly' ? weekDays : undefined,
      category,
      reminder: reminderEnabled ? reminder : undefined,
      color,
      difficulty,
    };
    
    addHabit(habitData);
    navigate('/');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Create New Habit</h1>
          <p className="text-muted-foreground mt-1">Add a new habit to track</p>
        </div>
      </div>
      
      <Card className="max-w-3xl mx-auto bg-card/70 backdrop-blur-sm border-muted/40">
        <form onSubmit={handleSubmit}>
          <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5">
            <CardTitle>Habit Details</CardTitle>
            <CardDescription>
              Fill in the details of the habit you want to build
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label htmlFor="name">Habit Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Morning Meditation"
                className="rounded-lg"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">A clear, specific name for your habit</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., 10 minutes of mindfulness meditation after waking up"
                rows={3}
                className="rounded-lg"
              />
              <p className="text-xs text-muted-foreground mt-1">Details about how and when you'll perform this habit</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category" className="rounded-lg">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger id="difficulty" className="rounded-lg">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Duration (minutes): {duration}</Label>
              <Slider 
                defaultValue={[10]} 
                max={120} 
                step={1} 
                value={[duration]}
                onValueChange={(value) => setDuration(value[0])}
              />
              <p className="text-xs text-muted-foreground">How long will this habit take each time?</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="progressType">Progress Tracking</Label>
              <Select value={progressType} onValueChange={setProgressType}>
                <SelectTrigger id="progressType" className="rounded-lg">
                  <SelectValue placeholder="Select how to track progress" />
                </SelectTrigger>
                <SelectContent>
                  {PROGRESS_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">How will you measure your progress?</p>
            </div>
            
            <div className="space-y-2">
              <Label>Frequency</Label>
              <RadioGroup
                value={frequency}
                onValueChange={(value) => setFrequency(value as Frequency)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily" className="cursor-pointer">Daily</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly" className="cursor-pointer">Weekly</Label>
                </div>
              </RadioGroup>
            </div>
            
            {frequency === 'weekly' && (
              <div className="space-y-2">
                <Label>Days of Week</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day, index) => {
                    const shortDay = day.charAt(0).toUpperCase();
                    return (
                      <Button
                        key={day}
                        type="button"
                        variant="outline"
                        className={`h-10 w-10 rounded-full p-0 ${
                          weekDays.includes(day) 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-background'
                        }`}
                        onClick={() => handleWeekDayToggle(day)}
                      >
                        {shortDay}
                      </Button>
                    );
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Select the days you want to perform this habit</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="reminderEnabled" className="font-medium text-base">Enable Reminder</Label>
                <Switch 
                  id="reminderEnabled" 
                  checked={reminderEnabled}
                  onCheckedChange={setReminderEnabled}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Get notified when it's time for this habit</p>
              
              {reminderEnabled && (
                <div className="pt-2">
                  <Label htmlFor="reminder">Reminder Time</Label>
                  <Input
                    id="reminder"
                    type="time"
                    value={reminder}
                    onChange={(e) => setReminder(e.target.value)}
                    className="rounded-lg mt-1"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((c) => (
                  <div
                    key={c.value}
                    className={`w-8 h-8 rounded-full cursor-pointer transition-all ${c.value} ${
                      color === c.value ? 'ring-2 ring-accent ring-offset-2' : ''
                    }`}
                    onClick={() => setColor(c.value)}
                  />
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6 px-6 pb-6 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/')}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="rounded-lg bg-gradient-to-r from-primary to-accent hover:opacity-90"
            >
              Create Habit
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

const NewHabitPage = () => {
  return (
    <HabitProvider>
      <Layout>
        <div className="max-w-6xl mx-auto">
          <NewHabitForm />
        </div>
      </Layout>
    </HabitProvider>
  );
};

export default NewHabitPage;

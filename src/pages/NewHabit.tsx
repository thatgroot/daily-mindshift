
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
      reminder: reminder || undefined,
      color,
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
      
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Habit Details</CardTitle>
            <CardDescription>
              Fill in the details of the habit you want to build
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your habit..."
                rows={3}
                className="rounded-lg"
              />
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
                <div className="grid grid-cols-4 gap-3">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={weekDays.includes(day)}
                        onCheckedChange={() => handleWeekDayToggle(day)}
                        className="rounded-md"
                      />
                      <Label htmlFor={day} className="cursor-pointer capitalize">
                        {day.slice(0, 3)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
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
              <Label htmlFor="reminder">Reminder Time (Optional)</Label>
              <Input
                id="reminder"
                type="time"
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="rounded-lg"
              />
              <p className="text-xs text-muted-foreground">
                Set a time to be reminded about this habit
              </p>
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
          <CardFooter className="flex justify-between border-t pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/')}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button type="submit" className="rounded-lg">
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
        <NewHabitForm />
      </Layout>
    </HabitProvider>
  );
};

export default NewHabitPage;

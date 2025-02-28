
import React, { useState } from 'react';
import { Habit, Frequency, WeekDay } from '@/types/habit';
import { useHabits } from '@/contexts/HabitContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

interface HabitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit?: Habit;
}

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

const HabitForm: React.FC<HabitFormProps> = ({
  open,
  onOpenChange,
  habit,
}) => {
  const { addHabit, updateHabit } = useHabits();
  const [name, setName] = useState(habit?.name || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [frequency, setFrequency] = useState<Frequency>(habit?.frequency || 'daily');
  const [weekDays, setWeekDays] = useState<WeekDay[]>(habit?.weekDays || ['monday', 'wednesday', 'friday']);
  const [category, setCategory] = useState(habit?.category || 'Personal');
  const [reminder, setReminder] = useState(habit?.reminder || '');
  const [color, setColor] = useState(habit?.color || COLORS[0].value);

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
    
    const habitData = {
      name,
      description,
      frequency,
      weekDays: frequency === 'weekly' ? weekDays : undefined,
      category,
      reminder: reminder || undefined,
      color,
    };
    
    if (habit) {
      updateHabit({
        ...habit,
        ...habitData,
      });
    } else {
      addHabit(habitData);
    }
    
    onOpenChange(false);
  };
  
  const handleWeekDayToggle = (day: WeekDay) => {
    if (weekDays.includes(day)) {
      setWeekDays(weekDays.filter((d) => d !== day));
    } else {
      setWeekDays([...weekDays, day]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{habit ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Habit Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Morning Meditation"
                autoFocus
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your habit..."
                rows={2}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Frequency</Label>
              <RadioGroup
                value={frequency}
                onValueChange={(value) => setFrequency(value as Frequency)}
                className="flex flex-col space-y-1"
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
              <div className="grid gap-2">
                <Label>Days of Week</Label>
                <div className="grid grid-cols-4 gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={day}
                        checked={weekDays.includes(day)}
                        onCheckedChange={() => handleWeekDayToggle(day)}
                      />
                      <Label htmlFor={day} className="cursor-pointer capitalize">
                        {day.slice(0, 3)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
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
            
            <div className="grid gap-2">
              <Label htmlFor="reminder">Reminder (Optional)</Label>
              <Input
                id="reminder"
                type="time"
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <div
                    key={c.value}
                    className={`w-8 h-8 rounded-full cursor-pointer transition-all ${c.value} ${
                      color === c.value ? 'ring-2 ring-accent' : ''
                    }`}
                    onClick={() => setColor(c.value)}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {habit ? 'Update Habit' : 'Create Habit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HabitForm;

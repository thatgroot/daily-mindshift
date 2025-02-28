
import React from 'react';
import { Habit } from '@/types/habit';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useHabits } from '@/contexts/HabitContext';
import { CheckCircle, CheckCircle2, Circle, MoreHorizontal, Flame, Award, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface HabitCardProps {
  habit: Habit;
  className?: string;
  onEdit?: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, className, onEdit }) => {
  const { toggleCompletion, deleteHabit, isHabitCompletedForDate } = useHabits();
  const today = new Date();
  const isCompleted = isHabitCompletedForDate(habit, today);

  const getHabitFrequencyText = (habit: Habit) => {
    switch (habit.frequency) {
      case 'daily':
        return 'Every day';
      case 'weekly':
        return habit.weekDays?.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ') || 'Weekly';
      case 'monthly':
        return habit.monthDays?.map(day => day.toString()).join(', ') || 'Monthly';
      case 'custom':
        return 'Custom schedule';
      default:
        return 'Unknown frequency';
    }
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-md",
        isCompleted ? "border-accent/40" : "border-border",
        className
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => toggleCompletion(habit.id, today)}
            className={cn(
              "rounded-full mr-3 transition-all duration-300",
              isCompleted ? "text-accent hover:text-accent/80" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isCompleted ? (
              <CheckCircle className="h-7 w-7 animate-scale-in" />
            ) : (
              <Circle className="h-7 w-7" />
            )}
          </Button>
          
          <div className="flex-1">
            <h3 className="font-medium text-lg">{habit.name}</h3>
            {habit.description && (
              <p className="text-muted-foreground text-sm">{habit.description}</p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteHabit(habit.id)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
      
      <CardFooter className="flex p-4 pt-0 gap-3 justify-between">
        <div className="flex gap-2">
          {habit.streak > 0 && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5" />
              <span>{habit.streak} day streak</span>
            </Badge>
          )}
          {habit.bestStreak > 0 && habit.bestStreak !== habit.streak && (
            <Badge variant="outline" className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" />
              <span>Best: {habit.bestStreak}</span>
            </Badge>
          )}
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground gap-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{getHabitFrequencyText(habit)}</span>
          </div>
          {habit.reminder && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{habit.reminder}</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default HabitCard;

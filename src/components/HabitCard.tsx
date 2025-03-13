
import React from 'react';
import { Habit } from '@/types/habit';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useHabits } from '@/contexts/HabitContext';
import { CheckCircle, Circle, MoreHorizontal, Flame, Award, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface HabitCardProps {
  habit: Habit;
  className?: string;
  style?: React.CSSProperties;
  onEdit?: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, className, style, onEdit }) => {
  const { toggleCompletion, deleteHabit, isHabitCompletedForDate } = useHabits();
  const today = new Date();
  const isCompleted = isHabitCompletedForDate(habit, today);

  // Determine background color based on habit category or name
  const getHabitColor = (habit: Habit) => {
    const nameToLower = habit.name.toLowerCase();
    
    if (habit.color) return habit.color;
    
    if (nameToLower.includes('meditate') || nameToLower.includes('mindfulness')) {
      return 'habit-type-blue';
    } else if (nameToLower.includes('workout') || nameToLower.includes('exercise') || nameToLower.includes('gym')) {
      return 'habit-type-pink';
    } else if (nameToLower.includes('read') || nameToLower.includes('study') || nameToLower.includes('learn')) {
      return 'habit-type-green';
    } else if (nameToLower.includes('yoga') || nameToLower.includes('stretch')) {
      return 'habit-type-orange';
    } else if (nameToLower.includes('run') || nameToLower.includes('jog')) {
      return 'habit-type-purple';
    }
    
    // Default colors by category
    switch (habit.category?.toLowerCase()) {
      case 'health': return 'habit-type-green';
      case 'fitness': return 'habit-type-pink';
      case 'mindfulness': return 'habit-type-blue';
      case 'learning': return 'habit-type-green';
      case 'productivity': return 'habit-type-orange';
      default: return 'bg-white dark:bg-gray-800';
    }
  };

  // Get text for streak or completion counter
  const getStreakText = (habit: Habit) => {
    if (habit.streak >= 7) {
      return `${habit.streak} days`;
    } else if (habit.streak > 0) {
      return `${habit.streak} days`;
    } 
    return '';
  };

  // Get the streak icon class
  const getStreakIconClass = (habit: Habit) => {
    if (habit.streak >= 30) return 'text-blue-500';
    if (habit.streak >= 14) return 'text-green-500';
    if (habit.streak >= 7) return 'text-orange-500';
    return 'text-amber-500';
  };

  return (
    <div 
      className={cn(
        "flex items-center p-4 rounded-lg mb-2 transition-all hover:translate-x-1 border-l-4", 
        isCompleted ? 
          "border-l-green-500 bg-green-50/40 dark:bg-green-900/20" : 
          "border-l-gray-200 dark:border-l-gray-700 bg-white dark:bg-gray-800",
        getHabitColor(habit),
        className
      )}
      style={style}
    >
      <Button
        variant={isCompleted ? "ghost" : "outline"}
        size="icon"
        onClick={() => toggleCompletion(habit.id, today)}
        className={cn(
          "rounded-full h-10 w-10 flex items-center justify-center mr-4 transition-all", 
          isCompleted ? 
            "bg-green-500 text-white hover:bg-green-600 hover:text-white" : 
            "bg-white text-gray-400 hover:text-gray-600 dark:bg-gray-800"
        )}
      >
        {isCompleted ? (
          <CheckCircle className="h-6 w-6" />
        ) : (
          <Circle className="h-6 w-6" />
        )}
      </Button>

      <div className="flex-1">
        <div className="flex items-center">
          <h3 className="font-semibold text-base">{habit.name}</h3>
          {habit.streak > 0 && (
            <Badge 
              variant="outline" 
              className={cn(
                "ml-2 flex items-center gap-1 border-none px-2 py-1", 
                getStreakIconClass(habit)
              )}
            >
              <Flame className="h-3 w-3" />
              <span className="text-xs">{getStreakText(habit)}</span>
            </Badge>
          )}
        </div>
        
        {habit.description && (
          <p className="text-muted-foreground text-xs mt-1">{habit.description}</p>
        )}
        
        <div className="flex items-center mt-1 text-xs text-muted-foreground">
          {habit.frequency && (
            <span className="flex items-center mr-3">
              <Calendar className="h-3 w-3 mr-1" />
              {habit.frequency}
            </span>
          )}
          {habit.reminder && (
            <span className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {habit.reminder}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteHabit(habit.id)} className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HabitCard;

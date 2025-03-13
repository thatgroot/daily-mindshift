
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Habit } from '@/types/habit';
import { format } from 'date-fns';
import { useHabits } from '@/contexts/HabitContext';
import { Check, Clock, X } from 'lucide-react';
import DailyProgressDialog from './DailyProgressDialog';

interface HabitProgressRecordProps {
  habit: Habit;
}

const HabitProgressRecord: React.FC<HabitProgressRecordProps> = ({ habit }) => {
  const { isHabitCompletedForDate } = useHabits();
  const [dialogOpen, setDialogOpen] = useState(false);
  const today = new Date();
  const isCompleted = isHabitCompletedForDate(habit, today);
  
  const getCompletionStatus = () => {
    if (isCompleted) {
      return {
        icon: <Check className="h-5 w-5 text-green-500" />,
        text: 'Completed',
        color: 'text-green-500'
      };
    }
    
    // In a real implementation, you'd handle partial status from the database
    return {
      icon: <Clock className="h-5 w-5 text-muted-foreground" />,
      text: 'Not recorded',
      color: 'text-muted-foreground'
    };
  };
  
  const status = getCompletionStatus();
  
  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-between group hover:border-accent/50 transition-all duration-300"
        onClick={() => setDialogOpen(true)}
      >
        <span>{habit.name}</span>
        <span className={`flex items-center ${status.color} group-hover:text-accent`}>
          {status.text}
          {status.icon}
        </span>
      </Button>
      
      <DailyProgressDialog
        habit={habit}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};

export default HabitProgressRecord;

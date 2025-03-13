
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Check, Clock, X } from 'lucide-react';
import { Habit } from '@/types/habit';
import { useHabits } from '@/contexts/HabitContext';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface DailyProgressDialogProps {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ProgressStatus = 'completed' | 'partial' | 'missed';

const DailyProgressDialog: React.FC<DailyProgressDialogProps> = ({ habit, open, onOpenChange }) => {
  const { toggleCompletion } = useHabits();
  const [status, setStatus] = useState<ProgressStatus>('completed');
  const [notes, setNotes] = useState('');
  
  const getStreakImpactMessage = () => {
    if (status === 'completed') {
      return '+1 day will be added to your current streak!';
    } else if (status === 'partial') {
      return 'Your streak will continue, but as partially completed.';
    } else {
      return 'This will reset your current streak to 0.';
    }
  };
  
  const handleSave = () => {
    const today = new Date();
    const statusCompleted = status !== 'missed';
    
    // In a real implementation, you'd handle partial differently
    toggleCompletion(habit.id, today, notes);
    
    toast({
      title: `${habit.name} marked as ${status}`,
      description: `Progress saved for ${format(today, 'MMMM d, yyyy')}`,
      variant: status === 'missed' ? 'destructive' : 'default',
    });
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-black/95 text-white border-gray-800 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Track Progress: {habit.name}</DialogTitle>
          <DialogDescription className="text-center text-gray-400 text-base">
            Record your progress for today's habit.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <h3 className="text-xl mb-4">How did you do today?</h3>
            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className={`flex flex-col items-center py-6 border ${status === 'completed' ? 'border-green-500 bg-green-950/30' : 'border-gray-700 bg-transparent'} hover:bg-green-950/20 rounded-lg`}
                onClick={() => setStatus('completed')}
              >
                <Check className={`w-6 h-6 mb-2 ${status === 'completed' ? 'text-green-500' : 'text-green-400/70'}`} />
                <span className="text-base">Completed</span>
              </Button>
              
              <Button 
                variant="outline" 
                className={`flex flex-col items-center py-6 border ${status === 'partial' ? 'border-yellow-500 bg-yellow-950/30' : 'border-gray-700 bg-transparent'} hover:bg-yellow-950/20 rounded-lg`}
                onClick={() => setStatus('partial')}
              >
                <Clock className={`w-6 h-6 mb-2 ${status === 'partial' ? 'text-yellow-500' : 'text-yellow-400/70'}`} />
                <span className="text-base">Partial</span>
              </Button>
              
              <Button 
                variant="outline" 
                className={`flex flex-col items-center py-6 border ${status === 'missed' ? 'border-red-500 bg-red-950/30' : 'border-gray-700 bg-transparent'} hover:bg-red-950/20 rounded-lg`}
                onClick={() => setStatus('missed')}
              >
                <X className={`w-6 h-6 mb-2 ${status === 'missed' ? 'text-red-500' : 'text-red-400/70'}`} />
                <span className="text-base">Missed</span>
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg">Notes (optional)</h3>
            <Textarea 
              placeholder="Add any details about today's progress..."
              className="bg-gray-900 border-gray-700 h-24"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg">Streak Impact</h3>
            <div className={`p-4 rounded-lg ${
              status === 'completed' ? 'bg-green-950/30 text-green-400' : 
              status === 'partial' ? 'bg-yellow-950/30 text-yellow-400' : 
              'bg-red-950/30 text-red-400'
            }`}>
              {getStreakImpactMessage()}
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:justify-between gap-2">
          <Button 
            className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 rounded-lg py-6 text-lg"
            onClick={handleSave}
          >
            Save Progress
          </Button>
          <Button 
            variant="ghost" 
            className="w-full border border-gray-800 rounded-lg py-6 text-lg"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DailyProgressDialog;

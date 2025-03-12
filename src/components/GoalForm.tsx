
import React, { useState } from 'react';
import { Goal } from '@/types/habit';
import { useGoals } from '@/contexts/GoalContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Loader2, Calendar } from 'lucide-react';

interface GoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal;
}

const GoalForm: React.FC<GoalFormProps> = ({
  open,
  onOpenChange,
  goal,
}) => {
  const { addGoal, updateGoal } = useGoals();
  const [title, setTitle] = useState(goal?.title || '');
  const [description, setDescription] = useState(goal?.description || '');
  const [targetDate, setTargetDate] = useState(goal?.targetDate?.split('T')[0] || '');
  const [achieved, setAchieved] = useState(goal?.achieved || false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Goal title is required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const goalData = {
        title,
        description,
        targetDate: targetDate ? new Date(targetDate).toISOString() : undefined,
        achieved,
      };
      
      if (goal) {
        await updateGoal({
          ...goal,
          ...goalData,
        });
        toast({
          title: "Success",
          description: "Goal updated successfully",
        });
      } else {
        await addGoal(goalData);
        toast({
          title: "Success",
          description: "Goal created successfully",
        });
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting goal:', error);
      toast({
        title: "Error",
        description: "Failed to save goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="text-xl">{goal ? 'Edit Goal' : 'Create New Goal'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-5">
            <div className="grid gap-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Learn a new language"
                autoFocus
                className="rounded-lg"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your goal..."
                rows={3}
                className="rounded-lg"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="targetDate">Target Date (Optional)</Label>
              <div className="relative">
                <Input
                  id="targetDate"
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="rounded-lg"
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            
            {goal && (
              <div className="flex items-center justify-between">
                <Label htmlFor="achieved" className="cursor-pointer">Mark as achieved</Label>
                <Switch
                  id="achieved"
                  checked={achieved}
                  onCheckedChange={setAchieved}
                />
              </div>
            )}
          </div>
          
          <DialogFooter className="pt-4 border-t flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
              Cancel
            </Button>
            <Button type="submit" className="rounded-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {goal ? 'Updating...' : 'Creating...'}</>
              ) : (
                goal ? 'Update Goal' : 'Create Goal'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalForm;

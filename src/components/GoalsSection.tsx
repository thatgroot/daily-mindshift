
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { CalendarIcon, CheckCircle, ChevronRight, Plus, Target, Trash2 } from 'lucide-react';
import { Progress } from './ui/progress';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from './ui/calendar';

interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: Date;
  progress: number;
  completed: boolean;
}

const SAMPLE_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Complete 30-Day Meditation Challenge',
    description: 'Meditate for at least 10 minutes every day for 30 consecutive days.',
    targetDate: new Date(2023, 11, 31),
    progress: 65,
    completed: false
  },
  {
    id: '2',
    title: 'Read 12 Books This Year',
    description: 'Focus on personal development and fiction books.',
    targetDate: new Date(2023, 11, 31),
    progress: 42,
    completed: false
  },
  {
    id: '3',
    title: 'Establish Morning Routine',
    description: 'Wake up at 6am, exercise, meditate, and plan the day before 8am.',
    targetDate: undefined,
    progress: 100,
    completed: true
  }
];

const GoalsSection: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>(SAMPLE_GOALS);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: undefined as Date | undefined
  });
  const [date, setDate] = React.useState<Date>();
  
  const handleAddGoal = () => {
    if (!newGoal.title.trim()) return;
    
    const goal: Goal = {
      id: Math.random().toString(36).substring(7),
      title: newGoal.title,
      description: newGoal.description || undefined,
      targetDate: newGoal.targetDate,
      progress: 0,
      completed: false
    };
    
    setGoals([...goals, goal]);
    setNewGoal({ title: '', description: '', targetDate: undefined });
    setCreateDialogOpen(false);
  };
  
  const toggleGoalCompleted = (id: string) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        return {
          ...goal,
          completed: !goal.completed,
          progress: goal.completed ? goal.progress : 100
        };
      }
      return goal;
    }));
  };
  
  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };
  
  return (
    <>
      <Card className="shadow-lg border border-border bg-card/70 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5">
          <CardTitle className="text-xl font-bold flex items-center">
            <Target className="mr-2 h-5 w-5 text-primary" />
            Goals & Objectives
          </CardTitle>
          <Button 
            size="sm" 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Goal
          </Button>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="space-y-4">
            {goals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="mx-auto h-10 w-10 mb-2 opacity-50" />
                <p>No goals set yet</p>
                <p className="text-sm mt-1">Set goals to track your progress</p>
              </div>
            ) : (
              goals.map(goal => (
                <div key={goal.id} className={`p-4 rounded-lg border ${goal.completed ? 'bg-primary/5 border-primary/10' : 'bg-card border-border'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className={`text-lg font-medium ${goal.completed ? 'text-primary' : ''}`}>
                          {goal.title}
                        </h3>
                        {goal.completed && (
                          <CheckCircle className="ml-2 h-4 w-4 text-primary" />
                        )}
                      </div>
                      {goal.description && (
                        <p className="text-muted-foreground text-sm mt-1">{goal.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-1 ml-2 mt-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-full hover:bg-accent/10"
                        onClick={() => toggleGoalCompleted(goal.id)}
                      >
                        <CheckCircle className={`h-4 w-4 ${goal.completed ? 'text-primary' : 'text-muted-foreground'}`} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-full hover:bg-destructive/10"
                        onClick={() => deleteGoal(goal.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className={`font-medium ${goal.completed ? 'text-primary' : ''}`}>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className={`h-2 ${goal.completed ? 'bg-primary/20' : 'bg-accent/10'}`} />
                  </div>
                  
                  {goal.targetDate && (
                    <div className="mt-3 flex items-center text-xs text-muted-foreground">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>
              Set a clear, achievable goal with a target date.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                placeholder="E.g., Run 5K without stopping"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add details about your goal..."
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Target Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${!newGoal.targetDate && "text-muted-foreground"}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newGoal.targetDate ? format(newGoal.targetDate, "PPP") : "Choose a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newGoal.targetDate}
                    onSelect={(date) => setNewGoal({...newGoal, targetDate: date || undefined})}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddGoal}>Create Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GoalsSection;


import React, { createContext, useContext, useEffect, useState } from 'react';
import { Goal, Habit } from '@/types/habit';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useHabits } from './HabitContext';

interface GoalContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Goal | undefined>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  linkHabitToGoal: (goalId: string, habitId: string) => Promise<void>;
  unlinkHabitFromGoal: (goalId: string, habitId: string) => Promise<void>;
  getGoalHabits: (goalId: string) => Habit[];
  loading: boolean;
  error: string | null;
}

export const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalHabitMappings, setGoalHabitMappings] = useState<Record<string, string[]>>({}); // goalId -> habitIds[]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { habits } = useHabits();

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) {
        setGoals([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data: goalsData, error: goalsError } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (goalsError) throw goalsError;

        // Fetch goal-habit mappings
        const { data: mappingsData, error: mappingsError } = await supabase
          .from('goal_habits')
          .select('*')
          .in('goal_id', goalsData.map(g => g.id));

        if (mappingsError) throw mappingsError;

        // Build the goal-habit mappings
        const mappings: Record<string, string[]> = {};
        mappingsData.forEach(mapping => {
          if (!mappings[mapping.goal_id]) {
            mappings[mapping.goal_id] = [];
          }
          mappings[mapping.goal_id].push(mapping.habit_id);
        });

        setGoalHabitMappings(mappings);

        const formattedGoals = goalsData.map(goal => ({
          id: goal.id,
          title: goal.title,
          description: goal.description || undefined,
          targetDate: goal.target_date || undefined,
          achieved: goal.achieved,
          createdAt: goal.created_at,
          updatedAt: goal.updated_at,
        })) as Goal[];

        setGoals(formattedGoals);
        setError(null);
      } catch (err) {
        console.error('Error fetching goals:', err);
        setError('Failed to load goals. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load goals. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  const addGoal = async (newGoal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal | undefined> => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add goals',
        variant: 'destructive',
      });
      return;
    }

    try {
      const goalPayload = {
        user_id: user.id,
        title: newGoal.title,
        description: newGoal.description || null,
        target_date: newGoal.targetDate || null,
        achieved: newGoal.achieved || false
      };
      
      const { data, error } = await supabase
        .from('goals')
        .insert([goalPayload])
        .select()
        .single();

      if (error) throw error;

      const goal: Goal = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        targetDate: data.target_date || undefined,
        achieved: data.achieved,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      setGoals(prev => [goal, ...prev]);
      
      toast({
        title: 'Goal created',
        description: `"${goal.title}" has been added to your goals.`,
      });
      
      return goal;
    } catch (err) {
      console.error('Error adding goal:', err);
      toast({
        title: 'Error',
        description: 'Failed to add goal. Please try again.',
        variant: 'destructive',
      });
      return undefined;
    }
  };

  const updateGoal = async (updatedGoal: Goal): Promise<void> => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('goals')
        .update({
          title: updatedGoal.title,
          description: updatedGoal.description,
          target_date: updatedGoal.targetDate,
          achieved: updatedGoal.achieved,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedGoal.id);

      if (error) throw error;

      setGoals(prev => 
        prev.map(goal => 
          goal.id === updatedGoal.id ? { ...updatedGoal, updatedAt: new Date().toISOString() } : goal
        )
      );
      
      toast({
        title: 'Goal updated',
        description: `"${updatedGoal.title}" has been updated.`,
      });
    } catch (err) {
      console.error('Error updating goal:', err);
      toast({
        title: 'Error',
        description: 'Failed to update goal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const deleteGoal = async (id: string): Promise<void> => {
    if (!user) return;

    const goalToDelete = goals.find(g => g.id === id);
    
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGoals(prev => prev.filter(goal => goal.id !== id));
      setGoalHabitMappings(prev => {
        const newMappings = { ...prev };
        delete newMappings[id];
        return newMappings;
      });
      
      toast({
        title: 'Goal deleted',
        description: goalToDelete ? `"${goalToDelete.title}" has been removed.` : 'Goal has been removed.',
      });
    } catch (err) {
      console.error('Error deleting goal:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete goal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const linkHabitToGoal = async (goalId: string, habitId: string): Promise<void> => {
    if (!user) return;
    
    try {
      // Check if the mapping already exists
      if (goalHabitMappings[goalId]?.includes(habitId)) {
        return;
      }
      
      const { error } = await supabase
        .from('goal_habits')
        .insert([{ goal_id: goalId, habit_id: habitId }]);

      if (error) throw error;

      // Update local state
      setGoalHabitMappings(prev => {
        const newMappings = { ...prev };
        if (!newMappings[goalId]) {
          newMappings[goalId] = [];
        }
        newMappings[goalId].push(habitId);
        return newMappings;
      });
      
      toast({
        title: 'Habit linked',
        description: 'Habit has been linked to the goal.',
      });
    } catch (err) {
      console.error('Error linking habit to goal:', err);
      toast({
        title: 'Error',
        description: 'Failed to link habit to goal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const unlinkHabitFromGoal = async (goalId: string, habitId: string): Promise<void> => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('goal_habits')
        .delete()
        .eq('goal_id', goalId)
        .eq('habit_id', habitId);

      if (error) throw error;

      // Update local state
      setGoalHabitMappings(prev => {
        const newMappings = { ...prev };
        if (newMappings[goalId]) {
          newMappings[goalId] = newMappings[goalId].filter(id => id !== habitId);
        }
        return newMappings;
      });
      
      toast({
        title: 'Habit unlinked',
        description: 'Habit has been unlinked from the goal.',
      });
    } catch (err) {
      console.error('Error unlinking habit from goal:', err);
      toast({
        title: 'Error',
        description: 'Failed to unlink habit from goal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getGoalHabits = (goalId: string): Habit[] => {
    const habitIds = goalHabitMappings[goalId] || [];
    return habits.filter(habit => habitIds.includes(habit.id));
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        linkHabitToGoal,
        unlinkHabitFromGoal,
        getGoalHabits,
        loading,
        error
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};

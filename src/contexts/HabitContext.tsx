
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Habit, HabitCompletion, Frequency, WeekDay, Difficulty } from '@/types/habit';
import { toast } from '@/hooks/use-toast';
import { format, isToday, parseISO, startOfDay } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'completions' | 'streak' | 'bestStreak' | 'totalCompletions'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleCompletion: (id: string, date: Date, notes?: string) => void;
  getHabitsByCategory: () => Record<string, Habit[]>;
  isHabitCompletedForDate: (habit: Habit, date: Date) => boolean;
  getHabitCompletion: (habit: Habit, date: Date) => HabitCompletion | undefined;
  shouldCompleteToday: (habit: Habit) => boolean;
  getCompletionStatus: () => { completed: number; total: number };
  loading: boolean;
  error: string | null;
}

export const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHabits = async () => {
      if (!user) {
        setHabits([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        const { data: habitsData, error: habitsError } = await supabase
          .from('habits')
          .select('*')
          .order('created_at', { ascending: false });

        if (habitsError) throw habitsError;

        const { data: completionsData, error: completionsError } = await supabase
          .from('habit_completions')
          .select('*')
          .in('habit_id', habitsData.map(h => h.id));

        if (completionsError) throw completionsError;

        const formattedHabits = habitsData.map(habit => {
          const habitCompletions = completionsData.filter(c => c.habit_id === habit.id);
          
          const completionsRecord: Record<string, HabitCompletion> = {};
          habitCompletions.forEach(completion => {
            const dateStr = format(new Date(completion.date), 'yyyy-MM-dd');
            completionsRecord[dateStr] = {
              date: new Date(completion.date).toISOString(),
              completed: completion.completed,
              notes: completion.notes || undefined
            };
          });

          return {
            id: habit.id,
            name: habit.name,
            description: habit.description || undefined,
            icon: habit.icon || undefined,
            color: habit.color || undefined,
            frequency: habit.frequency as Frequency,
            weekDays: habit.week_days as WeekDay[] || undefined,
            monthDays: habit.month_days || undefined,
            customDays: habit.custom_days || undefined,
            createdAt: habit.created_at,
            updatedAt: habit.updated_at,
            streak: habit.streak,
            bestStreak: habit.best_streak,
            totalCompletions: habit.total_completions,
            reminder: habit.reminder || undefined,
            category: habit.category || 'Personal',
            archived: habit.archived || false,
            difficulty: habit.difficulty as Difficulty || 'medium',
            completions: completionsRecord
          } as Habit;
        });

        setHabits(formattedHabits);
        setError(null);
      } catch (err) {
        console.error('Error fetching habits:', err);
        setError('Failed to load habits. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load habits. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [user]);

  const addHabit = async (newHabit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'completions' | 'streak' | 'bestStreak' | 'totalCompletions'>) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add habits',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('Adding new habit:', newHabit);
      
      // Create a payload object with snake_case keys to match database schema
      const habitPayload = {
        user_id: user.id,
        name: newHabit.name,
        description: newHabit.description || null,
        icon: newHabit.icon || null,
        color: newHabit.color || null,
        frequency: newHabit.frequency,
        week_days: newHabit.weekDays || null,
        month_days: newHabit.monthDays || null,
        custom_days: newHabit.customDays || null,
        reminder: newHabit.reminder || null,
        category: newHabit.category || 'Personal',
        difficulty: newHabit.difficulty || 'medium',
        streak: 0,
        best_streak: 0,
        total_completions: 0
      };
      
      console.log('Submitting habit payload:', habitPayload);
      
      const { data, error } = await supabase
        .from('habits')
        .insert([habitPayload])
        .select()
        .single();

      if (error) {
        console.error('Supabase error when adding habit:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No data returned from Supabase when adding habit');
      }

      console.log('Habit added successfully:', data);

      const habit: Habit = {
        id: data.id,
        name: data.name,
        description: data.description || undefined,
        icon: data.icon || undefined,
        color: data.color || undefined,
        frequency: data.frequency as Frequency,
        weekDays: data.week_days as WeekDay[] || undefined,
        monthDays: data.month_days || undefined,
        customDays: data.custom_days || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        streak: data.streak,
        bestStreak: data.best_streak,
        totalCompletions: data.total_completions,
        reminder: data.reminder || undefined,
        category: data.category || 'Personal',
        archived: data.archived || false,
        difficulty: data.difficulty as Difficulty || 'medium',
        completions: {}
      };
      
      setHabits((prevHabits) => [habit, ...prevHabits]);
      
      toast({
        title: 'Habit created',
        description: `${habit.name} has been added to your habits.`,
      });
      
      return habit;
    } catch (err) {
      console.error('Error adding habit:', err);
      toast({
        title: 'Error',
        description: 'Failed to add habit. Please try again.',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateHabit = async (updatedHabit: Habit) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('habits')
        .update({
          name: updatedHabit.name,
          description: updatedHabit.description,
          icon: updatedHabit.icon,
          color: updatedHabit.color,
          frequency: updatedHabit.frequency,
          week_days: updatedHabit.weekDays,
          month_days: updatedHabit.monthDays,
          custom_days: updatedHabit.customDays,
          reminder: updatedHabit.reminder,
          category: updatedHabit.category,
          difficulty: updatedHabit.difficulty,
          archived: updatedHabit.archived,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedHabit.id)
        .select()
        .single();

      if (error) throw error;

      setHabits((prevHabits) =>
        prevHabits.map((habit) =>
          habit.id === updatedHabit.id
            ? { ...updatedHabit, updatedAt: new Date().toISOString() }
            : habit
        )
      );
      
      toast({
        title: 'Habit updated',
        description: `${updatedHabit.name} has been updated.`,
      });
    } catch (err) {
      console.error('Error updating habit:', err);
      toast({
        title: 'Error',
        description: 'Failed to update habit. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const deleteHabit = async (id: string) => {
    if (!user) return;

    const habitName = habits.find(h => h.id === id)?.name;
    
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
      
      toast({
        title: 'Habit deleted',
        description: habitName ? `${habitName} has been removed.` : 'Habit has been removed.',
        variant: 'destructive',
      });
    } catch (err) {
      console.error('Error deleting habit:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete habit. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const toggleCompletion = async (id: string, date: Date, notes?: string) => {
    if (!user) return;

    const dateStr = format(date, 'yyyy-MM-dd');
    const habit = habits.find(h => h.id === id);
    
    if (!habit) return;
    
    const isCompleted = !!habit.completions[dateStr]?.completed;
    
    try {
      if (isCompleted) {
        const { error } = await supabase
          .from('habit_completions')
          .delete()
          .eq('habit_id', id)
          .eq('date', dateStr);

        if (error) throw error;
        
        const newHabits = [...habits];
        const habitIndex = newHabits.findIndex(h => h.id === id);
        
        if (habitIndex !== -1) {
          const newCompletions = { ...newHabits[habitIndex].completions };
          delete newCompletions[dateStr];
          
          newHabits[habitIndex] = {
            ...newHabits[habitIndex],
            completions: newCompletions,
            updatedAt: new Date().toISOString(),
          };
          
          setHabits(newHabits);
        }
      } else {
        const { error } = await supabase
          .from('habit_completions')
          .insert([{
            habit_id: id,
            date: dateStr,
            completed: true,
            notes: notes || null
          }]);

        if (error) throw error;
        
        const newHabits = [...habits];
        const habitIndex = newHabits.findIndex(h => h.id === id);
        
        if (habitIndex !== -1) {
          const newCompletions = { 
            ...newHabits[habitIndex].completions,
            [dateStr]: {
              date: date.toISOString(),
              completed: true,
              notes
            }
          };
          
          newHabits[habitIndex] = {
            ...newHabits[habitIndex],
            completions: newCompletions,
            updatedAt: new Date().toISOString(),
          };
          
          setHabits(newHabits);
        }
      }
    } catch (err) {
      console.error('Error toggling completion:', err);
      toast({
        title: 'Error',
        description: 'Failed to update habit completion. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getHabitsByCategory = () => {
    const categorized: Record<string, Habit[]> = {};
    
    habits.forEach((habit) => {
      const category = habit.category || 'Uncategorized';
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(habit);
    });
    
    return categorized;
  };

  const isHabitCompletedForDate = (habit: Habit, date: Date): boolean => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return !!habit.completions[dateStr]?.completed;
  };

  const getHabitCompletion = (habit: Habit, date: Date): HabitCompletion | undefined => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return habit.completions[dateStr];
  };

  const shouldCompleteToday = (habit: Habit): boolean => {
    const today = new Date();
    const dayOfWeek = format(today, 'EEEE').toLowerCase();
    
    switch (habit.frequency) {
      case 'daily':
        return true;
      case 'weekly':
        return habit.weekDays?.includes(dayOfWeek as any) || false;
      case 'monthly':
        const dayOfMonth = today.getDate();
        return habit.monthDays?.includes(dayOfMonth) || false;
      case 'custom':
        return true;
      default:
        return false;
    }
  };
  
  const getCompletionStatus = () => {
    const today = new Date();
    
    let completed = 0;
    let total = 0;
    
    habits.forEach(habit => {
      if (shouldCompleteToday(habit)) {
        total++;
        if (isHabitCompletedForDate(habit, today)) {
          completed++;
        }
      }
    });
    
    return { completed, total };
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleCompletion,
        getHabitsByCategory,
        isHabitCompletedForDate,
        getHabitCompletion,
        shouldCompleteToday,
        getCompletionStatus,
        loading,
        error
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};

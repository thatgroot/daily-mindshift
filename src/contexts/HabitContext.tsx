
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Habit, HabitCompletion } from '@/types/habit';
import { toast } from '@/hooks/use-toast';
import { format, isToday, parseISO, startOfDay } from 'date-fns';

// Sample initial habits data
const initialHabits: Habit[] = [
  {
    id: '1',
    name: 'Morning Meditation',
    description: 'Meditate for 10 minutes in the morning',
    icon: 'brain',
    color: 'bg-purple-200 dark:bg-purple-900',
    frequency: 'daily',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    completions: {
      [format(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')]: {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completed: true,
      },
      [format(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')]: {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        completed: true,
      },
    },
    streak: 2,
    bestStreak: 7,
    totalCompletions: 12,
    reminder: '08:00',
    category: 'Wellness',
  },
  {
    id: '2',
    name: 'Read for 30 minutes',
    description: 'Read a non-fiction book',
    icon: 'book-open',
    color: 'bg-blue-200 dark:bg-blue-900',
    frequency: 'daily',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    completions: {
      [format(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')]: {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        completed: true,
      },
      [format(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')]: {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completed: true,
      },
    },
    streak: 0,
    bestStreak: 5,
    totalCompletions: 15,
    category: 'Learning',
  },
  {
    id: '3',
    name: 'Exercise',
    description: 'Go for a run or workout for 30 minutes',
    icon: 'dumbbell',
    color: 'bg-green-200 dark:bg-green-900',
    frequency: 'weekly',
    weekDays: ['monday', 'wednesday', 'friday'],
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    completions: {
      [format(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')]: {
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        completed: true,
      },
      [format(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')]: {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        completed: true,
      },
    },
    streak: 2,
    bestStreak: 8,
    totalCompletions: 25,
    reminder: '17:00',
    category: 'Fitness',
  },
  {
    id: '4',
    name: 'Drink 8 glasses of water',
    description: 'Stay hydrated throughout the day',
    icon: 'droplet',
    color: 'bg-cyan-200 dark:bg-cyan-900',
    frequency: 'daily',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    completions: {
      [format(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')]: {
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        completed: true,
      },
      [format(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')]: {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completed: true,
      },
      [format(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')]: {
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        completed: true,
      },
    },
    streak: 3,
    bestStreak: 10,
    totalCompletions: 30,
    category: 'Health',
  },
];

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
}

export const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : initialHabits;
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (newHabit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'completions' | 'streak' | 'bestStreak' | 'totalCompletions'>) => {
    const now = new Date().toISOString();
    const habit: Habit = {
      ...newHabit,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
      completions: {},
      streak: 0,
      bestStreak: 0,
      totalCompletions: 0,
    };
    
    setHabits((prevHabits) => [...prevHabits, habit]);
    toast({
      title: "Habit created",
      description: `${habit.name} has been added to your habits.`,
    });
  };

  const updateHabit = (updatedHabit: Habit) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) =>
        habit.id === updatedHabit.id
          ? { ...updatedHabit, updatedAt: new Date().toISOString() }
          : habit
      )
    );
    toast({
      title: "Habit updated",
      description: `${updatedHabit.name} has been updated.`,
    });
  };

  const deleteHabit = (id: string) => {
    const habitName = habits.find(h => h.id === id)?.name;
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
    toast({
      title: "Habit deleted",
      description: habitName ? `${habitName} has been removed.` : "Habit has been removed.",
      variant: "destructive",
    });
  };

  const calculateStreak = (completions: Record<string, HabitCompletion>, frequency: string): number => {
    if (Object.keys(completions).length === 0) return 0;
    
    // For simple demo, just returning the current streak value
    // In a real app, this would calculate based on completion dates and frequency
    return Object.keys(completions).length;
  };

  const toggleCompletion = (id: string, date: Date, notes?: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    
    setHabits((prevHabits) =>
      prevHabits.map((habit) => {
        if (habit.id !== id) return habit;
        
        const newCompletions = { ...habit.completions };
        
        if (newCompletions[dateStr]?.completed) {
          delete newCompletions[dateStr];
          
          return {
            ...habit,
            completions: newCompletions,
            streak: Math.max(0, habit.streak - (isToday(date) ? 1 : 0)),
            totalCompletions: Math.max(0, habit.totalCompletions - 1),
            updatedAt: new Date().toISOString(),
          };
        } else {
          newCompletions[dateStr] = {
            date: date.toISOString(),
            completed: true,
            notes,
          };
          
          const newStreak = habit.streak + (isToday(date) ? 1 : 0);
          
          return {
            ...habit,
            completions: newCompletions,
            streak: newStreak,
            bestStreak: Math.max(habit.bestStreak, newStreak),
            totalCompletions: habit.totalCompletions + 1,
            updatedAt: new Date().toISOString(),
          };
        }
      })
    );
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
        // For demo purposes, always return true for custom
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

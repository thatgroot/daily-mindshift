
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Home, Calendar, BarChart3, Settings, X, PlusCircle } from 'lucide-react';
import { useHabits } from '@/contexts/HabitContext';
import { useLocation, Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { habits } = useHabits();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // If not mounted yet (SSR), don't render
  if (!mounted) return null;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/30 z-40 transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed top-0 left-0 bottom-0 w-64 bg-background border-r z-50 transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <span className="font-semibold text-lg">Daily Routines</span>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="py-4 px-2">
          <div className="mb-6">
            <Button asChild variant="outline" className="w-full justify-start rounded-lg">
              <Link to="/new-habit" className="flex items-center">
                <PlusCircle className="mr-2 h-5 w-5" />
                New Habit
              </Link>
            </Button>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm rounded-lg transition-colors',
                    isActive 
                      ? 'bg-accent text-accent-foreground font-medium' 
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-8 px-3">
            <div className="text-xs font-medium text-muted-foreground mb-2">HABITS</div>
            <div className="space-y-1">
              {habits.slice(0, 5).map((habit) => (
                <div 
                  key={habit.id}
                  className="flex items-center px-3 py-2 text-sm rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors cursor-pointer"
                >
                  <div className={cn("w-2 h-2 rounded-full mr-3", habit.color || "bg-accent")} />
                  <span className="truncate">{habit.name}</span>
                </div>
              ))}
              {habits.length > 5 && (
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 text-sm rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-colors"
                >
                  <span className="truncate">View all habits...</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

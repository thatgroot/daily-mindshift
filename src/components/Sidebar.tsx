
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Calendar,
  BarChart,
  Settings,
  X,
  PlusCircle,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const links = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/calendar', icon: Calendar, label: 'Calendar' },
    { href: '/analytics', icon: BarChart, label: 'Analytics' },
    { href: '/settings', icon: Settings, label: 'Settings' },
    { href: '/docs', icon: FileText, label: 'Documentation' },
  ];
  
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 border-r bg-background p-6 shadow-lg transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Daily Routines</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="space-y-1.5">
            {links.map((link) => (
              <Link key={link.href} to={link.href}>
                <Button
                  variant={location.pathname === link.href ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 rounded-lg text-base h-auto py-3 px-4',
                    location.pathname === link.href && 'font-medium'
                  )}
                  onClick={onClose}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
          
          <div className="mt-6 border-t pt-6">
            <Link to="/new-habit">
              <Button
                className="w-full justify-start gap-3 rounded-lg"
                onClick={onClose}
              >
                <PlusCircle className="h-5 w-5" />
                New Habit
              </Button>
            </Link>
          </div>
          
          <div className="mt-auto">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="font-medium mb-2">Quick Tips</h3>
              <p className="text-sm text-muted-foreground">
                Start small with 1-3 habits and be consistent. Check your stats regularly to stay motivated.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

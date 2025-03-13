
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModeToggle } from './ModeToggle';
import { Bell, Menu, Calendar, PieChart, Settings, Home, BarChart3, Plus, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import Sidebar from './Sidebar';
import NotificationCenter from './NotificationCenter';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  const navigationItems = [
    { icon: Home, label: 'Today', path: '/' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-background dark:bg-gradient-to-br dark:from-gray-950 dark:via-gray-900 dark:to-gray-850 animate-fade-in">
      <header className="border-b backdrop-blur-md sticky top-0 z-40 bg-background/95 dark:bg-black/50 dark:border-gray-800/70 shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-accent/10"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">EVO<span className="text-black dark:text-white">DAY</span></span>
          </div>
          
          {/* Central action button */}
          <Button 
            onClick={() => navigate('/new-habit')}
            className="absolute left-1/2 transform -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Habit
          </Button>
          
          <div className="flex items-center justify-end space-x-2">
            <NotificationCenter />
            <ModeToggle />
          </div>
        </div>
      </header>
      
      <Sidebar open={sidebarOpen} onOpenChange={closeSidebar} />
      
      <main className="flex-1 transition-all duration-200 ease-in-out relative pt-2 pb-16 md:pb-6">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-accent/3 to-purple-500/5 dark:from-primary/10 dark:via-accent/5 dark:to-purple-500/10 pointer-events-none" aria-hidden="true"></div>
        <div className="container py-4 md:py-6 max-w-6xl relative z-10">
          {children}
        </div>
      </main>
      
      {/* Fixed Bottom Navigation for Mobile */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-md z-50 py-2 dark:bg-gray-900/80 dark:border-gray-800/70 shadow-lg">
          <div className="flex justify-around items-center">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path}
                  className={cn(
                    "flex flex-col items-center py-1 px-2 rounded-xl transition-all",
                    isActive 
                      ? "text-blue-500 font-medium bg-blue-50/50 dark:bg-blue-950/30" 
                      : "text-muted-foreground hover:bg-gray-100/50 dark:hover:bg-gray-800/30"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 mb-1",
                    isActive ? "fill-blue-500/20" : "" 
                  )} />
                  <span className="text-xs">{item.label}</span>
                  
                  {isActive && (
                    <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-blue-500 rounded-full" />
                  )}
                </Link>
              );
            })}
            
            <Button 
              onClick={() => navigate('/new-habit')}
              size="sm"
              className="flex flex-col items-center py-1 px-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl shadow-md"
            >
              <Plus className="h-5 w-5 mb-1" />
              <span className="text-xs">Add</span>
            </Button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;

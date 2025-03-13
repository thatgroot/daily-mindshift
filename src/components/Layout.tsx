
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModeToggle } from './ModeToggle';
import { Bell, Menu, Calendar, PieChart, Settings, Home, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import Sidebar from './Sidebar';
import NotificationCenter from './NotificationCenter';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
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
        <div className="container flex h-16 items-center">
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
          
          <div className="flex-1 flex items-center justify-end space-x-2">
            <NotificationCenter />
            <ModeToggle />
          </div>
        </div>
      </header>
      
      <Sidebar open={sidebarOpen} onOpenChange={closeSidebar} />
      
      <main className="flex-1 transition-all duration-200 ease-in-out relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-accent/3 to-purple-500/5 dark:from-primary/10 dark:via-accent/5 dark:to-purple-500/10 pointer-events-none" aria-hidden="true"></div>
        <div className="container py-6 md:py-8 max-w-6xl relative z-10">
          {children}
        </div>
      </main>
      
      {/* Fixed Bottom Navigation for Mobile */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur-md z-50 py-1 dark:bg-gray-900/80 dark:border-gray-800/70">
          <div className="flex justify-around items-center">
            {navigationItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex flex-col items-center py-1 px-3 text-xs ${
                  location.pathname === item.path 
                    ? 'text-blue-500 font-medium' 
                    : 'text-muted-foreground'
                }`}
              >
                <item.icon className="h-5 w-5 mb-1" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;

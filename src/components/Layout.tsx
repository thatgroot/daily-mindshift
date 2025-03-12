
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModeToggle } from './ModeToggle';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';
import Sidebar from './Sidebar';
import NotificationCenter from './NotificationCenter';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-transparent animate-fade-in">
      <header className="border-b supports-backdrop-blur:bg-background/60 sticky top-0 z-40 bg-background/95 backdrop-blur shadow-sm">
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
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Daily Routines</span>
          </div>
          
          <div className="flex-1 flex items-center justify-end space-x-2">
            <NotificationCenter />
            <ModeToggle />
          </div>
        </div>
      </header>
      
      <Sidebar open={sidebarOpen} onOpenChange={closeSidebar} />
      
      <main className="flex-1">
        <div className="container py-6 md:py-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

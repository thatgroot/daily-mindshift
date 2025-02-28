
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModeToggle } from './ModeToggle';
import { Menu } from 'lucide-react';
import { Button } from './ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col bg-background animate-fade-in">
      <header className="border-b supports-backdrop-blur:bg-background/60 sticky top-0 z-40 bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="rounded-full lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-bold text-xl tracking-tight">Daily Routines</span>
          </div>
          
          <div className="flex-1 flex items-center justify-end space-x-2">
            <ModeToggle />
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <div className="container py-6 md:py-8 max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

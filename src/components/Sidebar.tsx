
import React from 'react';
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import {
  ScrollArea
} from "@/components/ui/scroll-area"
import {
  Home,
  Calendar,
  BarChart3,
  Settings,
  Book,
} from "lucide-react"
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ModeToggle } from './ModeToggle';
import { Button } from './ui/button';

interface SidebarProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SIDEBAR_LINKS = [
  {
    href: "/",
    icon: <Home className="h-4 w-4" />,
    label: "Dashboard",
  },
  {
    href: "/calendar",
    icon: <Calendar className="h-4 w-4" />,
    label: "Calendar",
  },
  {
    href: "/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    label: "Analytics",
  },
  {
    href: "/settings",
    icon: <Settings className="h-4 w-4" />,
    label: "Settings",
  },
  {
    href: "/docs",
    icon: <Book className="h-4 w-4" />,
    label: "Docs",
  },
];

import { useAuth } from '@/contexts/AuthContext';
import { LogOut } from 'lucide-react';

const Sidebar = ({ open, onOpenChange }: SidebarProps) => {
  const { signOut } = useAuth();
  const location = useLocation();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Daily Boost</h2>
            <p className="text-sm text-muted-foreground">Track your habits</p>
          </div>

          <ScrollArea className="flex-1 p-4">
            <nav className="grid gap-2">
              {SIDEBAR_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => onOpenChange?.(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors",
                    location.pathname === link.href && "bg-accent/50 font-medium"
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t mt-auto">
            <Button 
              variant="outline" 
              className="w-full justify-start flex gap-2"
              onClick={async () => {
                await signOut();
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
            <div className="mt-4 flex items-center justify-between">
              <ModeToggle />
              <p className="text-xs text-muted-foreground">v1.0.0</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;

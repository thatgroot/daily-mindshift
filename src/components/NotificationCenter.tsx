
import React, { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, Calendar, Award, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useHabits } from '@/contexts/HabitContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'completion' | 'streak' | 'reminder' | 'tip';
  icon: React.ReactNode;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const { habits } = useHabits();

  // Generate mock notifications based on actual habits
  useEffect(() => {
    if (habits.length > 0) {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          title: 'Habit Completed',
          message: `You've completed "${habits[0]?.name || 'your habit'}" today!`,
          timestamp: new Date(),
          read: false,
          type: 'completion',
          icon: <CheckCircle className="h-4 w-4 text-green-500" />
        },
        {
          id: '2',
          title: 'New Streak Milestone',
          message: `You're on a 7-day streak for "${habits[0]?.name || 'your habit'}"! Keep it up!`,
          timestamp: new Date(Date.now() - 86400000),
          read: false,
          type: 'streak',
          icon: <Award className="h-4 w-4 text-amber-500" />
        },
        {
          id: '3',
          title: 'Daily Summary',
          message: `You've completed 3 out of 5 habits scheduled for yesterday.`,
          timestamp: new Date(Date.now() - 172800000),
          read: true,
          type: 'reminder',
          icon: <Calendar className="h-4 w-4 text-blue-500" />
        },
        {
          id: '4',
          title: 'Habit Formation Tip',
          message: 'Try habit stacking: link a new habit to an existing one to increase success!',
          timestamp: new Date(Date.now() - 259200000),
          read: true,
          type: 'tip',
          icon: <BookOpen className="h-4 w-4 text-purple-500" />
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    }
  }, [habits]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const removeNotification = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(notifications.filter(n => n.id !== id));
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Notifications</CardTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </CardHeader>
        {notifications.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="flex flex-col gap-2 p-4 pt-0">
              {notifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={cn(
                    "relative",
                    !notification.read && "bg-muted/40"
                  )}
                >
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-6 w-6" 
                    onClick={() => removeNotification(notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="mt-0.5">
                        {notification.icon}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{notification.title}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(notification.timestamp, 'PPp')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  {!notification.read && (
                    <CardFooter className="pt-0 pb-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full text-xs"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <CardContent className="py-6">
            <div className="flex flex-col items-center justify-center text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground font-medium mb-1">All caught up!</p>
              <p className="text-sm text-muted-foreground">You have no new notifications.</p>
            </div>
          </CardContent>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;

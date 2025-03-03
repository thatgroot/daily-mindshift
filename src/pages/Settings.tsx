
import React from 'react';
import Layout from '@/components/Layout';
import { HabitProvider } from '@/contexts/HabitContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings as SettingsIcon, Bell, Moon, Calendar, Upload, Download, Trash2, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import ProfileCustomization from '@/components/ProfileCustomization';
import ProgressSnapshot from '@/components/ProgressSnapshot';

const Settings = () => {
  const [darkMode, setDarkMode] = React.useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleExportData = () => {
    const habitsData = localStorage.getItem('habits');
    if (habitsData) {
      const blob = new Blob([habitsData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daily-routines-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Your data has been exported successfully.",
      });
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          JSON.parse(content); // Validate JSON
          localStorage.setItem('habits', content);
          toast({
            title: "Import Successful",
            description: "Your data has been imported. Please reload the page to see changes.",
          });
          // In a real app, we would reload the data without refreshing
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "The selected file contains invalid data.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Customize your Daily Routines experience</p>
        </div>
        <ProgressSnapshot />
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" /> General Settings
              </CardTitle>
              <CardDescription>
                Customize the general appearance and behavior of the app.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch between light and dark themes
                  </p>
                </div>
                <Switch 
                  id="dark-mode" 
                  checked={darkMode} 
                  onCheckedChange={toggleDarkMode} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="start-day">First Day of Week</Label>
                <Select defaultValue="monday">
                  <SelectTrigger id="start-day" className="w-full">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time-format">Time Format</Label>
                <Select defaultValue="24h">
                  <SelectTrigger id="time-format" className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                    <SelectItem value="24h">24-hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Calendar Settings
              </CardTitle>
              <CardDescription>
                Configure how the calendar displays your habits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="completed-visible">Show Completed Habits</Label>
                  <p className="text-sm text-muted-foreground">
                    Display completed habits in calendar view
                  </p>
                </div>
                <Switch id="completed-visible" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="past-days">Show Past Days</Label>
                  <p className="text-sm text-muted-foreground">
                    Display habits for past dates
                  </p>
                </div>
                <Switch id="past-days" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Profile Settings
              </CardTitle>
              <CardDescription>
                Customize your profile and appearance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileCustomization />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" /> Notification Preferences
              </CardTitle>
              <CardDescription>
                Manage how and when you receive reminders for your habits.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders for your habits
                  </p>
                </div>
                <Switch id="enable-notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="daily-summary">Daily Summary</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a daily summary of your habits
                  </p>
                </div>
                <Switch id="daily-summary" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="summary-time">Summary Time</Label>
                <Input id="summary-time" type="time" defaultValue="20:00" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" /> Import & Export
              </CardTitle>
              <CardDescription>
                Backup and restore your habit data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Export Data</Label>
                <p className="text-sm text-muted-foreground">
                  Download a backup of all your habits and progress
                </p>
                <Button 
                  className="flex items-center gap-2"
                  onClick={handleExportData}
                >
                  <Download className="h-4 w-4" /> Export Data
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="import-file">Import Data</Label>
                <p className="text-sm text-muted-foreground">
                  Restore habits from a previous backup
                </p>
                <div className="flex items-center gap-2">
                  <Input 
                    id="import-file" 
                    type="file" 
                    accept=".json" 
                    onChange={handleImportData}
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" /> Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible actions that affect your data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Reset All Data</Label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete all your habits and progress. This cannot be undone.
                </p>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" /> Reset All Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const SettingsPage = () => {
  return (
    <HabitProvider>
      <Layout>
        <Settings />
      </Layout>
    </HabitProvider>
  );
};

export default SettingsPage;

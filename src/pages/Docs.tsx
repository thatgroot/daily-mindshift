
import React from 'react';
import Layout from '@/components/Layout';
import { HabitProvider } from '@/contexts/HabitContext';

const Docs = () => {
  return (
    <HabitProvider>
      <Layout>
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Documentation</h1>
            <p className="text-muted-foreground mt-1">Learn how to use Daily Routines effectively</p>
          </div>
          
          <div className="space-y-8">
            <section className="space-y-3">
              <h2 className="text-2xl font-medium">Getting Started</h2>
              <p>
                Daily Routines is a habit tracking application designed to help you build and maintain positive habits. 
                This documentation will guide you through the features and functionality of the application.
              </p>
            </section>
            
            <section className="space-y-3">
              <h2 className="text-2xl font-medium">Creating a Habit</h2>
              <p>
                To create a new habit, click on the "+ New Habit" button on the dashboard or navigate to the New Habit page.
                Fill in the details for your habit:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Name:</strong> What habit do you want to track?</li>
                <li><strong>Description:</strong> Optional details about your habit</li>
                <li><strong>Frequency:</strong> How often do you want to practice this habit?</li>
                <li><strong>Category:</strong> Organize your habits by category</li>
                <li><strong>Reminder:</strong> Set a time to be reminded</li>
                <li><strong>Color:</strong> Choose a color for visual organization</li>
              </ul>
            </section>
            
            <section className="space-y-3">
              <h2 className="text-2xl font-medium">Tracking Habits</h2>
              <p>
                On the dashboard, you'll see all your habits organized by category. To mark a habit as completed:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Click the circle next to the habit name</li>
                <li>The habit will be marked as completed for the current day</li>
                <li>Your streak and statistics will update automatically</li>
              </ul>
            </section>
            
            <section className="space-y-3">
              <h2 className="text-2xl font-medium">Analytics</h2>
              <p>
                The Analytics page provides insights into your habit performance:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Overall Completion Rate:</strong> Your average completion rate across all habits</li>
                <li><strong>Best Streak:</strong> Your longest streak of consecutive completions</li>
                <li><strong>Total Completions:</strong> The total number of habit completions</li>
                <li><strong>Category Distribution:</strong> How your habits are distributed across categories</li>
                <li><strong>7-Day Trend:</strong> Your completion trend over the past week</li>
                <li><strong>Habit Performance:</strong> Individual habit statistics</li>
              </ul>
            </section>
            
            <section className="space-y-3">
              <h2 className="text-2xl font-medium">Calendar View</h2>
              <p>
                The Calendar page shows your habits organized by date:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Navigate between weeks using the arrows</li>
                <li>See which habits are scheduled for each day</li>
                <li>View completion status for each habit</li>
              </ul>
            </section>
            
            <section className="space-y-3">
              <h2 className="text-2xl font-medium">Settings</h2>
              <p>
                In the Settings page, you can customize your experience:
              </p>
              <ul className="list-disc ml-6 space-y-2">
                <li><strong>Profile:</strong> Update your display name, bio, and profile image</li>
                <li><strong>Theme:</strong> Choose between light and dark theme</li>
                <li><strong>Progress Snapshot:</strong> Generate and share visual summaries of your habit progress</li>
                <li><strong>Account:</strong> Manage your account settings</li>
              </ul>
            </section>
          </div>
        </div>
      </Layout>
    </HabitProvider>
  );
};

export default Docs;

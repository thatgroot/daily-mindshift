
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGoals } from '@/contexts/GoalContext';

const Goals = () => {
  const { goals } = useGoals();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Goals</h1>
            <p className="text-muted-foreground mt-1">Set and track your personal goals</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Goals Feature Coming Soon</CardTitle>
            <CardDescription>
              This section will allow you to create and track personal goals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                We're building a goal tracking system where you can:
              </p>
              <ul className="list-disc list-inside mt-4 text-left max-w-md mx-auto space-y-2">
                <li>Set specific, measurable goals</li>
                <li>Link habits to goals to track progress</li>
                <li>View goal completion statistics</li>
                <li>Set target dates and milestones</li>
                <li>Celebrate achievements when goals are completed</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Goals;


import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Community = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Community</h1>
            <p className="text-muted-foreground mt-1">Connect with others, share progress, and join challenges</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Community Features Coming Soon</CardTitle>
            <CardDescription>
              This section will include social feed, leaderboards, groups, and challenges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                We're working on building a community platform where you can:
              </p>
              <ul className="list-disc list-inside mt-4 text-left max-w-md mx-auto space-y-2">
                <li>Share your habit progress and achievements</li>
                <li>Join groups focused on specific habit categories</li>
                <li>Participate in challenges with start/end dates</li>
                <li>Connect with like-minded individuals</li>
                <li>View leaderboards based on streaks and consistency</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Community;

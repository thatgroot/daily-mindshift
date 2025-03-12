
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Profile = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your profile and connections</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="md:col-span-1">
            <CardContent className="pt-6 text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src="" alt={user?.email ?? "User"} />
                <AvatarFallback className="text-xl">
                  {user?.email?.[0].toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-medium mt-4">{user?.email ?? "User"}</h2>
              <p className="text-muted-foreground text-sm mt-1">Member since {user?.user_metadata?.created_at ? new Date(user.user_metadata.created_at).toLocaleDateString() : "N/A"}</p>
            </CardContent>
          </Card>
          
          <div className="md:col-span-3">
            <Tabs defaultValue="info">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="connections">Connections</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Basic details about your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        Profile customization coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="goals">
                <Card>
                  <CardHeader>
                    <CardTitle>Goals</CardTitle>
                    <CardDescription>
                      Track your personal goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        Goal setting and tracking coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="stats">
                <Card>
                  <CardHeader>
                    <CardTitle>Stats</CardTitle>
                    <CardDescription>
                      Your habit statistics and progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        Detailed statistics coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="connections">
                <Card>
                  <CardHeader>
                    <CardTitle>Connections</CardTitle>
                    <CardDescription>
                      Manage your connections
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        Connection management coming soon
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;

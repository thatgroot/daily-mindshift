
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Camera, 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Palette, 
  Award,
  Calendar,
  CheckCircle2,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoalsSection from "./GoalsSection";

const themes = [
  { name: "Default", color: "bg-background" },
  { name: "Purple", color: "bg-purple-100 dark:bg-purple-900" },
  { name: "Blue", color: "bg-blue-100 dark:bg-blue-900" },
  { name: "Green", color: "bg-green-100 dark:bg-green-900" },
  { name: "Orange", color: "bg-orange-100 dark:bg-orange-900" },
  { name: "Pink", color: "bg-pink-100 dark:bg-pink-900" },
];

const ProfileCustomization = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.email?.split('@')[0] || "");
  const [bio, setBio] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("Default");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [location, setLocation] = useState("San Francisco, CA");
  const [website, setWebsite] = useState("https://example.com");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch user profile data from Supabase
  useEffect(() => {
    if (user) {
      fetchProfileData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('display_name, bio, theme, profile_image, location, website')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } else if (data) {
        setDisplayName(data.display_name || user?.email?.split('@')[0] || "");
        setBio(data.bio || "");
        setSelectedTheme(data.theme || "Default");
        setProfileImage(data.profile_image || null);
        setLocation(data.location || "San Francisco, CA");
        setWebsite(data.website || "https://example.com");
        
        // Apply theme immediately on load
        document.documentElement.setAttribute('data-theme', data.theme?.toLowerCase() || 'default');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    try {
      setLoading(true);
      
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile_images')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicUrl } = supabase.storage
        .from('profile_images')
        .getPublicUrl(filePath);
      
      if (publicUrl) {
        setProfileImage(publicUrl.publicUrl);
      }
      
      toast({
        title: "Image Uploaded",
        description: "Profile image has been updated.",
      });
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload profile image.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your profile settings.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const profileData = {
        user_id: user.id,
        display_name: displayName,
        bio,
        theme: selectedTheme,
        profile_image: profileImage,
        location,
        website
      };
      
      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileData, { 
          onConflict: 'user_id',
          ignoreDuplicates: false 
        });
      
      if (error) throw error;
      
      // Apply theme immediately
      document.documentElement.setAttribute('data-theme', selectedTheme.toLowerCase());
      
      // Save to localStorage as fallback for the client-side theme application
      localStorage.setItem('userProfile', JSON.stringify({
        displayName,
        bio,
        theme: selectedTheme,
        profileImage,
        location,
        website
      }));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated!",
      });
      
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const ProfileView = () => (
    <Card className="bg-card/70 backdrop-blur-sm border-border/40 shadow-md">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Manage your personal details and profile information.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <Avatar className="h-32 w-32 border-2 border-primary/20">
              <AvatarImage src={profileImage || ""} alt={displayName} />
              <AvatarFallback className="text-4xl bg-primary/10">
                {displayName ? displayName.charAt(0).toUpperCase() : <User className="h-16 w-16 text-muted-foreground" />}
              </AvatarFallback>
            </Avatar>
          </div>

          <h2 className="text-2xl font-bold mb-1">{displayName}</h2>
          <p className="text-muted-foreground mb-2">{user?.email}</p>
          <p className="text-muted-foreground">{location}</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            <Label className="text-muted-foreground">Full Name</Label>
            <p className="font-medium text-lg">{displayName}</p>
          </div>
          
          <div className="space-y-1">
            <Label className="text-muted-foreground">Email Address</Label>
            <p className="font-medium flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {user?.email}</p>
          </div>
          
          <div className="space-y-1">
            <Label className="text-muted-foreground">Bio</Label>
            <p>{bio || "Passionate about self-improvement and habit formation. On a journey to build better habits and a better life."}</p>
          </div>
          
          <div className="space-y-1">
            <Label className="text-muted-foreground">Location</Label>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {location}</p>
          </div>
          
          <div className="space-y-1">
            <Label className="text-muted-foreground">Website</Label>
            <p className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> {website}</p>
          </div>
          
          <div className="flex justify-between pt-4 border-t border-border/60">
            <div>
              <p className="text-sm text-muted-foreground">Member since</p>
              <p className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-primary" /> 
                {format(new Date(user?.created_at || Date.now()), "MMMM d, yyyy")}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Theme</p>
              <p className="flex items-center gap-2 mt-1">
                <Palette className="h-4 w-4 text-primary" /> 
                {selectedTheme}
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => setActiveTab('edit')}
            className="w-full mt-4"
          >
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const EditProfileView = () => (
    <Card className="bg-card/70 backdrop-blur-sm border-border/40 shadow-md">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>Update your profile details and preferences.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImage || ""} alt={displayName} />
              <AvatarFallback className="text-2xl bg-primary/10">
                {displayName ? displayName.charAt(0).toUpperCase() : <User />}
              </AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0">
              <Label htmlFor="picture" className="cursor-pointer">
                <div className="rounded-full bg-primary p-2 text-primary-foreground">
                  <Camera className="h-4 w-4" />
                </div>
              </Label>
              <Input 
                id="picture" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input 
              id="displayName" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="resize-none"
              rows={3}
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input 
              id="website" 
              value={website} 
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://your-website.com"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-3">
            <Label>Profile Theme</Label>
            <RadioGroup 
              value={selectedTheme} 
              onValueChange={setSelectedTheme} 
              className="grid grid-cols-3 gap-2"
              disabled={loading}
            >
              {themes.map((theme) => (
                <div key={theme.name} className="flex items-center space-x-2">
                  <RadioGroupItem value={theme.name} id={`theme-${theme.name}`} />
                  <Label htmlFor={`theme-${theme.name}`} className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-6 h-6 rounded-full ${theme.color}`} />
                    {theme.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          
          <div className="flex gap-3 pt-6">
            <Button 
              variant="outline"
              onClick={() => setActiveTab('profile')} 
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={saveProfile} 
              className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const StatsAndAchievements = () => (
    <Card className="bg-card/70 backdrop-blur-sm border-border/40 shadow-md">
      <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Stats & Achievements
        </CardTitle>
        <CardDescription>View your progress and milestones.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-primary/5 rounded-lg p-4 text-center">
            <p className="text-muted-foreground text-sm">Total Habits</p>
            <p className="text-3xl font-bold">8</p>
          </div>
          <div className="bg-accent/5 rounded-lg p-4 text-center">
            <p className="text-muted-foreground text-sm">Completion Rate</p>
            <p className="text-3xl font-bold">87%</p>
          </div>
          <div className="bg-primary/5 rounded-lg p-4 text-center">
            <p className="text-muted-foreground text-sm">Longest Streak</p>
            <p className="text-3xl font-bold">42</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Recent Achievements
          </h3>
          
          <div className="space-y-3">
            {[
              { title: "Habit Master", description: "Complete all habits for 7 consecutive days", date: "Aug 28, 2023" },
              { title: "Early Bird", description: "Complete morning routine for 30 days", date: "Jul 15, 2023" },
              { title: "Consistency King", description: "Maintain a streak of 50+ days", date: "Jun 02, 2023" }
            ].map((achievement, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border/40">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="profile" className="data-[state=active]:bg-primary/10">
            Profile
          </TabsTrigger>
          <TabsTrigger value="edit" className="data-[state=active]:bg-primary/10">
            Edit Profile
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-primary/10">
            Stats
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileView />
        </TabsContent>
        
        <TabsContent value="edit">
          <EditProfileView />
        </TabsContent>
        
        <TabsContent value="stats" className="space-y-6">
          <StatsAndAchievements />
          <GoalsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileCustomization;

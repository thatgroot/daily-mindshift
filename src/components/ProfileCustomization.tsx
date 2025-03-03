
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Camera, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [loading, setLoading] = useState(true);

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
        .select('display_name, bio, theme, profile_image')
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
        profile_image: profileImage
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
        profileImage
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

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>
      
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
        
        <Button 
          onClick={saveProfile} 
          className="w-full mt-6"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
};

export default ProfileCustomization;

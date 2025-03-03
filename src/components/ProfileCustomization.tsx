
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    // In a real implementation, this would save to a backend
    localStorage.setItem('userProfile', JSON.stringify({
      displayName,
      bio,
      theme: selectedTheme,
      profileImage
    }));
    
    // Apply theme immediately
    document.documentElement.setAttribute('data-theme', selectedTheme.toLowerCase());
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated!",
    });
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
          />
        </div>
        
        <div className="space-y-3">
          <Label>Profile Theme</Label>
          <RadioGroup 
            value={selectedTheme} 
            onValueChange={setSelectedTheme} 
            className="grid grid-cols-3 gap-2"
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
        
        <Button onClick={saveProfile} className="w-full mt-6">
          Save Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileCustomization;

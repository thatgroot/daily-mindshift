
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function ModeToggle() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [theme, setThemeState] = React.useState<"theme-light" | "dark" | "system">("theme-light");

  React.useEffect(() => {
    // Try to load user's theme preference from Supabase first
    const fetchUserTheme = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('theme')
            .eq('user_id', user.id)
            .maybeSingle();
          
          if (error) {
            console.error('Error fetching user theme:', error);
            return;
          }
          
          if (data?.theme) {
            // Convert theme name to expected format
            const themeValue = data.theme.toLowerCase() === 'default' 
              ? 'theme-light' 
              : data.theme.toLowerCase() === 'dark' 
                ? 'dark' 
                : 'theme-light';
            
            setThemeState(themeValue as "theme-light" | "dark" | "system");
            return;
          }
        } catch (error) {
          console.error('Error fetching user theme:', error);
        }
      }
      
      // Fallback to checking current document state
      const isDarkMode = document.documentElement.classList.contains("dark");
      setThemeState(isDarkMode ? "dark" : "theme-light");
    };
    
    fetchUserTheme();
  }, [user]);

  React.useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    document.documentElement.classList[isDark ? "add" : "remove"]("dark");
    
    // When theme changes, update data-theme attribute for custom theming
    const dataTheme = theme === "dark" ? "dark" : "default";
    document.documentElement.setAttribute('data-theme', dataTheme);
    
    // If user is authenticated, save theme preference to Supabase
    const saveThemePreference = async () => {
      if (user) {
        try {
          const themeValue = theme === "dark" ? "Dark" : "Default";
          
          const { error } = await supabase
            .from('user_profiles')
            .upsert({ 
              user_id: user.id, 
              theme: themeValue 
            }, { 
              onConflict: 'user_id', 
              ignoreDuplicates: false 
            });
            
          if (error) {
            console.error('Error saving theme preference:', error);
          }
        } catch (error) {
          console.error('Error saving theme preference:', error);
        }
      }
    };
    
    saveThemePreference();
    
  }, [theme, user]);

  const setTheme = (newTheme: "theme-light" | "dark" | "system") => {
    setThemeState(newTheme);
    
    // Show toast notification for theme change
    const themeName = newTheme === "dark" ? "Dark" : "Light";
    toast({
      title: `${themeName} theme applied`,
      description: `The ${themeName.toLowerCase()} theme has been applied to your interface.`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme("theme-light")}
          className="flex gap-2 items-center"
        >
          <Sun className="h-4 w-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex gap-2 items-center"
        >
          <Moon className="h-4 w-4" /> Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

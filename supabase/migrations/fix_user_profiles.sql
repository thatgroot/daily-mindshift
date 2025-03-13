
-- Add missing columns to user_profiles table if they don't exist
DO $$
BEGIN
    -- Check if display_name column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'user_profiles' 
                   AND column_name = 'display_name') THEN
        ALTER TABLE public.user_profiles ADD COLUMN display_name TEXT;
    END IF;
    
    -- Check if bio column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'user_profiles' 
                  AND column_name = 'bio') THEN
        ALTER TABLE public.user_profiles ADD COLUMN bio TEXT;
    END IF;
    
    -- Check if theme column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'user_profiles' 
                  AND column_name = 'theme') THEN
        ALTER TABLE public.user_profiles ADD COLUMN theme TEXT;
    END IF;
    
    -- Check if profile_image column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'user_profiles' 
                  AND column_name = 'profile_image') THEN
        ALTER TABLE public.user_profiles ADD COLUMN profile_image TEXT;
    END IF;
    
    -- Check if location column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'user_profiles' 
                  AND column_name = 'location') THEN
        ALTER TABLE public.user_profiles ADD COLUMN location TEXT;
    END IF;
    
    -- Check if website column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'user_profiles' 
                  AND column_name = 'website') THEN
        ALTER TABLE public.user_profiles ADD COLUMN website TEXT;
    END IF;
END $$;

-- Create the user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    display_name TEXT,
    bio TEXT,
    theme TEXT,
    profile_image TEXT,
    location TEXT,
    website TEXT
);

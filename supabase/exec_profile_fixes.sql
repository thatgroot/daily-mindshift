
-- Add missing columns to user_profiles table
DO $$
BEGIN
    -- First check if the table exists, if not create it
    IF NOT EXISTS (SELECT FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = 'user_profiles') THEN
        CREATE TABLE public.user_profiles (
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
        
        -- Add RLS policies
        ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
        
        -- Policy for users to view their own profile
        CREATE POLICY "Users can view their own profile"
        ON public.user_profiles
        FOR SELECT
        USING (auth.uid() = id);
        
        -- Policy for users to update their own profile
        CREATE POLICY "Users can update their own profile"
        ON public.user_profiles
        FOR UPDATE
        USING (auth.uid() = id);
        
        -- Policy for users to insert their own profile
        CREATE POLICY "Users can insert their own profile"
        ON public.user_profiles
        FOR INSERT
        WITH CHECK (auth.uid() = id);
        
    ELSE
        -- Add columns if they don't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_profiles' 
                      AND column_name = 'display_name') THEN
            ALTER TABLE public.user_profiles ADD COLUMN display_name TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_profiles' 
                      AND column_name = 'bio') THEN
            ALTER TABLE public.user_profiles ADD COLUMN bio TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_profiles' 
                      AND column_name = 'theme') THEN
            ALTER TABLE public.user_profiles ADD COLUMN theme TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_profiles' 
                      AND column_name = 'profile_image') THEN
            ALTER TABLE public.user_profiles ADD COLUMN profile_image TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_profiles' 
                      AND column_name = 'location') THEN
            ALTER TABLE public.user_profiles ADD COLUMN location TEXT;
        END IF;
        
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_schema = 'public' 
                      AND table_name = 'user_profiles' 
                      AND column_name = 'website') THEN
            ALTER TABLE public.user_profiles ADD COLUMN website TEXT;
        END IF;
    END IF;
END $$;

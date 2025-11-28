-- Create classes table with unique code
CREATE TABLE public.classes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Add class_id to profiles table
ALTER TABLE public.profiles ADD COLUMN class_id UUID REFERENCES public.classes(id);

-- Create index on class code for faster lookups
CREATE INDEX idx_classes_code ON public.classes(code);

-- Function to generate unique class code
CREATE OR REPLACE FUNCTION public.generate_class_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate 6-character alphanumeric code
    new_code := UPPER(substring(md5(random()::text) from 1 for 6));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.classes WHERE code = new_code) INTO code_exists;
    
    -- Exit loop if code is unique
    IF NOT code_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN new_code;
END;
$$;

-- RLS Policies for classes
CREATE POLICY "Users can view their own class"
ON public.classes
FOR SELECT
USING (
  id IN (
    SELECT class_id FROM public.profiles WHERE id = auth.uid()
  )
);

CREATE POLICY "Admins can create classes"
ON public.classes
FOR INSERT
WITH CHECK (
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Update profiles RLS to consider class_id
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Admins can view profiles in their class"
ON public.profiles
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin'::app_role) 
  AND class_id IN (
    SELECT class_id FROM public.profiles WHERE id = auth.uid()
  )
);
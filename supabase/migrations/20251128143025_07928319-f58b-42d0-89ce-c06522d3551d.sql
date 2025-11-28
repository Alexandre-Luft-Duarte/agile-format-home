-- Create security definer function to get user's class_id
CREATE OR REPLACE FUNCTION public.get_user_class_id(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT class_id
  FROM public.profiles
  WHERE id = _user_id
$$;

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can view profiles in their class" ON public.profiles;

-- Recreate it using the security definer function
CREATE POLICY "Admins can view profiles in their class"
ON public.profiles
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) 
  AND class_id = public.get_user_class_id(auth.uid())
);
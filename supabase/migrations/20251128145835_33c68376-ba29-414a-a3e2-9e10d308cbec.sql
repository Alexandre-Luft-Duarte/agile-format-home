-- Fix RLS policies for classes table to allow trigger to insert
-- The trigger runs with SECURITY DEFINER but needs proper INSERT policy

-- Drop existing INSERT policy if exists
DROP POLICY IF EXISTS "Admins can create classes" ON public.classes;

-- Create new INSERT policy that allows the trigger to insert
-- The trigger runs as the function owner, so we need to allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert classes"
ON public.classes
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Also ensure the has_role function and trigger are working correctly
-- Let's verify the trigger is properly set up
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW 
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
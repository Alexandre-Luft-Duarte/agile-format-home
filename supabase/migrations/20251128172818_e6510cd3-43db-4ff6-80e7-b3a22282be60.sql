-- Allow anonymous (signup) users to search classes by code
DROP POLICY IF EXISTS "Anyone can search classes by code" ON public.classes;

CREATE POLICY "Anyone can search classes by code"
ON public.classes
FOR SELECT
TO public
USING (true);
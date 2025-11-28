-- Allow users to find classes by code during signup
CREATE POLICY "Anyone can search classes by code"
ON public.classes
FOR SELECT
TO authenticated
USING (true);
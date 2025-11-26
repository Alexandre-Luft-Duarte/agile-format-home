-- Allow admins to delete polls
CREATE POLICY "Admins can delete polls"
ON public.polls
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to create poll options
CREATE POLICY "Admins can create poll options"
ON public.poll_options
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to delete poll options
CREATE POLICY "Admins can delete poll options"
ON public.poll_options
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to increment vote count when a vote is cast
CREATE OR REPLACE FUNCTION increment_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE poll_options
  SET vote_count = vote_count + 1
  WHERE id = NEW.option_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically increment vote count
CREATE TRIGGER on_vote_cast
AFTER INSERT ON poll_votes
FOR EACH ROW
EXECUTE FUNCTION increment_vote_count();

-- Allow users to update poll options vote count (for the trigger)
CREATE POLICY "System can update vote counts"
ON public.poll_options
FOR UPDATE
TO authenticated
USING (true);
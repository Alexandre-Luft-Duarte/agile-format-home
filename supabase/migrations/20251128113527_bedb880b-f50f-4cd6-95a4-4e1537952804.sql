-- Allow admins to delete financial transactions
CREATE POLICY "Admins can delete transactions"
ON public.financial_transactions
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
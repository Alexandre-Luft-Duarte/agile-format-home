-- Allow students to update their own installments when paying
CREATE POLICY "Students can update their own installments"
ON public.student_installments
FOR UPDATE
TO authenticated
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

-- Allow students to create financial transactions when paying
CREATE POLICY "Students can create payment transactions"
ON public.financial_transactions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by AND type = 'income');
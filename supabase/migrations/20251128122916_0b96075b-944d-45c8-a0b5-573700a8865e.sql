-- Update handle_new_user trigger to handle class creation and assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
  new_class_id UUID;
BEGIN
  -- Get role from metadata, default to 'student'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student')::app_role;
  
  -- Check if admin is creating a new class
  IF user_role = 'admin' AND (NEW.raw_user_meta_data->>'create_class')::boolean = true THEN
    -- Create the new class
    INSERT INTO public.classes (name, code, created_by)
    VALUES (
      NEW.raw_user_meta_data->>'class_name',
      NEW.raw_user_meta_data->>'class_code',
      NEW.id
    )
    RETURNING id INTO new_class_id;
    
    -- Insert profile with class_id
    INSERT INTO public.profiles (id, full_name, class_id)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
      new_class_id
    );
  ELSE
    -- Insert profile with class_id from metadata
    INSERT INTO public.profiles (id, full_name, class_id)
    VALUES (
      NEW.id, 
      COALESCE(NEW.raw_user_meta_data->>'full_name', 'Usuário'),
      (NEW.raw_user_meta_data->>'class_id')::uuid
    );
  END IF;
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$;
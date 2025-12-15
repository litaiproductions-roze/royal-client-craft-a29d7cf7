-- Allow only admins to delete roles
CREATE POLICY "Only admins can delete roles" 
ON public.user_roles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow only admins to delete profiles
CREATE POLICY "Only admins can delete profiles" 
ON public.user_profiles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));
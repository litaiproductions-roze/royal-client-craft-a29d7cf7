-- Create trigger to validate admin assignment on the user_roles table
-- This ensures only litaiproductions@gmail.com can ever be assigned admin role
CREATE TRIGGER validate_admin_role_assignment
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_admin_assignment();
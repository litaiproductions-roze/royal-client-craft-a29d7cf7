
-- 1. Restrict user_profiles SELECT to authenticated users
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.user_profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (true);

-- 2. Add a hardened is_admin() function that reads auth.uid() internally
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'::public.app_role
  )
$$;

-- Restrict execution: only authenticated users may call it
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Also tighten has_role execution to authenticated only
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

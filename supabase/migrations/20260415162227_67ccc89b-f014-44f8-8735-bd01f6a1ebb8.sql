
-- Fix 1: Replace broken WITH CHECK on success_stories UPDATE policy
DROP POLICY "Users can update own stories" ON public.success_stories;

CREATE POLICY "Users can update own stories"
ON public.success_stories
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND likes_count = (SELECT s.likes_count FROM public.success_stories s WHERE s.id = success_stories.id)
  AND comments_count = (SELECT s.comments_count FROM public.success_stories s WHERE s.id = success_stories.id)
);

-- Fix 2: Restrict user_roles SELECT policies to authenticated only
DROP POLICY "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Drop the existing overly permissive UPDATE policy
DROP POLICY "Users can update own stories" ON public.success_stories;

-- Create a new UPDATE policy that prevents modifying likes_count and comments_count
-- We use a WITH CHECK that ensures these counters haven't been tampered with
CREATE POLICY "Users can update own stories" 
ON public.success_stories 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND likes_count = (SELECT likes_count FROM public.success_stories WHERE id = success_stories.id)
  AND comments_count = (SELECT comments_count FROM public.success_stories WHERE id = success_stories.id)
);
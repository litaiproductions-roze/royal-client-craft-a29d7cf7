-- 1) Deduplicate existing story_likes, then add UNIQUE constraint
DELETE FROM public.story_likes a
USING public.story_likes b
WHERE a.ctid < b.ctid
  AND a.story_id = b.story_id
  AND a.user_id = b.user_id;

ALTER TABLE public.story_likes
  ADD CONSTRAINT story_likes_story_user_unique UNIQUE (story_id, user_id);

-- Resync counts to match deduplicated state
UPDATE public.success_stories s
SET likes_count = COALESCE((
  SELECT COUNT(*) FROM public.story_likes l WHERE l.story_id = s.id
), 0);

-- 2) Tighten user_profiles SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.user_profiles;

CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Profiles of users who have public stories or comments are viewable (needed for community feed display)
CREATE POLICY "Public posters profiles viewable"
ON public.user_profiles
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (SELECT 1 FROM public.success_stories s WHERE s.user_id = user_profiles.user_id)
  OR EXISTS (SELECT 1 FROM public.story_comments c WHERE c.user_id = user_profiles.user_id)
);

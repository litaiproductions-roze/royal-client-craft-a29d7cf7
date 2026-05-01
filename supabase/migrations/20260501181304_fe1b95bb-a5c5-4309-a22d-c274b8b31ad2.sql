
-- Restrict INSERT on story_likes to authenticated only
DROP POLICY IF EXISTS "Authenticated users can like" ON public.story_likes;
CREATE POLICY "Authenticated users can like"
ON public.story_likes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove own likes" ON public.story_likes;
CREATE POLICY "Users can remove own likes"
ON public.story_likes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Also tighten story_comments INSERT/UPDATE/DELETE to authenticated
DROP POLICY IF EXISTS "Authenticated users can comment" ON public.story_comments;
CREATE POLICY "Authenticated users can comment"
ON public.story_comments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON public.story_comments;
CREATE POLICY "Users can update own comments"
ON public.story_comments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON public.story_comments;
CREATE POLICY "Users can delete own comments"
ON public.story_comments
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

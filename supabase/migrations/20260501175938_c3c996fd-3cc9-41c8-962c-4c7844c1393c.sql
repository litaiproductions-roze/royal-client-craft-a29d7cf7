-- Restrict story_likes SELECT to own user only (still allows count aggregations via triggers)
DROP POLICY IF EXISTS "Authenticated users can view likes" ON public.story_likes;

CREATE POLICY "Users can view own likes"
ON public.story_likes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Revoke EXECUTE on trigger-only SECURITY DEFINER functions from public/anon/authenticated
REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_admin_assignment() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_story_likes_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_story_comments_count() FROM PUBLIC, anon, authenticated;
DROP POLICY IF EXISTS "Anyone can log analytics events" ON public.analytics_events;
CREATE POLICY "Anyone can log analytics events"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    event_type IN ('page_view', 'link_click')
    AND (user_id IS NULL OR user_id = auth.uid())
    AND (path IS NULL OR char_length(path) <= 2000)
    AND (url IS NULL OR char_length(url) <= 2000)
    AND (label IS NULL OR char_length(label) <= 200)
    AND (referrer IS NULL OR char_length(referrer) <= 2000)
    AND (user_agent IS NULL OR char_length(user_agent) <= 1000)
    AND (session_id IS NULL OR char_length(session_id) <= 100)
  );
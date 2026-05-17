
-- Length constraints on analytics_events
ALTER TABLE public.analytics_events
  ADD CONSTRAINT analytics_path_len     CHECK (path IS NULL OR char_length(path) <= 2000),
  ADD CONSTRAINT analytics_url_len      CHECK (url IS NULL OR char_length(url) <= 2000),
  ADD CONSTRAINT analytics_label_len    CHECK (label IS NULL OR char_length(label) <= 200),
  ADD CONSTRAINT analytics_referrer_len CHECK (referrer IS NULL OR char_length(referrer) <= 2000),
  ADD CONSTRAINT analytics_ua_len       CHECK (user_agent IS NULL OR char_length(user_agent) <= 1000),
  ADD CONSTRAINT analytics_session_len  CHECK (session_id IS NULL OR char_length(session_id) <= 100),
  ADD CONSTRAINT analytics_event_type_allowed CHECK (event_type IN ('page_view','link_click'));

-- Tighten analytics insert RLS (replace WITH CHECK true)
DROP POLICY IF EXISTS "Anyone can log analytics events" ON public.analytics_events;
CREATE POLICY "Anyone can log analytics events"
  ON public.analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    event_type IN ('page_view','link_click')
    AND (path IS NULL OR char_length(path) <= 2000)
    AND (url IS NULL OR char_length(url) <= 2000)
    AND (label IS NULL OR char_length(label) <= 200)
    AND (referrer IS NULL OR char_length(referrer) <= 2000)
    AND (user_agent IS NULL OR char_length(user_agent) <= 1000)
    AND (session_id IS NULL OR char_length(session_id) <= 100)
  );

-- Success stories & comments size limits
ALTER TABLE public.success_stories
  ADD CONSTRAINT stories_title_len   CHECK (char_length(title) <= 200),
  ADD CONSTRAINT stories_content_len CHECK (char_length(content) <= 5000);

ALTER TABLE public.story_comments
  ADD CONSTRAINT comments_content_len CHECK (char_length(content) <= 2000);

ALTER TABLE public.user_profiles
  ADD CONSTRAINT profile_display_name_len CHECK (display_name IS NULL OR char_length(display_name) <= 100);

-- Persistent rate-limit table for contact form (IP hashed)
CREATE TABLE IF NOT EXISTS public.contact_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_contact_rate_limits_ip_time
  ON public.contact_rate_limits (ip_hash, created_at DESC);

ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages rate limits"
  ON public.contact_rate_limits
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can view rate limits"
  ON public.contact_rate_limits
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TABLE public.ai_assessment_leads (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL CHECK (char_length(name) <= 100),
  email text NOT NULL CHECK (char_length(email) <= 255),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 50),
  company text CHECK (company IS NULL OR char_length(company) <= 200),
  industry text CHECK (industry IS NULL OR char_length(industry) <= 100),
  team_size text CHECK (team_size IS NULL OR char_length(team_size) <= 50),
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  score integer NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  tier text NOT NULL DEFAULT 'Exploring' CHECK (char_length(tier) <= 50),
  recommendations jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','won','lost')),
  admin_notes text CHECK (admin_notes IS NULL OR char_length(admin_notes) <= 5000),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, UPDATE, DELETE ON public.ai_assessment_leads TO authenticated;
GRANT ALL ON public.ai_assessment_leads TO service_role;

ALTER TABLE public.ai_assessment_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view assessment leads"
  ON public.ai_assessment_leads FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update assessment leads"
  ON public.ai_assessment_leads FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete assessment leads"
  ON public.ai_assessment_leads FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Service role manages assessment leads"
  ON public.ai_assessment_leads FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE INDEX ai_assessment_leads_created_at_idx ON public.ai_assessment_leads (created_at DESC);
CREATE INDEX ai_assessment_leads_status_idx ON public.ai_assessment_leads (status);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_ai_assessment_leads_updated_at
  BEFORE UPDATE ON public.ai_assessment_leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
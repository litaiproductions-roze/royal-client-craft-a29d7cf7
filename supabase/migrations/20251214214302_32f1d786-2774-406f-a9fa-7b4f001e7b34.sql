-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create site_content table for about us and other editable content
CREATE TABLE public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    title TEXT,
    content TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Everyone can read site content
CREATE POLICY "Anyone can read site content"
ON public.site_content
FOR SELECT
USING (true);

-- Only admins can update site content
CREATE POLICY "Admins can update site content"
ON public.site_content
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert site content"
ON public.site_content
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create site_settings table for logo and other settings
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read site settings
CREATE POLICY "Anyone can read site settings"
ON public.site_settings
FOR SELECT
USING (true);

-- Only admins can update site settings
CREATE POLICY "Admins can update site settings"
ON public.site_settings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert site settings"
ON public.site_settings
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default content
INSERT INTO public.site_content (key, title, content) VALUES
('about_hero_title', 'About LIT Productions', 'Where passion meets precision. We''re not just web developers — we''re digital craftsmen dedicated to building your success.'),
('about_story', 'Our Story', 'LIT Productions was born from a simple belief: every brand deserves a website that truly shines. What started as a passion project has grown into a dedicated studio focused on delivering premium digital experiences.

We noticed that too many businesses settle for template-based, cookie-cutter websites that fail to capture their unique identity. That''s where we come in. We take the time to understand your story, your goals, and your vision — then we bring it all to life with pixel-perfect precision.

From personal portfolios and startup landing pages to full-scale enterprise solutions, we approach every project with the same level of care and dedication. Your success is our success, and we won''t rest until your website exceeds expectations.'),
('about_mission', 'Mission', 'To empower individuals and businesses with stunning, high-performance websites that drive success and leave lasting impressions in the digital world.'),
('about_vision', 'Vision', 'To become the go-to premium web design partner for brands seeking excellence, innovation, and a truly personalized digital experience.'),
('about_passion', 'Passion', 'We pour our hearts into every project, treating each website as a masterpiece that reflects both our client''s vision and our commitment to excellence.'),
('about_excellence', 'Excellence', 'We never settle for ordinary. Every line of code, every design element, and every interaction is crafted to exceed expectations.');

-- Create storage bucket for site assets
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true);

-- Storage policies
CREATE POLICY "Anyone can view site assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can upload site assets"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site assets"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete site assets"
ON storage.objects
FOR DELETE
USING (bucket_id = 'site-assets' AND public.has_role(auth.uid(), 'admin'));

-- Assign admin role to litaiproductions@gmail.com
-- First get the user id from auth.users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'litaiproductions@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
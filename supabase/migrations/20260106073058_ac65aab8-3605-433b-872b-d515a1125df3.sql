-- Add length constraints to success_stories table
ALTER TABLE public.success_stories
  ADD CONSTRAINT success_stories_title_length CHECK (char_length(title) <= 100 AND char_length(title) > 0),
  ADD CONSTRAINT success_stories_content_length CHECK (char_length(content) <= 2000 AND char_length(content) > 0);

-- Add length constraints to story_comments table
ALTER TABLE public.story_comments
  ADD CONSTRAINT story_comments_content_length CHECK (char_length(content) <= 1000 AND char_length(content) > 0);

-- Add length constraints to site_content table (admin only but still good practice)
ALTER TABLE public.site_content
  ADD CONSTRAINT site_content_title_length CHECK (title IS NULL OR char_length(title) <= 200),
  ADD CONSTRAINT site_content_content_length CHECK (content IS NULL OR char_length(content) <= 10000);
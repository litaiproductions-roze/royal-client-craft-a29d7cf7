import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SiteContent {
  [key: string]: { title: string; content: string };
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data, error } = await supabase
      .from("site_content")
      .select("key, title, content");

    if (error) {
      console.error("Error fetching content:", error);
    } else if (data) {
      const contentMap: SiteContent = {};
      data.forEach((item) => {
        contentMap[item.key] = { title: item.title || "", content: item.content || "" };
      });
      setContent(contentMap);
    }
    setLoading(false);
  };

  const updateContent = async (key: string, title: string, content: string) => {
    const { error } = await supabase
      .from("site_content")
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq("key", key);

    if (error) {
      throw error;
    }

    setContent((prev) => ({
      ...prev,
      [key]: { title, content },
    }));
  };

  return { content, loading, updateContent, refetch: fetchContent };
}

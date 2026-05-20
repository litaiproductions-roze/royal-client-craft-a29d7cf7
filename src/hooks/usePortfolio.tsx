import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PortfolioItem {
  id: string;
  title: string;
  url: string;
  screenshot_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function usePortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching portfolio:", error);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const addItem = async (title: string, url: string, screenshotFile?: File) => {
    let screenshot_url: string | null = null;

    const ALLOWED_MIME = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    const ALLOWED_EXT = ["png", "jpg", "jpeg", "webp", "gif"];

    if (screenshotFile) {
      const ext = (screenshotFile.name.split(".").pop() || "").toLowerCase();
      if (!ALLOWED_MIME.includes(screenshotFile.type) || !ALLOWED_EXT.includes(ext)) {
        throw new Error("Invalid image type. Use PNG, JPG, WEBP, or GIF.");
      }
      if (screenshotFile.size > 5 * 1024 * 1024) {
        throw new Error("Image too large (max 5MB).");
      }
      const path = `portfolio/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("site-assets")
        .upload(path, screenshotFile, { contentType: screenshotFile.type });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("site-assets")
        .getPublicUrl(path);
      screenshot_url = urlData.publicUrl;
    }

    const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.display_order)) + 1 : 0;

    const { error } = await supabase.from("portfolio_items").insert({
      title,
      url,
      screenshot_url,
      display_order: maxOrder,
    });

    if (error) throw error;
    await fetchItems();
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
    if (error) throw error;
    await fetchItems();
  };

  return { items, loading, addItem, deleteItem, refetch: fetchItems };
}

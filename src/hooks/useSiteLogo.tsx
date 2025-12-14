import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import defaultLogo from "@/assets/logo.png";

export function useSiteLogo() {
  const [logoUrl, setLogoUrl] = useState<string>(defaultLogo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogo();
  }, []);

  const fetchLogo = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "logo_url")
      .maybeSingle();

    if (error) {
      console.error("Error fetching logo:", error);
    } else if (data?.value) {
      setLogoUrl(data.value);
    }
    setLoading(false);
  };

  const updateLogo = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `logo.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from("site-assets")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("site-assets")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // Update or insert site_settings
    const { data: existing } = await supabase
      .from("site_settings")
      .select("id")
      .eq("key", "logo_url")
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("site_settings")
        .update({ value: publicUrl, updated_at: new Date().toISOString() })
        .eq("key", "logo_url");
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("site_settings")
        .insert({ key: "logo_url", value: publicUrl });
      if (error) throw error;
    }

    setLogoUrl(publicUrl);
    return publicUrl;
  };

  return { logoUrl, loading, updateLogo, refetch: fetchLogo };
}

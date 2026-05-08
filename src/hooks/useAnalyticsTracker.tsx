import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function getSessionId(): string {
  let id = sessionStorage.getItem("analytics_session_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("analytics_session_id", id);
  }
  return id;
}

async function logEvent(payload: {
  event_type: "page_view" | "link_click";
  path?: string;
  url?: string;
  label?: string;
}) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("analytics_events").insert({
      ...payload,
      session_id: getSessionId(),
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      user_id: user?.id ?? null,
    });
  } catch {
    // silent
  }
}

export function useAnalyticsTracker() {
  const location = useLocation();

  // Page view tracking
  useEffect(() => {
    logEvent({
      event_type: "page_view",
      path: location.pathname + location.search,
    });
  }, [location.pathname, location.search]);

  // Outbound + internal link click tracking
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;
      const label = target.textContent?.trim().slice(0, 100) || href;
      logEvent({
        event_type: "link_click",
        url: href,
        label,
        path: location.pathname,
      });
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [location.pathname]);
}

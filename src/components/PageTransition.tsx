import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [showTransition, setShowTransition] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const isFirstRender = useRef(true);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;

    setShowContent(false);
    setShowTransition(true);

    const timer = setTimeout(() => {
      setShowTransition(false);
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {showTransition && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4 animate-page-transition-logo">
            <img src={logo} alt="LIT AI Productions" className="w-28 h-28 md:w-36 md:h-36" />
            <div className="h-1 w-32 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary animate-page-transition-bar" />
            </div>
          </div>
        </div>
      )}
      <div style={{ display: showContent ? "contents" : "none" }}>
        {children}
      </div>
    </>
  );
}

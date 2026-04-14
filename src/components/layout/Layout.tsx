import { Link } from "react-router-dom";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogIn, UserPlus, LogOut, User } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Top Right Auth Buttons */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
        {user ? (
          <div className="flex flex-col gap-2 items-end">
            <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border shadow-lg">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-foreground truncate max-w-[120px]">
                {user.email}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="bg-card/90 backdrop-blur-sm border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        ) : (
          <>
            <Button
              asChild
              variant="hero"
              size="sm"
              className="shadow-lg"
            >
              <Link to="/auth?mode=signup">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="bg-card/90 backdrop-blur-sm border-border"
            >
              <Link to="/auth">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
          </>
        )}
      </div>

      <main className="flex-1 md:pl-72">
        {children}
      </main>
      <Footer />
    </div>
  );
}

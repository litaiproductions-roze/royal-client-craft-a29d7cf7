import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PortfolioPage from "./pages/PortfolioPage";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import ServicesHub from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import LocationDetail from "./pages/LocationDetail";
import Blog from "./pages/Blog";
import { ScrollToTop } from "./components/ScrollToTop";
import { PageTransition } from "./components/PageTransition";
import { AnalyticsTracker } from "./components/AnalyticsTracker";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AnalyticsTracker />
            <PageTransition>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/services" element={<ServicesHub />} />
                <Route path="/services/:slug" element={<ServiceDetail />} />
                <Route path="/locations/:slug" element={<LocationDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

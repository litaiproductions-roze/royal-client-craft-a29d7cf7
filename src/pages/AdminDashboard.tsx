import { useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useSiteLogo } from "@/hooks/useSiteLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  FileText, 
  Image, 
  Save, 
  LogOut, 
  Upload,
  ArrowLeft,
  Loader2,
  Mail,
  KeyRound,
  Globe,
  Share2,
  BarChart3,
  Users as UsersIcon
} from "lucide-react";
import PortfolioManager from "@/components/admin/PortfolioManager";
import ContactSubmissionsTable from "@/components/admin/ContactSubmissionsTable";
import PasswordResetLogsTable from "@/components/admin/PasswordResetLogsTable";
import SocialLinksManager from "@/components/admin/SocialLinksManager";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import UsersTable from "@/components/admin/UsersTable";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const { content, loading: contentLoading, updateContent } = useSiteContent();
  const { logoUrl, updateLogo } = useSiteLogo();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<"analytics" | "users" | "content" | "logo" | "submissions" | "reset-logs" | "portfolio" | "social">("analytics");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    about_hero_title: { title: "", content: "" },
    about_story: { title: "", content: "" },
    about_mission: { title: "", content: "" },
    about_vision: { title: "", content: "" },
    about_passion: { title: "", content: "" },
    about_excellence: { title: "", content: "" },
  });

  // Load content into form when it changes
  useState(() => {
    if (Object.keys(content).length > 0) {
      setFormData({
        about_hero_title: content.about_hero_title || { title: "", content: "" },
        about_story: content.about_story || { title: "", content: "" },
        about_mission: content.about_mission || { title: "", content: "" },
        about_vision: content.about_vision || { title: "", content: "" },
        about_passion: content.about_passion || { title: "", content: "" },
        about_excellence: content.about_excellence || { title: "", content: "" },
      });
    }
  });

  if (authLoading || contentLoading) {
    return (
      <div className="min-h-screen gradient-dark flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen gradient-dark flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-foreground mb-4">Access Denied</h1>
          <p className="text-primary-foreground/70 mb-6">You don't have admin privileges.</p>
          <Button asChild variant="hero">
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveContent = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(formData)) {
        await updateContent(key, value.title, value.content);
      }
      toast({
        title: "Content saved",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      await updateLogo(file);
      toast({
        title: "Logo updated",
        description: "Your new logo has been uploaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const updateFormField = (key: string, field: "title" | "content", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: {
        ...prev[key as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-royal py-4 px-4 sm:py-6 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link to="/" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors shrink-0">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground shrink-0" />
              <h1 className="text-base sm:text-xl font-bold text-primary-foreground truncate">Admin Dashboard</h1>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={signOut}
            className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 shrink-0"
          >
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 py-4 sm:px-6 sm:py-8">
        {/* Tabs — horizontally scrollable on mobile */}
        <div className="mb-6 sm:mb-8 border-b border-border -mx-3 px-3 sm:mx-0 sm:px-0">
          <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-none snap-x">
            {([
              { id: "analytics", label: "Analytics", Icon: BarChart3 },
              { id: "users", label: "Users", Icon: UsersIcon },
              { id: "content", label: "About Us Content", Icon: FileText },
              { id: "logo", label: "Site Logo", Icon: Image },
              { id: "submissions", label: "Contact Submissions", Icon: Mail },
              { id: "reset-logs", label: "Password Resets", Icon: KeyRound },
              { id: "portfolio", label: "Portfolio", Icon: Globe },
              { id: "social", label: "Social Links", Icon: Share2 },
            ] as const).map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium transition-colors shrink-0 whitespace-nowrap snap-start ${
                  activeTab === id
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </button>
            ))}
          </div>
        </div>


        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Site Activity & Analytics
            </h2>
            <AnalyticsDashboard />
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-primary" />
              All Users
            </h2>
            <UsersTable />
          </div>
        )}

        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Hero Section</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hero_title">Title</Label>
                  <Input
                    id="hero_title"
                    value={formData.about_hero_title.title}
                    onChange={(e) => updateFormField("about_hero_title", "title", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="hero_content">Tagline</Label>
                  <Textarea
                    id="hero_content"
                    value={formData.about_hero_title.content}
                    onChange={(e) => updateFormField("about_hero_title", "content", e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Story Section */}
            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Our Story</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="story_title">Title</Label>
                  <Input
                    id="story_title"
                    value={formData.about_story.title}
                    onChange={(e) => updateFormField("about_story", "title", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="story_content">Content</Label>
                  <Textarea
                    id="story_content"
                    value={formData.about_story.content}
                    onChange={(e) => updateFormField("about_story", "content", e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Core Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["about_mission", "about_vision", "about_passion", "about_excellence"].map((key) => (
                  <div key={key} className="space-y-3">
                    <div>
                      <Label htmlFor={`${key}_title`}>
                        {key.replace("about_", "").charAt(0).toUpperCase() + key.replace("about_", "").slice(1)} Title
                      </Label>
                      <Input
                        id={`${key}_title`}
                        value={formData[key as keyof typeof formData].title}
                        onChange={(e) => updateFormField(key, "title", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${key}_content`}>Description</Label>
                      <Textarea
                        id={`${key}_content`}
                        value={formData[key as keyof typeof formData].content}
                        onChange={(e) => updateFormField(key, "content", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleSaveContent} disabled={saving} variant="hero" size="lg">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save All Changes
                </>
              )}
            </Button>
          </div>
        )}

        {/* Logo Tab */}
        {activeTab === "logo" && (
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Site Logo</h2>
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="bg-muted rounded-xl p-8 flex items-center justify-center">
                <img
                  src={logoUrl}
                  alt="Current logo"
                  className="max-w-[200px] max-h-[200px] object-contain"
                />
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-muted-foreground">
                  Upload a new logo to replace the current one. Recommended size: 400x400px. 
                  Supported formats: PNG, JPG, SVG, WEBP.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  variant="hero"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload New Logo
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Contact Form Submissions
            </h2>
            <ContactSubmissionsTable />
          </div>
        )}

        {/* Password Reset Logs Tab */}
        {activeTab === "reset-logs" && (
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              Password Reset Activity
            </h2>
            <PasswordResetLogsTable />
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Manage Portfolio
            </h2>
            <PortfolioManager />
          </div>
        )}

        {/* Social Links Tab */}
        {activeTab === "social" && (
          <div className="bg-card rounded-xl p-4 sm:p-6 border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              Social Media Links
            </h2>
            <SocialLinksManager />
          </div>
        )}
      </div>
    </div>
  );
}

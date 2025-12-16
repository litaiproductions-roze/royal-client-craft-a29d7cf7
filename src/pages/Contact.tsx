import { useState } from "react";
import { Send, Mail, MessageSquare, User, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Message Sent Successfully!",
        description:
          "Thank you for reaching out. We'll get back to you within 24 hours.",
      });

      setFormData({ name: "", email: "", company: "", message: "" });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: "Please try again later or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* SEO */}
      <title>Contact Us | LIT Productions - Start Your Project</title>
      <meta
        name="description"
        content="Get in touch with LIT Productions to discuss your website project. We're ready to bring your vision to life with premium web design."
      />

      {/* Hero Section */}
      <section className="gradient-royal py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="animate-fade-in text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            Let's Create Something{" "}
            <span className="text-gradient-gold">Extraordinary</span>
          </h1>
          <p className="animate-fade-in-delay text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Ready to elevate your digital presence? Tell us about your project and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="animate-fade-in bg-card rounded-2xl p-8 md:p-12 shadow-card border border-border"
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              Send Us a Message
            </h2>

            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Your Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="h-12 bg-background border-border focus:border-primary"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="h-12 bg-background border-border focus:border-primary"
                />
              </div>

              {/* Company Field */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-foreground font-medium flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  Company Name <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your Company"
                  className="h-12 bg-background border-border focus:border-primary"
                />
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-foreground font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  Project Details *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project, goals, and any specific requirements..."
                  rows={6}
                  className="bg-background border-border focus:border-primary resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">What Happens Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full gradient-royal flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">1</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">We Review</h3>
              <p className="text-muted-foreground text-sm">
                We carefully read your project details and requirements.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 rounded-full gradient-royal flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">2</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">We Connect</h3>
              <p className="text-muted-foreground text-sm">
                We reach out within 24 hours to discuss your project in detail.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 rounded-full gradient-royal flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">3</span>
              </div>
              <h3 className="font-bold text-foreground mb-2">We Create</h3>
              <p className="text-muted-foreground text-sm">
                Once aligned, we begin crafting your premium website.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

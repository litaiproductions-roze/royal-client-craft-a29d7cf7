import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(5000),
});

interface Props {
  intent: string; // e.g. "Website Design quote"
  heading?: string;
  subheading?: string;
}

export function InlineLeadForm({ intent, heading, subheading }: Props) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: `I'm interested in: ${intent}\n\n`,
  });

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(data);
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fe[err.path[0] as string] = err.message;
      });
      setErrors(fe);
      return;
    }
    setSubmitting(true);
    try {
      const { data: res, error } = await supabase.functions.invoke("send-contact-email", {
        body: result.data,
      });
      if (error) throw error;
      if (res?.error) {
        toast({ title: "Submission limit reached", description: res.error, variant: "destructive" });
        return;
      }
      toast({
        title: "Thanks — we got it!",
        description: "We'll be in touch within 24 hours.",
      });
      setData({ name: "", email: "", phone: "", company: "", message: `I'm interested in: ${intent}\n\n` });
      formRef.current?.reset();
    } catch {
      toast({
        title: "Couldn't send",
        description: "Please try again or use the Contact page.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      className="bg-card rounded-2xl p-6 md:p-10 shadow-card border border-border"
    >
      {heading && <h2 className="text-2xl font-bold text-foreground mb-2">{heading}</h2>}
      {subheading && <p className="text-muted-foreground mb-6">{subheading}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lf-name">Name *</Label>
          <Input id="lf-name" name="name" required value={data.name} onChange={change} className="h-11" />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="lf-email">Email *</Label>
          <Input id="lf-email" name="email" type="email" required value={data.email} onChange={change} className="h-11" />
          {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
        </div>
        <div>
          <Label htmlFor="lf-phone">Phone</Label>
          <Input id="lf-phone" name="phone" type="tel" value={data.phone} onChange={change} className="h-11" />
        </div>
        <div>
          <Label htmlFor="lf-company">Business</Label>
          <Input id="lf-company" name="company" value={data.company} onChange={change} className="h-11" />
        </div>
      </div>

      <div className="mt-4">
        <Label htmlFor="lf-message">Tell us about your project *</Label>
        <Textarea id="lf-message" name="message" required rows={5} value={data.message} onChange={change} className="resize-none" />
        {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
      </div>

      <Button type="submit" variant="hero" size="lg" className="w-full mt-6" disabled={submitting}>
        {submitting ? "Sending..." : <>Request a Quote <Send className="ml-2 h-5 w-5" /></>}
      </Button>
    </form>
  );
}

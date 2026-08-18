import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Clock,
  ShieldCheck,
  Loader2,
  Mail,
} from "lucide-react";
import { z } from "zod";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  assessmentQuestions,
  computeResult,
  industries,
  teamSizes,
  type AssessmentResult,
} from "@/data/aiAssessment";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  industry: z.string().trim().max(100).optional().or(z.literal("")),
  teamSize: z.string().trim().max(50).optional().or(z.literal("")),
});

const faqs = [
  {
    q: "What is an AI readiness assessment?",
    a: "It's a short set of questions about how your business runs today — manual work, lead response, data, website, and marketing. We score the answers and show you exactly where AI and automation would save the most time and money.",
  },
  {
    q: "How long does the AI readiness assessment take?",
    a: "About 2 to 3 minutes. There are 10 quick multiple-choice questions and a short contact step so we can email you your personalized results.",
  },
  {
    q: "Is it really free?",
    a: "Yes. The assessment and your personalized recommendations are completely free, with no obligation to buy anything.",
  },
  {
    q: "What happens after I finish?",
    a: "You see your AI readiness score and recommendations immediately, and we email a copy to you. If you'd like help implementing any of it, you can book a free 15-minute call with our team.",
  },
];

export default function AIAssessment() {
  const { toast } = useToast();
  const [step, setStep] = useState(0); // 0 = intro, 1..N = questions, N+1 = contact, N+2 = results
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    teamSize: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [emailed, setEmailed] = useState(false);

  const total = assessmentQuestions.length;
  const contactStep = total + 1;
  const resultStep = total + 2;
  const progress = useMemo(() => {
    if (step === 0) return 0;
    if (step >= resultStep) return 100;
    return Math.round((Math.min(step, contactStep) / contactStep) * 100);
  }, [step, contactStep, resultStep]);

  const currentQuestion = step >= 1 && step <= total ? assessmentQuestions[step - 1] : null;

  const pick = (id: string, index: number) => {
    setAnswers((p) => ({ ...p, [id]: index }));
    setTimeout(() => setStep((s) => s + 1), 180);
  };

  const changeContact = (field: string, value: string) => {
    setContact((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(contact);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) fe[err.path[0] as string] = err.message;
      });
      setErrors(fe);
      return;
    }

    const localResult = computeResult(answers);
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-assessment", {
        body: {
          ...parsed.data,
          answers: assessmentQuestions.map((q) => ({
            id: q.id,
            question: q.question,
            answer: q.options[answers[q.id]]?.label ?? "Not answered",
            points: q.options[answers[q.id]]?.points ?? 0,
          })),
          score: localResult.score,
          tier: localResult.tier,
          recommendations: localResult.recommendations.map((r) => r.title),
        },
      });
      if (error) throw error;
      if (data?.error) {
        toast({ title: "Couldn't submit", description: data.error, variant: "destructive" });
        return;
      }
      setEmailed(Boolean(data?.emailed));
      setResult(localResult);
      setStep(resultStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment, or reach us on the Contact page.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "AI Readiness Assessment",
      applicationCategory: "BusinessApplication",
      url: "https://www.imagineitlit.com/ai-assessment",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      provider: { "@type": "Organization", name: "Lit AI Productions" },
    },
  ];

  return (
    <Layout>
      <SEO
        title="Free AI Readiness Assessment for Small Business | Lit AI Productions"
        description="Take the free 2-minute AI Readiness Assessment and get a personalized score plus recommendations on where AI and automation can save your business time and money."
        path="/ai-assessment"
        keywords="AI readiness assessment, AI readiness quiz, small business AI automation, AI audit for small business, business automation assessment, Long Island AI consulting"
        jsonLd={jsonLd}
      />

      <Breadcrumbs items={[{ name: "AI Assessment", path: "/ai-assessment" }]} />

      {/* Header */}
      <section className="px-6 pt-8 pb-6 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
          <Sparkles className="h-4 w-4" /> Free AI Readiness Assessment
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
          Discover How AI-Ready Your Business Really Is
        </h1>
        <p className="text-muted-foreground text-lg">
          Answer 10 quick questions and get a personalized report showing where AI can save you
          time, reduce costs, and automate repetitive work.
        </p>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-5 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> 100% free</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" /> Takes 2–3 minutes</span>
          <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> Your info stays private</span>
        </div>
      </section>

      {/* Progress */}
      {step > 0 && step < resultStep && (
        <div className="px-6 max-w-2xl mx-auto mb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>
              {step <= total ? `Question ${step} of ${total}` : "Almost done — where should we send it?"}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full gradient-royal transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <section className="px-6 pb-16 max-w-2xl mx-auto">
        {/* Intro */}
        {step === 0 && (
          <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-card text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">What you'll get</h2>
            <ul className="text-left space-y-3 mb-8 max-w-md mx-auto">
              {[
                "Your AI Readiness Score out of 100",
                "Your readiness level and what it means",
                "Up to 4 personalized recommendations",
                "A copy emailed straight to your inbox",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{b}</span>
                </li>
              ))}
            </ul>
            <Button variant="hero" size="lg" className="w-full sm:w-auto" onClick={() => setStep(1)}>
              Start the Assessment <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Questions */}
        {currentQuestion && (
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card animate-fade-in">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">
              {currentQuestion.category}
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              {currentQuestion.question}
            </h2>
            {currentQuestion.help && (
              <p className="text-sm text-muted-foreground mb-5">{currentQuestion.help}</p>
            )}
            <div className="space-y-3 mt-4">
              {currentQuestion.options.map((opt, i) => {
                const selected = answers[currentQuestion.id] === i;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => pick(currentQuestion.id, i)}
                    className={`w-full text-left px-4 py-4 rounded-xl border transition-all duration-200 flex items-center gap-3 ${
                      selected
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-background hover:border-primary/60 hover:bg-accent text-foreground"
                    }`}
                  >
                    <span
                      className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        selected ? "border-primary bg-primary" : "border-muted-foreground/40"
                      }`}
                    >
                      {selected && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                    </span>
                    <span className="font-medium">{opt.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-6">
              <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {typeof answers[currentQuestion.id] === "number" && (
                <Button variant="outline" onClick={() => setStep((s) => s + 1)}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Contact step */}
        {step === contactStep && (
          <form
            onSubmit={submit}
            className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card animate-fade-in"
          >
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Where should we send your results?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              We'll show your score instantly and email you a copy. No spam, ever.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="aq-name">Name *</Label>
                <Input
                  id="aq-name"
                  value={contact.name}
                  onChange={(e) => changeContact("name", e.target.value)}
                  maxLength={100}
                  className="h-11"
                  required
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="aq-email">Email *</Label>
                <Input
                  id="aq-email"
                  type="email"
                  value={contact.email}
                  onChange={(e) => changeContact("email", e.target.value)}
                  maxLength={255}
                  className="h-11"
                  required
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="aq-phone">Phone</Label>
                <Input
                  id="aq-phone"
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => changeContact("phone", e.target.value)}
                  maxLength={50}
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="aq-company">Business name</Label>
                <Input
                  id="aq-company"
                  value={contact.company}
                  onChange={(e) => changeContact("company", e.target.value)}
                  maxLength={200}
                  className="h-11"
                />
              </div>
              <div>
                <Label htmlFor="aq-industry">Industry</Label>
                <select
                  id="aq-industry"
                  value={contact.industry}
                  onChange={(e) => changeContact("industry", e.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                >
                  <option value="">Select…</option>
                  {industries.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="aq-team">Team size</Label>
                <select
                  id="aq-team"
                  value={contact.teamSize}
                  onChange={(e) => changeContact("teamSize", e.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
                >
                  <option value="">Select…</option>
                  {teamSizes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6">
              <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button type="submit" variant="hero" size="lg" disabled={submitting} className="w-full sm:w-auto">
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Scoring…
                  </>
                ) : (
                  <>
                    See My AI Readiness Score <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              We use your details only to send your results and follow up about your project. See our{" "}
              <Link to="/privacy" className="text-primary underline">
                privacy policy
              </Link>
              .
            </p>
          </form>
        )}

        {/* Results */}
        {step === resultStep && result && (
          <div className="animate-fade-in space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-card text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                Your AI Readiness Score
              </p>
              <div className="mx-auto w-32 h-32 rounded-full gradient-royal flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-primary-foreground">{result.score}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1">{result.tier}</h2>
              <p className="text-lg font-medium text-primary mb-4">{result.headline}</p>
              <p className="text-muted-foreground max-w-xl mx-auto">{result.summary}</p>
              {emailed && (
                <p className="inline-flex items-center gap-2 text-sm text-muted-foreground mt-5">
                  <Mail className="h-4 w-4 text-primary" /> A copy is on its way to {contact.email}
                </p>
              )}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-card">
              <h3 className="text-xl font-bold text-foreground mb-5">
                Your personalized recommendations
              </h3>
              <div className="space-y-4">
                {result.recommendations.map((r, i) => (
                  <div key={r.title} className="p-5 rounded-xl bg-background border border-border">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full gradient-royal text-primary-foreground font-bold text-sm flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-foreground mb-1">{r.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{r.detail}</p>
                        <Link
                          to={r.service}
                          className="inline-flex items-center text-sm font-semibold text-primary"
                        >
                          See how we help <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl gradient-dark p-6 md:p-10 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Want help putting this into action?
              </h3>
              <p className="text-white/80 mb-6">
                Book a free 15-minute call and we'll walk through your results and what to do first.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="hero" size="lg">
                  <Link to="/contact">
                    Book a Free Discovery Call <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Link to="/services">Explore Our Services</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* FAQ */}
      {step !== resultStep && (
        <section className="px-6 pb-20 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 text-center">
            AI Readiness Assessment FAQ
          </h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="p-5 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-foreground mb-1">{f.q}</h3>
                <p className="text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}

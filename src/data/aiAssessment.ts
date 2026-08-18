export interface AssessmentOption {
  label: string;
  points: number;
}

export interface AssessmentQuestion {
  id: string;
  category: string;
  question: string;
  help?: string;
  options: AssessmentOption[];
}

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: "repetitive_work",
    category: "Manual Work",
    question: "How much of your team's day goes to repetitive manual tasks?",
    help: "Data entry, copying info between tools, sending the same replies.",
    options: [
      { label: "More than half the day", points: 0 },
      { label: "A few hours a day", points: 1 },
      { label: "About an hour a day", points: 2 },
      { label: "Very little — most of it is automated", points: 3 },
    ],
  },
  {
    id: "lead_response",
    category: "Lead Response",
    question: "How quickly do you respond to new leads or inquiries?",
    options: [
      { label: "Days later, or sometimes not at all", points: 0 },
      { label: "Within a day, when we get to it", points: 1 },
      { label: "Within an hour during business hours", points: 2 },
      { label: "Instantly, automatically, 24/7", points: 3 },
    ],
  },
  {
    id: "customer_support",
    category: "Customer Support",
    question: "How do you currently handle customer questions?",
    options: [
      { label: "Phone and email only, all manual", points: 0 },
      { label: "Manual, with a few saved templates", points: 1 },
      { label: "FAQ page plus live chat handled by a person", points: 2 },
      { label: "AI chatbot or assistant answers most questions", points: 3 },
    ],
  },
  {
    id: "data_organization",
    category: "Data & Systems",
    question: "How organized is your business data?",
    help: "Customers, orders, quotes, invoices, notes.",
    options: [
      { label: "Paper, texts, and memory", points: 0 },
      { label: "Spreadsheets that live in different places", points: 1 },
      { label: "One main system, but tools don't talk to each other", points: 2 },
      { label: "Centralized CRM/database with connected tools", points: 3 },
    ],
  },
  {
    id: "website",
    category: "Web Presence",
    question: "How would you describe your current website?",
    options: [
      { label: "We don't have one (or just social media)", points: 0 },
      { label: "Outdated template we can't easily update", points: 1 },
      { label: "Decent site, but it doesn't generate leads", points: 2 },
      { label: "Modern, fast, and converting visitors into leads", points: 3 },
    ],
  },
  {
    id: "marketing",
    category: "Marketing & Content",
    question: "How do you handle marketing and content creation?",
    options: [
      { label: "We don't do any consistently", points: 0 },
      { label: "Occasional posts when we have time", points: 1 },
      { label: "Regular content, all created manually", points: 2 },
      { label: "Consistent content, partly AI-assisted", points: 3 },
    ],
  },
  {
    id: "ai_usage",
    category: "AI Adoption",
    question: "Is your team using AI tools today?",
    options: [
      { label: "No, and we're not sure where to start", points: 0 },
      { label: "A couple of people experiment with ChatGPT", points: 1 },
      { label: "We use AI tools regularly but informally", points: 2 },
      { label: "AI is built into our workflows and processes", points: 3 },
    ],
  },
  {
    id: "reporting",
    category: "Tracking & Reporting",
    question: "How do you track performance and results?",
    options: [
      { label: "Gut feeling — we don't really track", points: 0 },
      { label: "Manual spreadsheets at month end", points: 1 },
      { label: "Basic analytics we check sometimes", points: 2 },
      { label: "Automated dashboards and reports", points: 3 },
    ],
  },
  {
    id: "budget",
    category: "Investment Readiness",
    question: "What's your appetite for investing in AI and automation this year?",
    options: [
      { label: "Just researching for now", points: 0 },
      { label: "Interested if the ROI is clear", points: 1 },
      { label: "Budget planned, exploring options", points: 2 },
      { label: "Ready to move now", points: 3 },
    ],
  },
  {
    id: "timeline",
    category: "Timeline",
    question: "When would you want to start improving things?",
    options: [
      { label: "No timeline yet", points: 0 },
      { label: "Sometime in the next 6-12 months", points: 1 },
      { label: "Within the next 1-3 months", points: 2 },
      { label: "As soon as possible", points: 3 },
    ],
  },
];

export const industries = [
  "Home Services / Contracting",
  "Restaurant / Food & Beverage",
  "Retail / E-commerce",
  "Professional Services",
  "Health & Wellness",
  "Real Estate",
  "Creator / Media / Entertainment",
  "Startup / Tech",
  "Nonprofit",
  "Other",
];

export const teamSizes = [
  "Just me",
  "2-5 people",
  "6-20 people",
  "21-50 people",
  "50+ people",
];

const RECOMMENDATIONS: Record<string, { title: string; detail: string; service: string }> = {
  repetitive_work: {
    title: "Automate your repetitive workflows",
    detail:
      "Hours of manual copying, data entry, and follow-up can be handled automatically. This is usually the fastest ROI win for a small team.",
    service: "/services/ai-automation",
  },
  lead_response: {
    title: "Add instant lead response",
    detail:
      "Leads go cold fast. An automated intake and instant reply system means every inquiry gets answered within seconds, day or night.",
    service: "/services/ai-automation",
  },
  customer_support: {
    title: "Deploy an AI assistant for customer questions",
    detail:
      "An AI chatbot trained on your business answers common questions instantly and hands off real opportunities to you.",
    service: "/services/ai-automation",
  },
  data_organization: {
    title: "Centralize your business data",
    detail:
      "Scattered spreadsheets block automation. A single connected system for customers and jobs unlocks everything else.",
    service: "/services/custom-business-tools",
  },
  website: {
    title: "Rebuild your website to convert",
    detail:
      "A fast, modern site with clear calls to action turns existing traffic into booked calls instead of bounces.",
    service: "/services/website-design",
  },
  marketing: {
    title: "Turn on AI-assisted content and SEO",
    detail:
      "Consistent, keyword-focused content built with AI support keeps you visible on Google and in AI search results.",
    service: "/services/seo",
  },
  ai_usage: {
    title: "Create a practical AI game plan",
    detail:
      "Start with two or three high-impact use cases specific to your business instead of random tool experiments.",
    service: "/services/ai-automation",
  },
  reporting: {
    title: "Set up automated reporting",
    detail:
      "Live dashboards showing traffic, leads, and revenue mean decisions stop being guesswork.",
    service: "/services/custom-business-tools",
  },
};

export interface AssessmentResult {
  score: number;
  tier: string;
  headline: string;
  summary: string;
  recommendations: { title: string; detail: string; service: string }[];
}

export function computeResult(answers: Record<string, number>): AssessmentResult {
  const scored = assessmentQuestions.filter((q) => typeof answers[q.id] === "number");
  const earned = scored.reduce((sum, q) => {
    const idx = answers[q.id];
    return sum + (q.options[idx]?.points ?? 0);
  }, 0);
  const max = scored.length * 3 || 1;
  const score = Math.round((earned / max) * 100);

  let tier = "AI Curious";
  let headline = "You're at the starting line — and that's a great place to be";
  let summary =
    "There's a lot of low-hanging fruit in your business right now. A few focused automations and a modern website would likely save you hours every week and capture leads you're currently losing.";

  if (score >= 85) {
    tier = "AI Leader";
    headline = "You're ahead of nearly every business your size";
    summary =
      "Your foundations are strong. The next gains come from custom AI tools and deeper integrations built specifically around how your business operates.";
  } else if (score >= 65) {
    tier = "AI Advancing";
    headline = "You're well on your way — time to go deeper";
    summary =
      "You've got real systems in place. Connecting them and layering AI on top of your highest-volume workflows is where the next big time savings live.";
  } else if (score >= 40) {
    tier = "AI Ready";
    headline = "You're ready for AI — you just need the right first moves";
    summary =
      "You have the basics covered, which means automation will stick. Two or three targeted AI projects should produce measurable results quickly.";
  }

  const gaps = assessmentQuestions
    .filter((q) => RECOMMENDATIONS[q.id])
    .map((q) => ({
      id: q.id,
      points: q.options[answers[q.id]]?.points ?? 0,
    }))
    .filter((g) => g.points <= 1)
    .sort((a, b) => a.points - b.points)
    .slice(0, 4);

  const recommendations = gaps.map((g) => RECOMMENDATIONS[g.id]);

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Build custom AI tools around your workflow",
      detail:
        "You've handled the fundamentals. Purpose-built internal tools and AI agents are the next step-change for a business at your level.",
      service: "/services/custom-business-tools",
    });
  }

  return { score, tier, headline, summary, recommendations };
}

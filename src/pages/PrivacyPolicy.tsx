import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Eye, Trash2, Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <>
      <title>Privacy Policy | LIT Productions</title>
      <meta name="description" content="LIT Productions privacy policy - how we protect your data and respect your privacy." />

      {/* Header */}
      <section className="gradient-royal py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground">
            Privacy Policy
          </h1>
          <p className="text-primary-foreground/80 mt-4">
            Last updated: December 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-4xl mx-auto prose prose-lg dark:prose-invert">
          
          {/* Key Commitments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 not-prose">
            <div className="bg-card p-6 rounded-xl border border-border">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-bold text-foreground mb-2">No IP Logging</h3>
              <p className="text-muted-foreground text-sm">
                We do not collect, store, or log your IP address.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border">
              <Lock className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-bold text-foreground mb-2">Data Encryption</h3>
              <p className="text-muted-foreground text-sm">
                All data is encrypted in transit and at rest.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border">
              <Eye className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-bold text-foreground mb-2">No AI Training</h3>
              <p className="text-muted-foreground text-sm">
                Your data is never used for AI training purposes.
              </p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border">
              <Trash2 className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-bold text-foreground mb-2">Right to Deletion</h3>
              <p className="text-muted-foreground text-sm">
                Request deletion of your data at any time.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-muted-foreground mb-4">
            We collect only the minimum information necessary to provide our services:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
            <li><strong>Contact Information:</strong> Name, email address, and company name (optional) when you submit our contact form.</li>
            <li><strong>Account Information:</strong> Email and password (securely hashed) if you create an account.</li>
            <li><strong>Content:</strong> Any messages or content you voluntarily submit.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">2. Information We Do NOT Collect</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
            <li><strong>IP Addresses:</strong> We do not log or store your IP address.</li>
            <li><strong>Tracking Data:</strong> We do not use third-party analytics or tracking pixels.</li>
            <li><strong>Cookies:</strong> We only use essential cookies required for authentication.</li>
            <li><strong>Device Fingerprints:</strong> We do not collect device fingerprinting data.</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">3. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-4">
            Your information is used exclusively for:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
            <li>Responding to your inquiries and providing customer support</li>
            <li>Delivering our web design and development services</li>
            <li>Authenticating your account access</li>
            <li>Sending essential service communications (no marketing without consent)</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">4. Data Security</h2>
          <p className="text-muted-foreground mb-4">
            We implement industry-standard security measures:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
            <li>All data transmission is encrypted using TLS 1.3</li>
            <li>Passwords are securely hashed using bcrypt</li>
            <li>Database access is protected by row-level security policies</li>
            <li>Regular security audits and vulnerability assessments</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">5. Data Sharing</h2>
          <p className="text-muted-foreground mb-6">
            We do <strong>NOT</strong> sell, rent, or share your personal information with third parties 
            for marketing purposes. Your data is never used to train AI models or shared with data brokers.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">6. Your Rights (GDPR & CCPA)</h2>
          <p className="text-muted-foreground mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-6">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Rectification:</strong> Correct inaccurate personal data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Portability:</strong> Receive your data in a portable format</li>
            <li><strong>Objection:</strong> Object to processing of your personal data</li>
          </ul>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">7. Data Retention</h2>
          <p className="text-muted-foreground mb-6">
            We retain your personal data only as long as necessary to provide our services. 
            Contact form submissions are retained for 90 days unless you request earlier deletion. 
            Account data is retained until you request account deletion.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">8. AI and Automated Data Collection</h2>
          <p className="text-muted-foreground mb-6">
            We actively block AI crawlers, scrapers, and automated data collection tools from accessing 
            our website content. Your interactions with our site are not used for any AI training purposes.
          </p>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">9. Contact & Data Requests</h2>
          <p className="text-muted-foreground mb-4">
            To exercise your privacy rights or ask questions about this policy, contact us:
          </p>
          <div className="bg-card p-6 rounded-xl border border-border not-prose">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <a href="mailto:litaiproductions@gmail.com" className="text-primary hover:underline">
                litaiproductions@gmail.com
              </a>
            </div>
            <p className="text-muted-foreground text-sm mt-3">
              We will respond to all data requests within 30 days.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">10. Changes to This Policy</h2>
          <p className="text-muted-foreground mb-6">
            We may update this privacy policy from time to time. We will notify you of any material 
            changes by posting the new policy on this page and updating the "Last updated" date.
          </p>

        </div>
      </section>
    </>
  );
}

import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0D0D1A" }}>
      {/* Header */}
      <header className="border-b border-white/10" style={{ backgroundColor: "#1A1A2E" }}>
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold"
              style={{ backgroundColor: "#D4A843", color: "#0D0D1A" }}
            >
              BU
            </div>
            <span className="text-lg font-bold text-white">
              Brix<span style={{ color: "#D4A843" }}>Up</span>
            </span>
          </Link>
          <Link href="/" className="text-sm text-white/50 hover:text-white transition-colors">
            Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-sm text-white/40 mb-10">Last updated: February 14, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-white/70">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Introduction</h2>
            <p>
              BrixUp Technologies LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the BrixUp platform (&quot;Platform&quot;), including our website and mobile application.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Information We Collect</h2>

            <h3 className="text-sm font-semibold text-white/90 mt-4 mb-2">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-white">Account Information:</strong> Name, email address, phone number, password, and account role (Investor, Builder, or Dealmaker)</li>
              <li><strong className="text-white">Identity Verification (KYC):</strong> Government-issued ID, date of birth, address, Social Security Number or Tax ID, as required for investment compliance</li>
              <li><strong className="text-white">Financial Information:</strong> Bank account details, wallet addresses, investment amounts, and transaction history</li>
              <li><strong className="text-white">Contractor Information:</strong> Trade specialization, license numbers, insurance details, W-9 status, years of experience, and professional references</li>
              <li><strong className="text-white">Deal Information:</strong> Property details, addresses, financial projections, and descriptions submitted by Deal Finders</li>
              <li><strong className="text-white">Communications:</strong> Messages, support requests, and feedback you send to us</li>
            </ul>

            <h3 className="text-sm font-semibold text-white/90 mt-4 mb-2">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-white">Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong className="text-white">Usage Data:</strong> Pages visited, features used, timestamps, click patterns, and session duration</li>
              <li><strong className="text-white">Location Data:</strong> Approximate location based on IP address; precise location only if you enable geolocation for deal mapping</li>
              <li><strong className="text-white">Cookies:</strong> Session cookies, authentication tokens, and analytics cookies</li>
            </ul>

            <h3 className="text-sm font-semibold text-white/90 mt-4 mb-2">2.3 Blockchain Data</h3>
            <p>
              Transactions conducted on the Base blockchain (Coinbase L2) are publicly recorded. This includes wallet addresses, token transfers, and transaction hashes. Blockchain data is public by nature and cannot be deleted.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. How We Use Your Information</h2>
            <p className="mb-2">We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Provide, maintain, and improve the Platform</li>
              <li>Process investments, transactions, and payouts</li>
              <li>Verify your identity for regulatory compliance (KYC/AML)</li>
              <li>Match builders with construction projects</li>
              <li>Calculate Brix Scores and performance metrics</li>
              <li>Send notifications about deals, yields, milestones, and account activity</li>
              <li>Respond to support requests and communications</li>
              <li>Detect and prevent fraud, abuse, and unauthorized access</li>
              <li>Comply with legal obligations and regulatory requirements</li>
              <li>Analyze usage patterns to improve user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. How We Share Your Information</h2>
            <p className="mb-2">We may share your information with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-white">Service Providers:</strong> Third-party companies that help us operate the Platform (hosting, analytics, payment processing, KYC verification)</li>
              <li><strong className="text-white">Deal Participants:</strong> Limited information shared between investors, builders, and deal makers as necessary for deal execution</li>
              <li><strong className="text-white">Legal and Regulatory:</strong> When required by law, court order, or governmental authority, or to protect our rights and safety</li>
              <li><strong className="text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p className="mt-3">
              We <strong className="text-white">do NOT sell</strong> your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal information, including:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Encryption of data in transit (TLS/SSL) and at rest</li>
              <li>Secure authentication via Supabase Auth with session management</li>
              <li>Row-level security (RLS) policies on all database tables</li>
              <li>Regular security assessments and monitoring</li>
              <li>Access controls limiting employee access to personal data</li>
            </ul>
            <p className="mt-3">
              No method of transmission or storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide services. We may also retain information as required by law, to resolve disputes, enforce agreements, or for legitimate business purposes. KYC documents are retained as required by applicable anti-money laundering regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Your Rights and Choices</h2>
            <p className="mb-2">Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-white">Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong className="text-white">Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong className="text-white">Deletion:</strong> Request deletion of your personal information, subject to legal retention requirements</li>
              <li><strong className="text-white">Portability:</strong> Request your data in a structured, machine-readable format</li>
              <li><strong className="text-white">Opt-out:</strong> Manage notification preferences in your account settings</li>
              <li><strong className="text-white">Withdraw Consent:</strong> Where processing is based on consent, you may withdraw at any time</li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at privacy@brixup.io or through your account Settings page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Cookies and Tracking</h2>
            <p>
              We use essential cookies for authentication and session management. We may use analytics cookies (such as Google Analytics or PostHog) to understand how users interact with the Platform. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Children&apos;s Privacy</h2>
            <p>
              The Platform is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we learn that we have collected information from a child under 18, we will promptly delete it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers in accordance with applicable data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. California Privacy Rights (CCPA)</h2>
            <p>
              California residents have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information is collected, request deletion, and opt out of the sale of personal information. We do not sell personal information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">12. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be communicated via email or a prominent notice on the Platform. The &quot;Last updated&quot; date at the top indicates when the policy was last revised.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">13. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="mt-2 text-white/50">
              BrixUp Technologies LLC<br />
              Email: privacy@brixup.io
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

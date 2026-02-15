import Link from "next/link";

export default function TermsOfServicePage() {
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
        <h1 className="text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-sm text-white/40 mb-10">Last updated: February 14, 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-white/70">
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the BrixUp platform (&quot;Platform&quot;), including our website, mobile application, and all related services provided by BrixUp Technologies LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not access or use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">2. Eligibility</h2>
            <p className="mb-2">To use the Platform, you must:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Be at least 18 years of age</li>
              <li>Have the legal capacity to enter into a binding agreement</li>
              <li>Not be a resident of any jurisdiction where use of the Platform would be prohibited</li>
              <li>Complete identity verification (KYC) where required for investment activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">3. Account Registration</h2>
            <p>
              You must register an account to access certain features of the Platform. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your account credentials and for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">4. $BRIX Token</h2>
            <p className="mb-2">
              The $BRIX token is a utility token issued on the Base blockchain (Coinbase L2). The $BRIX token:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Is a utility token and does <strong className="text-white underline">NOT</strong> constitute a security, equity, or ownership stake in BrixUp Technologies LLC or any property</li>
              <li>May be used within the Platform for staking, governance, and accessing platform features</li>
              <li>Has no guaranteed value and its price may fluctuate based on market conditions</li>
              <li>Is not redeemable for cash or cash equivalents from BrixUp Technologies LLC</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">5. Investment Activities</h2>
            <p className="mb-2">
              The Platform facilitates fractional investment in real estate deals. By participating in investment activities, you acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>All investments carry risk, including the potential loss of your entire investment</li>
              <li>Past performance is not indicative of future results</li>
              <li>Projected returns (ROI) are estimates and are not guaranteed</li>
              <li>Real estate investments are illiquid and may have long holding periods</li>
              <li>You are solely responsible for your investment decisions</li>
              <li>BrixUp does not provide investment, tax, or legal advice</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">6. Builder and Contractor Services</h2>
            <p>
              Builders and contractors using the Platform agree to provide accurate information regarding their qualifications, licenses, insurance, and work history. BrixUp reserves the right to verify credentials, assign Brix Scores based on performance, and remove contractors who fail to meet quality or safety standards. Builders are independent contractors and not employees of BrixUp.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">7. Deal Finder Services</h2>
            <p>
              Deal Finders who submit real estate opportunities to the Platform may earn commissions on funded deals. All submitted deals are subject to BrixUp&apos;s review and approval process. Commission rates are set by BrixUp and are subject to change. Deal submissions must be accurate and made in good faith.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">8. Fees and Payments</h2>
            <p>
              Certain services on the Platform may be subject to fees. All fees will be disclosed before you complete a transaction. We reserve the right to modify our fee structure with reasonable notice. Payment processing is handled through third-party providers and is subject to their terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">9. Prohibited Conduct</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the Platform for any unlawful purpose or in violation of any applicable laws</li>
              <li>Provide false or misleading information</li>
              <li>Manipulate or attempt to manipulate the Platform, token prices, or deal outcomes</li>
              <li>Use the Platform for money laundering, terrorist financing, or other financial crimes</li>
              <li>Access or attempt to access other users&apos; accounts without authorization</li>
              <li>Reverse-engineer, decompile, or disassemble any aspect of the Platform</li>
              <li>Use automated systems (bots) to interact with the Platform without prior written consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">10. Intellectual Property</h2>
            <p>
              All content, trademarks, logos, and intellectual property on the Platform are owned by BrixUp Technologies LLC or its licensors. You may not reproduce, distribute, or create derivative works from any content on the Platform without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">11. Disclaimer of Warranties</h2>
            <p>
              THE PLATFORM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. WE MAKE NO REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF ANY DEAL INFORMATION OR INVESTMENT PROJECTIONS.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">12. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, BRIXUP TECHNOLOGIES LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE PLATFORM OR ANY INVESTMENT ACTIVITIES.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">13. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless BrixUp Technologies LLC and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Platform, your violation of these Terms, or your violation of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">14. Termination</h2>
            <p>
              We may suspend or terminate your access to the Platform at any time, with or without cause, and with or without notice. Upon termination, your right to use the Platform will immediately cease. Provisions that by their nature should survive termination will survive, including ownership, warranty disclaimers, indemnification, and limitations of liability.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">15. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of laws provisions. Any disputes arising under these Terms shall be resolved exclusively in the courts of the State of Delaware.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">16. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be communicated via email or a prominent notice on the Platform. Your continued use of the Platform after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-3">17. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="mt-2 text-white/50">
              BrixUp Technologies LLC<br />
              Email: legal@brixup.io
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

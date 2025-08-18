"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Terms & Conditions – WordyWrites
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. Introduction</h2>
            <p>
              Welcome to <strong>WordyWrites</strong>. By accessing or using our
              platform, you agree to comply with and be bound by these Terms and
              Conditions. If you do not agree, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. Services</h2>
            <p>
              WordyWrites provides AI-powered blog and content generation tools.
              Features may include blog writing, SEO optimization, and content
              repurposing. We reserve the right to update or modify features at
              any time.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials. All activities under your account are your
              responsibility. Use of false information or impersonation is
              prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Payments & Subscriptions</h2>
            <p>
              WordyWrites offers a free plan and paid subscriptions. Payments
              are processed through our payment provider (e.g., Paddle or
              LemonSqueezy). Subscriptions automatically renew unless canceled
              before the renewal date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Acceptable Use</h2>
            <p>
              You agree not to misuse WordyWrites for illegal, harmful, or
              malicious purposes, including but not limited to generating
              harmful content, spam, or violating intellectual property rights.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">6. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account if you
              violate these Terms or engage in activities that harm the platform
              or its users.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">7. Liability</h2>
            <p>
              WordyWrites is provided “as is” without warranties of any kind. We
              are not liable for damages resulting from the use of our platform,
              except as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">8. Changes</h2>
            <p>
              We may update these Terms from time to time. Continued use of
              WordyWrites constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">9. Contact</h2>
            <p>
              If you have questions about these Terms, please contact us at:{" "}
              <a
                href="mailto:support@wordywrites.com"
                className="text-blue-600 underline"
              >
                support@wordywrites.com
              </a>
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

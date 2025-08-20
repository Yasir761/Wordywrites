"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Privacy Policy – WordyWrites
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. Information Collection</h2>
            <p>
              WordyWrites collects personal information such as email address and account details when users sign up or use our platform. We do not sell your data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. Use of Information</h2>
            <p>
              We use the information collected to provide, maintain, and improve our services, communicate with users, and send important updates about the platform.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. Data Security</h2>
            <p>
              We implement reasonable security measures to protect user data. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Third-Party Services</h2>
            <p>
              We may use third-party services (like Paddle or LemonSqueezy) for payments. These services have their own privacy policies that users should review.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">5. Contact</h2>
            <p>
              For any privacy-related questions, contact us at{" "}
              <a href="mailto:support@wordywrites.com" className="text-blue-600 underline">
                support@wordywrites.com
              </a>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

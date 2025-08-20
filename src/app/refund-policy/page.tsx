"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RefundPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Refund Policy – WordyWrites
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-700">
          <section>
            <h2 className="text-lg font-semibold mb-2">1. Refund Eligibility</h2>
            <p>
              At <strong>WordyWrites</strong>, we offer a 14-day refund period for paid subscriptions. 
              Refunds are available only if the request is made within 14 days of purchase and the services have not been extensively used.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">2. How to Request a Refund</h2>
            <p>
              To request a refund, please contact our support team at{" "}
              <a href="mailto:support@wordywrites.com" className="text-blue-600 underline">
                support@wordywrites.com
              </a>
              . Include your purchase details and reason for the refund request.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">3. Refund Processing</h2>
            <p>
              Refunds are processed within 5-7 business days through the original payment method. 
              Please note that bank processing times may vary.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">4. Contact</h2>
            <p>
              If you have any questions about our refund policy, reach out to us at{" "}
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

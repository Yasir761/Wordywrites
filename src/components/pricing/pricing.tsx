'use client'

import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for testing Wordywrites.',
    features: [
      { label: 'Keyword Agent', included: true },
      { label: 'Outline Agent', included: true },
      { label: 'Blog Writing Agent — 5 posts/month', included: true },
      { label: 'SEO Agent', included: false },
      { label: 'Tone Agent', included: false },
      { label: 'Hashtag Agent', included: false },
      { label: 'Teaser Agent', included: false },
      { label: 'Analyze Agent', included: false },
      { label: 'Crawl Agent', included: false },
      { label: 'Publish to WordPress', included: false },
      { label: 'Copy for Medium', included: false },
    ],
    cta: 'Start for Free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$9.99/mo',
    description: 'Everything you need to blog better.',
    features: [
      { label: 'Unlimited Blog Writing', included: true },
      { label: 'Keyword Agent', included: true },
      { label: 'Outline Agent', included: true },
      { label: 'SEO Agent', included: true },
      { label: 'Tone Agent', included: true },
      { label: 'Hashtag Agent', included: true },
      { label: 'Teaser Agent', included: true },
      { label: 'Analyze Agent', included: true },
      { label: 'Crawl Agent', included: true },
      { label: 'Publish to WordPress', included: true },
      { label: 'Copy for Medium', included: true },
    ],
    cta: 'Go Pro',
    highlight: true,
    variantId: 123456, // <-- your actual Lemon Squeezy Pro plan variant ID
  },
]

export default function Pricing() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleCheckout = async (variantId?: number) => {
    if (!variantId) return
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variantId,
        userId: 'example-user-id', // replace with logged-in user ID
      }),
    })

    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    }
  }

  return (
    <section className="py-24 scroll-mt-28" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
        <p className="mt-2 text-gray-600 text-base sm:text-lg">
          No hidden fees. No credit card required for Free plan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto px-4 sm:px-6">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`relative rounded-3xl p-6 border transition duration-300 shadow-sm hover:shadow-md
              ${
                plan.highlight
                  ? 'border-indigo-500 bg-white/80 backdrop-blur-lg ring-2 ring-indigo-300'
                  : 'border-gray-200 bg-white/70'
              }`}
          >
            {plan.highlight && (
              <div className="absolute top-4 right-4 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium">
                Most Popular
              </div>
            )}

            <h3 className="text-xl font-semibold text-gray-800">{plan.name}</h3>
            <p className="mt-1 text-3xl font-bold text-gray-900">{plan.price}</p>
            <p className="mt-2 text-gray-600 text-sm">{plan.description}</p>

            <ul className="mt-6 space-y-3 text-left text-sm text-gray-700">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {feature.included ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-gray-400" />
                  )}
                  {feature.label}
                </li>
              ))}
            </ul>

            <Button
              className="mt-6 w-full"
              onClick={() => handleCheckout(plan.variantId)}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Instagram, X, Mail } from 'lucide-react'

export default function CTAAndFooter() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <footer className="mt-24">
      {/* CTA Section */}
      <section className="py-20 text-center px-4 sm:px-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl max-w-6xl mx-auto shadow-sm">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 font-heading">
          Create your next blog in seconds
        </h2>
        <p className="mt-4 text-gray-600 text-base sm:text-lg">
          Get started free — your first 5 blogs are on us. No credit card required.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/sign-up">
            <Button className="text-white px-6 py-2 rounded-full w-full sm:w-auto">
              Get Started Free
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              variant="outline"
              className="px-6 py-2 rounded-full w-full sm:w-auto"
            >
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer Section */}
      <div className="border-t border-gray-200 py-12 px-4 sm:px-6 mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-gray-600 text-sm">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Wordywrites</h3>
            <p className="mt-2">Smarter blogs. Faster content. Zero hassle.</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <p>
              <Link href="#features" className="hover:text-indigo-600 transition">
                Features
              </Link>
            </p>
            <p>
              <Link href="#pricing" className="hover:text-indigo-600 transition">
                Pricing
              </Link>
            </p>
            <p>
              <Link href="#faq" className="hover:text-indigo-600 transition">
                FAQs
              </Link>
            </p>
            <p>
              <Link href="/contact" className="hover:text-indigo-600 transition">
                Contact
              </Link>
            </p>
             <p>
              <Link href="/terms&condition" className="hover:text-indigo-600 transition">
                Terms & Conditions
              </Link>
            </p>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <p className="font-medium text-gray-800">Join our newsletter</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Enter your email"
                className="rounded-full px-4 py-2 w-full"
              />
              <Button className="rounded-full text-white px-5 w-full sm:w-auto">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-gray-400 mt-10">
          &copy; {new Date().getFullYear()} Wordywrites. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

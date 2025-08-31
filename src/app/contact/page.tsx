'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

export default function ContactPage() {
  const [status, setStatus] = useState('')

const handleSubmit = async (e: any) => {
  e.preventDefault()
  setStatus('Sending...')

  const form = new FormData(e.target)
  const res = await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify({
      name: form.get('name'),
      email: form.get('email'),
      message: form.get('message'),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (res.ok) {
    setStatus('✅ Message sent successfully!')
    e.target.reset()
  } else {
    setStatus('⚠️ Please log in or sign up to continue.')
  }
}



  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-100 px-4">
      <div className="max-w-2xl w-full py-16">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 font-heading">
            Contact Us
          </h1>
          <p className="mt-4 text-gray-600 text-base sm:text-lg">
            Have a question, feature request, or just want to say hi? We’d love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-3xl p-6 sm:p-10 space-y-6 border border-gray-100">
          <Input type="text" name="name" placeholder="Your Name" required />
          <Input type="email" name="email" placeholder="Your Email" required />
          <Textarea name="message" placeholder="Your Message" rows={5} required />
          <Button type="submit" className="w-full text-white rounded-full py-2">
            Send Message
          </Button>
          {status && (
            <p className="text-sm text-center text-gray-500 mt-2">
              {status}
            </p>
          )}
        </form>

        {/* Back to Home button */}
        <div className="text-center mt-6">
          <Link href="/" passHref>
            <Button variant="outline" className="rounded-full px-6">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

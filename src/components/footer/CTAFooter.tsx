
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { X, Github, Globe, ArrowRight, Mail, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CTAAndFooter() {
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleSubscribe = async () => {
    if (!email) return
    setLoading(true)

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setShowPopup(true)
        setEmail("")
      } else {
        alert("⚠️ Subscription failed. Try again later.")
      }
    } catch (err) {
      console.error(err)
      alert("⚠️ Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const footerLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQs', href: '#faq' },
    { label: 'Contact', href: '/contact' },
  ]

  const socialLinks = [
    { icon: X, href: 'https://x.com/Mohd_Yasir29', label: 'Twitter' },
    { icon: Github, href: 'https://github.com/Yasir761', label: 'GitHub' },
    { icon: Globe, href: 'https://codilad.dev', label: 'Website' },
  ]

  return (
    <footer className="mt-24">
      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl lg:rounded-4xl overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 shadow-2xl">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ scale: [1.1, 1, 1.1] }}
                transition={{ duration: 8, repeat: Infinity, delay: 2 }}
                className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"
              />
            </div>

            {/* Content */}
            <div className="relative z-10 px-6 sm:px-10 lg:px-16 py-16 sm:py-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-heading leading-tight">
                  Create Your Next Blog in Seconds
                </h2>
                <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
                  Get started free — your first 5 blogs are on us. No credit card required.
                </p>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-4"
              >
                <Link href="/sign-up" className="w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="w-full sm:w-auto text-white px-8 py-3 rounded-full font-semibold bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg hover:shadow-xl transition-all duration-300">
                      Get Started Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/pricing" className="w-full sm:w-auto">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto px-8 py-3 rounded-full font-semibold text-white border-2 border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                    >
                      View Pricing
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer Section */}
      <div className="border-t border-gray-200 bg-gradient-to-b from-white via-gray-50 to-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-heading">
                Wordywrites
              </h3>
              <p className="mt-3 text-gray-600 text-sm leading-relaxed max-w-xs">
                Smarter blogs. Faster content. Zero hassle.
              </p>
              <p className="mt-4 text-xs text-gray-500">
                © {new Date().getFullYear()} Wordywrites
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <p className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Navigation</p>
              <div className="space-y-2">
                {footerLinks.map((link, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 text-sm font-medium flex items-center gap-2 group"
                    >
                      {link.label}
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <p className="font-semibold text-gray-900 text-sm uppercase tracking-wider">Resources</p>
              <div className="space-y-2">
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Link href="#how-it-works" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 text-sm font-medium flex items-center gap-2 group">
                    How It Works
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Link href="#integrations" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 text-sm font-medium flex items-center gap-2 group">
                    Integrations
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                  <Link href="mailto:hello@wordywrites.com" className="text-gray-600 hover:text-indigo-600 transition-colors duration-300 text-sm font-medium flex items-center gap-2 group">
                    Support
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <p className="font-semibold text-gray-900 text-sm uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Newsletter
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Stay updated with the latest features and blogging tips.
              </p>
              <div className="flex flex-col gap-2">
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="rounded-full px-4 py-2.5 w-full text-sm border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSubscribe()}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="rounded-full text-white px-5 py-2.5 w-full text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8" />

          {/* Social Links + Copyright */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            {/* Social Icons */}
            <div className="flex gap-6">
              {socialLinks.map((social, i) => {
                const Icon = social.icon
                return (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2, y: -4 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Link
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-all duration-300"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </Link>
                  </motion.div>
                )
              })}
            </div>

            {/* Copyright Text */}
            <div className="text-center sm:text-right text-xs sm:text-sm text-gray-500">
              <p>All rights reserved. Found and developed by <span className="font-semibold text-gray-700"><a href="http://codilad.dev">Codilad</a></span></p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 400 }}
              className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 text-center max-w-sm w-full"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6 }}
                className="mb-4 flex justify-center"
              >
                <div className="p-4 rounded-full bg-green-100">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </motion.div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-heading">
                Thank You for Subscribing!
              </h3>
              <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
                Please check your inbox for confirmation. We'll keep you updated with the latest features and blogging tips.
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPopup(false)}
                className="mt-6 w-full rounded-full py-3 text-white font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}
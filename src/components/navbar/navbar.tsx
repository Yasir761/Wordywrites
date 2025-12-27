'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import Link from 'next/link'

const navItems = [
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'FAQs', href: '#faq' },
  { name: 'Contact', href: '/contact' }, //  changed from #contact to /contact
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={clsx(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        scrolled ? 'backdrop-blur-md bg-white/70 shadow-md' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-gray-800 font-heading hover:text-primary transition-colors"
          >
            Wordywrites
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            {navItems.map((item, i) =>
              item.href.startsWith('#') ? (
                <a
                  key={i}
                  href={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={i}
                  href={item.href}
                  className="transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-sm px-4">
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="text-sm px-5 py-2">
                Try It Free
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden px-6 pb-4 pt-2 bg-white/80 backdrop-blur-md shadow-md"
        >
          <div className="flex flex-col gap-4 text-gray-700 font-medium">
            {navItems.map((item, i) =>
              item.href.startsWith('#') ? (
                <a
                  key={i}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="transition-colors hover:text-primary"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={i}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              )
            )}
            <Link href="/sign-in">
              <Button variant="ghost" className="w-full mt-2">
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="w-full">Try It Free</Button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

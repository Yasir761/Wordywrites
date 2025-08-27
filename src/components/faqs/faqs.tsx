'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: 'What do I need to get started?',
    answer:
      'Just one keyword. Wordywrites instantly turns it into a complete, SEO-friendly blog — no prior writing or SEO skills required.',
  },
  {
    question: 'Can I customize tone, style, or audience?',
    answer:
      'Yes! Choose from tones like informative, conversational, formal, or promotional, and fine-tune it for your exact audience.',
  },
  {
    question: 'Will my blogs be SEO-optimized?',
    answer:
      'Absolutely. We handle titles, headings, keywords, and structure so your content has the best chance to rank on Google.',
  },
  {
    question: 'Is the content plagiarism-free?',
    answer:
      '100%. Every piece is generated fresh and run through AI-powered plagiarism checks to ensure originality.',
  },
  {
    question: 'Can I export my content?',
    answer:
      'Yes — download, copy for Medium, or publish directly to WordPress with one click.',
  },
  {
    question: 'Will my data be stored or reused?',
    answer:
      'No. Your inputs and outputs are private and never shared or reused outside your account.',
  },
  {
    question: 'Do I need to connect my CMS?',
    answer:
      'No. CMS integrations are optional — you can simply copy or download your content if you prefer.',
  },
  {
    question: 'How is Wordywrites different from ChatGPT?',
    answer:
      'Wordywrites is purpose-built for SEO blogging, with specialized AI agents, a structured workflow, and built-in publishing tools — no endless prompting required.',
  },
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section className="py-24 px-4 sm:px-8 max-w-4xl mx-auto" id="faq">
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 font-heading">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-500 mt-4 text-sm sm:text-base">
          Still curious?{' '}
          <a href="/contact" className="text-indigo-600 hover:underline">
            Contact us →
          </a>
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl px-5 sm:px-6 py-4 shadow-md cursor-pointer transition-all duration-200 
              ${openIndex === i ? 'shadow-lg border border-indigo-100' : 'hover:shadow-lg'}`}
            onClick={() => toggleFAQ(i)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-gray-800 font-medium text-base sm:text-lg pr-4">
                {faq.question}
              </h3>
              <ChevronDown
                className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 text-indigo-500 ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
              />
            </div>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="pt-3 text-sm sm:text-base text-gray-600 leading-relaxed"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <p className="text-center mt-10 text-sm text-gray-500">
        Trusted by founders, marketers, and creators worldwide.
      </p>
    </section>
  )
}

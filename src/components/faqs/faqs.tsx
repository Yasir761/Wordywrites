
'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: 'What do I need to get started?',
    answer:
      'Just one keyword. Wordywrites instantly turns it into a complete, SEO-friendly blog — no prior writing or SEO skills required.',
    category: 'Getting Started'
  },
  {
    question: 'Can I customize tone, style, or audience?',
    answer:
      'Yes! Choose from tones like informative, conversational, formal, or promotional, and fine-tune it for your exact audience.',
    category: 'Customization'
  },
  {
    question: 'Will my blogs be SEO-optimized?',
    answer:
      'Absolutely. We handle titles, headings, keywords, and structure so your content has the best chance to rank on Google.',
    category: 'SEO'
  },
  {
    question: 'Is the content plagiarism-free?',
    answer:
      '100%. Every piece is generated fresh and run through AI-powered plagiarism checks to ensure originality.',
    category: 'Quality'
  },
  {
    question: 'Can I export my content?',
    answer:
      'Yes — download, copy for Medium, or publish directly to WordPress with one click.',
    category: 'Publishing'
  },
  {
    question: 'Will my data be stored or reused?',
    answer:
      'No. Your inputs and outputs are private and never shared or reused outside your account.',
    category: 'Privacy'
  },
  {
    question: 'Do I need to connect my CMS?',
    answer:
      'No. CMS integrations are optional — you can simply copy or download your content if you prefer.',
    category: 'Publishing'
  },
  {
    question: 'How is Wordywrites different from ChatGPT?',
    answer:
      'Wordywrites is purpose-built for SEO blogging, with specialized AI agents, a structured workflow, and built-in publishing tools — no endless prompting required.',
    category: 'Product'
  },
]

const categoryColors = {
  'Getting Started': 'from-blue-500 to-cyan-500',
  'Customization': 'from-purple-500 to-pink-500',
  'SEO': 'from-green-500 to-emerald-500',
  'Quality': 'from-yellow-500 to-amber-500',
  'Publishing': 'from-orange-500 to-red-500',
  'Privacy': 'from-indigo-500 to-purple-500',
  'Product': 'from-rose-500 to-pink-500',
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const toggleFAQ = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  const categories = Array.from(new Set(faqs.map(faq => faq.category)))
  const faqsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = faqs.filter(faq => faq.category === cat)
    return acc
  }, {} as Record<string, typeof faqs>)

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 scroll-mt-24 bg-gradient-to-b from-white via-indigo-50/20 to-white" id="faq">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200/50 mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span className="text-xs sm:text-sm font-semibold text-indigo-600 uppercase tracking-wider">
              Have Questions?
            </span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 font-heading mt-4 leading-tight">
            Frequently Asked Questions
          </h2>
          
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about Wordywrites, answered.{' '}
            <motion.a 
              href="/contact" 
              className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1 group"
              whileHover={{ x: 4 }}
            >
              Still have questions?{' '}
              <MessageCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </motion.a>
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="space-y-3 sm:space-y-4"
        >
          {faqs.map((faq, i) => {
            const categoryGradient = categoryColors[faq.category as keyof typeof categoryColors] || 'from-indigo-500 to-purple-500'
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="group"
              >
                <motion.button
                  onClick={() => toggleFAQ(i)}
                  className="w-full text-left bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl px-6 sm:px-8 py-5 sm:py-6 shadow-sm group-hover:shadow-md transition-all duration-300 border border-gray-200/60 group-hover:border-indigo-200/50"
                  whileHover={{ 
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    y: -2
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <motion.div
                          className={`hidden sm:flex w-2 h-2 rounded-full bg-gradient-to-r ${categoryGradient}`}
                          animate={{ scale: openIndex === i ? 1.5 : 1 }}
                          transition={{ duration: 0.3 }}
                        />
                        <span className={`text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${categoryGradient} bg-clip-text text-transparent`}>
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300 leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <motion.div
                      className="flex-shrink-0 mt-1"
                      animate={{ rotate: openIndex === i ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-gradient-to-r ${categoryGradient}`}>
                        <ChevronDown className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                  </div>
                </motion.button>

                {/* Answer Section */}
                <AnimatePresence mode="wait">
                  {openIndex === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className={`mt-2 mx-2 p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${categoryGradient} bg-opacity-5 border border-gray-100`}>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 text-center"
        >
          <div className="inline-block px-6 sm:px-8 py-4 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/50 backdrop-blur-sm">
            <p className="text-gray-700 text-base sm:text-lg font-medium">
              Trusted by <span className="font-bold text-indigo-600">3,000+</span> creators, marketers & teams worldwide
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
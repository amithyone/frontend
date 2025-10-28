"use client"

import type React from "react"
import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      question: "What is FaddedSMS?",
      answer:
        "FaddedSMS lets you get real phone numbers to receive SMS or voice verifications, sign ups, testing, or protecting your personal number.",
    },
    {
      question: "Are the numbers real?",
      answer:
        "Yes — all numbers are real, non-VoIP US numbers. They work with major services like Google, PayPal, Uber, and more.",
    },
    {
      question: "How often are numbers restocked?",
      answer: "New numbers are added daily. If the one you want isn't available, check back soon.",
    },
    {
      question: "How secure is it?",
      answer: "Your sessions are encrypted, and we accept crypto payments for full privacy.",
    },
    {
      question: "How is this different from Google Voice or VoIP numbers?",
      answer:
        "Unlike VoIP or Google Voice, our real non-VoIP numbers are accepted by almost all major platforms, reducing verification issues.",
    },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-800 mb-8">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-4 lg:space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{faq.question}</h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform ${openIndex === index ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              {openIndex === index && <p className="text-sm sm:text-base text-gray-600 mt-4">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

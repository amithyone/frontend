"use client"

import type React from "react"
import { motion } from "framer-motion"

interface Step {
  number: number
  title: string
  description: string
  color: string
}

export const HowItWorks: React.FC = () => {
  const steps: Step[] = [
    {
      number: 1,
      title: "Choose Service",
      description: "Select from 900+ supported services like WhatsApp, Instagram, or any platform you need.",
      color: "bg-blue-500",
    },
    {
      number: 2,
      title: "Get Number",
      description: "Receive a temporary phone number instantly. Use it for verification on your chosen service.",
      color: "bg-green-500",
    },
    {
      number: 3,
      title: "Receive SMS",
      description: "Get your verification code instantly and complete your registration or login.",
      color: "bg-orange-500",
    },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Get started in just 3 simple steps
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div
                className={`w-16 sm:w-20 h-16 sm:h-20 ${step.color} text-white rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-6 shadow-lg`}
              >
                {step.number}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-sm sm:text-base text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

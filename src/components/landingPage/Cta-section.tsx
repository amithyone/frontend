"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export const GetStartedCTA: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-6 lg:px-20 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
        >
          Get started today
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-base sm:text-lg text-gray-700 mb-4"
        >
          Sign-Up is quick, free, and easy. We respect your privacy.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-base sm:text-lg text-gray-700 mb-8"
        >
          Your account will be ready to use within seconds.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          onClick={() => navigate("/register")}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold text-base sm:text-lg transition-colors"
        >
          Sign Up
        </motion.button>
      </div>
    </section>
  )
}

export const FinalCTA: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-green-100 to-teal-100 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-0 right-0 w-64 sm:w-96 lg:w-[500px] h-80 sm:h-96 lg:h-[600px] opacity-90"
      >
        <img
          src="/images/phoneone.png"
          alt="FaddedSMS Phone Interface"
          className="w-full h-full object-contain transform rotate-12 translate-x-10 translate-y-20 sm:translate-y-40 lg:translate-y-60"
        />
      </motion.div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-800 mb-6">
            Stay Private. Stay Verified.
          </h2>

          <p className="text-base sm:text-lg text-gray-700 mb-8">
            Reliable International Numbers for SMS and voice verifications—secure, instant, and trusted worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="px-6 sm:px-8 py-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              Sign in
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              className="px-6 sm:px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              Sign Up
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

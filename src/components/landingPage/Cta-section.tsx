"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"

export const GetStartedCTA: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-6 lg:px-20 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Get started today</h2>
        <p className="text-base sm:text-lg text-gray-700 mb-4">
          Sign-Up is quick, free, and easy. We respect your privacy.
        </p>
        <p className="text-base sm:text-lg text-gray-700 mb-8">Your account will be ready to use within seconds.</p>
        <button
          onClick={() => navigate("/register")}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold text-base sm:text-lg transition-colors"
        >
          Sign Up
        </button>
      </div>
    </section>
  )
}

export const FinalCTA: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-green-100 to-teal-100 overflow-hidden">
      {/* Phone image background */}
      <div className="absolute bottom-0 right-0 w-64 sm:w-96 lg:w-[500px] h-80 sm:h-96 lg:h-[600px] opacity-90">
        <img
          src="/images/phoneone.png"
          alt="FaddedSMS Phone Interface"
          className="w-full h-full object-contain transform rotate-12 translate-x-10 translate-y-20 sm:translate-y-40 lg:translate-y-60"
        />
      </div>

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-800 mb-6">
            Stay Private. Stay Verified.
          </h2>
          <p className="text-base sm:text-lg text-gray-700 mb-8">
            Reliable International Numbers for SMS and voice verifications—secure, instant, and trusted worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-6 sm:px-8 py-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-6 sm:px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

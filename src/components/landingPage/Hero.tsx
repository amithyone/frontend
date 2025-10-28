"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"

export const HeroSection: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="relative text-white overflow-hidden pt-20 min-h-screen flex items-center">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/images/hero-background.jpg"
          alt="Hero background with blue sky and clouds"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 lg:px-20 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 lg:space-y-8">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
              Not comfortable sharing your phone number? — Use Ours!
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 leading-relaxed">
              Access 900+ services without revealing your personal phone number. Get SMS and OTP messages from any
              service.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-green-500 hover:bg-green-600 rounded-full text-white font-semibold text-base sm:text-lg transition-colors"
            >
              Get Started For Free
            </button>
          </div>

          {/* Phone Image */}
          <div className="relative flex justify-center lg:justify-end">
            <img
              src="/images/hero-hand-phone.png"
              alt="Hand holding phone with FaddedSMS app"
              className="w-64 sm:w-72 lg:w-80 h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

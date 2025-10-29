"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

export const HeroSection: React.FC = () => {
    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    return (
        <section className="relative text-white overflow-hidden min-h-screen flex items-center lg:m-5 mt-4 rounded-2xl lg:rounded-3xl">
            {/* Background - Extended to full width */}
            <div className="absolute inset-0 w-screen h-full z-0 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                <img
                    src="/images/hero-background.jpg"
                    alt="Hero background with blue sky and clouds"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Content */}
            <div className="px-6 lg:px-20 py-16 lg:py-24 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Text Section */}
                    <div
                        className={`space-y-6 lg:space-y-8 transform transition-all duration-1000 max-w-2xl leading-8 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                            }`}
                    >
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight font-jakarta">
                            Not comfortable sharing your phone number?
                            <span className="text-[#C5FF95] ml-3">— Use Ours!</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-[#F5FAF9] font-inter">
                            Receive SMS & OTP from Apps and Websites easily. Works with Google, PayPal, Uber,
                            WhatsApp, Tinder etc.
                        </p>
                        <button
                            onClick={() => navigate("/register")}
                            className="px-8 py-4 bg-[#5DEBD7] rounded-full text-gray-900 font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Get Started
                        </button>
                    </div>

                    {/* Phone Image + Floating Elements */}
                    <div
                        className={`relative flex justify-center lg:justify-end transform transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                            }`}
                    >
                        <div className="relative animate-float">
                            <img
                                src="/images/hero-hand-phone.png"
                                alt="Hand holding phone with FaddedSMS app"
                                className="w-80 sm:w-96 lg:w-[530px] xl:w-[630px] h-auto lg:h-[682px] xl:h-[782px] object-cover drop-shadow-2xl"
                            />

                            {/* Virtual Number Tag */}
                            <div
                                className="absolute top-10 left-6 lg:left-20 lg:top-40 bg-[#EDECEC] rounded-2xl px-4 py-3 shadow-2xl animate-float-delayed"
                                style={{ animationDelay: "0.5s" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#5DEBD7] rounded-xl flex items-center justify-center">
                                        <img src="/icons/bars.svg" alt="Virtual Number" className="w-6 h-6" />
                                    </div>
                                    <span className="text-gray-800 text-sm font-semibold">Virtual Number</span>
                                </div>
                            </div>

                            {/* Fund Wallet Tag */}
                            <div
                                className="absolute top-40 right-0 lg:top-72 bg-[#EDECEC] rounded-2xl px-4 py-3 shadow-2xl animate-float-delayed"
                                style={{ animationDelay: "1s" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#C5FF95] rounded-xl flex items-center justify-center">

                                        <img src="/icons/money.svg" alt="Bill Payment" className="w-6 h-6" />
                                    </div>
                                    <span className="text-gray-800 text-sm font-semibold">Fund Wallet</span>
                                </div>
                            </div>

                            {/* Bill Payment Tag */}
                            <div
                                className="absolute bottom-32 -left-4 bg-white rounded-2xl px-4 py-3 shadow-2xl animate-float-delayed"
                                style={{ animationDelay: "0.5s" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                        <img src="/icons/telephone.svg" alt="Bill Payment" className="w-6 h-6" />
                                    </div>
                                    <span className="text-gray-800 text-sm font-semibold">Bill Payment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
        </section>
    )
}

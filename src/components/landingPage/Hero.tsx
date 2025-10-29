"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

export const HeroSection: React.FC = () => {
    const navigate = useNavigate()

    return (
        <section className="relative text-white overflow-hidden flex items-center lg:m-5 mt-4 rounded-2xl lg:rounded-3xl">
            {/* Background */}
            <div className="absolute inset-0 w-screen h-full z-0 left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                <img
                    src="/images/hero-background.jpg"
                    alt="Hero background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            {/* Content */}
            <div className="px-6 lg:px-20 py-16 lg:py-24 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Text Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6 lg:space-y-8 max-w-2xl leading-8"
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
                            className="px-8 py-4 bg-[#5DEBD7] rounded-full text-gray-900 font-semibold text-lg transition-all hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            Get Started
                        </button>
                    </motion.div>

                    {/* Phone + Floating Labels */}
                    <motion.div
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center lg:justify-end"
                    >
                        <div className="relative">
                            <img
                                src="/images/hero-hand-phone.png"
                                alt="Phone"
                                className="w-80 sm:w-96 lg:w-[530px] xl:w-[630px] h-auto object-cover drop-shadow-2xl"
                            />

                            {/* Floating tag 1 */}
                            <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-10 left-6 lg:left-20 lg:top-40 bg-[#EDECEC] rounded-2xl px-4 py-3 shadow-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#5DEBD7] rounded-xl flex items-center justify-center">
                                        <img src="/icons/bars.svg" alt="Virtual Number" className="w-6 h-6" />
                                    </div>
                                    <span className="text-gray-800 text-sm font-semibold">Virtual Number</span>
                                </div>
                            </motion.div>

                            {/* Floating tag 2 */}
                            <motion.div
                                animate={{ y: [0, -15, 0] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-40 right-0 lg:top-72 bg-[#EDECEC] rounded-2xl px-4 py-3 shadow-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#C5FF95] rounded-xl flex items-center justify-center">
                                        <img src="/icons/money.svg" alt="Fund Wallet" className="w-6 h-6" />
                                    </div>
                                    <span className="text-gray-800 text-sm font-semibold">Fund Wallet</span>
                                </div>
                            </motion.div>

                            {/* Floating tag 3 */}
                            <motion.div
                                animate={{ y: [0, -18, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-32 -left-4 bg-white rounded-2xl px-4 py-3 shadow-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                        <img src="/icons/telephone.svg" alt="Bill Payment" className="w-6 h-6" />
                                    </div>
                                    <span className="text-gray-800 text-sm font-semibold">Bill Payment</span>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

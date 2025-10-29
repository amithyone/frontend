"use client"
import type React from "react"
import { motion } from "framer-motion"

export const ServicesSection: React.FC = () => {
  return (
    <section className="pt-6 bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        <motion.div
          className="text-center mb-2 lg:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-sm lg:text-sm font-light text-[#AEAEB2] lg:mb-8 uppercase tracking-wide font-inter">
            Receive SMS & OTP from 900+ Services
          </h2>

          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 sm:gap-x-8 sm:gap-y-4 lg:gap-x-44 lg:gap-y-6 mb-8">
            {["google", "whatsapp", "hinge", "tinder", "uber"].map((icon, index) => (
              <motion.div
                key={icon}
                className="flex items-center"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="w-20 h-20 lg:w-34 lg:h-20 rounded-full flex items-center justify-center">
                  <img src={`/icons/${icon}.svg`} alt={icon} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export const FeatureCards: React.FC = () => {
  return (
    <section className="pb-6 bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        <motion.div
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-[#172624] mb-4">
            Global virtual numbers, instant data & airtime top-ups — all in one.
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-[#393939] max-w-3xl mx-auto font-inter">
            Whether it's verifying online, topping up data and airtime, we keep everything seamless, secure, and hassle-free.
          </p>
        </motion.div>

        <motion.div
          className="overflow-hidden py-8 bg-gray-50"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex animate-marquee gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6">
                {[
                  {
                    title: "Get Virtual Number",
                    desc: "Receive OTP easily and verify online KYC with our virtual international numbers.",
                    btn: "Get a Number",
                    img: "/images/feature-sim-card.png",
                  },
                  {
                    title: "Buy Data and Airtime",
                    desc: "Stay connected online, get your favorite network operator data at an affordable price.",
                    btn: "Stay Connected",
                    img: "/images/feature-wifi.png",
                  },
                  {
                    title: "Bills Payment",
                    desc: "Pay for cable and electricity easily.",
                    btn: "Pay Bills",
                    img: "/icons/bills.svg",
                  },
                ].map((card, index) => (
                  <motion.div
                    key={index}
                    className="bg-[#E7FCF9] rounded-3xl p-6 sm:p-8 relative overflow-hidden flex-shrink-0 w-80 sm:w-96 shadow-lg"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{card.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mb-6">{card.desc}</p>
                    <button className="bg-[#5DEBD7] text-black px-6 py-3 rounded-full font-medium transition-all hover:bg-[#4AD9C7] hover:scale-105 text-sm sm:text-base">
                      {card.btn}
                    </button>
                    <div className="absolute bottom-0 right-0 w-28 sm:w-36 h-28 sm:h-36 -mr-4 -mb-4">
                      <img src={card.img} className="w-full h-full object-contain drop-shadow-lg" />
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

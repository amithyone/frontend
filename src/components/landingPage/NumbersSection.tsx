"use client"
import { motion } from "framer-motion"
import type React from "react"

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
}

export const RealNumbersSection: React.FC = () => {
  const features: Feature[] = [
    {
      title: "Verify",
      description: "Bypass any text or voice verification with real non-voip US based phone numbers.",
      icon: <img src="/icons/check.svg" alt="Verify" className="w-5 h-5" />,
    },
    {
      title: "Secured",
      description: "Give out our numbers instead of yours. Strong encryption and cryptocurrency payments.",
      icon: <img src="/icons/Lock.svg" alt="Secured" className="w-5 h-5" />,
    },
    {
      title: "Automate",
      description: "Build apps using our powerful API. Bulk discount pricing available.",
      icon: <img src="/icons/Brain.svg" alt="Automate" className="w-5 h-5" />,
    },
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Text Section */}
          <div className="space-y-6 lg:space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black"
            >
              <span className="text-gray-500">Real Numbers for</span>
              <br />
              <span className="text-black">Instant OTP and SMS verification, stay private and secured.</span>
            </motion.h2>

            <div className="space-y-4 lg:space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4 hover:scale-[1.02] transition-all duration-300"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ backgroundColor: "#5DEBD7" }}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black mb-2">{feature.title}</h3>
                    <div className="flex flex-col lg:flex-row gap-20">
                      <p className="text-sm sm:text-base text-black mb-2 max-w-md">{feature.description}</p>
                      <a href="#" className="text-blue-600 underline text-sm hover:text-blue-700">
                        Learn More
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >
            <img
              src="/images/lady.png"
              alt="Lady with phone"
              className="w-64 sm:w-72 lg:w-96 h-auto object-cover rounded-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

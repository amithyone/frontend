import type React from "react"

export const ServicesSection: React.FC = () => {
    return (
        <section className="pt-6 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="text-center mb-2 lg:mb-16">
            <h2 className="text-sm lg:text-sm font-light text-[#AEAEB2] lg:mb-8 uppercase tracking-wide font-inter">
              Receive SMS & OTP from 900+ Services
            </h2>
      
            {/* Service logos - responsive grid */}
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 sm:gap-x-8 sm:gap-y-4 lg:gap-x-44 lg:gap-y-6 mb-8">
              <div className="flex items-center">
                <div className="w-20 h-20 lg:w-34 lg:h-20 rounded-full flex items-center justify-center">
                  <img src="/icons/google.svg" alt="google" />
                </div>
              </div>
      
              <div className="flex items-center">
                <div className="w-20 h-20 lg:w-34 lg:h-20 rounded-full flex items-center justify-center">
                  <img src="/icons/whatsapp.svg" alt="whatsapp" />
                </div>
              </div>
      
              <div className="flex items-center">
                <div className="w-20 h-20 lg:w-34 lg:h-20 rounded-full flex items-center justify-center">
                  <img src="/icons/hinge.svg" alt="hinge" />
                </div>
              </div>
      
              <div className="flex items-center">
                <div className="w-20 h-20 lg:w-34 lg:h-20 rounded-full flex items-center justify-center">
                  <img src="/icons/tinder.svg" alt="tinder" />
                </div>
              </div>
      
              <div className="flex items-center">
                <div className="w-16 h-16 lg:w-34 lg:h-20 rounded-full flex items-center justify-center">
                  <img src="/icons/uber.svg" alt="uber" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    )
}

export const FeatureCards: React.FC = () => {
    return (
        <section className="pb-6 bg-white">
            <div className="container mx-auto px-6 lg:px-20">
                <div className="text-center mb-12 lg:mb-16">
                    <h3 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-[#172624] mb-4">
                        Global virtual numbers, instant data & airtime top-ups — all in one.
                    </h3>
                    <p className="text-base sm:text-lg lg:text-xl text-[#393939] max-w-3xl mx-auto font-inter">
                        Whether it's verifying online, topping up data and airtime, we keep everything seamless, secure, and
                        hassle-free.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
                    {/* Get Virtual Number Card */}
                    <div className="bg-[#E7FCF9] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Get Virtual Number</h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-6">
                                Receive OTP easily and verify online KYC with our virtual international numbers.
                            </p>
                            <button className="bg-[#5DEBD7] text-black px-6 py-3 rounded-full font-medium transition-colors text-sm sm:text-base">
                                Get a Number →
                            </button>
                        </div>
                        <div className="absolute bottom-0 right-0 w-24 sm:w-32 h-24 sm:h-32">
                            <img src="/images/feature-sim-card.png" alt="SIM Card" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Buy Data Card */}
                    <div className="bg-[#E7FCF9] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Buy Data and Airtime</h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-6">
                            Stay connected online, get your favorite network operator data at an affordable price.
                            </p>
                            <button className="bg-[#5DEBD7] text-black px-6 py-3 rounded-full font-medium transition-colors text-sm sm:text-base">
                                Stay Connected →
                            </button>
                        </div>
                        <div className="absolute bottom-0 right-0 w-24 sm:w-32 h-24 sm:h-32">
                            <img src="/images/feature-wifi.png" alt="Wi-Fi Symbol" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    {/* Bills payment */}
                    <div className="bg-[#E7FCF9] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Bills Payment</h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-6">
                            pay for cable and electricity easily.
                            </p>
                            <button className="bg-[#5DEBD7] text-black px-6 py-3 rounded-full font-medium transition-colors text-sm sm:text-base">
                                Pay Bills →
                            </button>
                        </div>
                        <div className="absolute bottom-0 right-0 w-24 sm:w-32 h-24 sm:h-32">
                            <img src="/images/feature-wifi.png" alt="Wi-Fi Symbol" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

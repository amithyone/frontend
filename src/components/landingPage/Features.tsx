import type React from "react"

export const ServicesSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-500 mb-8 uppercase tracking-wide">
            Receive SMS & OTP from 900+ Services
          </h2>

          {/* Service logos - responsive grid */}
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 lg:gap-12 mb-8">
            <div className="flex items-center">
              <span className="text-lg sm:text-2xl lg:text-3xl font-normal text-gray-600">Google</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </div>
              <span className="text-lg sm:text-2xl lg:text-3xl font-normal text-gray-600">WhatsApp</span>
            </div>

            <div className="flex items-center">
              <span className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-600">Hinge</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="text-lg sm:text-2xl lg:text-3xl font-normal text-gray-600">tinder</span>
            </div>

            <div className="flex items-center">
              <span className="text-lg sm:text-2xl lg:text-3xl font-normal text-gray-600">Uber</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export const FeatureCards: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-sm font-light text-gray-500 mb-4 uppercase tracking-wide">What You Can Do With Us</h2>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Global virtual numbers, instant data & airtime top-ups — all in one.
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Whether it's verifying online, topping up data and airtime, we keep everything seamless, secure, and
            hassle-free.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Get Virtual Number Card */}
          <div className="bg-green-50 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Get Virtual Number</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Receive OTP easily and verify online KYC with our virtual international numbers.
              </p>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors text-sm sm:text-base">
                Get a Number →
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-24 sm:w-32 h-24 sm:h-32 opacity-20">
              <img src="/images/feature-sim-card.png" alt="SIM Card" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Buy Data Card */}
          <div className="bg-green-50 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Buy Data, Airtime and Bill Payment</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Stay connected online, get your favorite network operator data at an affordable price
              </p>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors text-sm sm:text-base">
                Get Data Now →
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-24 sm:w-32 h-24 sm:h-32 opacity-20">
              <img src="/images/feature-wifi.png" alt="Wi-Fi Symbol" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

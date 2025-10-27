import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-white w-full min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-6 lg:px-20 py-6 bg-transparent absolute top-0 left-0 right-0 z-10">
        <div className="flex items-center">
          <img 
            src="/images/faddedsms-logo.png" 
            alt="FaddedSMS Logo" 
            className="h-8 w-auto"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="px-6 py-2 rounded-full border border-white/40 bg-transparent hover:bg-white/10 text-white font-medium transition-all duration-200"
          >
            Sign Up
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all duration-200"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative text-white overflow-hidden pt-20 min-h-screen flex items-center">
        {/* Hero Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img 
            src="/images/hero-background.jpg" 
            alt="Hero background with blue sky and clouds" 
            className="w-full h-full object-cover"
          />
          {/* Semi-transparent overlay for text readability */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Content Container */}
        <div className="container mx-auto px-6 lg:px-20 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Not comfortable sharing your phone number? — Use Ours!
        </h1>
              <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                Access 900+ services without revealing your personal phone number. Get SMS and OTP messages from any service.
              </p>
              <button 
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-green-500 hover:bg-green-600 rounded-full text-white font-semibold text-lg"
              >
                Get Started For Free
              </button>
            </div>
            
            {/* Hand holding phone with FaddedSMS app */}
            <div className="relative flex justify-center lg:justify-end">
              <img 
                src="/images/hero-hand-phone.png" 
                alt="Hand holding phone with FaddedSMS app" 
                className="w-80 h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-2xl lg:text-3xl font-light text-gray-500 mb-8">
              RECEIVE SMS & OTP FROM 900+ SERVICES
            </h2>
            
            {/* Service logos row */}
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 mb-8">
              {/* Google */}
              <div className="flex items-center">
                <span className="text-2xl lg:text-3xl font-normal text-gray-600">Google</span>
              </div>
              
              {/* WhatsApp */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
                <span className="text-2xl lg:text-3xl font-normal text-gray-600">WhatsApp</span>
              </div>
              
              {/* Hinge */}
              <div className="flex items-center">
                <span className="text-2xl lg:text-3xl font-bold text-gray-600">Hinge</span>
              </div>
              
              {/* Tinder */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span className="text-2xl lg:text-3xl font-normal text-gray-600">tinder</span>
              </div>
              
              {/* Uber */}
              <div className="flex items-center">
                <span className="text-2xl lg:text-3xl font-normal text-gray-600">Uber</span>
              </div>
            </div>
            
            <h3 className="text-xl lg:text-2xl font-light text-gray-500">
              WHAT YOU CAN DO WITH US
            </h3>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-sm font-light text-gray-500 mb-4 uppercase tracking-wide">
              WHAT YOU CAN DO WITH US
            </h2>
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Global virtual numbers, instant data & airtime top-ups — all in one.
        </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether it's verifying online, topping up data and airtime, we keep everything seamless, secure, and hassle-free.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Get Virtual Number Card */}
            <div className="bg-green-50 rounded-3xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Virtual Number</h3>
                <p className="text-gray-600 mb-6">
                  Receive OTP easily and verify online KYC with our virtual international numbers.
                </p>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors">
                  Get a Number →
                </button>
              </div>
              {/* SIM Card - Bottom right as background */}
              <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
                <img 
                  src="/images/feature-sim-card.png" 
                  alt="SIM Card" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Buy Data Card */}
            <div className="bg-green-50 rounded-3xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Buy Data, Airtime and Bill Payment</h3>
                <p className="text-gray-600 mb-6">
                  Stay connected online, get your favorite network operator data at an affordable price
                </p>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors">
                  Get Data Now →
                </button>
              </div>
              {/* Wi-Fi Symbol - Bottom right as background */}
              <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20">
                <img 
                  src="/images/feature-wifi.png" 
                  alt="Wi-Fi Symbol" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Numbers Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                <span className="text-gray-500">Real Numbers for</span><br />
                <span className="text-black">Instant OTP and SMS verification, stay private and secured.</span>
              </h2>
              
              <div className="space-y-6">
                {/* Verify Feature */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Verify</h3>
                    <p className="text-gray-600 mb-2">
                      Bypass any text or voice verification with real non-voip US based phone numbers.
                    </p>
                    <a href="#" className="text-blue-600 underline text-sm">Learn More</a>
                  </div>
                </div>

                {/* Secured Feature */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Secured</h3>
                    <p className="text-gray-600 mb-2">
                      Give out our numbers instead of yours. Strong encryption and cryptocurrency payments.
                    </p>
                    <a href="#" className="text-blue-600 underline text-sm">Learn More</a>
                  </div>
                </div>

                {/* Automate Feature */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Automate</h3>
                    <p className="text-gray-600 mb-2">
                      Build apps using our powerful API. Bulk discount pricing available.
                    </p>
                    <a href="#" className="text-blue-600 underline text-sm">Learn More</a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Lady with phone - Right side */}
            <div className="flex justify-center lg:justify-end">
              <img 
                src="/images/real-numbers-lady.png" 
                alt="Lady with phone" 
                className="w-80 h-96 object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in just 3 simple steps
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Choose Service</h3>
              <p className="text-gray-600">
                Select from 900+ supported services like WhatsApp, Instagram, or any platform you need.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Number</h3>
              <p className="text-gray-600">
                Receive a temporary phone number instantly. Use it for verification on your chosen service.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Receive SMS</h3>
              <p className="text-gray-600">
                Get your verification code instantly and complete your registration or login.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Today Section */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-6 lg:px-20 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
            Get started today
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            Sign-Up is quick, free, and easy. We respect your privacy.
          </p>
          <p className="text-lg text-gray-700 mb-8">
            Your account will be ready to use within seconds.
          </p>
          <button 
            onClick={() => navigate('/register')}
            className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold text-lg transition-colors"
          >
            Sign Up
          </button>
        </div>
      </section>

      {/* Loved by Users Worldwide Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">
              RATINGS AND REVIEWS
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Loved by users worldwide.
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Trusted worldwide by individuals and businesses who value privacy, speed, and reliability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "I have been using SMS Pro's renewable rentals for several weeks now. It gives me peace of mind when ordering food and rideshares."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900">Patelia Mich</p>
                  <p className="text-sm text-gray-500">Freelancer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "This is hands down the best tool to bypass 2-factor OTP codes. Their numbers always work and the support team is great."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900">Darrell Steward</p>
                  <p className="text-sm text-gray-500">Freelancer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6">
                "Got a temporal USA Number on Faddedsms for several weeks now. It gives me peace of mind when ordering food and rideshares"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900">Eleanor Pena</p>
                  <p className="text-sm text-gray-500">Virtual Assistant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-green-800 mb-8">
              Frequently Asked Questions
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">What is FaddedSMS?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
              <p className="text-gray-600 mt-4">
                FaddedSMS lets you get real phone numbers to receive SMS or voice verifications, sign ups, testing, or protecting your personal number.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Are the numbers real?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
              <p className="text-gray-600 mt-4">
                Yes — all numbers are real, non-VoIP US numbers. They work with major services like Google, PayPal, Uber, and more.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">How often are numbers restocked?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
              <p className="text-gray-600 mt-4">
                New numbers are added daily. If the one you want isn't available, check back soon.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">How secure is it?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
              <p className="text-gray-600 mt-4">
                Your sessions are encrypted, and we accept crypto payments for full privacy.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">How is this different from Google Voice or VoIP numbers?</h3>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </div>
              <p className="text-gray-600 mt-4">
                Unlike VoIP or Google Voice, our real non-VoIP numbers are accepted by almost all major platforms, reducing verification issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-100 to-teal-100 overflow-hidden">
        {/* Phone image as background overlay */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[600px] opacity-90">
          <img 
            src="/images/phoneone.png" 
            alt="FaddedSMS Phone Interface" 
            className="w-full h-full object-contain transform rotate-12 translate-x-10 translate-y-60"
          />
        </div>
        
        <div className="container mx-auto px-6 lg:px-20 relative z-10">
          <div className="max-w-2xl">
            {/* Text content */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-green-800 mb-6">
                Stay Private. Stay Verified.
              </h2>
              <p className="text-lg text-gray-700 mb-8">
                Reliable International Numbers for SMS and voice verifications—secure, instant, and trusted worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="px-8 py-3 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white rounded-lg font-semibold transition-colors"
                >
                  Sign in
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-xl font-bold text-gray-900">faddedsms</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                We are the premier one stop shop for all your SMS, text, and voice verification needs. Exceptional service and competitive pricing sets us apart from the rest.
              </p>
            </div>
            
            {/* Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm">LINKS</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-teal-600 transition-colors text-sm">Products</a></li>
                <li><a href="#" className="hover:text-teal-600 transition-colors text-sm">Free Numbers</a></li>
                <li><a href="#" className="hover:text-teal-600 transition-colors text-sm">Buy Credits</a></li>
                <li><a href="#" className="hover:text-teal-600 transition-colors text-sm">API</a></li>
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm">CONTACT</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-teal-600 transition-colors text-sm">Telegram</a></li>
                <li><a href="#" className="hover:text-teal-600 transition-colors text-sm">WhatsApp</a></li>
                <li><a href="#" className="hover:text-teal-600 transition-colors text-sm">Instagram</a></li>
                <li><a href="#" className="hover:text-teal-600 transition-colors text-sm">Twitter</a></li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider text-sm">COMPANY</h3>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-teal-600 transition-colors text-sm">Customer Support</a></li>
                <li><a href="#" className="hover:text-teal-600 transition-colors text-sm">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-teal-600 transition-colors text-sm">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p className="text-sm">&copy; 2025 faddedsms. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
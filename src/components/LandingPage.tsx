import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Smartphone, Zap, Users, Star, CheckCircle, ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-oxford-blue via-oxford-blue-light to-oxford-blue-dark text-white">
      {/* Navigation */}
      <nav className="px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold">SMS Pro</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-white hover:text-blue-300 transition-colors">
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Not comfortable sharing your phone number?
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-blue-200">
          No Problem. Use Ours.
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Receive SMS & OTP from 900+ services with real US mobile numbers backed by physical SIMs. 
          Protect your privacy and bypass any text or voice verification.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/register" 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/login" 
            className="border border-blue-400 hover:bg-blue-400/10 px-8 py-4 rounded-xl text-lg font-semibold transition-all"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 py-16">
        <h3 className="text-2xl font-semibold text-center mb-12 text-blue-200">
          Works With...
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-4xl mx-auto">
          {['Google', 'Ticketmaster', 'PayPal', 'Uber', 'Tinder'].map((service) => (
            <div key={service} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all transform hover:scale-105">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-blue-300 font-semibold">{service.charAt(0)}</span>
              </div>
              <span className="text-sm font-medium">{service}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-400 mt-6">And hundreds more...</p>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-16 text-blue-200">
            What we offer
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all transform hover:scale-105">
              <div className="w-16 h-16 bg-green-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="text-xl font-bold mb-4">Verify</h4>
              <p className="text-gray-300 mb-4">
                Bypass any text or voice verification with real non-voip US based phone numbers.
              </p>
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Learn More →
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all transform hover:scale-105">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-xl font-bold mb-4">Secure</h4>
              <p className="text-gray-300 mb-4">
                Give out our numbers instead of yours. Strong encryption and cryptocurrency payments.
              </p>
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Learn More →
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/20 transition-all transform hover:scale-105">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-xl font-bold mb-4">Automate</h4>
              <p className="text-gray-300 mb-4">
                Build apps using our powerful API. Bulk discount pricing available.
              </p>
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-16 text-blue-200">
            Loved by users worldwide
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                text: "Literally took me 2 minutes to create a bunch of anonymous accounts for Twitter & Discord using your temporary phone verification service. Good job, guys.",
                author: "Social Media Manager",
                location: "San Francisco, USA",
                rating: 5.0
              },
              {
                text: "This is hands down the best tool to bypass 2-factor OTP codes. Their numbers always work and the support team is great.",
                author: "Digital Nomad",
                location: "Bangkok, Thailand",
                rating: 5.0
              },
              {
                text: "I have been using SMS Pro's renewable rentals for several weeks now. It gives me peace of mind when ordering food and rideshares.",
                author: "Privacy Advocate",
                location: "Las Vegas, USA",
                rating: 4.5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(testimonial.rating) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} 
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-300">{testimonial.rating}</span>
                </div>
                <p className="text-gray-300 mb-4 text-sm leading-relaxed">"{testimonial.text}"</p>
                <div className="text-sm">
                  <p className="font-semibold text-blue-300">{testimonial.author}</p>
                  <p className="text-gray-400">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-6 text-blue-200">
            Get started today
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Sign-Up is quick, free, and easy. We respect your privacy. Your account will be ready to use within minutes.
          </p>
          <Link 
            to="/register" 
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <span>Sign Up Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4 text-blue-200">Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Service List</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-blue-200">Services</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Free Numbers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Buy Credits</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-blue-200">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Updates</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-blue-200">SMS Pro</h4>
              <p className="text-sm text-gray-400 mb-4">
                We are the premier one stop shop for all your SMS, text, and voice verification needs.
              </p>
              <p className="text-xs text-gray-500">© 2024 SMS Pro All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

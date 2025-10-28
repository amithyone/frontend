import type React from "react"

interface Testimonial {
  name: string
  role: string
  text: string
}

export const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      name: "Patelia Mich",
      role: "Freelancer",
      text: "I have been using SMS Pro's renewable rentals for several weeks now. It gives me peace of mind when ordering food and rideshares.",
    },
    {
      name: "Darrell Steward",
      role: "Freelancer",
      text: "This is hands down the best tool to bypass 2-factor OTP codes. Their numbers always work and the support team is great.",
    },
    {
      name: "Eleanor Pena",
      role: "Virtual Assistant",
      text: "Got a temporal USA Number on Faddedsms for several weeks now. It gives me peace of mind when ordering food and rideshares",
    },
  ]

  const StarRating = () => (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">Ratings and Reviews</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Loved by users worldwide.</h2>
          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto">
            Trusted worldwide by individuals and businesses who value privacy, speed, and reliability.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <StarRating />
              </div>
              <p className="text-sm sm:text-base text-gray-700 mb-6">"{testimonial.text}"</p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</p>
                  <p className="text-xs sm:text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

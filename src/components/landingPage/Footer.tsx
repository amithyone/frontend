interface FooterLink {
    label: string
    href: string
  }
  
  interface FooterSection {
    title: string
    links: FooterLink[]
  }
  
  export const Footer: React.FC = () => {
    const sections: FooterSection[] = [
      {
        title: "LINKS",
        links: [
          { label: "Products", href: "#" },
          { label: "Free Numbers", href: "#" },
          { label: "Buy Credits", href: "#" },
          { label: "API", href: "#" },
        ],
      },
      {
        title: "CONTACT",
        links: [
          { label: "Telegram", href: "#" },
          { label: "WhatsApp", href: "#" },
          { label: "Instagram", href: "#" },
          { label: "Twitter", href: "#" },
        ],
      },
      {
        title: "COMPANY",
        links: [
          { label: "Customer Support", href: "#" },
          { label: "Terms & Conditions", href: "#" },
          { label: "Privacy Policy", href: "#" },
        ],
      },
    ]
  
    return (
      <footer className="bg-white py-12 sm:py-16 lg:py-20 border-t border-gray-100">
        <div className="container mx-auto px-6 lg:px-20">
          {/* Logo and Description - Full width on mobile */}
          <div className="mb-10 lg:mb-12">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
                </svg>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">faddedsms</span>
            </div>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed max-w-2xl">
              We are the premier one stop shop for all your SMS, text, and voice verification needs. Exceptional service
              and competitive pricing sets us apart from the rest.
            </p>
          </div>
  
          {/* Footer Links - 3 columns on all screens */}
          <div className="grid grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mb-10 lg:mb-12">
            {sections.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-400 mb-4 sm:mb-6 uppercase tracking-wider text-xs sm:text-sm">
                  {section.title}
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-900 hover:text-teal-600 transition-colors text-sm sm:text-base block"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
  
          {/* Divider */}
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-sm sm:text-base text-gray-700">
              &copy; 2025 faddedsms. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    )
  }
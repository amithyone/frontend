import type React from "react"

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
      title: "Links",
      links: [
        { label: "Products", href: "#" },
        { label: "Free Numbers", href: "#" },
        { label: "Buy Credits", href: "#" },
        { label: "API", href: "#" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Telegram", href: "#" },
        { label: "WhatsApp", href: "#" },
        { label: "Instagram", href: "#" },
        { label: "Twitter", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Customer Support", href: "#" },
        { label: "Terms & Conditions", href: "#" },
        { label: "Privacy Policy", href: "#" },
      ],
    },
  ]

  return (
    <footer className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 lg:mb-12">
          {/* Logo and Description */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">faddedsms</span>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
              We are the premier one stop shop for all your SMS, text, and voice verification needs. Exceptional service
              and competitive pricing sets us apart from the rest.
            </p>
          </div>

          {/* Footer Links */}
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 mb-4 uppercase tracking-wider text-xs sm:text-sm">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="hover:text-teal-600 transition-colors text-xs sm:text-sm text-gray-600"
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
        <div className="border-t border-gray-200 pt-8 text-center">
          <p className="text-xs sm:text-sm text-gray-500">&copy; 2025 faddedsms. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

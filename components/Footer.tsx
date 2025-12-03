/**
 * Footer Component
 * Site footer with location, WhatsApp contact, and copyright info
 */

import Link from 'next/link'
import WhatsAppButton from './WhatsAppButton'

interface FooterProps {
  storeName: string
  storeLocation?: string
  whatsappNumber?: string
}

export default function Footer({
  storeName,
  storeLocation,
  whatsappNumber,
}: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">{storeName}</h3>
            {storeLocation && (
              <p className="text-gray-300 mb-4 flex items-start gap-2">
                <svg
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{storeLocation}</span>
              </p>
            )}
            <p className="text-gray-300 text-sm">
              Leading tech and laptop retailer serving the community with quality products and excellent service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=laptops"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Laptops
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=accessories"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <p className="text-gray-300 mb-4 text-sm">
              Have questions? Chat with us on WhatsApp for instant support.
            </p>
            {whatsappNumber && (
              <div className="mb-6">
                <WhatsAppButton
                  phoneNumber={whatsappNumber}
                  variant="secondary"
                  size="md"
                />
              </div>
            )}
            <p className="text-gray-400 text-xs">
              Business Hours: Mon-Sat, 10AM - 8PM
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} {storeName}. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

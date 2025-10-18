"use client";

import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Top Section */}
      <div className="bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Flex Container for Top Section */}
          <div className="flex flex-col lg:flex-row justify-between gap-20">
            {/* Newsletter */}
            <section className="flex-1 space-y-4" aria-labelledby="newsletter-heading">
              <h3 id="newsletter-heading" className="text-xl font-bold">
                Stay Updated with Skill Trade
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Get updates on new services, featured professionals & more.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md" aria-label="Newsletter subscription">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-white text-gray-900 border-0 h-10 flex-1"
                  aria-label="Email address for newsletter"
                  required
                />
                <Button 
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-700 text-white h-12 px-6 flex items-center gap-2 whitespace-nowrap"
                  aria-describedby="newsletter-privacy"
                >
                  Subscribe <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </form>
              <p id="newsletter-privacy" className="text-xs text-gray-400">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </section>

            {/* Quick Links */}
            <section className="flex-0.5 space-y-4" aria-labelledby="quick-links-heading">
              <h3 id="quick-links-heading" className="text-lg font-semibold">Quick Links</h3>
              <nav aria-label="Footer navigation">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-300">
                  <Link href="/" className="hover:text-white transition-colors focus:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 rounded">
                    Home
                  </Link>
                  <Link href="/services" className="hover:text-white transition-colors focus:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 rounded">
                    Services
                  </Link>
                  <Link href="/professionals" className="hover:text-white transition-colors focus:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 rounded">
                    Find Professionals
                  </Link>
                  <Link href="/about-us" className="hover:text-white transition-colors focus:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 rounded">
                    About Us
                  </Link>
                  <Link href="/contact-us" className="hover:text-white transition-colors focus:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 rounded">
                    Contact
                  </Link>
                  <Link href="/blog" className="hover:text-white transition-colors focus:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 rounded">
                    Blog
                  </Link>
                </div>
              </nav>
            </section>


            {/* Social Media */}
            <section className="flex-1 space-y-4" aria-labelledby="social-media-heading">
              <h3 id="social-media-heading" className="text-lg font-semibold">Follow Us</h3>
              <p className="text-sm text-gray-400">
                Stay connected for updates.
              </p>
              <div className="flex space-x-3" role="list" aria-label="Social media links">
                <a
                  href="#" // entire a valid link
                  className="p-3 rounded-full bg-gray-700 hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Follow us on Facebook"
                  role="listitem"
                >
                  <FaFacebook size={20} aria-hidden="true" />
                </a>
                <a
                  href="#" // entire a valid link
                  className="p-3 rounded-full bg-gray-700 hover:bg-blue-400 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Follow us on Twitter"
                  role="listitem"
                >
                  <FaTwitter size={20} aria-hidden="true" />
                </a>
                <a
                  href="#" // entire a valid link
                  className="p-3 rounded-full bg-gray-700 hover:bg-pink-300 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Follow us on Instagram"
                  role="listitem"
                >
                  <FaInstagram size={20} aria-hidden="true" />
                </a>
                <a
                  href="#" // entire a valid link
                  className="p-3 rounded-full bg-gray-700 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label="Follow us on LinkedIn"
                  role="listitem"
                >
                  <FaLinkedin size={20} aria-hidden="true" />
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6 px-4">
        <div className="max-w-7xl mx-auto ">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
            <div className="flex justify-center flex-col sm:flex-row items-center gap-2 sm:gap-0">
              <span>
                © {new Date().getFullYear()} Skill Trade. All rights reserved.
              </span>
              <span className="hidden sm:inline mx-2">•</span>
              <span className="flex items-center">
                Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> in
                India
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/term-conditions" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/about" className="hover:text-white transition-colors">
                Cookies
              </Link>
              <Link href="/about" className="hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

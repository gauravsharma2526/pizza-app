import React from 'react';
import { Pizza, Heart, Github, Twitter, Instagram } from 'lucide-react';

/**
 * Footer component with branding and links
 */
export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-full">
                <Pizza className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-gray-900 dark:text-white">
                Crust<span className="text-primary-500">&Co</span>
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Crafting authentic Italian pizzas with love and the finest ingredients since 1985.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Menu', 'Add Pizza', 'Order History', 'Contact Us'].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>123 Pizza Street, Naples</li>
              <li>+1 (555) 123-4567</li>
              <li>hello@crustandco.com</li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <Twitter className="w-4 h-4 text-gray-500" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <Instagram className="w-4 h-4 text-gray-500" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <Github className="w-4 h-4 text-gray-500" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Crust & Co. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary-500 fill-primary-500" /> and fresh
            ingredients
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

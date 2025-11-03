import { Link } from "react-router-dom";
import { Cloud, Github, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative z-10 mt-12 pb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="glass rounded-2xl p-8">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Cloud className="w-6 h-6 text-white" />
                <h3 className="font-bold text-white text-lg">WeatherNow</h3>
              </div>
              <p className="text-white/70 text-sm">
                AI-powered weather insights for smarter planning
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <nav className="space-y-2">
                <Link
                  to="/about"
                  className="block text-white/70 hover:text-white text-sm transition-colors"
                >
                  About Us
                </Link>
                <Link
                  to="/features"
                  className="block text-white/70 hover:text-white text-sm transition-colors"
                >
                  Features
                </Link>
                <Link
                  to="/dashboard"
                  className="block text-white/70 hover:text-white text-sm transition-colors"
                >
                  Performance Dashboard
                </Link>
                <Link
                  to="/privacy"
                  className="block text-white/70 hover:text-white text-sm transition-colors"
                >
                  Privacy Policy
                </Link>
              </nav>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 text-center">
            <p className="text-white/60 text-sm mb-2">
              © {new Date().getFullYear()} WeatherNow AI. All rights reserved.
            </p>
            <p className="text-white/50 text-xs">
              Proprietary Software — Unauthorized copying, modification, or redistribution is strictly prohibited.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

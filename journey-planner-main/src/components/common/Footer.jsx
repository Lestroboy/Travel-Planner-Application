import { Link } from "react-router-dom";
import { FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail, FiPhone } from "react-icons/fi";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", path: "/about" },
      { name: "Careers", path: "/careers" },
      { name: "Press", path: "/press" },
      { name: "Blog", path: "/blog" },
    ],
    support: [
      { name: "Help Center", path: "/help" },
      { name: "Safety Info", path: "/safety" },
      { name: "Cancellation Options", path: "/cancellation" },
      { name: "Contact Us", path: "/contact" },
    ],
    legal: [
      { name: "Terms of Service", path: "/terms" },
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Cookie Policy", path: "/cookies" },
      { name: "Refund Policy", path: "/refund" },
    ],
    destinations: [
      { name: "Goa", path: "/destinations/goa" },
      { name: "Dubai", path: "/destinations/dubai" },
      { name: "Maldives", path: "/destinations/maldives" },
      { name: "Bali", path: "/destinations/bali" },
    ],
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      {/* Main Footer */}
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-sunset flex items-center justify-center">
                <FiMapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-heading font-bold">TravelPlan</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm mb-6">
              Your ultimate travel companion. Plan, book, and explore the world with ease.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors"
              >
                <FiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Top Destinations</h4>
            <ul className="space-y-3">
              {footerLinks.destinations.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <a
              href="mailto:support@travelplan.com"
              className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm"
            >
              <FiMail className="w-4 h-4" />
              support@travelplan.com
            </a>
            <a
              href="tel:+911234567890"
              className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground text-sm"
            >
              <FiPhone className="w-4 h-4" />
              +91 123 456 7890
            </a>
          </div>
          <p className="text-primary-foreground/50 text-sm">
            © {currentYear} TravelPlan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

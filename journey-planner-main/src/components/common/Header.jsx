import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiUser, FiBell, FiHeart, FiMapPin } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Handle scroll effect
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHomePage = location.pathname === "/";

  const navLinks = [
    { name: "Flights", path: "/flights/search" },
    { name: "Hotels", path: "/hotels/search" },
    { name: "Trains", path: "/trains/search" },
    { name: "Cabs", path: "/cabs/search" },
    { name: "My Trips", path: "/trips" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage
          ? "bg-background/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-sunset flex items-center justify-center">
              <FiMapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <span
              className={`text-xl font-heading font-bold ${
                isScrolled || !isHomePage ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              TravelPlan
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path
                    ? "text-primary"
                    : isScrolled || !isHomePage
                    ? "text-foreground"
                    : "text-primary-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate("/notifications")}
              className={`p-2 rounded-full transition-colors ${
                isScrolled || !isHomePage
                  ? "hover:bg-muted text-foreground"
                  : "hover:bg-primary-foreground/10 text-primary-foreground"
              }`}
            >
              <FiBell className="w-5 h-5" />
            </button>
            <button
              className={`p-2 rounded-full transition-colors ${
                isScrolled || !isHomePage
                  ? "hover:bg-muted text-foreground"
                  : "hover:bg-primary-foreground/10 text-primary-foreground"
              }`}
            >
              <FiHeart className="w-5 h-5" />
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 pl-2 pr-4 py-2 rounded-full border border-border bg-background hover:shadow-md transition-all"
              >
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-foreground">
                  {user?.name?.split(" ")[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="btn-primary text-sm py-2"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg ${
              isScrolled || !isHomePage ? "text-foreground" : "text-primary-foreground"
            }`}
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="container-custom py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block py-2 font-medium ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border flex items-center gap-4">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full py-2"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="btn-primary w-full"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

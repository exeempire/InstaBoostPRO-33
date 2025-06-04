import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { AuthModal } from "./auth-modal";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services", requireAuth: true },
    { href: "/wallet", label: "Wallet", requireAuth: true },
    { href: "/add-funds", label: "Add Funds", requireAuth: true },
    { href: "/orders", label: "Orders", requireAuth: true },
    { href: "/faq", label: "FAQ" },
    { href: "/terms", label: "Terms" },
    { href: "/privacy", label: "Privacy" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 shadow-lg" style={{ backgroundColor: 'var(--navbar-bg)', borderBottom: '1px solid var(--gold)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-gold to-tan rounded-xl flex items-center justify-center shadow-xl overflow-hidden">
                <img 
                  src="https://files.catbox.moe/95hr3x.png" 
                  alt="InstaBoost Pro Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="text-gold font-bold text-2xl">InstaBoost Pro</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => {
                if (link.requireAuth && !isAuthenticated) {
                  return (
                    <button
                      key={link.href}
                      onClick={() => setIsAuthModalOpen(true)}
                      className="nav-link hover:text-gold"
                    >
                      {link.label}
                    </button>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link ${
                      location === link.href ? "text-gold" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xs text-cream/70">Balance</div>
                    <div className="text-gold font-semibold">
                      {formatCurrency(user.walletBalance)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-cream/70">UID</div>
                    <div className="text-cream text-sm font-mono">{user.uid}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-cream/70 hover:text-gold"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="btn-outline"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="btn-primary"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-cream hover:text-gold transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-charcoal border-t border-gold/20">
            <div className="px-4 py-2 space-y-2">
              {navLinks.map((link) => {
                if (link.requireAuth && !isAuthenticated) {
                  return (
                    <button
                      key={link.href}
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-cream hover:text-gold transition-colors duration-300"
                    >
                      {link.label}
                    </button>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-3 py-2 text-cream hover:text-gold transition-colors duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              
              <div className="border-t border-gold/20 pt-2 mt-2">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    {/* Profile Section */}
                    <div className="px-3 py-2 bg-gold/10 rounded-lg">
                      <div className="text-gold font-semibold text-sm">Profile</div>
                      <div className="text-cream text-sm">@{user.instagramUsername}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-cream/70 text-xs">UID: {user.uid}</div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(user.uid);
                            setIsMobileMenuOpen(false);
                          }}
                          className="text-gold text-xs hover:text-gold/80"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="text-gold text-sm font-semibold mt-1">
                        Balance: ₹{user.walletBalance}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-red-400 hover:bg-red-400/10 transition-colors rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gold hover:bg-gold/10 transition-colors rounded-lg"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}

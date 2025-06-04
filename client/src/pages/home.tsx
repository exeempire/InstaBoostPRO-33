import { useState } from "react";
import { Link } from "wouter";
import { useAuth, useClaimBonus } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const claimBonus = useClaimBonus();
  const { toast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleClaimBonus = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    if (user?.bonusClaimed) {
      toast({
        title: "Bonus Already Claimed",
        description: "You have already claimed your welcome bonus.",
        variant: "destructive",
      });
      return;
    }

    try {
      await claimBonus.mutateAsync();
      toast({
        title: "Bonus Claimed!",
        description: "₹10 has been added to your wallet!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to claim bonus. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="px-4 mb-16">
          <div className="max-w-7xl mx-auto">
            <div 
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-charcoal to-charcoal-dark border border-gold/20 mb-16"
              style={{
                backgroundImage: `linear-gradient(rgba(18, 38, 32, 0.9), rgba(18, 38, 32, 0.9)), url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&h=1200')`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="px-8 py-16 md:px-16 md:py-24 text-center">
                <div className="inline-block bg-gradient-to-r from-gold to-tan text-charcoal-dark px-6 py-2 rounded-full font-bold mb-6 text-sm uppercase tracking-wide">
                  🚀 Premium SMM Panel
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-gold mb-6 leading-tight">
                  Boost Your Social Media<br />
                  <span className="text-cream">Instantly</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-cream/80 mb-8 max-w-3xl mx-auto">
                  Get premium followers, likes, views, and comments at unbeatable prices starting from ₹1/1000
                </p>

                {/* Welcome Bonus Card */}
                <div className="inline-block bg-charcoal/90 backdrop-blur-sm border border-gold/30 rounded-2xl p-8 mb-8 shadow-2xl">
                  <div className="text-center">
                    <i className="fas fa-gift text-gold text-4xl mb-4"></i>
                    <h3 className="text-2xl font-bold text-gold mb-2">Welcome Bonus</h3>
                    <p className="text-cream/80 mb-4">Claim your free ₹10 bonus now!</p>
                    <Button 
                      onClick={handleClaimBonus}
                      disabled={claimBonus.isPending || (isAuthenticated && user?.bonusClaimed)}
                      className="btn-primary pulse-glow"
                    >
                      {claimBonus.isPending ? (
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                      ) : (
                        <i className="fas fa-star mr-2"></i>
                      )}
                      {isAuthenticated && user?.bonusClaimed ? "Bonus Claimed" : "Claim Now"}
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="btn-primary hover:scale-105 transition-all duration-300"
                  >
                    <i className="fas fa-rocket mr-2"></i>Get Started Free
                  </Button>
                  <Link href="/services">
                    <Button variant="outline" className="btn-outline">
                      <i className="fas fa-eye mr-2"></i>View Services
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="bg-charcoal border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-tan/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-users text-gold text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gold mb-2">Real Followers</h3>
                <p className="text-cream/80">High-quality Indian and international followers starting from ₹4/1000</p>
              </div>

              <div className="bg-charcoal border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-tan/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-heart text-gold text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gold mb-2">Instant Likes</h3>
                <p className="text-cream/80">Boost engagement with authentic likes starting from ₹2/1000</p>
              </div>

              <div className="bg-charcoal border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-tan/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-eye text-gold text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gold mb-2">Video Views</h3>
                <p className="text-cream/80">Increase video reach with premium views starting from ₹1/1000</p>
              </div>

              <div className="bg-charcoal border border-gold/20 rounded-xl p-6 hover:border-gold/40 transition-all duration-300 hover:transform hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-tan/20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-comments text-gold text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gold mb-2">Comments</h3>
                <p className="text-cream/80">Drive conversations with comments starting from ₹8/1000</p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-charcoal border border-gold/20 rounded-2xl p-8 text-center">
              <h2 className="text-3xl font-bold text-gold mb-8">Why Choose InstaBoost Pro?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold text-gold mb-2">50K+</div>
                  <div className="text-cream/70">Happy Customers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gold mb-2">24/7</div>
                  <div className="text-cream/70">Customer Support</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-gold mb-2">99.9%</div>
                  <div className="text-cream/70">Delivery Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}

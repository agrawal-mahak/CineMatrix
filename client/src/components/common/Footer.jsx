import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Film,
  Headphones,
  Mail,
  Ticket,
  ShieldCheck,
  Send,
  CheckCircle2,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  CreditCard,
  Smartphone,
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail('');
        setSubscribed(false);
      }, 4000);
    }
  };

  return (
    <footer className="bg-[#0B0F19] border-t border-white/10 mt-20 text-gray-400 text-xs">
      
      {/* 1. Value Proposition Features Strip */}
      <div className="border-b border-white/5 bg-surface-secondary/40 py-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          
          <div className="flex items-center gap-4 justify-center md:justify-start p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">24/7 Customer Care</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Instant assistance & booking help</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Instant E-Ticket Pass</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">M-Ticket QR code directly to mail</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Secure Checkout</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">256-Bit SSL Encrypted Payments</p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start p-3 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Exclusive Promo Offers</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">Up to 50% OFF discount codes</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Multi-Column Quick Links & Newsletter Subscription */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-rose-700 flex items-center justify-center shadow-lg shadow-brand-primary/40 border border-red-500/30 group-hover:scale-105 transition-transform">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Cine<span className="text-brand-primary font-black">Matrix</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              CineMatrix is your premium digital cinema ticketing platform. Experience seamless real-time seat locking, instant QR E-Ticket passes, and pre-ordered concessions across top cinema halls.
            </p>

            {/* Newsletter Subscription Box */}
            <div className="pt-2">
              <h5 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">Subscribe to Exclusive Movie Offers</h5>
              {subscribed ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Subscribed! Check your email for movie discount vouchers.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-surface-secondary border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-brand-primary transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold shadow-md shadow-brand-primary/30 flex items-center gap-1.5 transition-all"
                  >
                    <span>Subscribe</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 2: Movies Now Showing */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">Now Showing</h5>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><Link to="/" className="hover:text-white transition-colors">Inception: Resonance</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Cyberpunk Metropolis</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Starlight Symphony</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Shadow Realm Chronicles</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">Spider-Man: Brand New Day</Link></li>
            </ul>
          </div>

          {/* Column 3: Popular Cities */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">Popular Cities</h5>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><span className="hover:text-white transition-colors cursor-pointer">Mumbai (120+ Screens)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Delhi NCR (95+ Screens)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Bengaluru (80+ Screens)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Hyderabad (75+ Screens)</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Pune & Chennai</span></li>
            </ul>
          </div>

          {/* Column 4: Help & Legal */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">Customer Care</h5>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><Link to="/my-bookings" className="hover:text-white transition-colors">My Bookings & E-Tickets</Link></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Resend Ticket PDF</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms & Conditions</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">24x7 Help Desk</span></li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Bottom Bar: Social Links & Payment Gateway Badges */}
      <div className="border-t border-white/5 bg-surface-primary/80 py-6">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="text-center md:text-left space-y-1">
            <p>© 2026 CineMatrix Entertainment Inc. All rights reserved.</p>
            <p className="text-[10px] text-gray-500">Built with Node.js, Express, MongoDB, React 18, Redux & Tailwind CSS.</p>
          </div>

          {/* Payment Gateway Badges */}
          <div className="flex items-center gap-3 text-gray-400">
            <span className="text-[10px] uppercase font-bold text-gray-500">Secure Payments:</span>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <CreditCard className="w-4 h-4 text-brand-primary" />
              <span>Visa / Mastercard</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Instant UPI</span>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-3">
            <a href="#instagram" className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-brand-primary transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#twitter" className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-sky-400 transition-all">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#facebook" className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-blue-500 transition-all">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="#youtube" className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-red-500 transition-all">
              <Youtube className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>

    </footer>
  );
};

export default Footer;

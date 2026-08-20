import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Film,
  MapPin,
  Search,
  User as UserIcon,
  LogOut,
  Ticket,
  ChevronDown,
  Shield,
} from 'lucide-react';
import LocationSelector from './LocationSelector';
import { setSelectedCity, setSearchQuery } from '../../store/movieSlice';
import { openAuthModal, logout } from '../../store/authSlice';

const CITIES = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Ratlam', 'Indore', 'Bhopal', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Pune'];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { selectedCity, searchQuery } = useSelector((state) => state.movies);

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass-nav px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-rose-700 flex items-center justify-center shadow-lg shadow-brand-primary/40 border border-red-500/30 group-hover:scale-105 transition-transform">
            <Film className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">
            Cine<span className="text-brand-primary font-black">Matrix</span>
          </span>
        </Link>

        {/* Search & City Selection Bar */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xl mx-4">
          {/* Location Selector */}
          <LocationSelector />

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search movies, genres, languages..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-surface-secondary border border-white/5 text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:border-brand-primary/50 focus:ring-1 focus:ring-brand-primary/50 transition-all"
            />
          </div>
        </div>

        {/* User Auth Profile Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-surface-secondary hover:bg-surface-tertiary border border-white/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-rose-700 flex items-center justify-center text-white font-black text-sm shadow-md border border-red-500/30 shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-gray-100 flex items-center gap-1">
                    {user?.name}
                    {user?.role === 'ADMIN' && (
                      <span className="bg-brand-primary/20 text-brand-primary text-[10px] px-1.5 py-0.5 rounded font-bold border border-brand-primary/30">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate max-w-[100px]">{user?.email}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-surface-secondary border border-white/10 shadow-2xl py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/5 sm:hidden">
                    <div className="text-sm font-semibold text-gray-200">{user?.name}</div>
                    <div className="text-xs text-gray-400">{user?.email}</div>
                  </div>

                  {user?.role === 'ADMIN' && (
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-brand-accent hover:bg-surface-tertiary flex items-center gap-2.5 transition-colors font-bold border-b border-white/5"
                    >
                      <Shield className="w-4 h-4 text-brand-accent" />
                      <span>Admin Console</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      navigate('/my-bookings');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-surface-tertiary flex items-center gap-2.5 transition-colors"
                  >
                    <Ticket className="w-4 h-4 text-brand-primary" />
                    <span>My Bookings</span>
                  </button>

                  <button
                    onClick={() => {
                      dispatch(logout());
                      setIsUserDropdownOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors mt-1 border-t border-white/5"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(openAuthModal('login'))}
                className="px-4 py-2 text-sm font-semibold text-gray-200 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => dispatch(openAuthModal('register'))}
                className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-sm font-semibold shadow-lg shadow-brand-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

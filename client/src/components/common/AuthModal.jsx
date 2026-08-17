import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Mail, Lock, User, Phone, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import {
  closeAuthModal,
  loginUser,
  registerUser,
  clearError,
} from '../../store/authSlice';

const AuthModal = () => {
  const dispatch = useDispatch();
  const { isAuthModalOpen, authModalTab, loading, error } = useSelector(
    (state) => state.auth
  );

  const [activeTab, setActiveTab] = useState(authModalTab || 'login');

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('USER');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'login') {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(registerUser({ name, email, password, phone, role }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-surface-secondary border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-surface-primary/50">
          <h3 className="text-lg font-bold text-gray-100">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Your CineMatrix Account'}
          </h3>
          <button
            onClick={() => {
              dispatch(closeAuthModal());
              dispatch(clearError());
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1.5 mx-6 mt-6 bg-surface-primary rounded-xl border border-white/5">
          <button
            onClick={() => {
              setActiveTab('login');
              dispatch(clearError());
            }}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'login'
                ? 'bg-brand-primary text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              dispatch(clearError());
            }}
            className={`py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'register'
                ? 'bg-brand-primary text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert Display */}
        {error && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {activeTab === 'register' && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {/* Account Role Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Account Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('USER')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'USER'
                        ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                        : 'border-white/5 bg-surface-primary text-gray-400'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    Standard User
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('ADMIN')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      role === 'ADMIN'
                        ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                        : 'border-white/5 bg-surface-primary text-gray-400'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    System Admin
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-primary border border-white/5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          {/* Quick Admin Credential Helper */}
          {activeTab === 'login' && (
            <div className="p-2.5 rounded-xl bg-surface-primary/60 border border-white/5 text-[11px] text-gray-400 flex flex-col gap-1">
              <div className="font-semibold text-gray-300">Quick Test Credentials:</div>
              <div>User: <span className="text-gray-200">john@example.com</span> / <span className="text-gray-200">userpassword123</span></div>
              <div>Admin: <span className="text-gray-200">admin@cinematrix.com</span> / <span className="text-gray-200">adminpassword123</span></div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-sm shadow-lg shadow-brand-primary/30 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{activeTab === 'login' ? 'Sign In to CineMatrix' : 'Create Account'}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;

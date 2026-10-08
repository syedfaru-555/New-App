import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Mail, Lock, Key, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'otp'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (mode === 'login' || mode === 'signup') {
        showToast('Successfully authenticated with Vela');
        setShowAuthModal(false);
      } else if (mode === 'forgot') {
        setMode('otp');
        showToast('Verification code sent to your email');
      } else if (mode === 'otp') {
        showToast('Password reset link confirmed');
        setMode('login');
      }
    }, 1000);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Logged in with Google account');
      setShowAuthModal(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-zinc-950 rounded-2xl border border-white/10 p-6 shadow-2xl">
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand */}
        <div className="text-center mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-rose-950/50">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 22h20L12 2zm0 4.8L18.2 19H5.8L12 6.8z" />
            </svg>
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-wider font-['Syne',sans-serif]">
            {mode === 'login' && 'Sign In to Vela'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
            {mode === 'otp' && 'Verify 6-Digit OTP'}
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            {mode === 'login' && 'Enter your credentials to access personalized feeds'}
            {mode === 'signup' && 'Enjoy 4K HDR streams and multiple profiles'}
            {mode === 'forgot' && 'We will send a security code to your email'}
            {mode === 'otp' && 'Enter the 6-digit code received'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode !== 'otp' && (
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'signup') && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-zinc-400">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-rose-500 hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white text-xs focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>
          )}

          {mode === 'otp' && (
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Enter Verification Code</label>
              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-white/10 rounded-lg text-white text-xs tracking-widest font-mono text-center focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition-all mt-4"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'signup' && 'Create Free Account'}
                  {mode === 'forgot' && 'Send Reset Code'}
                  {mode === 'otp' && 'Verify & Continue'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Google OAuth Login Option */}
        {(mode === 'login' || mode === 'signup') && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.4C3.7 20.4 7.5 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>
        )}

        {/* Toggle Mode */}
        <div className="mt-4 text-center text-xs text-zinc-400">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-rose-500 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-rose-500 font-semibold hover:underline"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

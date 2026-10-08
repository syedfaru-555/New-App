import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Check, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { SubscriptionTier } from '../types';

export const SubscriptionModal: React.FC = () => {
  const {
    showSubscriptionModal,
    setShowSubscriptionModal,
    subscriptionTiers,
    user,
    setPaymentModalData
  } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  if (!showSubscriptionModal) return null;

  const handleSelectTier = (tier: SubscriptionTier) => {
    if (tier.id === 'tier-free') {
      // Free plan directly applies
      return;
    }
    // Launch secure payment modal
    setPaymentModalData({ tier, billingCycle });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-950 rounded-2xl border border-white/10 p-5 sm:p-8 shadow-2xl my-auto">
        <button
          onClick={() => setShowSubscriptionModal(false)}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center max-w-md mx-auto">
          <span className="text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 fill-rose-500" />
            Vela Cinema Pass
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1 font-['Syne',sans-serif]">
            Choose Your Cinematic Plan
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Stream unlimited originals, blockbusters, and 4K HDR master recordings.
          </p>

          {/* Monthly / Yearly Toggle */}
          <div className="inline-flex items-center p-1 bg-zinc-900 rounded-xl border border-white/10 mt-5">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                billingCycle === 'monthly' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                billingCycle === 'yearly' ? 'bg-rose-600 text-white shadow' : 'text-zinc-400'
              }`}
            >
              <span>Yearly</span>
              <span className="text-[10px] bg-white text-rose-600 font-extrabold px-1 rounded">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Tier Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {subscriptionTiers.map((tier) => {
            const isCurrent = user.currentTierId === tier.id;
            const price = billingCycle === 'yearly' ? tier.priceYearly : tier.priceMonthly;
            const priceFormatted = price === 0 ? 'Free' : `$${price.toFixed(2)}`;
            const period = price === 0 ? '' : billingCycle === 'yearly' ? '/yr' : '/mo';

            return (
              <div
                key={tier.id}
                className={`relative rounded-xl p-5 flex flex-col justify-between border transition-all ${
                  tier.popular
                    ? 'bg-gradient-to-b from-rose-950/40 to-zinc-900 border-rose-500 shadow-xl shadow-rose-950/30'
                    : 'bg-zinc-900 border-white/10'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="text-base font-bold text-white">{tier.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white font-['Syne',sans-serif]">
                      {priceFormatted}
                    </span>
                    <span className="text-xs text-zinc-400">{period}</span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2 text-xs text-zinc-300">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-zinc-400">Resolution</span>
                      <span className="text-white font-semibold">{tier.resolution}</span>
                    </div>
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-zinc-400">Screens</span>
                      <span className="text-white font-semibold">{tier.devices} simultaneous</span>
                    </div>
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-zinc-400">Audio</span>
                      <span className="text-white font-semibold">{tier.audioQuality}</span>
                    </div>

                    <div className="pt-2 space-y-1.5">
                      {tier.features.map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] text-zinc-300 leading-tight">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  {isCurrent ? (
                    <div className="w-full py-2.5 rounded-lg bg-zinc-800 text-zinc-400 text-xs font-bold text-center border border-white/10">
                      Current Plan
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSelectTier(tier)}
                      className={`w-full py-2.5 rounded-lg text-xs font-bold transition-transform active:scale-95 shadow ${
                        tier.popular
                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {tier.priceMonthly === 0 ? 'Use Free Plan' : 'Select Plan'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee footer */}
        <div className="mt-6 text-center flex items-center justify-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Encrypted 256-bit SSL Checkout · Cancel or change tiers anytime</span>
        </div>
      </div>
    </div>
  );
};

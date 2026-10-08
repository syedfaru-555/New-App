import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CreditCard,
  QrCode,
  Building,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const { paymentModalData, setPaymentModalData, upgradeSubscription } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [cardName, setCardName] = useState('Faruk Syed');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [selectedWallet, setSelectedWallet] = useState('Google Pay');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!paymentModalData) return null;

  const { tier, billingCycle } = paymentModalData;
  const price = billingCycle === 'yearly' ? tier.priceYearly : tier.priceMonthly;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate realistic payment gateway authorization
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        upgradeSubscription(tier.id, billingCycle);
      }, 1400);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-zinc-950 rounded-2xl border border-white/10 p-6 shadow-2xl overflow-hidden">
        {!isProcessing && !isSuccess && (
          <button
            onClick={() => setPaymentModalData(null)}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {isSuccess ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white font-['Syne',sans-serif]">
              Payment Successful!
            </h3>
            <p className="text-xs text-zinc-300 max-w-xs mx-auto">
              Your subscription to <strong className="text-white">{tier.name}</strong> is now activated.
            </p>
          </div>
        ) : isProcessing ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="text-base font-bold text-white font-['Syne',sans-serif]">
              Securing Transaction...
            </h3>
            <p className="text-xs text-zinc-400">
              Communicating with encrypted bank gateway. Do not refresh or exit.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5" />
                Vela Secure Payment
              </div>
              <h3 className="text-lg font-bold text-white mt-0.5">
                Checkout: {tier.name} ({billingCycle})
              </h3>
              <p className="text-xs text-zinc-400">
                Amount Payable: <strong className="text-white font-mono text-sm">${price.toFixed(2)}</strong>
              </p>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-zinc-900 rounded-xl border border-white/10 text-xs">
              {[
                { id: 'upi', label: 'UPI', icon: QrCode },
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'netbanking', label: 'NetBank', icon: Building },
                { id: 'wallet', label: 'Wallets', icon: Wallet }
              ].map((m) => {
                const Icon = m.icon;
                const active = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`py-2 rounded-lg font-semibold flex flex-col items-center justify-center gap-1 transition-colors ${
                      active ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>

            {/* UPI Option */}
            {paymentMethod === 'upi' && (
              <div className="space-y-3 p-3 bg-zinc-900/60 rounded-xl border border-white/5">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Enter UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@okhdfcbank"
                    className="w-full p-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
                <div className="flex gap-2 text-xs">
                  {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                    <button
                      key={app}
                      type="button"
                      onClick={() => setUpiId(`user@${app.toLowerCase().replace(' ', '')}`)}
                      className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 text-zinc-300"
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Card Option */}
            {paymentMethod === 'card' && (
              <div className="space-y-2.5 p-3 bg-zinc-900/60 rounded-xl border border-white/5">
                <div>
                  <label className="text-xs text-zinc-400 block mb-0.5">Cardholder Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full p-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-0.5">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-zinc-400 block mb-0.5">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full p-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-0.5">CVV</label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full p-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking Option */}
            {paymentMethod === 'netbanking' && (
              <div className="space-y-2 p-3 bg-zinc-900/60 rounded-xl border border-white/5">
                <label className="text-xs text-zinc-400 block">Select Banking Institution</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Chase Bank', 'Citibank'].map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setSelectedBank(b)}
                      className={`p-2 rounded-lg border text-left transition-colors ${
                        selectedBank === b ? 'border-rose-500 bg-rose-500/10 text-white' : 'border-white/10 bg-zinc-900 text-zinc-300'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wallets Option */}
            {paymentMethod === 'wallet' && (
              <div className="space-y-2 p-3 bg-zinc-900/60 rounded-xl border border-white/5">
                <label className="text-xs text-zinc-400 block">Choose Wallet Provider</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {['Apple Pay', 'Google Pay', 'PayPal', 'Amazon Pay'].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setSelectedWallet(w)}
                      className={`p-2.5 rounded-lg border text-center transition-colors font-medium ${
                        selectedWallet === w ? 'border-rose-500 bg-rose-500/10 text-white' : 'border-white/10 bg-zinc-900 text-zinc-300'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Card and credentials are tokenized and processed securely.</span>
            </div>

            {/* Pay Button */}
            <button
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 active:scale-95 transition-all"
            >
              <span>Authorize & Pay ${price.toFixed(2)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

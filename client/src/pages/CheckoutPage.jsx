import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { confirmBookingAction } from '../store/bookingSlice';
import HoldTimer from '../components/seats/HoldTimer';
import ConcessionsSelector from '../components/checkout/ConcessionsSelector';
import API from '../services/api';
import { ShieldCheck, CreditCard, Smartphone, Building2, Lock, Tag, Loader2, ArrowLeft, AlertCircle, Popcorn, CheckCircle2 } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentBooking, holdExpiresAt, selectedSnacks, loading, error } = useSelector(
    (state) => state.booking
  );

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'netbanking'
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  if (!currentBooking) {
    return (
      <div className="text-center py-20 text-gray-400">
        <h2 className="text-xl font-bold">No active hold found</h2>
        <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-semibold">
          Return to Home
        </button>
      </div>
    );
  }

  const basePrice = currentBooking.totalAmount || 0;
  const convenienceFee = 35; // Itemized fee

  // Calculate snacks total
  const snacksTotal = (selectedSnacks || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const subtotalBeforeDiscount = basePrice + convenienceFee + snacksTotal;
  const totalPayable = Math.max(0, subtotalBeforeDiscount - discount);

  const handleApplyPromo = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setValidatingCoupon(true);
    setCouponError('');

    try {
      const res = await API.post('/bookings/validate-coupon', {
        code: promoCode,
        amount: subtotalBeforeDiscount,
      });

      if (res.data.success) {
        setDiscount(res.data.coupon.discountAmount);
        setAppliedCoupon(res.data.coupon);
        setCouponError('');
      }
    } catch (err) {
      setDiscount(0);
      setAppliedCoupon(null);
      setCouponError(err.response?.data?.message || 'Invalid promo code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon(null);
    setPromoCode('');
    setCouponError('');
  };

  const handleConfirmPayment = async () => {
    const result = await dispatch(
      confirmBookingAction({
        bookingId: currentBooking.bookingId,
        selectedSnacks,
      })
    );

    if (confirmBookingAction.fulfilled.match(result)) {
      navigate('/ticket-success');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
      {/* Navigation & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Modify Seat Selection</span>
          </button>
          <h1 className="text-3xl font-black text-white tracking-tight">Checkout & Payment</h1>
        </div>

        {/* 10-Minute Hold Timer Badge */}
        {holdExpiresAt && (
          <HoldTimer
            expiresAt={holdExpiresAt}
            onExpire={() => {
              alert('10-Minute hold timer expired! Returning to home.');
              navigate('/');
            }}
          />
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Two-Column Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Itemized Ticket Fees, Snacks & Promo */}
        <div className="lg:col-span-7 space-y-6">
          {/* Concessions / Food Add-ons Selector */}
          <ConcessionsSelector />

          {/* Itemized Summary Card */}
          <div className="p-6 rounded-2xl bg-surface-secondary border border-white/5 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Order Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-gray-300">
                <span>Seats ({currentBooking.seats?.join(', ')})</span>
                <span className="font-bold text-gray-100">${basePrice}</span>
              </div>

              <div className="flex items-center justify-between text-gray-300">
                <span>Convenience & Booking Fee</span>
                <span className="font-bold text-gray-100">${convenienceFee}</span>
              </div>

              {snacksTotal > 0 && (
                <div className="flex items-center justify-between text-amber-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Popcorn className="w-4 h-4" /> Snacks & Food Add-ons
                  </span>
                  <span>+${snacksTotal}</span>
                </div>
              )}

              {discount > 0 && (
                <div className="flex items-center justify-between text-emerald-400 font-semibold">
                  <span>Promo Discount ({appliedCoupon?.code})</span>
                  <span>-${discount}</span>
                </div>
              )}

              <div className="border-t border-white/10 pt-3 flex items-center justify-between text-base font-extrabold text-white">
                <span>Total Amount Payable</span>
                <span className="text-xl text-emerald-400">${totalPayable}</span>
              </div>
            </div>
          </div>

          {/* Promo Code Input Card */}
          <div className="p-6 rounded-2xl bg-surface-secondary border border-white/5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                <Tag className="w-4 h-4 text-brand-primary" />
                <span>Apply Promo Voucher / Offer</span>
              </h4>
            </div>

            {/* Quick Available Promo Badges */}
            <div className="flex flex-wrap gap-2 text-xs">
              {['FIRST50', 'BOOKMYSHOW20', 'CINEMA100'].map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setPromoCode(code)}
                  className="px-2.5 py-1 rounded-lg bg-surface-primary hover:bg-white/10 border border-white/10 text-gray-300 font-mono text-[11px] hover:border-brand-primary/50 transition-colors"
                >
                  🏷️ {code}
                </button>
              ))}
            </div>

            {appliedCoupon ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Promo Code '{appliedCoupon.code}' Applied! (${appliedCoupon.discountAmount} Off)</span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-gray-400 hover:text-red-400 font-bold underline transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. FIRST50)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-surface-primary border border-white/10 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-primary uppercase font-mono"
                />
                <button
                  type="submit"
                  disabled={validatingCoupon || !promoCode.trim()}
                  className="px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply Code'}
                </button>
              </form>
            )}

            {couponError && (
              <p className="text-xs text-red-400 font-medium">{couponError}</p>
            )}
          </div>
        </div>

        {/* Right Column: Payment Gateway Accordion */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-surface-secondary border border-white/5 shadow-xl space-y-5">
            <h3 className="text-lg font-bold text-white border-b border-white/5 pb-3">Payment Method</h3>

            {/* Credit / Debit Card Option */}
            <label
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'card'
                  ? 'border-brand-primary bg-brand-primary/10 text-white'
                  : 'border-white/5 bg-surface-primary text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-brand-primary" />
                <div>
                  <div className="text-sm font-bold text-gray-200">Credit / Debit Card</div>
                  <div className="text-[11px] text-gray-400">Visa, Mastercard, AMEX</div>
                </div>
              </div>
              <input type="radio" checked={paymentMethod === 'card'} readOnly className="accent-brand-primary" />
            </label>

            {/* Card Mock Input Fields */}
            {paymentMethod === 'card' && (
              <div className="space-y-3 pt-2 animate-fade-in">
                <input
                  type="text"
                  placeholder="Card Number (4532 •••• •••• 8892)"
                  defaultValue="4532 8901 2345 8892"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface-primary border border-white/10 text-xs text-gray-200 font-mono focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/28"
                    className="px-4 py-2.5 rounded-xl bg-surface-primary border border-white/10 text-xs text-gray-200 font-mono focus:outline-none"
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    defaultValue="882"
                    className="px-4 py-2.5 rounded-xl bg-surface-primary border border-white/10 text-xs text-gray-200 font-mono focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* UPI Payment Option */}
            <label
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'upi'
                  ? 'border-brand-primary bg-brand-primary/10 text-white'
                  : 'border-white/5 bg-surface-primary text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-sm font-bold text-gray-200">Instant UPI / QR</div>
                  <div className="text-[11px] text-gray-400">Google Pay, PhonePe, Paytm</div>
                </div>
              </div>
              <input type="radio" checked={paymentMethod === 'upi'} readOnly className="accent-brand-primary" />
            </label>

            {/* Netbanking Option */}
            <label
              onClick={() => setPaymentMethod('netbanking')}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                paymentMethod === 'netbanking'
                  ? 'border-brand-primary bg-brand-primary/10 text-white'
                  : 'border-white/5 bg-surface-primary text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-sky-400" />
                <div>
                  <div className="text-sm font-bold text-gray-200">Netbanking</div>
                  <div className="text-[11px] text-gray-400">All major banks supported</div>
                </div>
              </div>
              <input type="radio" checked={paymentMethod === 'netbanking'} readOnly className="accent-brand-primary" />
            </label>

            {/* Payment CTA Button with SSL Security Badge */}
            <button
              onClick={handleConfirmPayment}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-hover text-white font-bold text-sm shadow-xl shadow-brand-primary/40 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay Securely (${totalPayable})</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>256-Bit SSL Encryption Guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

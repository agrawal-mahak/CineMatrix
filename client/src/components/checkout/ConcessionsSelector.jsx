import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSnackQuantity } from '../../store/bookingSlice';
import { Plus, Minus, Popcorn, Sparkles } from 'lucide-react';

const SNACK_ITEMS = [
  {
    id: 'popcorn-lg',
    name: 'Caramel Popcorn (Jumbo)',
    category: 'Popcorn',
    price: 120,
    icon: '🍿',
    description: 'Freshly popped warm caramel butter popcorn',
  },
  {
    id: 'coke-lg',
    name: 'Cold Fountain Drink (Large)',
    category: 'Drinks',
    price: 80,
    icon: '🥤',
    description: 'Ice cold Coca-Cola, Sprite, or Fanta',
  },
  {
    id: 'nachos-cheese',
    name: 'Mexican Cheese Nachos',
    category: 'Snacks',
    price: 150,
    icon: '🧀',
    description: 'Crispy corn tortilla chips with warm jalapeño cheese',
  },
  {
    id: 'cine-combo',
    name: 'VIP Cine Combo Deal',
    category: 'Combos',
    price: 280,
    icon: '🎬',
    description: '1 Jumbo Popcorn + 2 Large Sodas + Cheese Nachos',
    isBestValue: true,
  },
];

const ConcessionsSelector = () => {
  const dispatch = useDispatch();
  const { selectedSnacks } = useSelector((state) => state.booking);

  const getQuantity = (id) => {
    const found = selectedSnacks.find((s) => s.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-surface-secondary border border-white/10 shadow-xl space-y-4">
      <div className="border-b border-white/5 pb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Popcorn className="w-5 h-5 text-amber-400" />
          <span>Pre-order Cinema Snacks & Combos</span>
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">Skip the concession counter line! Snacks delivered directly to your seat.</p>
      </div>

      {/* Responsive Grid of Food Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {SNACK_ITEMS.map((item) => {
          const qty = getQuantity(item.id);

          return (
            <div
              key={item.id}
              className={`relative p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 overflow-hidden ${
                qty > 0
                  ? 'border-brand-primary bg-brand-primary/10 shadow-md shadow-brand-primary/10'
                  : 'border-white/5 bg-surface-primary hover:border-white/15'
              }`}
            >
              {item.isBestValue && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-brand-primary to-rose-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-bl-lg shadow-sm flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> BEST VALUE
                </div>
              )}

              {/* Item Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-1">
                <div className="text-2xl sm:text-3xl shrink-0 p-2 rounded-xl bg-surface-tertiary/70 border border-white/5">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-sm font-bold text-gray-100 line-clamp-1 leading-snug">
                    {item.name}
                  </div>
                  <div className="text-xs font-extrabold text-emerald-400 mt-0.5">
                    ${item.price}
                  </div>
                </div>
              </div>

              {/* Quantity Counter Controls */}
              <div className="flex items-center gap-1.5 bg-surface-secondary p-1 rounded-xl border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => dispatch(updateSnackQuantity({ snack: item, delta: -1 }))}
                  disabled={qty === 0}
                  className="w-7 h-7 rounded-lg bg-surface-tertiary hover:bg-white/10 disabled:opacity-20 text-gray-200 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="w-5 text-center text-xs font-extrabold text-white">{qty}</span>

                <button
                  type="button"
                  onClick={() => dispatch(updateSnackQuantity({ snack: item, delta: 1 }))}
                  className="w-7 h-7 rounded-lg bg-brand-primary hover:bg-brand-hover text-white flex items-center justify-center transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConcessionsSelector;

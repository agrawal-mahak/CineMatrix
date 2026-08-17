import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSnackQuantity } from '../../store/bookingSlice';
import { Plus, Minus, Popcorn, CupSoda, Utensils, Sparkles } from 'lucide-react';

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
    <div className="p-6 rounded-2xl bg-surface-secondary border border-white/5 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Popcorn className="w-5 h-5 text-amber-400" />
            <span>Pre-order Cinema Snacks & Combos</span>
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Skip the concession counter line! Snacks delivered to your seat.</p>
        </div>
      </div>

      {/* Grid of Food Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SNACK_ITEMS.map((item) => {
          const qty = getQuantity(item.id);

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                qty > 0
                  ? 'border-brand-primary bg-brand-primary/10'
                  : 'border-white/5 bg-surface-primary hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl shrink-0 p-2 rounded-xl bg-surface-tertiary">{item.icon}</div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-100">{item.name}</span>
                    {item.isBestValue && (
                      <span className="px-1.5 py-0.5 rounded bg-brand-primary/20 text-brand-primary text-[10px] font-bold border border-brand-primary/30 flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3" /> BEST VALUE
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-semibold text-emerald-400 mt-0.5">₹{item.price}</div>
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="flex items-center gap-2 bg-surface-secondary p-1 rounded-xl border border-white/10 shrink-0">
                <button
                  onClick={() => dispatch(updateSnackQuantity({ snack: item, delta: -1 }))}
                  disabled={qty === 0}
                  className="w-7 h-7 rounded-lg bg-surface-tertiary hover:bg-white/10 disabled:opacity-30 text-gray-200 flex items-center justify-center transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <span className="w-5 text-center text-xs font-bold text-white">{qty}</span>

                <button
                  onClick={() => dispatch(updateSnackQuantity({ snack: item, delta: 1 }))}
                  className="w-7 h-7 rounded-lg bg-brand-primary hover:bg-brand-hover text-white flex items-center justify-center transition-colors"
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

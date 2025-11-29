import React, { useState } from 'react';
import { CurrencyCode, CartItem } from '../types';
import { CURRENCIES } from '../constants';

interface NavbarProps {
  currentCurrency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  cart: CartItem[];
  onCheckout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentCurrency, onCurrencyChange, cart, onCheckout }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCheckoutClick = () => {
    onCheckout();
    setIsCartOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-stone-50/90 backdrop-blur-md border-b border-stone-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Left: Mobile Menu / Links */}
        <div className="hidden md:flex space-x-8 text-xs tracking-[0.2em] font-sans font-bold text-stone-800 uppercase">
          <a href="#" className="hover:text-gold-500 transition-colors">Jewelry</a>
          <a href="#" className="hover:text-gold-500 transition-colors">Watches</a>
          <a href="#" className="hover:text-gold-500 transition-colors">Maison</a>
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
          <h1 className="font-display text-2xl md:text-3xl tracking-widest text-stone-900 cursor-pointer">
            LUMIÈRE
          </h1>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-6 md:space-x-8">
          
          {/* Currency Selector */}
          <div className="relative group">
            <button className="text-xs font-sans tracking-wider text-stone-600 hover:text-stone-900 flex items-center">
              {currentCurrency}
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div className="absolute right-0 mt-2 w-24 bg-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto border border-stone-100">
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <button
                  key={code}
                  onClick={() => onCurrencyChange(code)}
                  className={`block w-full text-left px-4 py-2 text-xs font-sans hover:bg-stone-50 ${currentCurrency === code ? 'text-gold-500 font-bold' : 'text-stone-600'}`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="relative">
            <button 
              className="text-stone-800 hover:text-gold-500 transition-colors relative"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <span className="sr-only">Cart</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-gold-500 text-[8px] text-white">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            {isCartOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsCartOpen(false)}></div>
                <div className="absolute right-0 mt-4 w-72 bg-white shadow-2xl border border-stone-100 p-6 z-20 animate-fade-in origin-top-right">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-stone-900 mb-4 border-b border-stone-100 pb-2">Shopping Cart</h3>
                  
                  {cart.length === 0 ? (
                    <div className="py-4 text-center">
                      <p className="font-serif italic text-stone-500 text-sm">
                        Your cart is currently empty.
                      </p>
                      <a href="#collection" onClick={() => setIsCartOpen(false)} className="block mt-4 text-[10px] text-gold-600 hover:text-gold-500 uppercase tracking-wider font-bold">
                        Browse Collection
                      </a>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {cart.map((item, index) => (
                        <div key={index} className="flex gap-3">
                           <div className="w-12 h-12 bg-stone-100 shrink-0">
                              <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                           </div>
                           <div>
                              <p className="font-serif text-sm text-stone-900">{item.name}</p>
                              <p className="text-xs text-stone-500">{item.selectedSize ? `Size: ${item.selectedSize}` : item.category}</p>
                           </div>
                        </div>
                      ))}
                      <button 
                        onClick={handleCheckoutClick}
                        className="w-full mt-4 bg-stone-900 text-white py-2 text-xs uppercase tracking-widest hover:bg-gold-500 transition-colors"
                      >
                        Checkout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
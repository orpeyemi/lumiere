import React from 'react';
import { Product, CurrencyConfig } from '../types';

interface ProductCardProps {
  product: Product;
  currencyConfig: CurrencyConfig;
  onQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  currencyConfig, 
  onQuickView,
  isWishlisted,
  onToggleWishlist
}) => {
  const displayPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(product.priceUSD * currencyConfig.rate).replace('$', currencyConfig.symbol);

  return (
    <div className="group relative cursor-pointer" onClick={() => onQuickView(product)}>
      {/* Image Container */}
      <div className="aspect-[4/5] overflow-hidden bg-stone-100 relative mb-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-20
            ${isWishlisted 
              ? 'bg-white text-red-700 shadow-md opacity-100 translate-y-0' 
              : 'bg-white/10 text-stone-800 hover:bg-white/90 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0'
            }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-300 ${isWishlisted ? 'fill-current scale-110' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>

        {/* Quick View Button Overlay */}
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <button 
            className="pointer-events-auto translate-y-4 group-hover:translate-y-0 transition-all duration-500 bg-white text-stone-900 px-6 py-2 uppercase text-[10px] tracking-widest font-bold hover:bg-stone-900 hover:text-white shadow-[0_0_0_0_rgba(212,175,55,0.7)] group-hover:shadow-[0_0_20px_0_rgba(212,175,55,0.4)] border border-transparent group-hover:border-gold-400"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Details */}
      <div className="text-center space-y-1">
        <h3 className="font-serif text-lg text-stone-900 group-hover:text-gold-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-stone-500 font-sans tracking-wide">
          {product.category} &bull; {product.metal}
        </p>
        <p className="text-sm font-medium text-stone-800 pt-1">
          {displayPrice}
        </p>
      </div>
    </div>
  );
};
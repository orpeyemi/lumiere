import React, { useEffect, useState } from 'react';
import { Product, CurrencyConfig, CartItem } from '../types';
import { RING_SIZES } from '../constants';
import { generateProductStory } from '../services/geminiService';

interface ProductSidebarProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currencyConfig: CurrencyConfig;
  onAddToCart: (item: CartItem) => void;
}

export const ProductSidebar: React.FC<ProductSidebarProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  currencyConfig,
  onAddToCart 
}) => {
  const [description, setDescription] = useState<string>('');
  const [loadingStory, setLoadingStory] = useState<boolean>(false);
  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [selectedSize, setSelectedSize] = useState<string>(RING_SIZES[4]);

  // Reset state when product changes
  useEffect(() => {
    if (product && isOpen) {
      setDescription('');
      setLoadingStory(true);
      
      // Fetch AI description
      generateProductStory(product).then(story => {
        setDescription(story);
        setLoadingStory(false);
      });
    }
  }, [product, isOpen]);

  if (!product) return null;

  const displayPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(product.priceUSD * currencyConfig.rate).replace('$', currencyConfig.symbol);

  const handleAddToCartClick = () => {
    setAddingToCart(true);
    setTimeout(() => {
      onAddToCart({ ...product, selectedSize });
      setAddingToCart(false);
      onClose();
    }, 1500); // Simulate network delay
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[500px] bg-stone-50 z-50 shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-900 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="flex flex-col min-h-full">
          {/* Image Header */}
          <div className="relative h-96 w-full shrink-0">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-transparent to-transparent opacity-80" />
          </div>

          {/* Content */}
          <div className="px-8 pb-10 flex-grow -mt-20 relative">
            <h2 className="font-serif text-3xl text-stone-900 mb-2">{product.name}</h2>
            <p className="text-xl font-light text-stone-600 mb-6">{displayPrice}</p>

            {/* AI Description */}
            <div className="mb-8">
              <h4 className="text-[10px] uppercase tracking-widest text-gold-600 font-bold mb-3">Story</h4>
              <p className={`font-serif italic text-stone-600 leading-relaxed transition-opacity duration-700 ${loadingStory ? 'opacity-50 blur-[2px]' : 'opacity-100'}`}>
                {loadingStory ? "Consulting the gemologist..." : description}
              </p>
            </div>

            {/* The 4 Cs Table */}
            <div className="mb-8 p-6 bg-white border border-stone-100 shadow-sm">
              <h4 className="text-[10px] uppercase tracking-widest text-stone-400 mb-4 text-center">Gemstone Specifications</h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-xs text-stone-500 uppercase tracking-wider">Carat</span>
                  <span className="font-serif text-stone-900">{product.specs.carat}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-xs text-stone-500 uppercase tracking-wider">Color</span>
                  <span className="font-serif text-stone-900">{product.specs.color}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-xs text-stone-500 uppercase tracking-wider">Clarity</span>
                  <span className="font-serif text-stone-900">{product.specs.clarity}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-xs text-stone-500 uppercase tracking-wider">Cut</span>
                  <span className="font-serif text-stone-900">{product.specs.cut}</span>
                </div>
              </div>
            </div>

            {/* Size Selection (Only for rings) */}
            {product.category === 'Ring' && (
              <div className="mb-8">
                <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2">
                  Select Ring Size
                </label>
                <div className="relative">
                  <select 
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full appearance-none bg-transparent border-b border-stone-300 py-2 text-stone-900 font-sans text-sm focus:outline-none focus:border-gold-500 transition-colors cursor-pointer"
                  >
                    {RING_SIZES.map(size => (
                      <option key={size} value={size}>US {size}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-stone-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="sticky bottom-0 bg-stone-50 pt-4 pb-2">
              <button 
                onClick={handleAddToCartClick}
                disabled={addingToCart}
                className="w-full bg-stone-900 text-white py-4 uppercase text-xs tracking-[0.2em] hover:bg-gold-500 transition-colors duration-500 flex items-center justify-center disabled:bg-stone-800"
              >
                {addingToCart ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding to Cart
                  </>
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
            
            <p className="mt-4 text-[10px] text-stone-400 text-center leading-relaxed">
              Complimentary shipping and returns on all orders. <br/>
              Includes certificate of authenticity.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
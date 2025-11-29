import React from 'react';

export const Hero: React.FC = () => {
  const scrollToCollection = () => {
    const collectionSection = document.getElementById('collection');
    if (collectionSection) {
      collectionSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Jewelry Model" 
          className="w-full h-full object-cover opacity-90 scale-105 animate-[fadeIn_2s_ease-out]"
        />
        <div className="absolute inset-0 bg-stone-900/20 mix-blend-multiply"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <span className="text-stone-50 text-xs md:text-sm tracking-[0.3em] uppercase mb-4 animate-slide-up [animation-delay:0.3s]">
          Collection 2024
        </span>
        <h2 className="text-4xl md:text-7xl lg:text-8xl font-serif text-white mb-6 animate-slide-up [animation-delay:0.5s]">
          Eternal Radiance
        </h2>
        <p className="text-stone-200 text-sm md:text-base font-light max-w-lg mb-10 leading-relaxed animate-slide-up [animation-delay:0.7s]">
          Discover the new definitions of elegance. Crafted with precision, worn with passion.
        </p>
        <button 
          onClick={scrollToCollection}
          className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/40 text-white hover:bg-white hover:text-stone-900 transition-all duration-500 uppercase text-xs tracking-widest animate-slide-up [animation-delay:0.9s]"
        >
          Explore Collection
        </button>
      </div>

      {/* Scroll Indicator */}
      <div 
        onClick={scrollToCollection}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-70 cursor-pointer"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
};
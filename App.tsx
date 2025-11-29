import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductSidebar } from './components/ProductSidebar';
import { Chatbot } from './components/Chatbot';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { INITIAL_PRODUCTS, CURRENCIES } from './constants';
import { Product, CurrencyCode, CartItem, Order } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<'shop' | 'admin' | 'login'>('shop');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('USD');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  // Listen for hash changes to trigger admin login
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('login');
      }
    };
    
    // Check initial hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleCurrencyChange = (code: CurrencyCode) => {
    setCurrentCurrency(code);
  };

  const handleQuickView = (product: Product) => {
    setActiveProduct(product);
    setIsSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
    setTimeout(() => setActiveProduct(null), 500); // Wait for animation
  };

  const handleAddToCart = (item: CartItem) => {
    setCart([...cart, item]);
  };

  const handleToggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const newOrder: Order = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        customerName: "Guest Client", // Simplified for demo
        customerEmail: "guest@example.com",
        items: [...cart],
        totalUSD: cart.reduce((acc, item) => acc + item.priceUSD, 0),
        status: 'Processing'
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    alert("Thank you for your purchase. Your order has been sent to our atelier.");
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleLoginSuccess = () => {
    setCurrentView('admin');
  };

  const handleExitAdmin = () => {
    setCurrentView('shop');
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
  };

  if (currentView === 'login') {
    return (
      <AdminLogin 
        onLogin={handleLoginSuccess} 
        onCancel={() => {
          setCurrentView('shop');
          window.history.pushState("", document.title, window.location.pathname + window.location.search);
        }} 
      />
    );
  }

  if (currentView === 'admin') {
      return (
          <AdminDashboard 
            products={products} 
            setProducts={setProducts} 
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onExit={handleExitAdmin}
          />
      );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-gold-500 selection:text-white">
      <Navbar 
        currentCurrency={currentCurrency} 
        onCurrencyChange={handleCurrencyChange} 
        cart={cart}
        onCheckout={handleCheckout}
      />
      
      <main>
        <Hero />
        
        <section id="collection" className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center mb-16 space-y-4">
            <span className="text-gold-600 text-xs tracking-[0.3em] uppercase font-bold">Curated Selection</span>
            <h2 className="text-3xl md:text-5xl font-serif text-stone-900">Fine Jewelry</h2>
            <div className="w-12 h-px bg-gold-400 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                currencyConfig={CURRENCIES[currentCurrency]}
                onQuickView={handleQuickView}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        </section>

        {/* Brand Promise / Footer */}
        <section className="bg-stone-900 text-stone-400 py-24 px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="font-serif text-2xl text-white">The Art of Brilliance</h3>
            <p className="font-light leading-relaxed text-sm">
              We travel the globe to source stones of unmatched character, 
              ensuring that every facet reflects the light of your unique story.
            </p>
            <div className="pt-8 flex flex-col items-center gap-4">
              <span className="font-display text-xl text-stone-600 tracking-widest">LUMIÈRE & STONE</span>
              <p className="text-[10px] text-stone-600 uppercase tracking-widest mt-8">
                © 2024 Lumière & Stone. All Rights Reserved.
              </p>
            </div>
          </div>
        </section>
      </main>

      <ProductSidebar 
        product={activeProduct}
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        currencyConfig={CURRENCIES[currentCurrency]}
        onAddToCart={handleAddToCart}
      />

      <Chatbot />
    </div>
  );
}
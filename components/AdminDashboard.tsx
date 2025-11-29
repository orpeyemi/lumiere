import React, { useState } from 'react';
import { Product, Order, FourCs } from '../types';

interface AdminDashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  onExit: () => void;
}

type Tab = 'inventory' | 'sales' | 'customers';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, setProducts, orders, onUpdateOrderStatus, onExit }) => {
  const [activeTab, setActiveTab] = useState<Tab>('inventory');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  
  // New Product Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    category: 'Ring',
    priceUSD: 0,
    metal: '18k Yellow Gold',
    image: '',
    specs: { carat: 1.0, cut: 'Excellent', color: 'G', clarity: 'VS1' }
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.priceUSD) return;
    
    const product: Product = {
      id: Date.now().toString(),
      name: newProduct.name!,
      category: newProduct.category as any,
      priceUSD: Number(newProduct.priceUSD),
      metal: newProduct.metal as any,
      image: newProduct.image || 'https://images.unsplash.com/photo-1617038220319-88af15286a77?auto=format&fit=crop&q=80&w=1000',
      specs: newProduct.specs as FourCs
    };

    setProducts(prev => [product, ...prev]);
    setIsAddingProduct(false);
    setNewProduct({
      name: '',
      category: 'Ring',
      priceUSD: 0,
      metal: '18k Yellow Gold',
      image: '',
      specs: { carat: 1.0, cut: 'Excellent', color: 'G', clarity: 'VS1' }
    });
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to remove this piece from the collection?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Derive unique customers from orders
  const customers = Array.from(new Set(orders.map(o => o.customerEmail))).map(email => {
    const customerOrders = orders.filter(o => o.customerEmail === email);
    const lastOrder = customerOrders.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
    return {
      name: lastOrder.customerName,
      email: email,
      totalSpent: customerOrders.reduce((acc, curr) => acc + curr.totalUSD, 0),
      lastOrderDate: lastOrder.date
    };
  });

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.totalUSD, 0);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Processing': return 'bg-blue-50 text-blue-800 border-blue-100';
      case 'Shipped': return 'bg-amber-50 text-amber-800 border-amber-100';
      case 'Delivered': return 'bg-green-50 text-green-800 border-green-100';
      default: return 'bg-gray-50 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col fixed h-full left-0 top-0 z-50">
        <div className="p-8 border-b border-stone-800">
          <h2 className="font-display text-2xl tracking-widest text-white leading-none">MAISON<br/><span className="text-gold-500 text-sm tracking-[0.4em]">ADMIN</span></h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full text-left px-4 py-3 rounded-sm transition-all duration-300 uppercase text-xs tracking-widest font-bold ${activeTab === 'inventory' ? 'bg-white text-stone-900 shadow-lg translate-x-1' : 'hover:bg-stone-800 hover:text-white'}`}
          >
            Inventory
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={`w-full text-left px-4 py-3 rounded-sm transition-all duration-300 uppercase text-xs tracking-widest font-bold ${activeTab === 'sales' ? 'bg-white text-stone-900 shadow-lg translate-x-1' : 'hover:bg-stone-800 hover:text-white'}`}
          >
            Sales Log
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`w-full text-left px-4 py-3 rounded-sm transition-all duration-300 uppercase text-xs tracking-widest font-bold ${activeTab === 'customers' ? 'bg-white text-stone-900 shadow-lg translate-x-1' : 'hover:bg-stone-800 hover:text-white'}`}
          >
            Clientele
          </button>
        </nav>
        <div className="p-6 border-t border-stone-800 bg-stone-900">
          <button onClick={onExit} className="flex items-center gap-2 w-full px-4 py-2 text-xs uppercase tracking-widest text-stone-500 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-12 overflow-y-auto">
        <header className="mb-10 flex justify-between items-end border-b border-stone-200 pb-6">
          <div>
             <h1 className="font-serif text-4xl text-stone-900 capitalize mb-2">{activeTab}</h1>
             <p className="text-stone-500 text-sm">Manage your maison's {activeTab}</p>
          </div>
          {activeTab === 'inventory' && (
            <button 
              onClick={() => setIsAddingProduct(true)}
              className="bg-stone-900 text-white px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-gold-500 transition-colors shadow-lg"
            >
              Add New Piece
            </button>
          )}
        </header>

        {/* Inventory View */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-sm shadow-sm border border-stone-200 overflow-hidden">
            {isAddingProduct && (
              <div className="p-8 bg-stone-50 border-b border-stone-200 animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-serif text-stone-900">New Collection Piece</h3>
                    <button onClick={() => setIsAddingProduct(false)} className="text-stone-400 hover:text-stone-900 transition-colors"><svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                  <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Product Name</label>
                      <input className="w-full bg-white border border-stone-200 p-3 text-sm focus:outline-none focus:border-gold-500 transition-colors font-serif" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} placeholder="e.g. The Royal Sapphire" />
                  </div>
                  <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Price (USD)</label>
                      <input type="number" className="w-full bg-white border border-stone-200 p-3 text-sm focus:outline-none focus:border-gold-500 transition-colors font-serif" value={newProduct.priceUSD || ''} onChange={e => setNewProduct({...newProduct, priceUSD: Number(e.target.value)})} placeholder="0.00" />
                  </div>
                  <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Category</label>
                      <select className="w-full bg-white border border-stone-200 p-3 text-sm focus:outline-none focus:border-gold-500 transition-colors font-sans" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}>
                        <option value="Ring">Ring</option>
                        <option value="Necklace">Necklace</option>
                        <option value="Earrings">Earrings</option>
                      </select>
                  </div>
                  <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Metal</label>
                      <select className="w-full bg-white border border-stone-200 p-3 text-sm focus:outline-none focus:border-gold-500 transition-colors font-sans" value={newProduct.metal} onChange={e => setNewProduct({...newProduct, metal: e.target.value as any})}>
                        <option value="18k Yellow Gold">18k Yellow Gold</option>
                        <option value="Platinum">Platinum</option>
                        <option value="18k Rose Gold">18k Rose Gold</option>
                      </select>
                  </div>
                  <div className="col-span-2 space-y-1">
                      <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Image URL</label>
                      <input className="w-full bg-white border border-stone-200 p-3 text-sm focus:outline-none focus:border-gold-500 transition-colors font-mono text-xs text-stone-500" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} placeholder="https://..." />
                  </div>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleAddProduct} className="bg-stone-900 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-gold-500 transition-colors">Save to Catalog</button>
                    <button onClick={() => setIsAddingProduct(false)} className="bg-white border border-stone-200 text-stone-800 px-8 py-3 text-xs uppercase tracking-widest hover:bg-stone-50 transition-colors">Cancel</button>
                </div>
              </div>
            )}
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-stone-500">Product Details</th>
                  <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-stone-500">Category</th>
                  <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-stone-500">Price</th>
                  <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-stone-500">Inventory Status</th>
                  <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-stone-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-stone-50 transition-colors group">
                    <td className="p-5 flex items-center gap-4">
                      <img src={product.image} className="w-12 h-12 object-cover rounded-sm bg-stone-200" alt="" />
                      <div>
                          <span className="font-serif font-medium text-stone-900 block text-base">{product.name}</span>
                          <span className="text-[10px] text-stone-400 uppercase tracking-wider">{product.id.slice(0,8)}</span>
                      </div>
                    </td>
                    <td className="p-5 text-stone-600">{product.category}</td>
                    <td className="p-5 font-medium text-stone-900">${product.priceUSD.toLocaleString()}</td>
                    <td className="p-5"><span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-[10px] uppercase tracking-wider font-bold rounded-full border border-green-100">In Stock</span></td>
                    <td className="p-5 text-right">
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-stone-400 hover:text-red-600 text-[10px] uppercase tracking-widest font-bold transition-colors">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Sales View */}
        {activeTab === 'sales' && (
          <div className="space-y-8">
            {/* Sales Metrics */}
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white p-6 border border-stone-200 shadow-sm">
                    <h4 className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Total Revenue</h4>
                    <p className="font-serif text-3xl text-stone-900">${totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 border border-stone-200 shadow-sm">
                    <h4 className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Orders Processed</h4>
                    <p className="font-serif text-3xl text-stone-900">{orders.length}</p>
                </div>
                <div className="bg-white p-6 border border-stone-200 shadow-sm">
                    <h4 className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Avg. Order Value</h4>
                    <p className="font-serif text-3xl text-stone-900">${orders.length > 0 ? Math.round(totalRevenue / orders.length).toLocaleString() : 0}</p>
                </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-stone-200 overflow-hidden">
                {orders.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="font-serif italic text-stone-400 text-lg">No transactions recorded yet.</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                    <thead className="bg-stone-50 border-b border-stone-200">
                        <tr>
                        <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-stone-500">Order Ref</th>
                        <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-stone-500">Date</th>
                        <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-stone-500">Client</th>
                        <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-stone-500">Summary</th>
                        <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-stone-500">Total</th>
                        <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-stone-500">Manage Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {orders.map(order => (
                        <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                            <td className="p-5 font-mono text-xs text-stone-400">#{order.id.slice(-6)}</td>
                            <td className="p-5 text-stone-600">{new Date(order.date).toLocaleDateString()}</td>
                            <td className="p-5 font-medium text-stone-900">{order.customerName}</td>
                            <td className="p-5 text-stone-500 text-xs">{order.items.length} Item(s)</td>
                            <td className="p-5 font-medium text-stone-900">${order.totalUSD.toLocaleString()}</td>
                            <td className="p-5">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                  <select 
                                    value={order.status}
                                    onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                    className="bg-transparent text-[10px] uppercase tracking-wider font-bold border-none focus:ring-0 cursor-pointer p-0 pr-1 appearance-none focus:outline-none"
                                  >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                  </select>
                                  <svg className="w-3 h-3 ml-1 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                )}
            </div>
          </div>
        )}

        {/* Customers View */}
        {activeTab === 'customers' && (
          <div className="space-y-8">
             {/* Customer Metrics */}
             <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 border border-stone-200 shadow-sm">
                    <h4 className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Total Clients</h4>
                    <p className="font-serif text-3xl text-stone-900">{customers.length}</p>
                </div>
                <div className="bg-white p-6 border border-stone-200 shadow-sm">
                    <h4 className="text-[10px] uppercase tracking-widest text-stone-400 mb-2">Top Spender</h4>
                    <p className="font-serif text-3xl text-gold-600">
                        {customers.length > 0 
                            ? `$${Math.max(...customers.map(c => c.totalSpent)).toLocaleString()}` 
                            : '$0'
                        }
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-sm shadow-sm border border-stone-200 overflow-hidden">
                {customers.length === 0 ? (
                    <div className="p-12 text-center">
                         <p className="font-serif italic text-stone-400 text-lg">Client database is currently empty.</p>
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                    <thead className="bg-stone-50 border-b border-stone-200">
                        <tr>
                        <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-stone-500">Client Profile</th>
                        <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-stone-500">Contact</th>
                        <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-stone-500">Lifetime Value</th>
                        <th className="p-5 font-bold text-[10px] uppercase tracking-widest text-stone-500">Last Engagement</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {customers.map((cust, i) => (
                        <tr key={i} className="hover:bg-stone-50 transition-colors">
                            <td className="p-5">
                                <span className="font-serif font-medium text-stone-900 block text-base">{cust.name}</span>
                            </td>
                            <td className="p-5 text-stone-500 font-mono text-xs">{cust.email}</td>
                            <td className="p-5 font-medium text-gold-600">${cust.totalSpent.toLocaleString()}</td>
                            <td className="p-5 text-stone-500">{new Date(cust.lastOrderDate).toLocaleDateString()}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
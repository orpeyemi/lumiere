import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'luxury2024') {
      onLogin();
    } else {
      setError('Invalid credentials. Access denied.');
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white p-10 max-w-sm w-full shadow-2xl border border-stone-200 relative">
        <button 
            onClick={onCancel}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-900"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <div className="text-center mb-10">
            <h2 className="font-serif text-2xl text-stone-900 tracking-wide">Maison Access</h2>
            <div className="w-8 h-px bg-gold-500 mx-auto mt-4 mb-2"></div>
            <p className="text-[10px] text-stone-500 uppercase tracking-[0.2em]">Authorized Personnel Only</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2 font-bold">Identity</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-stone-50 border-b border-stone-200 p-2 text-stone-900 focus:outline-none focus:border-gold-500 transition-colors font-serif placeholder-stone-300"
                    placeholder="Enter ID"
                    autoFocus
                />
            </div>
            <div>
                <label className="block text-[10px] uppercase tracking-widest text-stone-500 mb-2 font-bold">Passkey</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-stone-50 border-b border-stone-200 p-2 text-stone-900 focus:outline-none focus:border-gold-500 transition-colors font-serif placeholder-stone-300"
                    placeholder="Enter Passkey"
                />
            </div>
            
            {error && <p className="text-red-800 bg-red-50 p-2 text-xs text-center border border-red-100">{error}</p>}
            
            <button type="submit" className="w-full bg-stone-900 text-white py-4 uppercase text-[10px] tracking-[0.2em] font-bold hover:bg-gold-500 transition-colors duration-300">
                Authenticate
            </button>
        </form>
      </div>
    </div>
  );
};
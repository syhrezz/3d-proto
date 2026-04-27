import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Returns() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [isSubmitted]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (orderNumber && email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] pt-24 pb-20 bg-slate-50 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-emerald-500 font-bold text-[10px] uppercase tracking-[0.2em] mb-4 block">Customer Service</span>
          <h1 className="text-4xl md:text-5xl font-light text-slate-900 mb-6 tracking-tight">Returns & Exchanges</h1>
          <p className="text-slate-500 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            We want you to love your Bizmate pieces. If you're not completely satisfied, we're here to help make it right.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-20">
          
          {/* Form Section */}
          <div className="md:col-span-3">
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-slate-100">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900 mb-2">Return Initiated</h3>
                  <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                    We've found your order <span className="font-semibold text-slate-900">{orderNumber}</span>. We've sent an email to <span className="font-semibold text-slate-900">{email}</span> with your return label and instructions.
                  </p>
                  <button 
                    onClick={() => {
                      setIsSubmitted(false);
                      setOrderNumber('');
                      setEmail('');
                    }}
                    className="text-sm font-semibold text-slate-900 hover:text-emerald-600 transition-colors"
                  >
                    Start another return
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-semibold text-slate-900 mb-6">Start a Return</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="orderNumber" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Order Number</label>
                      <input 
                        type="text" 
                        id="orderNumber"
                        required
                        placeholder="e.g. BZ-123456"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        id="email"
                        required
                        placeholder="The email used for the order"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full mt-4 py-3.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                      Find My Order
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  </form>
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <p className="text-xs text-slate-500 text-center">
                      Need help? <Link to="#" className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors">Contact Support</Link>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Policy Section */}
          <div className="md:col-span-2 flex flex-col gap-8">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Our Policy</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-5 h-5 mt-0.5 text-slate-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">30-Day Returns</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">You have 30 days from the delivery date to return your items for a full refund.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 mt-0.5 text-slate-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">Original Condition</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">Items must be returned in their original packaging and in perfect, resalable condition.</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-5 h-5 mt-0.5 text-slate-400 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">Free Return Shipping</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">We provide a prepaid shipping label for all authorized returns within the country.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-slate-900 p-6 rounded-xl text-white">
               <h4 className="text-sm font-bold mb-2">Exchanges</h4>
               <p className="text-xs text-slate-400 leading-relaxed mb-4">Want a different color or model? The fastest way to ensure you get what you want is to return the item you have, and make a separate purchase for the new item.</p>
               <Link to="/" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors">
                 Shop Collection <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
               </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

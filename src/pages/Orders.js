import React, { useState, useEffect } from 'react';
import { orders } from '../data/orders';

export default function Orders() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [activeTab, searchQuery]);

  const tabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Shipped': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Processing': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return 'check-circle';
      case 'Shipped': return 'truck';
      case 'Processing': return 'clock';
      case 'Cancelled': return 'x-circle';
      default: return 'package';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 md:pt-32 pb-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2 tracking-tight">My Orders</h1>
            <p className="text-slate-500">Track, manage and view your purchase history.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <span><i data-lucide="search" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i></span>
            <input 
              type="text" 
              placeholder="Search by Order ID or Product..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-400/5 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar border-b border-slate-200">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-t-xl text-sm font-semibold whitespace-nowrap transition-all relative ${
                activeTab === tab 
                  ? 'text-slate-900' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-900 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <span><i data-lucide="shopping-bag" className="w-10 h-10 text-slate-300"></i></span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No orders found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">We couldn't find any orders matching your current filters.</p>
              <button 
                onClick={() => { setActiveTab('All'); setSearchQuery(''); }}
                className="mt-8 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
              >
                View All Orders
              </button>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Order Header */}
                <div className="px-6 md:px-8 py-5 bg-slate-50/50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                      <p className="text-sm font-bold text-slate-900">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date Placed</p>
                      <p className="text-sm font-medium text-slate-600">{new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="text-sm font-bold text-slate-900 font-mono">Rp {order.total.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold ${getStatusColor(order.status)}`}>
                    <span><i data-lucide={getStatusIcon(order.status)} className="w-3.5 h-3.5"></i></span>
                    {order.status.toUpperCase()}
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 md:px-8 py-6">
                  <div className="space-y-6">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 md:gap-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-50 rounded-2xl flex items-center justify-center p-2 border border-slate-100">
                          <img src={process.env.PUBLIC_URL + item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base md:text-lg font-bold text-slate-900 truncate mb-1">{item.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <p>Qty: <span className="font-semibold text-slate-700">{item.quantity}</span></p>
                            <p>Price: <span className="font-semibold text-slate-700">Rp {item.price.toLocaleString('id-ID')}</span></p>
                          </div>
                        </div>
                        <div className="hidden md:block">
                          <button className="px-5 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                            View Product
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Footer */}
                <div className="px-6 md:px-8 py-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-slate-500 italic">
                    Your order is currently <span className="font-bold text-slate-700 lowercase">{order.status}</span>.
                  </p>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-200">
                      Track Order
                    </button>
                    <button className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all">
                      Order Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Support Section */}
        <div className="mt-16 bg-slate-900 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Need help with your order?</h2>
              <p className="text-slate-400 max-w-md">Our customer support team is available 24/7 to assist you with any questions or concerns.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all">
                Contact Support
              </button>
              <button className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all border border-slate-700">
                FAQs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

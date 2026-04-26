import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';

export default function Catalog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Chairs', 'Tables', 'Loungers'];

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 md:pt-32 pb-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Banner */}
        <div className="relative w-full rounded-3xl overflow-hidden mb-12 min-h-[380px] md:h-[450px] bg-slate-900 flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/70 to-transparent z-10"></div>
          
          <img 
            src={process.env.PUBLIC_URL + '/armchair.png'} 
            alt="Spring Sale" 
            className="absolute right-0 top-0 h-full w-full md:w-1/2 object-cover md:object-contain opacity-40 md:opacity-100 mix-blend-lighten md:mix-blend-normal transition-opacity duration-700" 
          />
          
          <div className="relative z-20 px-6 md:px-16 py-12 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] md:text-sm rounded-full mb-4 border border-emerald-500/30 uppercase tracking-widest">
              Spring Collection 2024
            </span>
            <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 leading-[1.1]">
              Elevate your <br className="hidden md:block" /> living space.
            </h1>
            <p className="text-slate-300 text-sm md:text-lg mb-8 max-w-xs md:max-w-md leading-relaxed">
              Discover premium furniture designed for modern comfort. Get up to <span className="text-white font-bold">20% off</span> on selected items this week.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 md:px-8 py-3 md:py-3.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-white/10">
                Shop the Sale
              </button>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Our Collection</h2>
            <p className="text-slate-500">Discover premium furniture crafted for modern living.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <i data-lucide="search" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all"
              />
            </div>
            
            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
              {categories.map(category => (
                <button 
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === category 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
            <p className="text-slate-500">Try adjusting your filters or search query.</p>
            <button 
              onClick={() => { setActiveCategory('All'); setSearchQuery(''); }}
              className="mt-6 px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredProducts.map(product => (
              <Link key={product.id} to={`/product/${product.id}`} className="group block">
                <div className="relative bg-white rounded-3xl p-6 mb-4 aspect-square flex items-center justify-center transition-all duration-300 border border-slate-100 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1">
                  {product.oldPrice && (
                    <span className="absolute top-4 left-4 bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-md border border-emerald-100 z-10">
                      SALE
                    </span>
                  )}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors z-10 shadow-sm" onClick={(e) => { e.preventDefault(); /* mock wishlist */ }}>
                    <i data-lucide="heart" className="w-5 h-5"></i>
                  </button>
                  <img src={process.env.PUBLIC_URL + product.image} alt={product.name} className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-xl" />
                </div>
                <div className="px-2">
                  <div className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-wider">{product.category}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900">Rp {product.price.toLocaleString('id-ID')}</span>
                    {product.oldPrice && (
                      <span className="text-sm text-slate-400 line-through">Rp {product.oldPrice.toLocaleString('id-ID')}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

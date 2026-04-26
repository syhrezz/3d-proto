import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';

export default function Catalog() {
  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Our Collection</h1>
            <p className="text-slate-500">Discover premium furniture crafted for modern living.</p>
          </div>
          <div className="hidden md:flex gap-4">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-colors">All Pieces</button>
            <button className="px-4 py-2 border border-transparent rounded-full text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Chairs</button>
            <button className="px-4 py-2 border border-transparent rounded-full text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Tables</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products.map(product => (
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
      </div>
    </div>
  );
}

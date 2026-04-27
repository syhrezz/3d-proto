import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function Wishlist() {
  const { wishlistItems, getWishlistProducts, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wishlistProducts = getWishlistProducts();

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [wishlistProducts]);

  return (
    <div className="min-h-[calc(100vh-80px)] pt-24 pb-16 bg-slate-50 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Wishlist</h1>
          <p className="text-slate-500">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
            <p className="text-slate-500 mb-8 max-w-md">
              Save your favorite items here while you browse to easily find them later.
            </p>
            <Link 
              to="/" 
              className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistProducts.map(product => (
              <div key={product.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 group flex flex-col">
                <div className="relative aspect-square mb-4 bg-slate-50 rounded-xl flex items-center justify-center p-4">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      removeFromWishlist(product.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors shadow-sm z-10"
                    title="Remove from Wishlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                  </button>
                  <Link to={`/product/${product.id}`} className="absolute inset-0 z-0 flex items-center justify-center">
                    <img 
                      src={process.env.PUBLIC_URL + product.image} 
                      alt={product.name} 
                      className="max-w-[80%] max-h-[80%] object-contain transition-transform duration-500 group-hover:scale-105" 
                    />
                  </Link>
                </div>
                
                <div className="flex flex-col flex-grow">
                  <Link to={`/product/${product.id}`} className="flex-grow">
                    <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">{product.category}</div>
                    <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-bold text-slate-900">Rp {product.price.toLocaleString('id-ID')}</span>
                      {product.oldPrice && (
                        <span className="text-xs text-slate-400 line-through">Rp {product.oldPrice.toLocaleString('id-ID')}</span>
                      )}
                    </div>
                  </Link>
                  
                  <button 
                    onClick={() => {
                      addToCart(product);
                      // Optional: remove from wishlist after adding to cart
                      // removeFromWishlist(product.id);
                    }}
                    className="w-full py-2.5 bg-slate-100 text-slate-900 font-bold text-sm rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/><path d="M12 8v6"/><path d="M9 11h6"/></svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

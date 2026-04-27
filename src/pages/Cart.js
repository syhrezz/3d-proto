import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [orderComplete, cartItems]);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate API call
    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      clearCart();
    }, 1500);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-sm border border-slate-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span><i data-lucide="check" className="w-10 h-10 stroke-[3]"></i></span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h2>
          <p className="text-slate-500 mb-8">Thank you for shopping with Bizmate. Your premium furniture is being prepared for delivery.</p>
          <Link to="/" className="inline-block w-full bg-slate-900 text-white font-semibold py-4 rounded-xl hover:bg-slate-800 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 md:mb-12">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
            <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
              <span><i data-lucide="shopping-bag" className="w-12 h-12"></i></span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-500 mb-8">Looks like you haven't added any furniture to your cart yet.</p>
            <Link to="/" className="inline-block px-8 bg-slate-900 text-white font-semibold py-3.5 rounded-xl hover:bg-slate-800 transition-colors">
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-6 items-center sm:items-start relative">
                  <div className="w-full sm:w-32 h-32 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 p-2 border border-slate-100">
                    <img src={process.env.PUBLIC_URL + item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="flex-1 w-full text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row justify-between mb-2 sm:mb-1">
                      <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                      <span className="font-semibold text-slate-900 mt-1 sm:mt-0">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">{item.color}</p>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-6">
                      <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <span><i data-lucide="minus" className="w-4 h-4"></i></span>
                        </button>
                        <span className="w-8 text-center font-semibold text-slate-900">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          <span><i data-lucide="plus" className="w-4 h-4"></i></span>
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1.5"
                      >
                        <span><i data-lucide="trash-2" className="w-4 h-4"></i></span>
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 sticky top-32">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-900">Rp {cartTotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Shipping</span>
                    <span className="font-medium text-emerald-600">Free</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Tax (11%)</span>
                    <span className="font-medium text-slate-900">Rp {(cartTotal * 0.11).toLocaleString('id-ID')}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-end mb-8">
                  <span className="font-bold text-slate-900">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-slate-900 block">Rp {(cartTotal * 1.11).toLocaleString('id-ID')}</span>
                    <span className="text-xs text-slate-400">Includes VAT</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl hover:bg-slate-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCheckingOut ? (
                    <>
                      <span><i data-lucide="loader-2" className="w-5 h-5 animate-spin"></i></span>
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <span><i data-lucide="shield-check" className="w-4 h-4"></i></span>
                  <span>Secure 256-bit SSL encryption</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

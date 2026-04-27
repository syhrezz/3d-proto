import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/login');
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm" id="navbar">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-800 transition-transform group-hover:-rotate-6"><path d="M19 10V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path d="M3 13v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/><path d="M3 10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3Z"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/></svg>
              <span className="font-bold text-xl tracking-tight text-slate-900">Bizmate</span>
          </Link>

          <div className="flex items-center gap-5 text-slate-600">
              <button className="hover:text-slate-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>
              
              <Link to="/cart" className="hover:text-slate-900 transition-colors relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{cartCount}</span>
                  )}
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors overflow-hidden border border-slate-200"
                >
                  {user ? (
                    <span className="font-bold text-slate-800">{user.name.charAt(0).toUpperCase()}</span>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  )}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-4 w-[280px] bg-white rounded-xl shadow-2xl border border-slate-100 py-6 px-5 z-[60] animate-in fade-in zoom-in-95 duration-200">
                    {/* Close Button */}
                    <button 
                      onClick={() => setShowDropdown(false)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="border border-slate-200 rounded p-[1px]"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>

                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Links</p>
                      
                      <div className="flex flex-col">
                        <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 py-3 text-[14px] text-slate-700 hover:text-slate-900 border-b border-slate-50 transition-colors group">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-900"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                          My Profile
                        </Link>
                        <Link to="/orders" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 py-3 text-[14px] text-slate-700 hover:text-slate-900 border-b border-slate-50 transition-colors group">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-900"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                          My Orders
                        </Link>
                        <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 py-3 text-[14px] text-slate-700 hover:text-slate-900 border-b border-slate-50 transition-colors group">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-900"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                          Wishlist
                        </Link>
                        <button className="flex items-center gap-3 py-3 text-[14px] text-slate-700 hover:text-slate-900 border-b border-slate-50 text-left transition-colors group">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 group-hover:text-slate-900"><path d="m7 15 5 5 5-5"/><path d="M12 9v11"/><path d="M21 15V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11"/></svg>
                          Returns
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 space-y-4">
                      {user ? (
                        <button 
                          onClick={handleLogout}
                          className="w-full py-3.5 bg-slate-900 text-white font-bold text-sm tracking-wider rounded transition-all hover:bg-slate-800 active:scale-[0.98]"
                        >
                          LOGOUT
                        </button>
                      ) : (
                        <>
                          <Link 
                            to="/login" 
                            onClick={() => setShowDropdown(false)}
                            className="block w-full py-3.5 bg-slate-900 text-white text-center font-bold text-sm tracking-wider rounded transition-all hover:bg-slate-800 active:scale-[0.98]"
                          >
                            LOGIN
                          </Link>
                          <div className="text-center">
                            <span className="text-[11px] text-slate-500">Don't have an account? </span>
                            <Link to="/signup" className="text-[11px] font-bold text-slate-800 border-b-2 border-slate-300 pb-0.5 hover:border-slate-800 transition-all">REGISTER HERE.</Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
          </div>
      </div>
    </nav>
  );
}

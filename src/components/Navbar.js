import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm" id="navbar">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
              <i data-lucide="sofa" className="w-8 h-8 text-slate-800 transition-transform group-hover:-rotate-6"></i>
              <span className="font-bold text-xl tracking-tight text-slate-900">Bizmate</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link to="/" className="text-slate-900 transition-colors">Catalog</Link>
              <span className="hover:text-slate-900 transition-colors cursor-pointer">Designers</span>
              <span className="hover:text-slate-900 transition-colors cursor-pointer">About Us</span>
          </div>
          <div className="flex items-center gap-5 text-slate-600">
              <button className="hover:text-slate-900 transition-colors"><i data-lucide="search" className="w-5 h-5"></i></button>
              <button className="hover:text-slate-900 transition-colors"><i data-lucide="heart" className="w-5 h-5"></i></button>
              <button className="hover:text-slate-900 transition-colors relative">
                  <i data-lucide="shopping-bag" className="w-5 h-5"></i>
                  <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">0</span>
              </button>
          </div>
      </div>
    </nav>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import ARViewer from '../components/ARViewer';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [product, showToast]);

  useEffect(() => {
    const p = products.find(p => p.id === id);
    setProduct(p);
    setQty(1);
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: qty });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (!product) return <div className="min-h-screen flex items-center justify-center font-medium text-slate-500">Loading Product...</div>;

  return (
    <main className="pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto min-h-screen relative">
      {/* Toast Notification */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 transition-all duration-300 z-50 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <i data-lucide="check" className="w-4 h-4 text-white stroke-[3]"></i>
        </div>
        <span className="font-medium text-sm">Added to your cart</span>
        <Link to="/cart" className="ml-2 text-emerald-400 hover:text-emerald-300 text-sm font-bold transition-colors">View Cart</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20">
        
        {/* Left: 3D AR Viewer */}
        <div className="relative w-full rounded-2xl md:rounded-3xl bg-gradient-to-br from-white to-slate-100 overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center aspect-[4/5] md:aspect-auto md:min-h-[500px]">
          {/* Badges */}
          <div className="absolute top-6 left-6 z-10 flex flex-col gap-3 pointer-events-none">
            <span className="bg-white/80 backdrop-blur-md text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/50 shadow-sm w-fit">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              3D & AR Ready
            </span>
          </div>
          
          <ARViewer modelUrl={process.env.PUBLIC_URL + product.modelUrl} scaleFactor={product.scaleFactor} />
        </div>

        {/* Right: Details */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 md:mb-6 font-medium">
            <Link to="/" className="hover:text-slate-900">Catalog</Link>
            <span>/</span>
            <span className="hover:text-slate-900">{product.category}</span>
            <span>/</span>
            <span className="text-slate-900">{product.name}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-3 md:mb-4 leading-tight">{product.name}</h1>
          
          {/* Reviews & SKU */}
          <div className="flex items-center gap-4 md:gap-6 mb-6">
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                <i data-lucide="star" className="w-4 h-4 fill-current"></i>
                <i data-lucide="star" className="w-4 h-4 fill-current"></i>
                <i data-lucide="star" className="w-4 h-4 fill-current"></i>
                <i data-lucide="star" className="w-4 h-4 fill-current"></i>
                <i data-lucide="star-half" className="w-4 h-4 fill-current"></i>
              </div>
              <span className="text-sm font-medium text-slate-600 ml-1">4.9 (84 reviews)</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            <span className="text-sm text-slate-500 font-mono tracking-wider">SKU: {product.id.split('-')[0].toUpperCase()}-01</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-6 md:mb-8">
            <span className="text-2xl md:text-3xl font-bold text-slate-900">Rp {product.price.toLocaleString('id-ID')}</span>
            {product.oldPrice && (
              <>
                <span className="text-sm text-slate-500 line-through mb-1">Rp {product.oldPrice.toLocaleString('id-ID')}</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md mb-1 ml-2 border border-emerald-100">Sale</span>
              </>
            )}
          </div>

          <p className="text-slate-600 leading-relaxed mb-10 text-sm md:text-base">
            {product.description}
          </p>

          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-slate-900">Finish / Color</span>
              <span className="text-sm text-slate-500 font-medium">{product.color}</span>
            </div>
            <div className="w-10 h-10 rounded-full border border-white shadow-md ring-1 ring-slate-200 bg-slate-800" title={product.color}></div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-12">
            <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900"><i data-lucide="minus" className="w-4 h-4"></i></button>
              <span className="w-8 text-center font-semibold text-slate-900">{qty}</span>
              <button onClick={() => setQty(Math.min(10, qty + 1))} className="w-12 h-12 flex items-center justify-center text-slate-500 hover:text-slate-900"><i data-lucide="plus" className="w-4 h-4"></i></button>
            </div>
            
            <button onClick={handleAddToCart} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors">
              <i data-lucide="shopping-bag" className="w-5 h-5"></i>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

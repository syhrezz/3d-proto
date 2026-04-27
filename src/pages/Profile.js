import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    biodata: user?.biodata || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      updateProfile(formData);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 text-3xl font-bold border-4 border-white shadow-lg shadow-emerald-100/50">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
              
              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl text-sm font-medium transition-all">
                  <span><i data-lucide="user" className="w-4 h-4"></i></span>
                  Account Settings
                </button>
                <button 
                  onClick={() => navigate('/orders')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-medium transition-all"
                >
                  <span><i data-lucide="shopping-cart" className="w-4 h-4"></i></span>
                  My Orders
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-medium transition-all">
                  <span><i data-lucide="heart" className="w-4 h-4"></i></span>
                  Wishlist
                </button>
                <button 
                  onClick={() => { logout(); navigate('/login'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl text-sm font-medium transition-all mt-4"
                >
                  <span><i data-lucide="log-out" className="w-4 h-4"></i></span>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-100 shadow-sm">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-1">Edit Profile</h1>
                <p className="text-slate-500 text-sm">Update your personal information and address details.</p>
              </div>

              {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-3 animate-fade-in">
                  <span><i data-lucide="check-circle" className="w-5 h-5"></i></span>
                  <span className="text-sm font-medium">Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      disabled
                      value={formData.email}
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none opacity-60 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Biodata / Bio</label>
                  <textarea 
                    name="biodata"
                    rows="3"
                    placeholder="Tell us about yourself..."
                    value={formData.biodata}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/5 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Shipping Address</label>
                  <textarea 
                    name="address"
                    rows="2"
                    placeholder="Enter your complete address..."
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/5 transition-all resize-none"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-2xl shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-8 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Security</h3>
                  <p className="text-sm text-slate-500">Enable two-factor authentication or change password.</p>
                </div>
                <button className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                  Manage
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

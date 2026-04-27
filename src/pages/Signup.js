import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    setLoading(true);
    // Mock signup delay
    setTimeout(() => {
      login({ email, name: name || email.split('@')[0], biodata: '', address: '' });
      setLoading(false);
      navigate('/');
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] pt-24 pb-8 flex items-center justify-center bg-slate-50 px-4 md:px-6">
      <div className="max-w-4xl w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">

        {/* Left Side: Visual Content */}
        <div className="hidden md:flex md:w-[45%] relative bg-slate-900 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800/80 to-slate-900 z-10 transition-all duration-700"></div>

          <img
            src={process.env.PUBLIC_URL + '/lounger.png'}
            alt="Interior Design"
            className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 opacity-60 mix-blend-overlay"
          />

          <div className="relative z-20 flex flex-col justify-center px-10 h-full text-white">
            <Link to="/" className="flex items-center gap-2 mb-4 animate-fade-in opacity-80 hover:opacity-100 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M19 10V4a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" /><path d="M3 13v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" /><path d="M3 10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-3Z" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /></svg>
              <span className="font-bold text-lg tracking-tight">Bizmate</span>
            </Link>

            <h2 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight">
              Create your <br /> <span className="text-emerald-400">dream</span> space.
            </h2>
            <p className="text-slate-300 text-[13px] mb-6 max-w-[240px] leading-relaxed">
              Join 2k+ lovers and get exclusive 3D AR tools.
            </p>
          </div>

          <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px]"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-32 h-32 bg-slate-500/10 rounded-full blur-[50px]"></div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-full md:w-[55%] p-6 lg:p-10 flex flex-col justify-center">


          <div className="mb-6 text-center md:text-left">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Create Account</h1>
            <p className="text-slate-500 text-sm">Join us for a premium experience.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 ml-1" htmlFor="name">Full Name</label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                <input
                  type="text"
                  id="name"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/5 transition-all text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600 ml-1" htmlFor="email">Email Address</label>
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8z" /><path d="m22 9-10 7L2 9" /></svg>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/5 transition-all text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-1">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 ml-1" htmlFor="password">Password</label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  <input
                    type="password"
                    id="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/5 transition-all text-slate-800"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 ml-1" htmlFor="confirmPassword">Confirm</label>
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                  <input
                    type="password"
                    id="confirmPassword"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/5 transition-all text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1 py-0.5">
              <input type="checkbox" id="terms" required className="w-3 h-3 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500 cursor-pointer" />
              <label htmlFor="terms" className="text-[10px] text-slate-600 font-semibold cursor-pointer">Agree to Terms \u0026 Conditions</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg shadow-slate-100 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 ${loading ? 'cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Create Account'}
            </button>

            <div className="relative flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-slate-100"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or</span>
              <div className="flex-1 h-px bg-slate-100"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center gap-2 py-1.5 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google" />
                Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 py-1.5 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="w-4 h-4" alt="LinkedIn" />
                LinkedIn
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-[11px] text-slate-500 font-medium">
            Have an account? <Link to="/login" className="text-emerald-600 font-bold hover:underline decoration-2 underline-offset-4">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

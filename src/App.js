import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
        <div className="App flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
          </div>
        </div>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

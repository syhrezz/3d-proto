import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <Router>
      <div className="App flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

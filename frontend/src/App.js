import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import NavBar from './components/NavBar';
import Home from './components/Home';
import ProductDetail from './components/ProductDetail.js';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import Checkout from './components/Checkout';


function App() {
  const [cart, setCart] = useState([]);

  return (
    <Router>
      <NavBar cart={cart} />
      <Routes>
        <Route path="/" element={<Home setCart={setCart} cart={cart} />} exact />
        <Route path="/product/:id" element={<ProductDetail cart={cart} setCart={setCart} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Checkout cart={cart} setCart={setCart} />} />
        {/* Add more routes as needed */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

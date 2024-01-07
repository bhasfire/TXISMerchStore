import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.scss';
import styled from 'styled-components';
import NavBar from './components/NavBar';
import Home from './components/Home';
import ProductDetail from './components/ProductDetail.js';
import About from './components/About';
import Contact from './components/Contact';
import Checkout from './components/Checkout';
import CartSidebar from './components/CartSidebar';
import Confirmation from './components/Confirmation.js';

const PageContainer = styled.div`
  min-height: 100vh; /* Minimum height of 100% of the viewport height */
  display: flex;
  flex-direction: column; /* Stack children vertically */
`;

const ContentWrap = styled.div`
  flex: 1; /* Grow to use all available space */
  /* Add padding or any other styling here for your main content area */
`;

const StyledFooter = styled.footer`
  background: #f8f9fa; /* Example background color for the footer */
  padding: 1rem 0; /* Example padding for the footer */
  text-align: center;
`;

function App() {
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false); // Add this state

  // Function to toggle cart visibility
  const toggleCartVisibility = () => {
    setIsCartVisible(!isCartVisible);
  };

  return (
    <Router>
      <NavBar cart={cart} toggleCart={toggleCartVisibility} /> {/* Pass the function */}
      <PageContainer>
        <ContentWrap>
          <Routes>
            <Route path="/" element={<Home setCart={setCart} cart={cart} />} exact />
            <Route path="/product/:id" element={<ProductDetail cart={cart} setCart={setCart} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Checkout cart={cart} setCart={setCart} />} />
            <Route path="/confirmation" element={<Confirmation />} />
            {/* Add more routes as needed */}
          </Routes>
        </ContentWrap>
        <StyledFooter>
          <p>&copy; {new Date().getFullYear()} Texas Iron Spikes</p>
          {/* Add more footer content as needed */}
        </StyledFooter>
      </PageContainer>
      {isCartVisible && <CartSidebar cart={cart} setCart={setCart} onClose={() => setIsCartVisible(false)} isVisible={isCartVisible} />}
    </Router>
  );
}

export default App;

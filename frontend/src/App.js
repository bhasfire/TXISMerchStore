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

  return (
    <Router>
      <NavBar cart={cart} />
      <PageContainer>
        <ContentWrap>
          <Routes>
            <Route path="/" element={<Home setCart={setCart} cart={cart} />} exact />
            <Route path="/product/:id" element={<ProductDetail cart={cart} setCart={setCart} />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Checkout cart={cart} setCart={setCart} />} />
            {/* Add more routes as needed */}
          </Routes>
        </ContentWrap>
        <StyledFooter>
          <p>&copy; {new Date().getFullYear()} TXIS Merch Store</p>
          {/* Add more footer content as needed */}
        </StyledFooter>
      </PageContainer>
    </Router>
  );
}

export default App;

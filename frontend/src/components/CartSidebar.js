import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Sidebar = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  z-index: 1000;
  padding: 20px; // Add padding for the content inside
`;

const CartItem = styled.div`
  margin-bottom: 20px; // Give some space between cart items
  display: flex;
  align-items: center;
  
  & > img {
    width: 50px; // Example image size, adjust as needed
    height: 50px; // Keep the aspect ratio
    object-fit: cover;
    margin-right: 10px; // Space between image and text
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const CartSidebar = ({ cart, onClose }) => {
    return (
      <Sidebar>
        <CloseButton onClick={onClose}>&times;</CloseButton> {/* This is a simple 'X' button */}
        {cart.map((item, index) => (
          <CartItem key={index}>
            <img src={item.imageUrl} alt={item.name} />
            <div>
              <h5>{item.name}</h5>
              <p>Size: {item.size}</p>
              <p>Price: {item.price}</p>
            </div>
          </CartItem>
        ))}
        {/* Here you would calculate and show total price */}
        <Link to="/cart"> {/* Import Link from react-router-dom */}
            <button>Go to Checkout</button>
        </Link>
      </Sidebar>
    );
};

export default CartSidebar;

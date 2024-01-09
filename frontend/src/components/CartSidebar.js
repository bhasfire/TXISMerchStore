import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between; // Aligns children (cart items and checkout button) on opposite ends
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  overflow-y: auto;
  z-index: 1000;
  padding: 20px;
//   transition: right 0.3s ease-in-out; // Add this line for transition
//   right: ${props => props.isVisible ? '0' : '-300px'};
`;

const CartItemsContainer = styled.div`
  overflow-y: auto;
`;

const CheckoutButtonContainer = styled.div`
  padding-top: 20px; // Add some space above the button
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

const CartSidebar = ({ cart, setCart, onClose, isVisible }) => {
    console.log("Cart items:", cart);

    const subtotal = cart.reduce((total, item) => {
        // Remove the dollar sign and convert to a number
        const itemPrice = Number(item.price.replace('$', ''));
        const itemQuantity = Number(item.quantity);
        return total + (itemPrice * itemQuantity);
    }, 0);

    const sidebarRef = useRef();

    const incrementQuantity = (id, size) => {
        const updatedCart = cart.map(item =>
            item.id === id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCart(updatedCart);
    };

    const decrementQuantity = (id, size) => {
        setCart(cart.map(item =>
            item.id === id && item.size === size && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    const removeFromCart = (id, size) => {
        setCart(cart.filter(item => !(item.id === id && item.size === size)));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                onClose(); // Hide the sidebar
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        // Cleanup function
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);
    
    return (
        <Sidebar ref={sidebarRef} isVisible={isVisible}>
            <CloseButton onClick={onClose}>&times;</CloseButton>
            <CartItemsContainer>
            <h3>Your Cart</h3>
                {cart.map((item, index) => (
                <CartItem key={index}>
                    <img src={item.imageUrl} alt={item.name} />
                    <div>
                    <h5>{item.name}</h5>
                    <p>
                        Size: {item.size} <br />
                        Price: {item.price} <br />
                        Quantity: {item.quantity}
                    </p>
                    <button onClick={() => incrementQuantity(item.id, item.size)}>+</button>
                    <span> {item.quantity} </span>
                    <button onClick={() => decrementQuantity(item.id, item.size)}>-</button>
                    <button onClick={() => removeFromCart(item.id, item.size)}>Remove</button>
                    </div>
                </CartItem>
                ))}
            </CartItemsContainer>
            <h3>Subtotal: ${subtotal.toFixed(2)}</h3> {/* Display subtotal */}
            <CheckoutButtonContainer>
                <Link to="/cart">
                    <button onClick={onClose}>Go to Checkout</button>
                </Link>
            </CheckoutButtonContainer>

        </Sidebar>
    );
};

export default CartSidebar;

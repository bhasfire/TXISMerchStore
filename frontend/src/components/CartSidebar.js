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
  transform: translateX(${props => props.isVisible ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
`;

const CartItemsContainer = styled.div`
  overflow-y: auto;

`;

const CheckoutButtonContainer = styled.div`
  padding-top: 20px; // Add some space above the button
  border-top: 2px solid #dee2e6; // Example border, adjust as needed

  button {
    background-color: #007bff; // Example button background color, adjust as needed
    width: 100%;
    color: white; // Example button text color, adjust as needed
    border: none;
    padding: 10px 20px; // Adjust padding as needed
    margin-bottom: 20px; // Add some space below the button
    border-radius: 5px; // Rounded corners for the button 
    font-size: 16px; // Adjust font size as needed
    cursor: pointer;
    transition: background-color 0.3s; // Transition for hover effect

    &:hover {
      background-color: #0056b3; // Darker shade on hover, adjust as needed
    }
`;

const CartItem = styled.div`
  margin-bottom: 20px; // Give some space between cart items
  display: flex;
  align-items: center;
  margin-bottom: 20px; // Add some space between cart items
  padding-bottom: 20px; // Add some space below the cart items
  border-bottom: 2px solid #dee2e6; // Example border, adjust as needed
  
  & > img {
    width: 100x; // Example image size, adjust as needed
    height: 100px; // Keep the aspect ratio
    object-fit: cover;
    margin-right: 10px; // Space between image and text
  }

  div {
    flex-grow: 1;
  }

  p {
    font-size: 14px; // Smaller font size for details
    line-height: 1.5; // Line spacing
  }

  button {
    margin-right: 5px; // Space between buttons
    padding: 5px 10px; // Button padding
    font-size: 14px; // Button font size
    border: none;
    // background-color: #007bff;
    color: black;
    border-radius: 5px;

    &:hover {
      background-color: #0056b3;
    }

    &:last-child {
      margin-right: 0; // No right margin for last button
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 50px;
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

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);
    
    return (
        <Sidebar ref={sidebarRef} isVisible={isVisible}>
            <CloseButton onClick={onClose}>&times;</CloseButton>
            <CartItemsContainer>
                <h3>Your Cart</h3>
                {cart.length === 0 ? (
                        <p>Your Cart Is Currently Empty</p> // Display when cart is empty
                    ) : (
                    cart.map((item, index) => (
                        <CartItem key={index}>
                            <img src={item.imageUrl} alt={item.name} />
                            <div>
                                <strong>{item.name}</strong>
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
                    ))
                )}
            </CartItemsContainer>
            <CheckoutButtonContainer>
                <h5>Subtotal: ${subtotal.toFixed(2)}</h5> 
                <Link to="/cart">
                    <button onClick={onClose}>Start Your Checkout</button>
                </Link>
            </CheckoutButtonContainer>

        </Sidebar>
    );
};

export default CartSidebar;

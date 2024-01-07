// Checkout.js
import React from 'react';
import styled from 'styled-components';

const CheckoutContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`;

const CartColumn = styled.div`
  width: 50%;
`;

const FormColumn = styled.div`
  width: 50%;
`;

const CheckoutForm = styled.form`
  // Style your form here
`;

const Checkout = ({ cart, setCart }) => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const incrementQuantity = (id, size) => {
        setCart(cart.map(item =>
          item.id === id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };
    
    const decrementQuantity = (id, size) => {
        setCart(cart.map(item =>
          item.id === id && item.size === size && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };
    
    const removeFromCart = (id, size) => {
        setCart(cart.filter(item => !(item.id === id && item.size === size)));
    };

    return (
        <CheckoutContainer>
          
          <FormColumn>
            <CheckoutForm>
              <h3>Customer Details</h3>
              <div>
                <label>Name:</label>
                <input type="text" placeholder="Enter your name" />
              </div>
              <div>
                <label>Email:</label>
                <input type="email" placeholder="Enter your email" />
              </div>
              <div>
                <label>Phone Number:</label>
                <input type="tel" placeholder="Enter your phone number" />
              </div>
              <button type="submit">Submit</button>
            </CheckoutForm>
          </FormColumn>

          <CartColumn>
            <h2>Checkout</h2>
            {cart.map((item, index) => (
              <div key={index}>
                <img src={item.imageUrl} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                <h5>{item.name}</h5>
                <p>Size: {item.size} - Price: {item.price} - Quantity: {item.quantity}</p>
                {/* Uncomment below buttons if you need to modify quantity in checkout page */}
                <button onClick={() => incrementQuantity(item.id, item.size)}>+</button>
                <span> {item.quantity} </span>
                <button onClick={() => decrementQuantity(item.id, item.size)}>-</button>
                <button onClick={() => removeFromCart(item.id, item.size)}>Remove</button>
              </div>
            ))}
            <p>Subtotal: ${subtotal.toFixed(2)}</p> {/* Display subtotal */}
          </CartColumn>
        </CheckoutContainer>
      );
      
};

export default Checkout;

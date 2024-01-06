// Checkout.js
import React from 'react';

const Checkout = ({ cart, setCart }) => {

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
        <div>
          <h2>Checkout</h2>
          {cart.map((item, index) => (
            <div key={index}>
              <img src={item.imageUrl} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
              <h5>{item.name}</h5>
              <p>Size: {item.size} - Price: {item.price} - Quantity: {item.quantity}</p>
              <button onClick={() => incrementQuantity(item.id, item.size)}>+</button>
              <span> {item.quantity} </span>
              <button onClick={() => decrementQuantity(item.id, item.size)}>-</button>
              <button onClick={() => removeFromCart(item.id, item.size)}>Remove</button>
            </div>
          ))}
          {/* Add more checkout functionality here */}
        </div>
    );
};

export default Checkout;

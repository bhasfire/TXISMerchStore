// Checkout.js
import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const [customerName, setCustomerName] = useState('');
    // const [customerEmail, setCustomerEmail] = useState('');
    // const [customerPhone, setCustomerPhone] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const orderData = {
            customerName,
            products: cart.map(item => ({ ...item, price: item.price.replace('$', '') })),
            subtotal: subtotal.toFixed(2)
        };

        console.log('Submitting order:', orderData); // Log the order being submitted
    
        try {
            const response = await fetch('http://localhost:3001/api/submit-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });
    
            if (response.ok) {
                console.log('Order submitted successfully');
                setCart([]); // Clear the cart
                navigate('/confirmation'); // Redirect to the confirmation page
            } else {
                const errorText = await response.text();
                console.error('Server responded with a non-OK status:', response.status);
                alert(errorText); // Display the server error message to the user
            }
        } catch (error) {
            console.error('Error occurred during the fetch operation:', error);
            alert('An error occurred while submitting your order. Please try again.'); // Display a general error message to the user
        }
    };
    

    const subtotal = cart.reduce((total, item) => {
        const itemPrice = Number(item.price.replace('$', ''));
        const itemQuantity = Number(item.quantity);
        return total + (itemPrice * itemQuantity);
    }, 0);

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
            <CheckoutForm onSubmit={handleSubmit}>
                <h3>Customer Details</h3>
                <div>
                    <label>Name:</label>
                    <input 
                        type="text" 
                        placeholder="Enter your name" 
                        value={customerName} 
                        onChange={(e) => setCustomerName(e.target.value)} 
                    />
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
                <p>
                    Size: {item.size} <br />
                    Price: {item.price} <br />
                    Quantity: {item.quantity}
                </p>
                {/* Uncomment below buttons if you need to modify quantity in checkout page */}
                <button onClick={() => incrementQuantity(item.id, item.size)}>+</button>
                <span> {item.quantity} </span>
                <button onClick={() => decrementQuantity(item.id, item.size)}>-</button>
                <button onClick={() => removeFromCart(item.id, item.size)}>Remove</button>
              </div>
            ))}
            <h3>Subtotal: ${subtotal.toFixed(2)}</h3> {/* Display subtotal */}
          </CartColumn>
        </CheckoutContainer>
      );
      
};

export default Checkout;

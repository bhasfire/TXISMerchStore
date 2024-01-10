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
    margin-top: 20px;
    width: 50%;
    border-right: 1px solid #ddd; // Divider
    padding-right: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    h2 {
        margin-bottom: 15px;
        color: #333;
    }

    > div {
        border: 1px solid #eee;
        padding: 10px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: box-shadow 0.3s;

        &:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        img {
            width: 100px;
            height: 100px;
            object-fit: cover;
            border-radius: 4px;
            display: flex;
            margin-right: 10px;
        }

        h5 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 5px;
        }

        p {
            font-size: 14px;
            color: #666;
            line-height: 1.4;
        }

        button {
            padding: 5px 10px;
            margin-right: 5px;
            border: none;
            border-radius: 4px;
            background-color: #007bff;
            color: white;
            cursor: pointer;
            transition: background-color 0.2s;

            &:hover {
                background-color: #0056b3;
            }

            &:last-child {
                background-color: #dc3545;

                &:hover {
                    background-color: #c82333;
                }
            }
        }
    }

    h3 {
        align-self: flex-left;
        font-weight: bold;
        color: #333;
    }
`;

const FormColumn = styled.div`
    margin-top: 20px;
    width: 50%;
    padding-left: 20px;
`;

const CheckoutForm = styled.form`
    // border: 1px solid #ddd;
    display: flex;
    flex-direction: column;
    gap: 15px;

    h3 {
        margin-bottom: 10px;
    }

    div {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 50%;
    }

    label {
        font-weight: bold;
    }

    input {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        padding: 10px 20px;
        width: 50%;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;

        &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }

        &:hover:not(:disabled) {
            background-color: #0056b3;
        }
    }
`;

const Checkout = ({ cart, setCart }) => {
    const navigate = useNavigate();
    const [customerName, setCustomerName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // const [customerEmail, setCustomerEmail] = useState('');
    // const [customerPhone, setCustomerPhone] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); // Start loading
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
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Processing order..." : "Submit"}
                </button>

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

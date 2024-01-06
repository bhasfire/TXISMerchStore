import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

const ProductDetail = ({ cart, setCart }) => {
  let { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');


  useEffect(() => {
    // Fetch the details of the product using the id
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          console.error('Error fetching product details');
        }
      } catch (error) {
        console.error('There was a problem fetching product details:', error);
      }
    };

    fetchProductDetail();
  }, [id]);

  // Function to handle adding to cart
  const handleAddToCart = () => {
    // Define the logic to add the product to the cart
    // This is a simple example; you'll need to adjust it based on your cart logic
    setCart([...cart, product]);
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.imageUrl} alt={product.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
      {/* Add a select element for size */}
      <Form.Group controlId="sizeSelect">
        <Form.Label>Select Size</Form.Label>
        <Form.Control as="select" value={selectedSize} onChange={e => setSelectedSize(e.target.value)}>
          <option value="">Select a size</option>
          {product.sm_qty > 0 && <option value="S">Small</option>}
          {product.md_qty > 0 && <option value="M">Medium</option>}
          {product.lg_qty > 0 && <option value="L">Large</option>}
          {product.xl_qty > 0 && <option value="XL">X-Large</option>}
        </Form.Control>
      </Form.Group>
      <Button onClick={() => handleAddToCart()}>Add to Cart</Button>
    </div>
  );
};


export default ProductDetail;

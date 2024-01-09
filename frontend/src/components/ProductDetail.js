import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Container, Row, Col, Image } from 'react-bootstrap';

const ProductDetail = ({ cart, setCart, isCartVisible, setIsCartVisible }) => {
  let { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
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

  const handleAddToCart = () => {
  // Find if the item with the same id and size already exists
    const existingItem = cart.find(item => item.id === product.id && item.size === selectedSize);
    
    if (existingItem) {
      // Increment quantity if item already exists
      setCart(cart.map(item => 
        item.id === product.id && item.size === selectedSize ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      // Add new item with quantity 1 if it doesn't exist
      const newItem = { ...product, size: selectedSize, quantity: 1 };
      setCart(currentCart => [...currentCart, newItem]);
    }
    setIsCartVisible(true);
  };

  if (!product) {
    return <div>Loading product details...</div>;
  }

  return (
    <Container>
      <Row>
        <Col md={6}>
          {/* Image should take the full width of the column */}
          <Image src={product.imageUrl} alt={product.name} fluid />
        </Col>
        <Col md={6}>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <h3>Price: {product.price}</h3>
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
          <Button variant="primary" onClick={handleAddToCart} disabled={!selectedSize}>Add to Cart</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;

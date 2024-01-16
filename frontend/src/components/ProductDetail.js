import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import ImageCarousel from './ImageCarousel';
import styled from 'styled-components';

const ImageContainer = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-top: 20px;
`;

const ProductTitle = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const ProductDescription = styled.p`
  font-size: 16px;
  line-height: 1.5;
  color: #666;
  margin-bottom: 20px;
`;

const ProductPrice = styled.h3`
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  padding: 10px 0;
  font-size: 18px;
  margin-top: 15px;
`;

const ProductDetailsCol = styled(Col)`
  margin-top: 20px; // Adjust this value as needed
`;


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
          <ImageContainer>
            <ImageCarousel imageUrls={product.imageUrls ? product.imageUrls : []} />
          </ImageContainer>
        </Col>
        <ProductDetailsCol md={6}>
          <ProductTitle>{product.name}</ProductTitle>
          <ProductDescription>{product.description}</ProductDescription>
          <ProductPrice>Price: {product.price}</ProductPrice>
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
          {product.sm_qty > 0 || product.md_qty > 0 || product.lg_qty > 0 || product.xl_qty > 0 ? (
            <StyledButton variant="primary" onClick={(e) => handleAddToCart(e, product)}>Add to Cart</StyledButton>
          ) : (
            <StyledButton variant="secondary" disabled>Out of Stock</StyledButton>
          )}
        </ProductDetailsCol>
      </Row>
    </Container>
  );
};

export default ProductDetail;

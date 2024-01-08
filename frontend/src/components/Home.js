import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import CartSidebar from './CartSidebar';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  border: none;
  box-shadow: none;
  cursor: pointer; // Change cursor to pointer on hover
    transition: all 0.2s ease-in-out;
`;


const StyledCardBody = styled(Card.Body)`
  padding: 0; // Remove padding to align with the image
  margin-top: 20px; // Add some space between the image and the text

  .product-description {
    font-size: 14px;
  }

  .full-width-select, .full-width-btn {
    width: 100%;
    border-radius: 0;
    margin-left: 0;
    margin-right: 0;
    margin-top: 10px;
    margin-bottom: 10px;
  }
`;

const FullWidthFormGroup = styled(Form.Group)`
  width: 100%;
  margin: 0; // Remove margin to align with the image
`;


const Home = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState(new Map());
  const [isCartVisible, setIsCartVisible] = useState(false); // New state for cart visibility
  const navigate = useNavigate(); // Declare navigate function


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // const response = await fetch('https://us-central1-txismerchstore.cloudfunctions.net/app/api/products');
        const response = await fetch('http://localhost:3001/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          // Handle errors
          console.error('Error fetching products');
        }
      } catch (error) {
        console.error('There was a problem fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const cardImageStyle = {
    width: '100%', // This ensures the image takes the full width of the card
    height: '300px', // Set a fixed height for all images
    objectFit: 'cover' // This will cover the area, cropping the image if necessary
  };

  const addToCart = (product) => {
    const size = selectedSizes.get(product.id);
    if (!size) {
      alert('Please select a size.');
      return;
    }
  
    // Check if the item already exists in the cart
    const existingItem = cart.find(item => item.id === product.id && item.size === size);
  
    if (existingItem) {
      // Increment quantity if item already exists
      setCart(cart.map(item => 
        item.id === product.id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      // Add new item with quantity 1 if it doesn't exist
      const newItem = { ...product, size, quantity: 1 };
      setCart(currentCart => [...currentCart, newItem]);
    }
    setIsCartVisible(true);
  };
  

  const handleCloseCart = () => {
    setIsCartVisible(false); // Hide the cart sidebar
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes(prevSizes => new Map(prevSizes).set(productId, size));
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`); // Navigate to the ProductDetail page with the product id
  };

  const handleAddToCartClick = (e, product) => {
    e.stopPropagation(); // Prevent the event from bubbling up to the card's onClick handler
    addToCart(product);
  };

  return (
    <Container>
      <Row className="my-4">
        <Col sm={3}>
          {/* Simple filter section, can be expanded later */}
          <h5>Filter Products</h5>
          <div>Category</div>
          <form>
            {/* Filter checkboxes */}
            {/* Add more filters as needed */}
          </form>
        </Col>
        <Col sm={9}>
          <Row>
            <Col xs={12} md={6}>
                <p>{products.length} items</p> {/* Displaying the number of items */}
            </Col>
            <Col xs={12} md={6} className="d-flex justify-content-end">
            <DropdownButton
                id="dropdown-basic-button"
                title="Sort by"
                className="mb-3 dropdown-basic-button" // Apply custom class here
                >
                <Dropdown.Item href="#/action-1">Best Sellers</Dropdown.Item>
            {/* Add more sort options as needed */}
            </DropdownButton>
          </Col>
            {products.map(product => (
              <Col sm={4} key={product.id} className="mb-4">
                <StyledCard>
                  <Card.Img variant="top" src={product.imageUrl} style={cardImageStyle} onClick={() => handleProductClick(product.id)} />
                  <StyledCardBody onClick={() => handleProductClick(product.id)}>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text className="product-description">
                      {product.description}
                      <br />
                      <strong>{product.price}</strong>
                    </Card.Text>
                    <form onClick={e => e.stopPropagation()}>
                      <FullWidthFormGroup controlId={`sizeSelect-${product.id}`}>
                        <Form.Control
                          as="select"
                          className="full-width-select"
                          onChange={(e) => handleSizeChange(product.id, e.target.value)}
                          defaultValue=""
                        >
                          <option value="" disabled>Select a size</option>
                          {product.sm_qty > 0 && <option value="S">Small</option>}
                          {product.md_qty > 0 && <option value="M">Medium</option>}
                          {product.lg_qty > 0 && <option value="L">Large</option>}
                          {product.xl_qty > 0 && <option value="XL">X-Large</option>}
                        </Form.Control>
                      </FullWidthFormGroup>
                      <Button className="full-width-btn" variant="primary" onClick={(e) => handleAddToCartClick(e, product)}>Add to Cart</Button>
                    </form>
                  </StyledCardBody>
                </StyledCard>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
      {isCartVisible && <CartSidebar cart={cart} setCart={setCart} onClose={handleCloseCart} />}
    </Container>
  );  
};

export default Home;

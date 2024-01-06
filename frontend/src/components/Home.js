import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import CartSidebar from './CartSidebar';

const Home = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState(new Map());
  const [isCartVisible, setIsCartVisible] = useState(false); // New state for cart visibility
  const navigate = useNavigate(); // Declare navigate function


  useEffect(() => {
    const fetchProducts = async () => {
      try {
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
            <Col sm={12}>
              {/* Sort dropdown */}
              <DropdownButton id="dropdown-basic-button" title="Sort by" className="mb-3">
                <Dropdown.Item href="#/action-1">Best Sellers</Dropdown.Item>
                {/* Add more sort options as needed */}
              </DropdownButton>
            </Col>
            {products.map(product => (
              <Col sm={4} key={product.id} className="mb-4">
              <Card>
                <Card.Img variant="top" src={product.imageUrl} style={cardImageStyle} onClick={() => handleProductClick(product.id)} />
                <Card.Body onClick={() => handleProductClick(product.id)}>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>
                    {product.description}
                    <br />
                    <strong>{product.price}</strong>
                  </Card.Text>
                  <form onClick={e => e.stopPropagation()}> {/* Stop propagation here as well */}
                    <Form.Group controlId={`sizeSelect-${product.id}`}>
                      <Form.Control
                        as="select"
                        onChange={(e) => handleSizeChange(product.id, e.target.value)}
                        defaultValue=""
                      >
                        <option value="" disabled>Select a size</option>
                        {product.sm_qty > 0 && <option value="S">Small</option>}
                        {product.md_qty > 0 && <option value="M">Medium</option>}
                        {product.lg_qty > 0 && <option value="L">Large</option>}
                        {product.xl_qty > 0 && <option value="XL">X-Large</option>}
                      </Form.Control>
                    </Form.Group>
                  </form>
                  <Button variant="primary" onClick={(e) => handleAddToCartClick(e, product)}>Add to Cart</Button>
                </Card.Body>
              </Card>
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

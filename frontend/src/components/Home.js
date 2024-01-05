import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';

const Home = () => {
  const [products, setProducts] = useState([]);

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

  return (
    <Container>
      <Row className="my-4">
        <Col sm={3}>
          {/* Simple filter section, can be expanded later */}
          <h5>Filter Products</h5>
          <div>Size</div>
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
                <Card.Img variant="top" src={product.imageUrl} style={cardImageStyle} />
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>
                      {product.description}
                      <br />
                      <strong>{product.price}</strong>
                    </Card.Text>
                    <form>
                        <Form.Group controlId={`sizeSelect-${product.id}`}>
                            <Form.Label>Select a size</Form.Label>
                            <Form.Control as="select" defaultValue="">
                            <option value="" disabled>Choose...</option>
                            {product.sm_qty > 0 && <option value="S">S</option>}
                            {product.md_qty > 0 && <option value="M">M</option>}
                            {product.lg_qty > 0 && <option value="L">L</option>}
                            {product.xl_qty > 0 && <option value="XL">XL</option>}
                            </Form.Control>
                        </Form.Group>
                    </form>
                    <Button variant="primary">Add to Cart</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;

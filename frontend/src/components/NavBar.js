import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, Form, FormControl, Button, Badge } from 'react-bootstrap';
import logo from '../images/txislogo.png'; // Import the logo

const NavBar = ({ cart, toggleCart }) => {

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Navbar bg="light" expand="lg">
      <LinkContainer to="/">
        <Navbar.Brand>
          <img
            src={logo} // Replace with the path to your logo image
            alt="TXIS"
            style={{ width: '75px', height: 'px', marginRight: '10px', marginLeft: '50px' }} // Adjust size as needed
          />
          Texas Iron Spikes Store
        </Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <LinkContainer to="/about">
            <Nav.Link>About</Nav.Link>
          </LinkContainer>
          <LinkContainer to="/contact">
            <Nav.Link>Contact</Nav.Link>
          </LinkContainer>
        </Nav>
        <Form className="d-flex">
          <FormControl
            type="search"
            placeholder="What are you looking for?"
            className="mr-2"
            aria-label="Search"
          />
          <Button variant="outline-success">Search</Button>
        </Form>
        <Nav>
          <LinkContainer to="/account">
            <Nav.Link>Account</Nav.Link>
          </LinkContainer>
            <Nav.Link onClick={toggleCart}> 
              Cart {itemCount > 0 && <Badge bg="secondary">{itemCount}</Badge>} {/* Display the badge only if itemCount is greater than 0 */}
            </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;

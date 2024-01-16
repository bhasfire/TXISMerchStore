import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import ProductItem from './ProductItem';
import CartSidebar from './CartSidebar';
import styled from 'styled-components';
import bannerImage from '../images/SpikesBanner.png'; // Adjust the path based on your project structure

const Banner = styled.div`
  width: 100%;
  height: 250px; // Adjust the height as needed
  background-image: url(${bannerImage});
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  rotate: 10deg;
`;

const Home = ({ cart, setCart }) => {
  const [products, setProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState(new Map());
  const [isCartVisible, setIsCartVisible] = useState(false); // New state for cart visibility
  const navigate = useNavigate(); // Declare navigate function
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [sortMethod, setSortMethod] = useState('Best Sellers');


  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/products');
        // const response = await fetch('https://us-central1-txismerchstore.cloudfunctions.net/app/api/products');

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          const uniqueCategories = Array.from(new Set(data.map(p => p.category)));
          setCategories(uniqueCategories);
          setFilteredProducts(data);
        } else {
          console.error('Error fetching products');
        }
      } catch (error) {
        console.error('There was a problem fetching products:', error);
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  // Update filtered products whenever products or sortMethod changes
  useEffect(() => {
    let sortedProducts = [...products];

    if (sortMethod === 'Lowest Price') {
      sortedProducts.sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')));
    } else if (sortMethod === 'Highest Price') {
      sortedProducts.sort((a, b) => parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')));
    }

    // Apply category filter if any categories are selected
    if (selectedCategories.size > 0) {
      sortedProducts = sortedProducts.filter(p => selectedCategories.has(p.category));
    }

    setFilteredProducts(sortedProducts);
  }, [products, selectedCategories, sortMethod]);



  const handleSortChange = (method) => {
    setSortMethod(method);
  };

  const handleCategoryChange = (category, isChecked) => {
    const updatedCategories = new Set(selectedCategories);
    if (isChecked) {
      updatedCategories.add(category);
    } else {
      updatedCategories.delete(category);
    }
    setSelectedCategories(updatedCategories);

    if (updatedCategories.size === 0) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => updatedCategories.has(p.category)));
    }
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
    <Banner /> 
      {isLoading ? (
        <div>Loading products...</div> 
      ) : (
        <Row className="my-4">
          <Col sm={3}>
            <h5>Filter Products</h5>
            <Form>
                <p>Category</p>
                {categories.map(cat => (
                    <Form.Group key={cat} controlId={`filter-${cat}`}>
                    <Form.Check 
                        type="checkbox"
                        label={cat}
                        onChange={(e) => handleCategoryChange(cat, e.target.checked)}
                    />
                    </Form.Group>
                ))}
            </Form>
          </Col>
          <Col sm={9}>
            <Row>
              <Col xs={12} md={6}>
                <p>{products.length} items</p> {/* Displaying the number of items */}
              </Col>
              <Col xs={12} md={6} className="d-flex justify-content-end">
                <DropdownButton
                    id="dropdown-basic-button"
                    title={`${sortMethod}`}
                    className="mb-3 dropdown-basic-button"
                >
                    <Dropdown.Item onClick={() => handleSortChange('Best Sellers')}>Best Sellers</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('Lowest Price')}>Lowest Price</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleSortChange('Highest Price')}>Highest Price</Dropdown.Item>
                </DropdownButton>
              </Col>
              {filteredProducts.map(product => (
                <ProductItem 
                  key={product.id}
                  product={product}
                  handleProductClick={handleProductClick}
                  handleSizeChange={handleSizeChange}
                  handleAddToCartClick={handleAddToCartClick}
                />
              ))}
            </Row>
          </Col>
        </Row>
      )}
        <CartSidebar cart={cart} setCart={setCart} onClose={handleCloseCart} isVisible={isCartVisible} />
    </Container>
  );
  
};

export default Home;

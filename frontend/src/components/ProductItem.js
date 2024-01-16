// ProductItem.js
import React from 'react';
import ImageCarousel from './ImageCarousel';
import {Col, Card, Button, Form } from 'react-bootstrap';
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

    .full-width-select, .full-width-btn {
    width: 100%;
    border-radius: 0;
    margin-left: 0;
    margin-right: 0;
    margin-top: 10px;
    margin-bottom: 10px;
    }

    .product-description {
    font-size: 14px;
    min-height: 4.5em; // Adjust this value based on the line height and font size
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    }

    .price-tag {
    margin-top: auto; // Pushes the price tag to the bottom of the card body
    font-weight: bold;
    }
`;

const FullWidthFormGroup = styled(Form.Group)`
  width: 100%;
  margin: 0; // Remove margin to align with the image
`;

const ImageCarouselWrapper = styled.div`
    cursor: pointer;
    transition: transform 0.3s ease-in-out;

    &:hover {
        transform: scale(1.05); // Zoom in on hover
    }

    img {
        width: 100%;
        height: 300px;
        object-fit: cover;
    }
`;

// const useIntersectionObserver = (ref, options) => {
//     const [isIntersecting, setIntersecting] = useState(false);
  
//     useEffect(() => {
//       const observer = new IntersectionObserver(([entry]) => {
//         setIntersecting(entry.isIntersecting);
//       }, options);
  
//       if (ref.current) {
//         observer.observe(ref.current);
//       }
  
//       return () => {
//         if (ref.current) {
//           observer.unobserve(ref.current);
//         }
//       };
//     }, [ref, options]);
  
//     return isIntersecting;
//   };
  

  const ProductItem = ({ product, handleProductClick, handleSizeChange, handleAddToCartClick }) => {

    return (
      <Col sm={4} className="mb-4">
        <ImageCarouselWrapper onClick={() => handleProductClick(product.id)}>
          <ImageCarousel 
            imageUrls={product.imageUrls ? product.imageUrls : []} 
            // onClick={() => handleProductClick(product.id)} 
            context="home"
          />
        </ImageCarouselWrapper>
        <StyledCard>
          <StyledCardBody onClick={() => handleProductClick(product.id)}>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text className="product-description">
              {product.description}
              <br /><br />
              <span className="price-tag">{product.price}</span>
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
              {product.sm_qty > 0 || product.md_qty > 0 || product.lg_qty > 0 || product.xl_qty > 0 ? (
                <Button className="full-width-btn" variant="primary" onClick={(e) => handleAddToCartClick(e, product)}>Add to Cart</Button>
              ) : (
                <Button className="full-width-btn" variant="secondary" disabled>Out of Stock</Button>
              )}
            </form>
          </StyledCardBody>
        </StyledCard>
      </Col>
    );
};

export default ProductItem;

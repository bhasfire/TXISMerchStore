import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  let { id } = useParams();

  return (
    <div>
      <h1>Product Details</h1>
      <p>Details for product ID: {id}</p>
      {/* More detailed product information goes here */}
    </div>
  );
};

export default ProductDetail;

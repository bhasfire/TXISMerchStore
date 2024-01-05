const CartSidebar = ({ cart }) => {
    return (
      <div className="cart-sidebar">
        {/* Map over cart items and display them */}
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <img src={item.imageUrl} alt={item.name} />
            <div>
              <h5>{item.name}</h5>
              <p>Size: {item.size}</p>
              <p>Price: {item.price}</p>
            </div>
            {/* Add other cart item details */}
          </div>
        ))}
        {/* Calculate and show total price */}
        {/* Add checkout button */}
      </div>
    );
  };

export default CartSidebar;
  
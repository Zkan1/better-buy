import React, { useState, useEffect } from "react";
import "./UpdateProductForm.css";

const UpdateProductForm = ({ product, onUpdate }) => {
  const [name, setName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    if (product) {
      setName(product.name);
      setNewPrice(product.new_price);
    }
  }, [product]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleNewPriceChange = (e) => {
    setNewPrice(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(name, newPrice);
  };

  return (
    <div className="update-product-form">
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPrice">New Price:</label>
          <input
            type="number"
            id="newPrice"
            value={newPrice}
            onChange={handleNewPriceChange}
          />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateProductForm;

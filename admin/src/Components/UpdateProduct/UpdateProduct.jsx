import React, { useEffect, useState } from "react";
import "./UpdateProduct.css";
import edit_icon from "../../assets/edit_icon.png";  // Güncelleme ikonu

const UpdateProduct = () => {
  const [allproducts, setAllProducts] = useState([]);

  const fetchInfo = async () => {
    await fetch("http://localhost:4000/allproducts")
      .then((res) => res.json())
      .then((data) => {
        setAllProducts(data);
      });
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const update_product = async (id) => {
    const updatedProduct = allproducts.find(product => product.id === id);
    const updatedName = prompt("Enter new name", updatedProduct.name);
    const updatedPrice = prompt("Enter new price", updatedProduct.new_price);

    await fetch("http://localhost:4000/updateproduct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id, name: updatedName, new_price: updatedPrice }),
    });

    await fetchInfo();
  };

  return (
    <div className="updateproduct">
      <h1>Update Products</h1>
      <div className="updateproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Update</p>
      </div>
      <div className="updateproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => {
          return (
            <>
              <div
                key={index}
                className="updateproduct-format-main updateproduct-format"
              >
                <img
                  src={product.image}
                  alt=""
                  className="updateproduct-product-icon"
                />
                <p>{product.name}</p>
                <p>${product.old_price}</p>
                <p>${product.new_price}</p>
                <p>{product.category}</p>
                <img
                  onClick={() => {
                    update_product(product.id);
                  }}
                  className="updateproduct-update-icon"
                  src={edit_icon}
                  alt=""
                />
              </div>
              <hr />
            </>
          );
        })}
      </div>
    </div>
  );
};

export default UpdateProduct;

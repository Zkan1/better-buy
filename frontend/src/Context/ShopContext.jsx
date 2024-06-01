import React, { createContext, useEffect, useState } from "react";


export const ShopContext = createContext(null);
const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index < 300 + 1; index++) {
    cart[index] = 0;
  }
  return cart;
};
const ShopContextProvider = (props) => {

  const[cartItems, setCartItems] = useState(getDefaultCart());
  const[all_product,setAll_Product] = useState([]);

  useEffect(() => { 
    // Bileşen yüklendiğinde çalışacak bir yan etki (side effect) tanımlanır.
    fetch('http://localhost:4000/allproducts') // 'http://localhost:4000/allproducts' adresine bir GET isteği gönderilir.
      
      .then((response) => response.json()) // Yanıt JSON formatında parse edilir.
      
      .then((data) => setAll_Product(data)); // Parse edilen JSON verisi (ürünler) all_product durumuna ayarlanır.

      if (localStorage.getItem('auth-token')) {
        fetch('http://localhost:4000/getcart',{
          method: 'POST',
          headers:{
            Accept:'application/form-data',
            'auth-token': `${localStorage.getItem('auth-token')}`,
            'Content-Type': 'application/json',
          },
          body:"",

        }).then((response)=>response.json())
        .then((data)=>setCartItems(data));
      }
      
  }, []); 
  const addToCart = (itemId) => {
    // sepete ekleme ve eger eklendiyse sepette arttirma islemi.
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4000/addtocart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({"itemId":itemId}),
      })
      .then((response)=>response.json())
      .then((data)=>console.log(data));


    }
  };

  const removeFromCart = (itemId) => {
    // sepetten silme fonkiyonu
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    if (localStorage.getItem('auth-token')) {
      fetch('http://localhost:4000/removefromcart',{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'auth-token': `${localStorage.getItem('auth-token')}`,
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({"itemId":itemId}),
      })
      .then((response)=>response.json())
      .then((data)=>console.log(data));
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        totalAmount += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmount;
  };
  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];;
      }
    }
    return totalItem;
  };

  
  //const contextValue = {all_product,cartItems,addToCart};

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};
export default ShopContextProvider;

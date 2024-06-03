import React, { useContext, useEffect, useState } from 'react';

import './Orders.css';

const Orders = () => {
  const { user, fetchUserData } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      fetchUserData();
    }

    const fetchOrders = async () => {
      const response = await fetch('http://localhost:4000/orders', {
        method: 'GET',
      });

      const data = await response.json();
      setOrders(data);
    };

    fetchOrders();
  }, [user, fetchUserData]);

  if (!user || !orders) {
    return <p>Loading...</p>;
  }

  return (
    <div className="orders-container">
      <h1>Orders</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-item">
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Customer:</strong> {order.customer}</p>
            <p><strong>Total:</strong> ${order.total}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Cart:</strong> {JSON.stringify(order.cartData)}</p>
            <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;

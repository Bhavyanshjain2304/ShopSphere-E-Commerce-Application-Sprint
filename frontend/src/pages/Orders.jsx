import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orderApi';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getMyOrders().then((res) => setOrders(res.data.data || []));
  }, []);

  if (orders.length === 0) return <div><h2>No orders yet</h2></div>;

  return (
    <div>
      <h2>My Orders</h2>
      {orders.map((order) => (
        <div key={order.id}>
          <Link to={`/orders/${order.id}`}>
            <span>Order #{order.id}</span>
            <span>{order.status}</span>
            <span>${order.totalAmount}</span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}

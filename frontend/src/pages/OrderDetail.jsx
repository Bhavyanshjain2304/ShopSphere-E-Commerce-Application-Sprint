import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder } from '../api/orderApi';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrder(id).then((res) => setOrder(res.data.data));
  }, [id]);

  if (!order) return <div>Loading...</div>;

  return (
    <div>
      <h2>Order #{order.id}</h2>
      <p>Status: {order.status}</p>
      <p>Total: ${order.totalAmount}</p>
      <p>Address: {order.deliveryAddress}</p>
      <p>Payment: {order.paymentMode}</p>
      <h3>Items</h3>
      {order.items?.map((item) => (
        <div key={item.productId}>
          <span>{item.productName}</span>
          <span>x{item.quantity}</span>
          <span>${item.subtotal}</span>
        </div>
      ))}
    </div>
  );
}

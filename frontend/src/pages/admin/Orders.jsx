import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/adminApi';

const STATUSES = ['CHECKOUT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getAllOrders().then((res) => {
      const data = res.data.data;
      setOrders(Array.isArray(data) ? data : data?.content || []);
    });
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div>
      <h2>Manage Orders</h2>
      <table>
        <thead>
          <tr><th>ID</th><th>User</th><th>Total</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>#{order.id}</td>
              <td>{order.userEmail}</td>
              <td>${order.totalAmount}</td>
              <td>{order.status}</td>
              <td>
                <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../../api/adminApi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboard().then((res) => setStats(res.data.data));
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <nav>
        <Link to="/admin/products">Manage Products</Link>
        <Link to="/admin/orders">Manage Orders</Link>
      </nav>
      {stats && (
        <div>
          <div>Total Orders: {stats.totalOrders}</div>
          <div>Total Revenue: ${stats.totalRevenue}</div>
        </div>
      )}
    </div>
  );
}

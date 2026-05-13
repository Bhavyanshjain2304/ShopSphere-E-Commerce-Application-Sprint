import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function RevenueChart({ orders = [] }) {
  // Aggregate revenue by date from orders list
  const revenueByDate = orders.reduce((acc, order) => {
    if (!order.createdAt || !order.totalAmount) return acc;
    const date = new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + parseFloat(order.totalAmount || 0);
    return acc;
  }, {});

  const data = Object.entries(revenueByDate).map(([date, revenue]) => ({ date, revenue }));

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-48 text-gray-400">No revenue data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
        <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
        <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

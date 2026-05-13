import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  PAID: '#3b82f6',
  PROCESSING: '#8b5cf6',
  SHIPPED: '#6366f1',
  DELIVERED: '#22c55e',
  CANCELLED: '#ef4444',
  CHECKOUT: '#f59e0b',
};

export default function OrderStatusChart({ orders = [] }) {
  const statusCount = orders.reduce((acc, order) => {
    const s = order.status || 'UNKNOWN';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(statusCount).map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-48 text-gray-400">No order data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] || '#94a3b8'} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [value, name]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

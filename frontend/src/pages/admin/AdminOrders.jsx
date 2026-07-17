import React, { useEffect, useState } from 'react';
import API from '../../api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
      <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Orders Management</h3>
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
            <th style={{ padding: '12px' }}>Order #</th>
            <th style={{ padding: '12px' }}>Customer</th>
            <th style={{ padding: '12px' }}>Amount</th>
            <th style={{ padding: '12px' }}>Status</th>
            <th style={{ padding: '12px' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontWeight: '600' }}>#{o.id}</td>
              <td style={{ padding: '12px' }}>{o.user?.firstName} {o.user?.lastName}</td>
              <td style={{ padding: '12px', fontWeight: '700' }}>₹{o.totalAmount?.toFixed(2) || '0.00'}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                    backgroundColor: o.status === 'DELIVERED' ? '#dcfce7' : (o.status === 'CANCELLED' ? '#fee2e2' : '#fef9c3'),
                    color: o.status === 'DELIVERED' ? '#16a34a' : (o.status === 'CANCELLED' ? '#ef4444' : '#ca8a04')
                 }}>
                  {o.status}
                </span>
              </td>
              <td style={{ padding: '12px', color: '#64748b' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;

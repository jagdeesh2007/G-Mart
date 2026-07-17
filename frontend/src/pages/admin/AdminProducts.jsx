import React, { useEffect, useState } from 'react';
import API from '../../api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Inventory / Catalog</h3>
        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>+ Add Product</button>
      </div>
      
      <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
            <th style={{ padding: '12px' }}>ID</th>
            <th style={{ padding: '12px' }}>Product Name</th>
            <th style={{ padding: '12px' }}>Category</th>
            <th style={{ padding: '12px' }}>Price</th>
            <th style={{ padding: '12px' }}>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontWeight: '600' }}>{p.id}</td>
              <td style={{ padding: '12px' }}>{p.name}</td>
              <td style={{ padding: '12px' }}>{p.category}</td>
              <td style={{ padding: '12px', fontWeight: '700' }}>₹{p.price?.toFixed(2) || '0.00'}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', backgroundColor: p.stockQuantity > 0 ? '#dcfce7' : '#fee2e2', color: p.stockQuantity > 0 ? '#16a34a' : '#ef4444' }}>
                  {p.stockQuantity > 0 ? `${p.stockQuantity} in stock` : 'Out of stock'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;

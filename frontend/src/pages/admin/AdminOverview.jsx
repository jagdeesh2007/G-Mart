import React from 'react';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminOverview = ({ metrics, loading, chartData }) => {
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
         <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={24} style={{ color: '#10b981' }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> +12.5%
            </span>
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Total Revenue</div>
          <div style={{ fontSize: '28px', color: '#0f172a', fontWeight: '800' }}>₹{metrics.totalSales?.toFixed(2) || '0.00'}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingCart size={24} style={{ color: '#3b82f6' }} />
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Total Orders</div>
          <div style={{ fontSize: '28px', color: '#0f172a', fontWeight: '800' }}>{metrics.totalOrders || 0}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={24} style={{ color: '#ef4444' }} />
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Active Customers</div>
          <div style={{ fontSize: '28px', color: '#0f172a', fontWeight: '800' }}>{metrics.totalUsers || 0}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#fefce8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={24} style={{ color: '#eab308' }} />
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>Products in Catalog</div>
          <div style={{ fontSize: '28px', color: '#0f172a', fontWeight: '800' }}>{metrics.totalProducts || 0}</div>
        </div>

      </div>

      {/* Charts & Tables Area */}
      <div style={{ display: 'flex', gap: '30px' }}>
        
        {/* Chart */}
        <div style={{ flex: '2', backgroundColor: '#ffffff', borderRadius: '24px', padding: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 24px 0' }}>Revenue Overview (Last 7 Days)</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: '700', color: '#0f172a' }}
                  itemStyle={{ fontWeight: '600', color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div style={{ flex: '1.5', backgroundColor: '#ffffff', borderRadius: '24px', padding: '30px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Recent Orders</h3>
            <button style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>View All</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {metrics.recentOrders && metrics.recentOrders.length > 0 ? (
              metrics.recentOrders.map(order => (
                <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Order #{order.id}</div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{order.user?.firstName} {order.user?.lastName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a' }}>₹{order.totalAmount?.toFixed(2) || '0.00'}</div>
                    <div style={{ fontSize: '11px', fontWeight: '700', marginTop: '4px', display: 'inline-block', padding: '2px 8px', borderRadius: '12px',
                      backgroundColor: order.status === 'DELIVERED' ? '#dcfce7' : (order.status === 'CANCELLED' ? '#fee2e2' : '#fef9c3'),
                      color: order.status === 'DELIVERED' ? '#16a34a' : (order.status === 'CANCELLED' ? '#ef4444' : '#ca8a04')
                    }}>
                      {order.status}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: '14px' }}>
                No recent orders found
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminOverview;

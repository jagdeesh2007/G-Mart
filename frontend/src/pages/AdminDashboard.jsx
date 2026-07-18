import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, Users, Package, Settings, LogOut, Search, Bell } from 'lucide-react';
import API from '../api';
import AdminOverview from './admin/AdminOverview';
import AdminOrders from './admin/AdminOrders';
import AdminProducts from './admin/AdminProducts';
import AdminUsers from './admin/AdminUsers';
import AddProductModal from './admin/AddProductModal';

const AdminDashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    
    // Always fetch metrics for the overview tab to be ready
    API.get('/admin/metrics')
      .then(res => setMetrics(res.data))
      .catch(err => console.error("Error fetching metrics:", err))
      .finally(() => setLoading(false));
  }, [isAdmin, navigate]);

  const handleExport = async () => {
    try {
      let data = [];
      let filename = 'export.csv';

      if (activeTab === 'orders') {
        const res = await API.get('/admin/orders');
        data = res.data.map(o => ({ ID: o.id, Status: o.status, Amount: o.totalAmount, Date: o.createdAt }));
        filename = 'orders_report.csv';
      } else if (activeTab === 'users') {
        const res = await API.get('/admin/users');
        data = res.data.map(u => ({ ID: u.id, Name: `${u.firstName} ${u.lastName}`, Email: u.email, Role: u.role, Status: u.status }));
        filename = 'users_report.csv';
      } else if (activeTab === 'inventory') {
        const res = await API.get('/products?size=1000');
        data = res.data.content.map(p => ({ ID: p.id, Name: p.name, Price: p.price, Stock: p.stockQuantity }));
        filename = 'inventory_report.csv';
      } else {
        if (!metrics) return;
        data = [
          { Metric: 'Total Revenue', Value: metrics.totalSales },
          { Metric: 'Total Orders', Value: metrics.totalOrders },
          { Metric: 'Active Orders', Value: metrics.activeOrders },
          { Metric: 'Total Customers', Value: metrics.totalCustomers },
          { Metric: 'Total Products', Value: metrics.totalProducts }
        ];
        filename = 'dashboard_metrics.csv';
      }

      if (data.length === 0) {
        alert("No data available to export");
        return;
      }

      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${String(row[header]).replace(/"/g, '""')}"`).join(','))
      ];
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export report", err);
      alert("Failed to export report.");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview metrics={metrics || {}} loading={loading} chartData={[
          { name: 'Mon', revenue: 4000 },
          { name: 'Tue', revenue: 3000 },
          { name: 'Wed', revenue: 2000 },
          { name: 'Thu', revenue: 2780 },
          { name: 'Fri', revenue: 1890 },
          { name: 'Sat', revenue: 2390 },
          { name: 'Sun', revenue: 3490 },
        ]} />;
      case 'orders':
        return <AdminOrders />;
      case 'inventory':
        return <AdminProducts />;
      case 'users':
        return <AdminUsers />;
      default:
        return <AdminOverview metrics={metrics || {}} loading={loading} chartData={[]} />;
    }
  };

  if (!isAdmin) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" }}>
      
      {/* Sidebar */}
      <div style={{ width: '280px', backgroundColor: '#1e293b', color: '#ffffff', display: 'flex', flexDirection: 'column', padding: '24px 0' }}>
        <div style={{ padding: '0 24px', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#3b82f6' }}>C</span>-Mart <span style={{ fontSize: '12px', fontWeight: '600', backgroundColor: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>PRO</span>
          </h1>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 16px' }}>
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '12px' }}>Main Menu</div>
          
          <button 
            onClick={() => setActiveTab('overview')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', backgroundColor: activeTab === 'overview' ? '#3b82f6' : 'transparent', color: activeTab === 'overview' ? '#ffffff' : '#cbd5e1', border: 'none', cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left', fontWeight: activeTab === 'overview' ? '700' : '600' }}
          >
            <LayoutDashboard size={20} /> Overview
          </button>
          
          <button 
            onClick={() => setActiveTab('orders')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', backgroundColor: activeTab === 'orders' ? '#3b82f6' : 'transparent', color: activeTab === 'orders' ? '#ffffff' : '#cbd5e1', border: 'none', cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left', fontWeight: activeTab === 'orders' ? '700' : '600' }}
          >
            <ShoppingCart size={20} /> Orders Management
          </button>
          
          <button 
            onClick={() => setActiveTab('inventory')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', backgroundColor: activeTab === 'inventory' ? '#3b82f6' : 'transparent', color: activeTab === 'inventory' ? '#ffffff' : '#cbd5e1', border: 'none', cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left', fontWeight: activeTab === 'inventory' ? '700' : '600' }}
          >
            <Package size={20} /> Inventory / Catalog
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', backgroundColor: activeTab === 'users' ? '#3b82f6' : 'transparent', color: activeTab === 'users' ? '#ffffff' : '#cbd5e1', border: 'none', cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left', fontWeight: activeTab === 'users' ? '700' : '600' }}
          >
            <Users size={20} /> User Accounts
          </button>
        </nav>

        <div style={{ padding: '24px 16px 0', borderTop: '1px solid #334155', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '0 8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{user?.firstName} {user?.lastName}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Super Admin</div>
            </div>
          </div>
          <button 
            onClick={() => { logout(); navigate('/'); }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', width: '100%', backgroundColor: 'transparent', border: '1px solid #334155', color: '#cbd5e1', borderRadius: '12px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'orders' && 'Orders Management'}
              {activeTab === 'inventory' && 'Inventory / Catalog'}
              {activeTab === 'users' && 'User Accounts'}
            </h2>
            <p style={{ color: '#64748b', marginTop: '6px' }}>
              {activeTab === 'overview' && "Monitor your platform's real-time performance."}
              {activeTab === 'orders' && "Manage and track customer orders."}
              {activeTab === 'inventory' && "Manage your product catalog and stock levels."}
              {activeTab === 'users' && "Manage customer and admin accounts."}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={handleExport} style={{ padding: '10px 16px', fontSize: '14px' }}>Export Report</button>
            <button className="btn-primary" onClick={() => setIsAddProductModalOpen(true)} style={{ padding: '10px 16px', fontSize: '14px' }}>+ New Product</button>
          </div>
        </header>

        {renderContent()}

        <AddProductModal 
          isOpen={isAddProductModalOpen} 
          onClose={() => setIsAddProductModalOpen(false)} 
          onProductAdded={() => {
            // Optional: You could trigger a re-fetch of metrics or just let the tabs handle their own fetching
            if (activeTab === 'inventory') {
              // Trigger a re-render of AdminProducts by toggling tab or using a key
              setActiveTab('overview');
              setTimeout(() => setActiveTab('inventory'), 10);
            }
          }} 
        />

      </div>
    </div>
  );
};

export default AdminDashboard;

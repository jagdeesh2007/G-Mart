import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import API from '../api';
import { Package, MapPin, MessageSquare, LogOut, ChevronRight, CheckCircle, Truck, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // orders, addresses, support
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mocking dashboard data since backend controllers are currently missing
      const mockOrder = {
        id: 999,
        orderNumber: 'ORD-MOCK-123',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        estimatedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        grandTotal: 1249.99,
        orderStatus: 'SHIPPED',
        paymentMethod: 'UPI',
        paymentStatus: 'PAID',
        recipientName: 'Jagadeesh Dodda',
        streetAddress: '123 Tech Park',
        city: 'Hyderabad',
        state: 'Telangana',
        zipCode: '500081',
        trackingTimeline: JSON.stringify([
          { status: 'Order Placed', description: 'We have received your order.', date: new Date(Date.now() - 86400000 * 2).toISOString() },
          { status: 'Processing', description: 'Your order is being prepared.', date: new Date(Date.now() - 86400000 * 1.5).toISOString() },
          { status: 'Shipped', description: 'Your order is on the way.', date: new Date(Date.now() - 86400000 * 0.5).toISOString() }
        ])
      };
      setOrders([mockOrder]);
      setAddresses([]);
    } catch (err) {
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>
      
      {/* Top Banner */}
      <div style={{ backgroundColor: '#0f172a', padding: '60px 20px', color: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: '800' }}>
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0 }}>Welcome back, {user?.firstName}</h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '6px' }}>{user?.email} • Member since {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '-30px auto 40px', display: 'flex', gap: '30px', padding: '0 20px' }}>
        
        {/* Sidebar Navigation */}
        <div style={{ flex: '0 0 250px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
            {[
              { id: 'orders', label: 'My Orders', icon: <Package size={18} /> },
              { id: 'addresses', label: 'Address Book', icon: <MapPin size={18} /> },
              { id: 'support', label: 'Helpdesk', icon: <MessageSquare size={18} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  backgroundColor: activeTab === tab.id ? '#eff6ff' : 'transparent',
                  color: activeTab === tab.id ? '#2563eb' : '#475569',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: activeTab === tab.id ? '700' : '600',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  marginBottom: '8px'
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
            
            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />
            
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                backgroundColor: 'transparent',
                color: '#ef4444',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: '1', backgroundColor: '#ffffff', borderRadius: '24px', padding: '30px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', minHeight: '500px' }}>
          
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid #f1f5f9', borderTopColor: '#2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            <>
              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="animate-fade-in">
                  <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '24px' }}>Order History</h2>
                  
                  {orders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                      <Package size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
                      <h3 style={{ fontSize: '18px', color: '#475569' }}>No orders yet</h3>
                      <button onClick={() => navigate('/')} className="btn-primary" style={{ marginTop: '16px' }}>Start Shopping</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {orders.map(order => (
                        <div key={order.id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>ORDER NUMBER</div>
                              <div style={{ fontSize: '16px', color: '#0f172a', fontWeight: '800' }}>{order.orderNumber}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600', marginBottom: '4px' }}>TOTAL AMOUNT</div>
                              <div style={{ fontSize: '18px', color: '#2563eb', fontWeight: '800' }}>₹{order.grandTotal.toFixed(2)}</div>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <span style={{ 
                              padding: '4px 10px', 
                              borderRadius: '20px', 
                              fontSize: '12px', 
                              fontWeight: '700',
                              backgroundColor: order.orderStatus === 'DELIVERED' ? '#dcfce7' : '#fef9c3',
                              color: order.orderStatus === 'DELIVERED' ? '#16a34a' : '#ca8a04'
                            }}>
                              {order.orderStatus}
                            </span>
                            <span style={{ fontSize: '13px', color: '#64748b' }}>
                              {order.orderStatus === 'DELIVERED' ? 'Delivered on' : 'Expected delivery:'} {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                            </span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              Track & View Details <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ADDRESSES TAB */}
              {activeTab === 'addresses' && (
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Address Book</h2>
                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>+ Add New</button>
                  </div>

                  {addresses.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                      <MapPin size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
                      <h3 style={{ fontSize: '18px', color: '#475569' }}>No saved addresses</h3>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      {addresses.map(addr => (
                        <div key={addr.id} style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', position: 'relative' }}>
                          {addr.isDefault && (
                            <span style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '11px', backgroundColor: '#eff6ff', color: '#2563eb', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                              DEFAULT
                            </span>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#0f172a' }}>{addr.recipientName}</h3>
                            <span style={{ fontSize: '11px', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                              {addr.addressType}
                            </span>
                          </div>
                          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0 0 8px 0' }}>
                            {addr.streetAddress}<br />
                            {addr.city}, {addr.state} {addr.zipCode}<br />
                            {addr.country}
                          </p>
                          <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px 0', fontWeight: '500' }}>Phone: {addr.phone}</p>
                          
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: 0 }}>Edit</button>
                            <button style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: 0 }}>Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SUPPORT TAB */}
              {activeTab === 'support' && (
                <div className="animate-fade-in">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Helpdesk Support</h2>
                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Create Ticket</button>
                  </div>
                  
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <MessageSquare size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '18px', color: '#475569' }}>You have no active support tickets</h3>
                    <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '8px' }}>Need help with an order? Create a ticket and our team will assist you within 24 hours.</p>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Order Details & Tracking Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="animate-fade-in" style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '650px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '30px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            position: 'relative'
          }}>
            <button 
              onClick={() => setSelectedOrder(null)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <X size={24} />
            </button>

            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Order {selectedOrder.orderNumber}</h2>
            <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '30px' }}>Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>

            <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '24px', marginBottom: '30px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Truck size={18} style={{ color: '#2563eb' }}/> Tracking Timeline
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                {/* Vertical connecting line */}
                <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '10px', width: '2px', backgroundColor: '#e2e8f0' }} />
                
                {selectedOrder.trackingTimeline ? JSON.parse(selectedOrder.trackingTimeline).map((track, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', position: 'relative', zIndex: 1 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {idx === 0 ? <CheckCircle size={16} /> : <Clock size={16} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{track.status}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{track.description}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', fontWeight: '600' }}>{new Date(track.date).toLocaleString()}</div>
                    </div>
                  </div>
                )) : (
                  <div style={{ marginLeft: '48px', fontSize: '14px', color: '#64748b' }}>Tracking information unavailable</div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', marginBottom: '8px' }}>SHIPPING ADDRESS</h4>
                <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>{selectedOrder.recipientName}</div>
                <div style={{ fontSize: '14px', color: '#475569', marginTop: '4px', lineHeight: '1.5' }}>
                  {selectedOrder.streetAddress}<br/>
                  {selectedOrder.city}, {selectedOrder.state} {selectedOrder.zipCode}
                </div>
              </div>
              
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
                <h4 style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', marginBottom: '8px' }}>PAYMENT INFO</h4>
                <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '600' }}>Method: {selectedOrder.paymentMethod}</div>
                <div style={{ fontSize: '14px', color: '#475569', marginTop: '4px' }}>
                  Status: <span style={{ color: '#16a34a', fontWeight: '600' }}>{selectedOrder.paymentStatus}</span>
                </div>
                <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: '800', marginTop: '8px' }}>
                  Total: ₹{selectedOrder.grandTotal.toFixed(2)}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerDashboard;

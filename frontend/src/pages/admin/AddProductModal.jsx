import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import API from '../../api';
import { useToast } from '../../context/ToastContext';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: ''
  });

  useEffect(() => {
    if (isOpen) {
      API.get('/categories')
        .then(res => setCategories(res.data))
        .catch(err => console.error("Error fetching categories", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity, 10),
        categoryId: parseInt(formData.categoryId, 10),
        imageUrl: formData.imageUrl
      };

      await API.post('/admin/products', payload);
      addToast('Product added successfully!', 'success');
      onProductAdded();
      onClose();
      setFormData({ name: '', description: '', price: '', stockQuantity: '', categoryId: '', imageUrl: '' });
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add product', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
        
        <div style={{ padding: '24px 30px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10, borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#0f172a' }}>Add New Product</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Product Name</label>
              <input 
                type="text" name="name" value={formData.name} onChange={handleChange} required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', color: '#0f172a', boxSizing: 'border-box' }}
                placeholder="e.g. iPhone 15 Pro"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Description</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} required rows={3}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', color: '#0f172a', resize: 'vertical', boxSizing: 'border-box' }}
                placeholder="Detailed product description..."
              />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Price (₹)</label>
                <input 
                  type="number" name="price" value={formData.price} onChange={handleChange} required min="0" step="0.01"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', color: '#0f172a', boxSizing: 'border-box' }}
                  placeholder="0.00"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Stock Quantity</label>
                <input 
                  type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} required min="0"
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', color: '#0f172a', boxSizing: 'border-box' }}
                  placeholder="100"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Category</label>
              <select 
                name="categoryId" value={formData.categoryId} onChange={handleChange} required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', color: '#0f172a', backgroundColor: '#fff', boxSizing: 'border-box' }}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>Image URL</label>
              <input 
                type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', color: '#0f172a', boxSizing: 'border-box' }}
                placeholder="https://example.com/image.jpg"
              />
              {formData.imageUrl && (
                <div style={{ marginTop: '12px', borderRadius: '12px', overflow: 'hidden', height: '120px', backgroundColor: '#f1f5f9' }}>
                  <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display='none'} />
                </div>
              )}
            </div>

          </div>

          <div style={{ marginTop: '30px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '12px 24px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '15px', fontWeight: '600', border: 'none', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ padding: '12px 24px', borderRadius: '12px', backgroundColor: '#3b82f6', color: '#fff', fontSize: '15px', fontWeight: '600', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default AddProductModal;

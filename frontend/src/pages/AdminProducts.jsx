import { useEffect, useState } from 'react';
import api from '../api/axios.js';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  brand: '',
  image: '',
  stock: ''
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadProducts = async () => {
    const { data } = await api.get('/products', { params: { limit: 100 } });
    setProducts(data.products);
  };

  useEffect(() => {
    loadProducts().catch((err) => setError(err.response?.data?.message || 'Could not load products'));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        setMessage('Product updated');
      } else {
        await api.post('/products', payload);
        setMessage('Product created');
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save product');
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      brand: product.brand,
      image: product.image,
      stock: product.stock
    });
  };

  const archiveProduct = async (productId) => {
    await api.delete(`/products/${productId}`);
    await loadProducts();
  };

  return (
    <section>
      <h1>Manage products</h1>
      <form className="card stack" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit product' : 'Create product'}</h2>
        <label>Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
        <label>Description<textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></label>
        <label>Price<input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></label>
        <label>Category<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></label>
        <label>Brand<input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} /></label>
        <label>Image URL<input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></label>
        <label>Stock<input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required /></label>
        <div className="actions">
          <button className="button">{editingId ? 'Update product' : 'Create product'}</button>
          {editingId && <button className="button ghost" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
        </div>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>

      <div className="stack top-gap">
        {products.map((product) => (
          <article className="card split-row" key={product._id}>
            <div>
              <h3>{product.name}</h3>
              <p className="muted">{product.category} · ${product.price.toFixed(2)} · Stock {product.stock}</p>
            </div>
            <div className="actions">
              <button className="button ghost" onClick={() => startEdit(product)}>Edit</button>
              <button className="button danger" onClick={() => archiveProduct(product._id)}>Archive</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminProducts;

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
  const [autoImageLoading, setAutoImageLoading] = useState(false);

  const loadProducts = async () => {
    const { data } = await api.get('/products', { params: { limit: 100 } });
    setProducts(data.products);
  };

  useEffect(() => {
    loadProducts().catch((err) =>
      setError(err.response?.data?.message || 'Could not load products')
    );
  }, []);

  const updateForm = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value
    }));
  };

  const fetchAutoImage = async ({ silent = false } = {}) => {
    setError('');

    if (!form.name || !form.category) {
      const validationMessage = 'Enter product name and category before using Auto image.';

      if (!silent) {
        setError(validationMessage);
      }

      throw new Error(validationMessage);
    }

    setAutoImageLoading(true);

    try {
      const { data } = await api.post('/products/auto-image', {
        name: form.name,
        category: form.category
      });

      setForm((currentForm) => ({
        ...currentForm,
        image: data.image
      }));

      if (!silent) {
        setMessage('Product image downloaded and linked.');
      }

      return data.image;
    } catch (err) {
      const message = err.response?.data?.message || 'Could not auto-download product image';

      if (!silent) {
        setError(message);
      }

      throw err;
    } finally {
      setAutoImageLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setMessage('');

    let image = form.image;

    if (!image && form.name && form.category) {
      try {
        image = await fetchAutoImage({ silent: true });
      } catch {
        // Continue with the existing image value. Backend model has a default placeholder.
      }
    }

    const payload = {
      ...form,
      image,
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
    setError('');
    setMessage('');
  };

  const archiveProduct = async (productId) => {
    await api.delete(`/products/${productId}`);
    await loadProducts();
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError('');
    setMessage('');
  };

  return (
    <section className="stack">
      <h1>Manage products</h1>

      <form className="card stack" onSubmit={handleSubmit}>
        <h2>{editingId ? 'Edit product' : 'Create product'}</h2>

        <label>
          Name
          <input
            value={form.name}
            onChange={(event) => updateForm('name', event.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={form.description}
            onChange={(event) => updateForm('description', event.target.value)}
            required
          />
        </label>

        <label>
          Price
          <input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(event) => updateForm('price', event.target.value)}
            required
          />
        </label>

        <label>
          Category
          <input
            value={form.category}
            onChange={(event) => updateForm('category', event.target.value)}
            required
          />
        </label>

        <label>
          Brand
          <input value={form.brand} onChange={(event) => updateForm('brand', event.target.value)} />
        </label>

        <label>
          Image URL / Local image path
          <input
            value={form.image}
            onChange={(event) => updateForm('image', event.target.value)}
            placeholder="/images/products/category/product-name.jpg"
          />
        </label>

        <div className="actions">
          <button
            className="button ghost"
            type="button"
            onClick={() => fetchAutoImage()}
            disabled={autoImageLoading || !form.name || !form.category}
            data-testid="admin-auto-image-button"
          >
            {autoImageLoading ? 'Finding image...' : 'Auto image'}
          </button>

          {form.image && (
            <span className="muted" data-testid="admin-image-path">
              {form.image}
            </span>
          )}
        </div>

        {form.image && (
          <div className="admin-image-preview" data-testid="admin-image-preview">
            <img src={form.image} alt={form.name || 'Product preview'} />
          </div>
        )}

        <label>
          Stock
          <input
            type="number"
            value={form.stock}
            onChange={(event) => updateForm('stock', event.target.value)}
            required
          />
        </label>

        <div className="actions">
          <button className="button" type="submit">
            {editingId ? 'Update product' : 'Create product'}
          </button>

          {editingId && (
            <button className="button ghost" type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>

      <div className="stack top-gap">
        {products.map((product) => (
          <article className="card split-row" key={product._id}>
            <div className="admin-product-summary">
              <img className="admin-product-thumbnail" src={product.image} alt={product.name} />

              <div>
                <h3>{product.name}</h3>
                <p className="muted">
                  {product.category} · ${product.price.toFixed(2)} · Stock {product.stock}
                </p>
              </div>
            </div>

            <div className="actions">
              <button className="button ghost" type="button" onClick={() => startEdit(product)}>
                Edit
              </button>

              <button
                className="button danger"
                type="button"
                onClick={() => archiveProduct(product._id)}
              >
                Archive
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default AdminProducts;

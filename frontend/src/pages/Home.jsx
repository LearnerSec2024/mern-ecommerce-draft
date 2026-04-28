import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className="hero card">
      <div>
        <p className="eyebrow">First Draft MERN Ecommerce</p>
        <h1>Shop smarter with a clean, extensible ecommerce starter.</h1>
        <p>
          This draft includes authentication, product browsing, cart, checkout,
          orders and a basic admin area. Payments are mocked for the first MVP.
        </p>
        <div className="actions">
          <Link className="button" to="/products">Browse products</Link>
          <Link className="button ghost" to="/register">Create account</Link>
        </div>
      </div>
    </section>
  );
};

export default Home;

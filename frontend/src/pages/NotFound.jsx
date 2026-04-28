import { Link } from 'react-router-dom';

const NotFound = () => (
  <section className="card empty-state">
    <h1>Page not found</h1>
    <Link className="button" to="/">Go home</Link>
  </section>
);

export default NotFound;

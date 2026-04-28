import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    marketingOptIn: false
  });

  const [profilePictureName, setProfilePictureName] = useState('');
  const [error, setError] = useState('');

  const emailIsValid = useMemo(() => {
    if (!form.email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  }, [form.email]);

  const passwordRules = useMemo(() => {
    return {
      length: form.password.length >= 8,
      uppercase: /[A-Z]/.test(form.password),
      number: /\d/.test(form.password),
      special: /[^A-Za-z0-9]/.test(form.password)
    };
  }, [form.password]);

  const passwordIsValid = Object.values(passwordRules).every(Boolean);
  const passwordsMatch = Boolean(form.confirmPassword) && form.password === form.confirmPassword;

  const formIsValid =
    form.name.trim().length > 1 &&
    emailIsValid &&
    passwordIsValid &&
    passwordsMatch &&
    form.acceptTerms;

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files?.[0];
    setProfilePictureName(file ? file.name : '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!formIsValid) {
      setError('Please complete all required fields before registering.');
      return;
    }

    try {
      await register(form.name, form.email, form.password);
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <section className="auth-card card stack" data-testid="register-page">
      <div>
        <p className="eyebrow">Join MERN Shop</p>
        <h1>Create account</h1>
        <p className="muted">
          Create your customer account to save your cart, place orders and track purchases.
        </p>
      </div>

      <form className="stack" onSubmit={handleSubmit}>
        <label htmlFor="register-name">
          Name
          <input
            id="register-name"
            name="name"
            value={form.name}
            onChange={updateField}
            required
            data-testid="register-name-input"
          />
        </label>

        <label htmlFor="register-email">
          Email
          <input
            id="register-email"
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            required
            aria-invalid={form.email ? !emailIsValid : false}
            data-testid="register-email-input"
          />
        </label>

        {form.email && !emailIsValid && (
          <p className="error small" data-testid="register-email-error">
            Enter a valid email address.
          </p>
        )}

        <label htmlFor="register-password">
          Password
          <input
            id="register-password"
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            required
            minLength="8"
            aria-describedby="password-rules"
            data-testid="register-password-input"
          />
        </label>

        <div id="password-rules" className="validation-list" data-testid="password-rules">
          <p className={passwordRules.length ? 'success small' : 'muted small'}>
            Minimum 8 characters
          </p>
          <p className={passwordRules.uppercase ? 'success small' : 'muted small'}>
            At least one uppercase letter
          </p>
          <p className={passwordRules.number ? 'success small' : 'muted small'}>
            At least one number
          </p>
          <p className={passwordRules.special ? 'success small' : 'muted small'}>
            At least one special character
          </p>
        </div>

        <label htmlFor="register-confirm-password">
          Confirm password
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={updateField}
            required
            data-testid="register-confirm-password-input"
          />
        </label>

        {form.confirmPassword && !passwordsMatch && (
          <p className="error small" data-testid="register-password-match-error">
            Passwords do not match.
          </p>
        )}

        <label htmlFor="register-profile-picture">
          Profile picture upload optional
          <input
            id="register-profile-picture"
            name="profilePicture"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
            data-testid="register-profile-picture-input"
          />
        </label>

        {profilePictureName && (
          <p className="success small" data-testid="register-profile-picture-name">
            Selected file: {profilePictureName}
          </p>
        )}

        <label className="checkbox-row" htmlFor="register-marketing">
          <input
            id="register-marketing"
            name="marketingOptIn"
            type="checkbox"
            checked={form.marketingOptIn}
            onChange={updateField}
            data-testid="register-marketing-checkbox"
          />
          Send me product offers and order updates
        </label>

        <label className="checkbox-row" htmlFor="register-terms">
          <input
            id="register-terms"
            name="acceptTerms"
            type="checkbox"
            checked={form.acceptTerms}
            onChange={updateField}
            required
            data-testid="register-terms-checkbox"
          />
          I accept the terms and conditions
        </label>

        <button
          className="button full"
          type="submit"
          disabled={!formIsValid || loading}
          data-testid="register-submit-button"
        >
          {loading ? 'Creating account...' : 'Register'}
        </button>

        {error && (
          <p className="error" data-testid="register-error-message">
            {error}
          </p>
        )}
      </form>

      <p className="muted">
        Already registered? <Link to="/login">Login</Link>
      </p>
    </section>
  );
};

export default Register;
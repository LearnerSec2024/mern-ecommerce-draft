# MERN Ecommerce App - First Draft

This is a first-draft fullstack ecommerce app using MongoDB, Express, React and Node.js.

## Included Features

- User registration and login with JWT
- Password hashing with bcrypt
- Product listing, search, category filter and sorting
- Product details page
- Authenticated cart API
- Add, update, remove and clear cart items
- Checkout with mock payment
- Order creation and user order history
- Admin product management
- Admin order status management
- Basic security middleware: Helmet, rate limiting, NoSQL sanitisation and HPP protection
- Seed data including `Fruits & Vegetables` category using a safer category slug to avoid special-character issues

## Folder Structure

```txt
mern-ecommerce-draft/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── .env.example
│   └── package.json
└── implementation_plan.md
```

## Prerequisites

- Node.js
- MongoDB local instance or MongoDB Atlas connection string
- npm

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

Health check:

```txt
http://localhost:5000/api/health
```

Seeded admin login:

```txt
admin@example.com
Admin123!
```

## Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## API Summary

### Auth

| Method | Endpoint             | Purpose              |
| ------ | -------------------- | -------------------- |
| POST   | `/api/auth/register` | Register user        |
| POST   | `/api/auth/login`    | Login user           |
| GET    | `/api/auth/profile`  | Current user profile |

### Products

| Method | Endpoint            | Purpose               |
| ------ | ------------------- | --------------------- |
| GET    | `/api/products`     | List products         |
| GET    | `/api/products/:id` | Product details       |
| POST   | `/api/products`     | Admin create product  |
| PUT    | `/api/products/:id` | Admin update product  |
| DELETE | `/api/products/:id` | Admin archive product |

### Cart

| Method | Endpoint                      | Purpose              |
| ------ | ----------------------------- | -------------------- |
| GET    | `/api/cart`                   | Get user cart        |
| POST   | `/api/cart/add`               | Add item to cart     |
| PUT    | `/api/cart/update/:productId` | Update item quantity |
| DELETE | `/api/cart/remove/:productId` | Remove item          |
| DELETE | `/api/cart/clear`             | Clear cart           |

### Orders

| Method | Endpoint                 | Purpose                           |
| ------ | ------------------------ | --------------------------------- |
| POST   | `/api/orders`            | Create order                      |
| GET    | `/api/orders/my-orders`  | User order history                |
| GET    | `/api/orders/:id`        | Get one order                     |
| GET    | `/api/orders`            | Admin list all orders             |
| PUT    | `/api/orders/:id/status` | Admin update order/payment status |

## First Draft Limitations

- Payment is mocked, not integrated with Stripe or another payment provider.
- No image upload yet; products use image URLs.
- No product reviews yet.
- No forgot-password or email verification yet.
- Cart is server-side only and requires login.
- Admin dashboard is functional but basic.

## Recommended Next Iteration

1. Add request validation using Zod or Joi.
2. Add stronger frontend form validation.
3. Add product image upload using Cloudinary or S3.
4. Add Stripe checkout.
5. Add tests for auth, cart and order APIs.
6. Add refresh-token or httpOnly cookie auth if required.
7. Add pagination UI.
8. Add better admin dashboard metrics.

## Playwright E2E Test

This project now includes a Playwright end-to-end test for the main customer journey:

1. Access the home page at `http://localhost:5173/`
2. Create a new customer account with a unique email address
3. Log out and log back in using the newly created account
4. Open the product catalogue
5. Add a product to the cart
6. Complete checkout with mock payment
7. Verify the submitted order appears in `My orders`

### Test files added

```txt
frontend/playwright.config.js
frontend/tests/e2e/create-account-login-order.spec.js
```

### How to run the test

Keep MongoDB running, then start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd frontend
npm run dev
```

In a third terminal, install Playwright browsers once:

```bash
cd frontend
npx playwright install
```

Then run the E2E test:

```bash
npm run test:e2e
```

For a visible browser run:

```bash
npm run test:e2e:headed
```

For Playwright's interactive UI:

```bash
npm run test:e2e:ui
```

If your frontend is running on a different URL, override it like this:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:5173 npm run test:e2e
```

On Windows PowerShell:

```powershell
$env:PLAYWRIGHT_BASE_URL="http://localhost:5173"; npm run test:e2e
```

## Self-starting Playwright E2E test

The frontend Playwright config now starts the required local services for you:

- checks MongoDB on `127.0.0.1:27017`
- on Windows, attempts to start the `MongoDB` Windows service if it is stopped
- seeds an isolated E2E database named `mern_ecommerce_e2e`
- starts the backend API on `http://127.0.0.1:5000`
- starts the Vite frontend on `http://127.0.0.1:5173`
- runs the browser flow: home page → create account → logout → login → add product to cart → checkout → submit order → verify My Orders

Run from the frontend folder:

```powershell
cd frontend
npm install
npx playwright install
npm run test:e2e
```

For visible browser mode:

```powershell
npm run test:e2e:headed
```

For debugging:

```powershell
npm run test:e2e:debug
```

Important: close any manually running backend or frontend terminals before running the E2E test, because Playwright now starts its own controlled servers on ports `5000` and `5173`.

By default, the E2E test uses this database connection:

```txt
mongodb://127.0.0.1:27017/mern_ecommerce_e2e
```

To override it temporarily in PowerShell:

```powershell
$env:E2E_MONGO_URI="mongodb://127.0.0.1:27017/my_custom_e2e_db"
npm run test:e2e
```

Test

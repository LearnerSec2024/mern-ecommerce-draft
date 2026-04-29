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

---

Add this section to your `README.md`.

````md
## Starting the App Locally with One Script

// Script to run to start the app locally, This command opens two powershell windows, do not close them, until you want to stop the application:
powershell -ExecutionPolicy Bypass -File .\start-local.ps1

This project includes a PowerShell startup script that starts the full local development environment for the MERN ecommerce app.

The script can:

- Check whether MongoDB is running
- Start MongoDB if it is installed as a Windows service
- Check backend and frontend `.env` files
- Install dependencies when requested
- Seed the database when requested
- Start the backend server
- Start the frontend server
- Open the app in the browser

---

### Prerequisites

Before using the script, make sure you have installed:

- Node.js
- npm
- MongoDB Community Server
- Git
- VS Code

MongoDB should be installed as a Windows service called:

```txt
MongoDB
```
````

You can check this in PowerShell:

```powershell
Get-Service MongoDB
```

---

### Project Location

Open PowerShell and go to the project root:

```powershell
cd D:\Projects2\mern-ecommerce-draft-playwright-self-start\mern-ecommerce-draft
```

The project root should contain:

```txt
backend/
frontend/
README.md
start-local.ps1
```

---

### First-Time Setup

If this is the first time running the project, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-local.ps1 -Install
```

This will install dependencies for both:

```txt
backend/
frontend/
```

It will also start the backend and frontend servers.

---

### Normal Daily Startup

After dependencies are already installed, start the app with:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-local.ps1
```

This will:

1. Check MongoDB
2. Start MongoDB if needed
3. Start the backend server
4. Start the frontend server
5. Open the app in the browser

---

### Start the App and Seed the Database

To reload the sample database data before starting the app, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-local.ps1 -Seed
```

Use this when you want to reset products, admin user, and sample data.

Be careful: the seed script may clear and recreate existing local database data.

---

### Install Dependencies and Seed Database

For a full fresh setup, run:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-local.ps1 -Install -Seed
```

This is useful when:

- You cloned the project for the first time
- You deleted `node_modules`
- You want a clean database reset

---

### App URLs

Once the script has started successfully, open:

```txt
http://localhost:5173
```

Backend health check:

```txt
http://localhost:5000/api/health
```

---

### Admin Login

Seeded admin account:

```txt
Email: admin@example.com
Password: Admin123!
```

---

### Stopping the App

The script opens separate PowerShell windows for the backend and frontend.

To stop the app:

1. Go to the backend PowerShell window
2. Press:

```txt
Ctrl + C
```

3. Go to the frontend PowerShell window
4. Press:

```txt
Ctrl + C
```

---

### Manual Startup Alternative

If you do not want to use the script, you can still start the app manually.

Start MongoDB:

```powershell
Get-Service MongoDB
Start-Service MongoDB
```

Start backend:

```powershell
cd D:\Projects2\mern-ecommerce-draft-playwright-self-start\mern-ecommerce-draft\backend
npm run dev
```

Start frontend in another terminal:

```powershell
cd D:\Projects2\mern-ecommerce-draft-playwright-self-start\mern-ecommerce-draft\frontend
npm run dev
```

Then open:

```txt
http://localhost:5173
```

---

### Troubleshooting

#### MongoDB service not found

If this command does not find MongoDB:

```powershell
Get-Service MongoDB
```

MongoDB may not be installed as a Windows service. Start MongoDB manually or reinstall MongoDB Community Server with the Windows service option enabled.

#### Port already in use

If backend or frontend does not start, check whether ports are already in use:

```powershell
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

If a process is already listening on the port, stop that process or close the old terminal window.

#### Dependencies missing

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-local.ps1 -Install
```

#### Database needs resetting

Run:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-local.ps1 -Seed
```

````

After adding it, commit and push:

```powershell
git add README.md start-local.ps1
git commit -m "Add local startup script instructions"
git push
````

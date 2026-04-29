# MERN Ecommerce App with Playwright Automation

This is a fullstack ecommerce learning project built with the MERN stack:

- MongoDB
- Express.js
- React
- Node.js

The project also includes Playwright end-to-end tests and GitHub Actions so it can be used for learning and teaching browser automation with JavaScript.

---

## Included Features

### Ecommerce Features

- User registration and login with JWT
- Password hashing with bcrypt
- Product catalogue
- Product search, category filter and sorting
- Product details page
- Authenticated cart
- Add, update, remove and clear cart items
- Checkout with mock payment
- Order creation and user order history
- Admin product management
- Admin order status management
- Seed data including `Fruits & Vegetables` category
- Safer category slugs to avoid special-character issues

### Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected user routes
- Admin-only backend routes
- Helmet security headers
- Rate limiting
- NoSQL sanitisation
- HTTP parameter pollution protection
- Environment-based configuration

### Playwright Teaching Features

This project is being extended to support realistic Playwright automation teaching inside a real ecommerce app.

Current implemented areas include:

- Checkboxes
- Dropdowns
- Links
- Popups/modals
- New tabs/windows
- Iframes
- Dynamic delayed elements
- Keyboard search
- Price range slider
- Hover-revealed wishlist actions
- Drag product to cart drop zone
- Lazy/infinite scroll sentinel

The implementation notes are tracked in:

```txt
playwrightRequirements.md
```

---

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
│   ├── scripts/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── tests/
│   │   └── e2e/
│   ├── .env.example
│   ├── package.json
│   └── playwright.config.js
├── .github/
│   └── workflows/
├── implementation_plan.md
├── playwrightRequirements.md
├── postman_collection.json
├── README.md
├── start-local.ps1
└── package.json
```

---

## Prerequisites

Before running the project, install:

- Node.js
- npm
- MongoDB Community Server
- Git
- VS Code

MongoDB should be installed as a Windows service called:

```txt
MongoDB
```

You can check MongoDB with:

```powershell
Get-Service MongoDB
```

---

## Quick Start

From the project root, run:

```powershell
npm start
```

This starts the full local development environment.

The startup script will:

1. Check whether MongoDB is running
2. Start MongoDB if it is installed as a Windows service
3. Check backend and frontend `.env` files
4. Check whether dependencies are installed
5. Check whether product seed data exists
6. Seed the database only if products are missing
7. Start the backend server
8. Start the frontend server
9. Open the app in the browser

The app opens at:

```txt
http://localhost:5173
```

Backend health check:

```txt
http://localhost:5000/api/health
```

---

## One-Command Local Startup

The root-level `package.json` calls the PowerShell startup script.

### Normal Daily Startup

```powershell
npm start
```

Use this for normal local development.

### First-Time Setup

If this is your first time running the project, or if `node_modules` is missing, run:

```powershell
npm run start:install
```

This installs dependencies for both:

```txt
backend/
frontend/
```

Then it starts the app.

### Force Seed the Database

To reset and reload sample data:

```powershell
npm run start:seed
```

Be careful: the seed script may clear and recreate existing local data.

### Full Fresh Setup

To install dependencies and force seed the database:

```powershell
npm run start:install -- -Seed
```

Alternatively, run the PowerShell script directly:

```powershell
powershell -ExecutionPolicy Bypass -File .\start-local.ps1 -Install -Seed
```

---

## What the Startup Script Does

The startup script is:

```txt
start-local.ps1
```

It is useful because the app has three moving parts:

```txt
MongoDB database
Express backend
React frontend
```

Instead of manually starting each one, the script handles the startup flow.

It opens two PowerShell windows:

```txt
Backend server  -> http://localhost:5000
Frontend server -> http://localhost:5173
```

Keep both windows open while using the app.

To stop the app, press:

```txt
Ctrl + C
```

in both the backend and frontend PowerShell windows.

---

## Seeded Admin Login

After seeding the database, you can log in with:

```txt
Email: admin@example.com
Password: Admin123!
```

---

## Manual Startup Alternative

If you do not want to use the startup script, you can still run the app manually.

### Start MongoDB

```powershell
Get-Service MongoDB
Start-Service MongoDB
```

### Start Backend

```powershell
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

### Start Frontend

Open a second terminal:

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

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

---

## Playwright E2E Tests

This project includes Playwright end-to-end tests for the main ecommerce flow and automation teaching features.

### Test Files

```txt
frontend/tests/e2e/create-account-login-order.spec.js
frontend/tests/e2e/advanced-ui-interactions.spec.js
```

### Main Customer Journey Test

The customer journey test covers:

1. Access home page
2. Create a new customer account
3. Log in with the new account
4. Open product catalogue
5. Add product to cart
6. Complete checkout with mock payment
7. Verify submitted order appears in My Orders

### Advanced UI Interactions Test

The advanced UI interaction test covers:

1. Dynamic delayed promo banner
2. Product search using Enter key
3. Price range slider
4. Hover-revealed wishlist button
5. Hover tooltip
6. Drag product card to cart drop zone
7. Infinite/lazy scroll sentinel

---

## Running Playwright Tests Locally

Go to the frontend folder:

```powershell
cd frontend
```

Install Playwright browsers once:

```powershell
npx playwright install
```

Run all E2E tests:

```powershell
npm run test:e2e
```

Or run directly:

```powershell
npx playwright test
```

Run one test file:

```powershell
npx playwright test tests/e2e/advanced-ui-interactions.spec.js
```

Run in headed mode:

```powershell
npx playwright test --headed
```

Run in debug mode:

```powershell
npx playwright test --headed --debug
```

Open the Playwright report:

```powershell
npx playwright show-report
```

---

## Playwright Local Server Behaviour

The Playwright setup is configured to make local development easier.

When running locally:

- If the app is already running, Playwright reuses the existing backend and frontend.
- If the app is not running, Playwright can start the backend and frontend automatically.

When running in GitHub Actions:

- Playwright starts a clean controlled test environment.
- MongoDB runs as a temporary GitHub Actions service.
- Test data is created in an isolated E2E database.
- The test database is destroyed when the GitHub Actions runner finishes.

This keeps GitHub CI clean while allowing faster local development.

---

## Recommended Local Workflow

For day-to-day work:

```txt
1. Run npm start from the project root
2. Make changes in VS Code
3. Visually inspect the app in the browser
4. Run Playwright tests from the frontend folder
5. Commit changes in GitHub Desktop
6. Push to GitHub
7. Confirm GitHub Actions passes
```

Example:

```powershell
npm start
```

Then in another terminal:

```powershell
cd frontend
npx playwright test
```

---

## GitHub Actions

This project includes a GitHub Actions workflow for Playwright tests.

The workflow runs automatically on:

```txt
push to main
pull request to main
```

GitHub Actions will:

1. Check out the repository
2. Install backend dependencies
3. Install frontend dependencies
4. Start MongoDB as a service
5. Install Playwright browsers
6. Run Playwright tests
7. Upload the Playwright report as an artifact

The workflow file is located at:

```txt
.github/workflows/playwright.yml
```

---

## Environment Files

The real `.env` files are not committed to GitHub.

The repository includes example files only:

```txt
backend/.env.example
frontend/.env.example
```

This is intentional.

Do not commit:

```txt
backend/.env
frontend/.env
```

---

## Database Notes

This app uses MongoDB.

MongoDB stores data in collections, similar to tables in SQL databases.

Important collections include:

```txt
users
products
carts
orders
```

The frontend does not create products by itself. Products are loaded from MongoDB through the backend API.

The seed script inserts sample products into MongoDB so the catalogue has products to display.

Seed script:

```txt
backend/seed/productSeeder.js
```

Run seed manually:

```powershell
cd backend
npm run seed
```

Or use the startup script:

```powershell
npm start
```

The startup script will seed automatically if no products are found.

---

## Troubleshooting

### MongoDB service not found

If this command does not find MongoDB:

```powershell
Get-Service MongoDB
```

MongoDB may not be installed as a Windows service.

Start MongoDB manually or reinstall MongoDB Community Server with the Windows service option enabled.

### Products are not showing

Products are loaded from MongoDB.

If the product catalogue is empty, run:

```powershell
npm run start:seed
```

Or:

```powershell
cd backend
npm run seed
```

### Port already in use

Check whether backend or frontend ports are already in use:

```powershell
netstat -ano | findstr :5000
netstat -ano | findstr :5173
```

Only active servers show as:

```txt
LISTENING
```

If needed, stop the old terminal or kill the process by PID:

```powershell
taskkill /PID <PID_NUMBER> /F
```

### Playwright test is using the wrong URL

Use `localhost` consistently for local development:

```txt
http://localhost:5173
http://localhost:5000
```

Avoid mixing these unless you know why:

```txt
localhost
127.0.0.1
```

Browsers treat them as different origins.

### Dependencies missing

Run:

```powershell
npm run start:install
```

### Database needs resetting

Run:

```powershell
npm run start:seed
```

---

## Current Limitations

- Payment is mocked, not integrated with Stripe or another payment provider.
- Product images currently use URLs or placeholders.
- Product reviews are not yet implemented.
- Forgot-password and email verification are not yet implemented.
- Admin dashboard is functional but basic.
- Some automation-teaching features are still being added section by section.

---

## Recommended Next Iterations

1. Continue implementing `playwrightRequirements.md` section by section.
2. Add stronger frontend form validation.
3. Add product image upload using Cloudinary or S3.
4. Add Stripe checkout or a richer mock payment flow.
5. Add more API-level tests.
6. Add pagination UI polish.
7. Add better admin dashboard metrics.
8. Add accessibility checks with Playwright.
9. Add visual regression examples.
10. Add beginner-friendly Playwright learning notes.

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
- Product catalogue with categories, sorting and search
- Product details page
- Product images stored locally in the frontend public folder
- Authenticated cart
- Add, update, remove and clear cart items
- Checkout with mock payment
- Order creation and user order history
- Admin product management
- Admin order status management
- Seeded sample product catalogue
- Seed behaviour that keeps existing users while refreshing shop data

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
- Infinite loading for all products
- Pagination for category views

Implementation notes are tracked in:

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
│   ├── scripts/
│   │   └── download-product-images.mjs
│   ├── seed/
│   │   └── productSeeder.js
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── images/
│   │       └── products/
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
│       └── playwright.yml
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

## Environment Files

The real `.env` files are not committed to GitHub.

The repository includes example files only:

```txt
backend/.env.example
frontend/.env.example
```

Do not commit:

```txt
backend/.env
frontend/.env
```

The startup script can create `.env` files from `.env.example` if they are missing.

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

## Root Commands

Run these commands from the project root.

| Command                   | Purpose                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| `npm start`               | Start MongoDB check, backend, frontend and browser                 |
| `npm run start:install`   | Install backend/frontend dependencies, then start the app          |
| `npm run start:seed`      | Force seed shop data, then start the app                           |
| `npm run images:download` | Download/relink real product images using the Pexels helper script |
| `npm run test:e2e`        | Run Playwright tests from the frontend project                     |

---

## One-Command Local Startup

The root-level `package.json` calls the PowerShell startup script:

```txt
start-local.ps1
```

The app has three moving parts:

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

## First-Time Setup

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

---

## Normal Daily Startup

For normal local development, use:

```powershell
npm start
```

This starts the app and keeps existing local data.

Use `npm run start:seed` only when you intentionally want to reset the sample shop data.

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

---

## Seed Data Behaviour

The seed script is useful when you want to reset or rebuild the sample shop catalogue.

Run from the project root:

```powershell
npm run start:seed
```

Or run directly from the backend folder:

```powershell
cd backend
npm run seed
```

### What Gets Reset During Seeding

When the seed script runs, it resets the shop-related data:

| Collection          | What happens                                   |
| ------------------- | ---------------------------------------------- |
| `products`          | Deleted and recreated from the seed file       |
| `carts`             | Deleted                                        |
| `orders`            | Deleted                                        |
| `users`             | Kept                                           |
| `admin@example.com` | Created if missing, or corrected to admin role |

Manually created customer users are preserved when reseeding. Their carts and orders are cleared.

### Why Users Are Kept

Users are kept so browser-saved login credentials continue to work across development sessions.

Previously, reseeding deleted all users. This meant a saved email/password in the browser could stop working after the database was reseeded.

The current seed behaviour avoids that by preserving users and only refreshing shop data.

### When to Use `npm run start:seed`

Use this command when:

- Products are missing
- Products are broken or need to be reset
- You changed `backend/seed/productSeeder.js`
- You want a clean product catalogue
- You want to clear carts and orders
- You want a clean demo state

### Simple Rule

```txt
npm start                = daily startup, keep existing data
npm run start:seed       = reset products, carts and orders, keep users
npm run images:download  = relink/download real product images
```

---

## Product Images

This project supports real product images for seeded products.

Images are downloaded from Pexels using a helper script and saved locally inside the frontend public folder. The product records in MongoDB are then updated to point to those local image paths.

This keeps the app stable because images are loaded from the local project instead of hotlinking external image URLs.

### Image Storage Location

Downloaded product images are saved here:

```txt
frontend/public/images/products/
```

Example image paths:

```txt
frontend/public/images/products/electronics/wireless-headphones.jpg
frontend/public/images/products/fruits/organic-banana-bunch.jpg
frontend/public/images/products/home-and-kitchen/ceramic-coffee-mug.jpg
```

In MongoDB, each product stores a relative image path like:

```txt
/images/products/electronics/wireless-headphones.jpg
```

The frontend can render this directly because files inside `frontend/public` are served publicly by Vite.

### Pexels API Key Setup

The image download script requires a Pexels API key.

Add the key to:

```txt
backend/.env
```

Example:

```env
PEXELS_API_KEY=your_pexels_api_key_here
```

Do not commit the real API key to GitHub.

### Download or Relink Product Images

From the project root, run:

```powershell
npm run images:download
```

This command runs:

```powershell
cd backend && node scripts/download-product-images.mjs
```

The image script does the following:

1. Connects to the local MongoDB database
2. Reads all products from the `products` collection
3. Searches Pexels for a suitable image for each product
4. Downloads the image into `frontend/public/images/products/`
5. Updates each product record in MongoDB with the local image path
6. Skips images that have already been downloaded

### Important: Seeding and Images

If you run:

```powershell
npm run start:seed
```

the database products may be reset.

After reseeding, run:

```powershell
npm run images:download
```

Recommended reset flow:

```powershell
npm run start:seed
npm run images:download
npm start
```

### Verifying Images

Start the app:

```powershell
npm start
```

Then open:

```txt
http://localhost:5173/products
```

Check:

- Products page
- Home page product section
- Category views
- Product details page

If images do not appear, confirm that:

1. The image files exist under `frontend/public/images/products/`
2. The product `image` field in MongoDB starts with `/images/products/`
3. The app has been refreshed or restarted
4. `npm run images:download` was run after the latest database seed

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
7. Infinite loading for all products
8. Pagination inside category views

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

If products show but images are missing, run:

```powershell
npm run images:download
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
npm run images:download
```

---

## Current Limitations

- Payment is mocked, not integrated with Stripe or another payment provider.
- Product image download is helper-script based, not yet built into the admin UI.
- Product reviews are not yet implemented.
- Forgot-password and email verification are not yet implemented.
- Admin dashboard is functional but basic.
- Some automation-teaching features are still being added section by section.

---

## Recommended Next Iterations

1. Continue implementing `playwrightRequirements.md` section by section.
2. Add stronger frontend form validation.
3. Add admin product image upload or an admin “Find image automatically” action.
4. Add Stripe checkout or a richer mock payment flow.
5. Add more API-level tests.
6. Add pagination UI polish.
7. Add better admin dashboard metrics.
8. Add accessibility checks with Playwright.
9. Add visual regression examples.
10. Add beginner-friendly Playwright learning notes.

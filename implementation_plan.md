# Implementation Plan

## Current Phase

First-draft MVP scaffold completed.

## Completed in this Draft

### Backend

- Express server setup
- MongoDB connection helper
- User, Product, Cart and Order models
- JWT authentication
- Admin middleware
- ObjectId validation middleware
- Global error handling
- Auth APIs
- Product APIs
- Cart APIs
- Order APIs
- Product seed script
- Basic security middleware

### Frontend

- Vite React setup
- React Router setup
- Axios API client with JWT interceptor
- Auth context
- Cart context
- Navbar
- Public product catalogue
- Product details page
- Login and register pages
- Protected cart, checkout and orders pages
- Basic admin product and order management pages
- Responsive CSS

## Important Design Decisions

### Category Handling

Product categories are stored with both:

- `category`, for display, for example `Fruits & Vegetables`
- `categorySlug`, for filtering, for example `fruits-and-vegetables`

This avoids bugs caused by special characters like `&`, spaces, casing differences or URL encoding issues.

### Cart Flow

The first draft uses a server-side cart linked to the authenticated user.

Current add-to-cart request:

```json
{
  "productId": "MONGO_PRODUCT_ID",
  "quantity": 1
}
```

Current cart item shape:

```json
{
  "product": "MONGO_PRODUCT_ID",
  "name": "Organic Banana Bunch",
  "image": "image-url",
  "price": 4.5,
  "quantity": 1
}
```

### Payment Flow

Payments are mocked using:

```txt
mock-card
cash-on-delivery
```

No real card or payment provider details are captured in this draft.

## API Contracts to Protect

### Register

`POST /api/auth/register`

Request:

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Password123!"
}
```

Response:

```json
{
  "user": {
    "_id": "...",
    "name": "Test User",
    "email": "test@example.com",
    "role": "user"
  },
  "token": "jwt-token"
}
```

### Add to Cart

`POST /api/cart/add`

Headers:

```txt
Authorization: Bearer jwt-token
```

Request:

```json
{
  "productId": "...",
  "quantity": 1
}
```

Response:

```json
{
  "user": "...",
  "items": [],
  "totalAmount": 0
}
```

### Create Order

`POST /api/orders`

Request:

```json
{
  "shippingAddress": {
    "line1": "1 Queen Street",
    "city": "Brisbane",
    "state": "QLD",
    "postcode": "4000",
    "country": "Australia"
  },
  "paymentMethod": "mock-card"
}
```

## Risks / Things to Watch

- Do not pass raw category names through URLs without encoding or slugging.
- Do not directly trust client-side price or totals; backend recalculates totals from cart items.
- Do not expose stack traces in production.
- Do not allow admin APIs without both `protect` and `admin` middleware.
- Do not enable broad CORS in production.
- Do not store real card details in this app.

## Next Iteration

1. Run locally and test the happy path:
   - Seed products
   - Register user
   - Login
   - Browse products
   - Add Fruits & Vegetables product to cart
   - Checkout
   - View order
2. Create a Postman collection from the API contracts.
3. Add backend validation with Zod or Joi.
4. Add automated tests for cart and order flows.
5. Improve admin dashboard with basic metrics.

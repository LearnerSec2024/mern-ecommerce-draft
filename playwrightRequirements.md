---

# 🧱 1. Core UI Elements 


* Checkboxes
* Dropdowns
* Links
* Popups
* New windows/tabs
* Iframes

## Section 1 Implementation Notes — Register Page

Status: Partially complete

Implemented inside the real customer registration flow rather than a standalone automation playground.

UI location:

- Page: `/register`
- Navbar/Home link: `Create account`
- Code file: `frontend/src/pages/Register.jsx`
- Style file: `frontend/src/styles.css`
- Test file: `frontend/tests/e2e/create-account-login-order.spec.js`

Features implemented:

| Requirement | Status | UI location | Code location | Suggested Playwright locator |
|---|---|---|---|---|
| Text input | Complete | Register page, Name field | `Register.jsx` | `getByLabel(/^name$/i)` |
| Email validation field | Complete | Register page, Email field | `Register.jsx` | `getByTestId('register-email-input')` |
| Password field | Complete | Register page, Password field | `Register.jsx` | `getByLabel(/^password$/i)` |
| File upload | Complete | Register page, Profile picture upload | `Register.jsx` | `getByTestId('register-profile-picture-input')` |
| Checkboxes | Complete | Marketing opt-in and terms checkbox | `Register.jsx` | `getByTestId('register-terms-checkbox')` |
| Disabled → enabled button | Complete | Register button enables after valid form + terms | `Register.jsx` | `getByTestId('register-submit-button')` |
| Loading button | Complete | Register button shows `Creating account...` | `Register.jsx` | `getByRole('button', { name: /creating account/i })` |

Teaching value:

- Students can practise label locators, test IDs, email validation assertions, password rule assertions, file upload, checkbox selection, and disabled/enabled button assertions in a realistic registration flow.

Add these:

### Inputs & Forms

* Text inputs (username, search)
* Password fields
* Email validation field
* Number input (quantity)
* Date picker (delivery date)
* File upload (profile picture)
* Textarea (reviews/comments)

---

## Section 2 Implementation Notes — Advanced UI Interactions

✅ Dynamic delayed element
✅ Lazy-loaded product list
✅ Infinite scroll sentinel
✅ Hover to reveal hidden wishlist button
✅ Hover tooltip
✅ Drag product to cart
✅ Price range slider
✅ Press Enter to search
✅ Tab-friendly labelled controls

Status: ✅ Implemented

Implemented inside the real ecommerce product catalogue instead of a standalone demo page.

UI location:

- Page: `/products`
- Code files:
  - `frontend/src/pages/Products.jsx`
  - `frontend/src/components/ProductCard.jsx`
  - `frontend/src/styles.css`
- Test file:
  - `frontend/tests/e2e/advanced-ui-interactions.spec.js`

Features implemented:

| Requirement                    | Status             | UI location                                                              | Code location                     | Suggested Playwright locator                                             |
| ------------------------------ | ------------------ | ------------------------------------------------------------------------ | --------------------------------- | ------------------------------------------------------------------------ |
| Dynamic element after delay    | Complete           | Delayed promo banner on Products page                                    | `Products.jsx`                    | `getByTestId('delayed-deal-banner')`                                     |
| Lazy-loaded product list       | Complete           | Products page loads products in chunks                                   | `Products.jsx`                    | `getByTestId('loaded-product-count')`                                    |
| Infinite scroll                | Complete           | Products page bottom sentinel loads more products                        | `Products.jsx`                    | `getByTestId('infinite-scroll-sentinel')`                                |
| Hover to reveal hidden element | Complete           | Wishlist button and tooltip appear on product card hover                 | `ProductCard.jsx`                 | `getByTestId('wishlist-button')`, `getByTestId('product-hover-tooltip')` |
| Hidden Add to wishlist button  | Complete           | Product card image overlay                                               | `ProductCard.jsx`                 | `getByTestId('wishlist-button')`                                         |
| Drag & drop                    | Complete           | Drag product card to cart drop zone                                      | `Products.jsx`, `ProductCard.jsx` | `getByTestId('product-card')`, `getByTestId('cart-drop-zone')`           |
| Slider                         | Complete           | Max price filter slider                                                  | `Products.jsx`                    | `getByTestId('price-range-slider')`                                      |
| Keyboard action                | Complete           | Press Enter in product search field                                      | `Products.jsx`                    | `getByTestId('product-search-input').press('Enter')`                     |
| Tab navigation through form    | Existing/Supported | Register, login, checkout and product filters use labelled form controls | Multiple form pages               | `page.keyboard.press('Tab')`                                             |

Teaching value:

- Students can practise waiting for dynamic content, hover states, hidden elements, drag-and-drop, range sliders, keyboard search, infinite-scroll behaviour, and robust `data-testid` locators in a realistic ecommerce catalogue flow.

### Buttons & Actions

- Disabled → enabled buttons (e.g., after form validation)
- Loading buttons (spinner after click)
- Double-click / right-click actions

---

# 🎯 2. Advanced UI Interactions (VERY important for Playwright)

These are what actually differentiate beginners from experienced testers:

### Dynamic Elements

- Elements that appear after delay (AJAX)
- Lazy-loaded product lists
- Infinite scroll

### Hover & Hidden Elements

- Hover to reveal menu / tooltip
- Hidden “Add to wishlist” button

### Drag & Drop

- Drag product to cart

### Sliders

- Price range slider filter

### Keyboard Actions

- Press Enter to search
- Tab navigation through form

---

# 🧪 3. Locator Strategy Coverage (CRITICAL)

Design your DOM intentionally messy/varied:

- Unique IDs (easy mode)
- Duplicate classes (forces better locators)
- Dynamic IDs (e.g., `id="item-1234"`)
- Data attributes (`data-testid`) → best practice
- Nested elements (deep DOM)
- Shadow DOM (optional advanced)

👉 This ensures students practice:

- CSS selectors
- XPath
- Role-based selectors (Playwright best practice)

## ✅ 3. Locator Strategy Coverage - Implemented

Implemented using the real ecommerce UI instead of adding a separate static demo section.  
This keeps the original ecommerce look and customer journey intact while still giving learners varied locator practice.

### Where This Is Implemented

| Locator strategy     | Where implemented                                  | Example                                                                                                                                |
| -------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Unique IDs           | Products filter controls                           | `#product-search`, `#category-filter`, `#sort-filter`, `#price-range`                                                                  |
| Duplicate classes    | Product cards and shared UI classes                | `.product-card`, `.button`, `.status`                                                                                                  |
| Dynamic IDs          | Product cards and order cards                      | `id="product-<mongoId>"`, `id="order-<mongoId>"`                                                                                       |
| Data attributes      | Product cards, product actions and order cards     | `data-testid="product-card"`, `data-testid="product-card-title"`, `data-testid="product-card-add-to-cart"`, `data-testid="order-card"` |
| Nested elements      | Product card image/body/title/action structure     | `.product-image-wrap img`, `.card-body h3`, `.card-body .button`                                                                       |
| CSS selectors        | Product cards and product metadata                 | `article.product-card[id^="product-"]`, `[data-testid="product-card"][data-price]`                                                     |
| XPath                | Product detail links inside product cards          | `//article[contains(@class, "product-card")]//a[contains(normalize-space(), "View details")]`                                          |
| Role-based selectors | Accessible links, buttons, headings and comboboxes | `getByRole('heading')`, `getByRole('link')`, `getByRole('button')`, `getByRole('combobox')`                                            |
| Shadow DOM           | Not implemented                                    | Optional advanced item; skipped to keep the ecommerce UI natural                                                                       |

### Code Changes

Implemented in:

```txt
frontend/src/components/ProductCard.jsx
frontend/src/pages/Orders.jsx
frontend/tests/e2e/locator-strategy.spec.js

---

# 🔄 4. Navigation & Routing

- Multi-page navigation
- SPA-style navigation (no full reload)
- Back/forward browser navigation
- URL query params (`?category=shoes`)
- Redirects (login required → redirect)

---

# 🛒 5. Real eCommerce Flows (E2E goldmine)

### User Flow

- Register → login → logout
- Forgot password (mock)

### Product Flow

- Search products
- Filter (category, price, rating)
- Sort (price low → high)

### Cart Flow

- Add to cart
- Update quantity
- Remove item
- Persist cart (local storage)

### Checkout Flow

- Address form
- Payment (mock only)
- Order confirmation page

---

# ⚠️ 6. Validation & Error Handling

Must include both UI and API errors:

### Form Validation

- Required fields
- Invalid email
- Password rules

### API Errors

- 400 (bad request)
- 401 (unauthorized)
- 500 (server error simulation)

### UI Errors

- “Out of stock”
- “Network error, retry”

---

# 🌐 7. API Layer (VERY IMPORTANT for Playwright Java)

Expose real endpoints via Next.js API routes:

### Must-have APIs

- `GET /products`
- `GET /products/:id`
- `POST /login`
- `POST /cart`
- `POST /checkout`

### Add complexity

- Pagination (`/products?page=2`)
- Filtering (`/products?category=electronics`)
- Delayed responses (simulate slow API)

👉 Students can practice:

- API testing (Playwright request context)
- Mocking APIs
- Intercepting network calls

---

# ⏳ 8. Waiting & Synchronization Scenarios

Force students to handle timing issues:

- Loader/spinner before data loads
- Button enabled after API response
- Toast messages (disappear after 3 sec)
- Delayed modal popup

---

# 📢 9. Notifications & Alerts

- Browser alerts (`alert`, `confirm`, `prompt`)
- Toast notifications
- Inline success/error messages

---

# 🧾 10. Tables & Data Handling

- Product table with pagination
- Sortable columns
- Select rows (checkbox in table)
- Dynamic row updates

---

# 🔐 11. Authentication & State

- Session-based login
- Token-based (mock JWT)
- Expired session handling
- Role-based UI (admin vs user)

---

# 💾 12. Storage (Great for testing)

- Local Storage (cart data)
- Session Storage
- Cookies (auth token)

---

# 🌍 13. Cross-Browser & Responsive Features

- Mobile view (hamburger menu)
- Tablet layout
- Different viewport behaviors

---

# 🧩 14. Iframes (expand your idea)

Don’t just add iframe—make it useful:

- Payment gateway mock inside iframe
- Embedded chat widget
- External content iframe

---

# 🔗 15. External Integrations (Mocked)

- Fake payment gateway
- Fake shipping API
- Google Maps iframe (address)

---

# 🧠 16. Edge Cases (This is where real skill comes)

- Empty product list
- Very long product names
- Special characters in input
- Duplicate items in cart
- Network failure mid-checkout

---

# 🧪 17. Testability Enhancements (VERY IMPORTANT)

Add:

- `data-testid` attributes everywhere
- Consistent naming strategy
- Seeded test data (predictable results)

---
```

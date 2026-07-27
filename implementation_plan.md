# Implementation Plan - Featured Items & Infinite Marquee Animations

This plan details the implementation of:
1. **Featured Toggles for Categories and Products**: Add a `featured` boolean field to `Category` models, update Category and Product creation/edit forms in the Admin Panel to include "Featured" toggles, and filter the home page Category list to show only featured categories.
2. **Dynamic Best Seller Calculation**: Create a backend endpoint that aggregates actual sales (quantities ordered) from the `Order` collection, dynamically sorting and returning the top ordered product as the Best Seller.
3. **Infinite Marquee CSS & Layout Animations**: Implement smooth, GPU-accelerated horizontal infinite marquee looping animations for Product Visuals (featured products), Categories selector tabs, and Customer Reviews on the homepage.

---

## User Review Required

> [!IMPORTANT]
> 1. **Default Seeding**: Seeding the database will default all 4 main categories to `featured: true` so the homepage shows them initially, but you can toggle them in the Admin Panel.
> 2. **Best Seller Fallback**: If no orders are placed yet (e.g., right after seeding), the Best Seller API will dynamically fallback to the live product with the highest rating/stock.
> 3. **Infinite Scrolling Hover Behavior**: Hovering over any infinite marquee track (products, categories, reviews) will pause the scroll animation for premium interaction.

---






## Proposed Changes

### 1. Backend Server - Schema, Controller, and Services

#### [MODIFY] [category.model.js](file:///f:/Sirat/server/models/category.model.js)
- Add `featured: { type: Boolean, default: false }` to the category schema.

#### [MODIFY] [category.controller.js](file:///f:/Sirat/server/controllers/category.controller.js)
- Read `featured` from `req.body` in `createCategory` and `updateCategory` (handling FormData string-to-boolean casting: `req.body.featured === "true" || req.body.featured === true`).

#### [MODIFY] [product.routes.js](file:///f:/Sirat/server/routes/product.routes.js)
- Register GET `/featured` and GET `/best-seller` routes *before* the GET `/:id` route to avoid route matching conflicts.

#### [MODIFY] [product.controller.js](file:///f:/Sirat/server/controllers/product.controller.js)
- Add `getFeaturedProducts` and `getBestSeller` controller functions.

#### [MODIFY] [product.services.js](file:///f:/Sirat/server/services/product.services.js)
- Implement `getFeaturedProducts` (find live, featured products).
- Implement `getBestSellerProduct` (aggregate order log item quantities, find top product ID, fallback to highest-rated live product if no orders exist).

#### [MODIFY] [seed.js](file:///f:/Sirat/server/utils/seed.js)
- Add `featured: true` to default seed categories.

---

### 2. Validation Schemas & API Queries

#### [MODIFY] [schemas.js](file:///f:/Sirat/client/src/api/schemas.js) & [schemas.js](file:///f:/Sirat/admin/src/lib/api/schemas.js)
- Append `featured: z.boolean().default(false)` to `categorySchema`.

#### [MODIFY] [queries.js](file:///f:/Sirat/client/src/api/queries.js)
- Add `fetchBestSellerProduct()` calling GET `/products/best-seller`.

---

### 3. Admin Panel - Forms & Custom Toggles

#### [MODIFY] [CategoriesPage.jsx](file:///f:/Sirat/admin/src/features/categories/pages/CategoriesPage.jsx)
- Include a "Featured Category" checkbox in the add/edit Category Modal.
- Append `featured` field to `FormData` on save.

#### [MODIFY] [ProductsPage.jsx](file:///f:/Sirat/admin/src/features/products/pages/ProductsPage.jsx)
- Include a "Featured Product" checkbox in the add/edit Product Modal.
- Append `featured` field to `FormData` on save.

---

### 4. Client Storefront - Marquee & Dynamism

#### [MODIFY] [global.css](file:///f:/Sirat/client/src/styles/global.css)
- Implement infinite marquee utility styles:
  ```css
  .marquee-container {
    overflow: hidden;
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
  }
  .marquee-track {
    display: flex;
    width: max-content;
    gap: 1.5rem;
    animation: marquee-infinite 30s linear infinite;
  }
  .marquee-container:hover .marquee-track {
    animation-play-state: paused;
  }
  @keyframes marquee-infinite {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  ```

#### [MODIFY] [CategorySection.jsx](file:///f:/Sirat/client/src/features/products/sections/CategorySection.jsx)
- Filter `categoriesData` to show only `featured === true` categories (fallback to all categories if none are featured).
- Select the first featured category by default.
- Wrap categories selector inside the infinite marquee track, duplicating items for seamless loop.

#### [MODIFY] [VisualsSection.jsx](file:///f:/Sirat/client/src/features/products/sections/VisualsSection.jsx)
- Fetch featured products from the backend dynamically via `fetchFeaturedProducts()`.
- Wrap the product cards inside the infinite marquee track.

#### [MODIFY] [BestSellerSection.jsx](file:///f:/Sirat/client/src/features/products/sections/BestSellerSection.jsx)
- Fetch spotlight Best Seller product from backend dynamically via `fetchBestSellerProduct()`.

#### [MODIFY] [ReviewsSection.jsx](file:///f:/Sirat/client/src/features/products/sections/ReviewsSection.jsx)
- Redesign review layout to render review cards side-by-side inside the infinite marquee track.

---

## Verification Plan

### Automated / Backend Verification
- Seed database to check the `featured: true` flag is added correctly.
- Call the `/api/products/best-seller` and `/api/products/featured` endpoints directly to verify their JSON responses.

### Manual UI Verification
- Verify in the Admin Panel that Categories and Products can have their "Featured" checkbox toggled and saved successfully.
- Verify on the Client Homepage that:
  - Only featured categories are rendered as clickable tabs.
  - The Category tabs, Product Visuals, and Reviews scroll horizontally infinitely and pause on hover.
  - The Best Seller section shows the correct top-ordered product.

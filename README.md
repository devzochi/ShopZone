# ShopZone — Front-End Ecommerce Experience

ShopZone is a polished, responsive ecommerce storefront built to demonstrate product discovery, client-side shopping flows, and deliberate UI engineering. It presents a complete browse-to-checkout experience without relying on a backend: visitors can explore products, search and filter the catalog, manage a wishlist and cart, and complete a checkout demonstration entirely in the browser.

> **Portfolio project:** ShopZone focuses on the front-end experience. Product data is static and checkout is a UI demonstration; no account, payment, API, or order-management service is connected.

## Highlights

- Responsive storefront designed for mobile, tablet, and desktop
- Curated catalog with **60 products** — exactly **10 products across each of six categories**
- Category navigation, deals and new-arrivals views, full-text product search, and client-side sorting
- Product quick-view modal with gallery, colour selection, quantity controls, rating display, and stock state
- Persistent cart and wishlist powered by browser `localStorage`
- Cart drawer with line-item updates, removal, price totals, and shipping threshold feedback
- Multi-step checkout interface with shipping details, payment form UI, success confirmation, and cart reset
- Accessible interaction foundations: labelled controls, keyboard-friendly native inputs, clear focus states, and descriptive image alternatives

## Built with

| Area | Technology |
| --- | --- |
| UI | React 19 + TypeScript |
| Tooling | Vite 6 |
| Styling | Tailwind CSS 4 |
| Motion & feedback | Motion, canvas-confetti |
| Icons | Lucide React |
| State persistence | Browser `localStorage` |

## What I built

### Product discovery

The storefront uses a typed, static product catalog as a single source of truth. Each product has a category, pricing, rating, description, available colours, feature list, stock status, and merchandising flags. Those flags drive the **Deals**, **What’s New**, and trending experiences without duplicating product data.

Users can:

- browse six category collections: Electronics, Fashion, Home, Fitness, Accessories, and Lifestyle;
- search product names, categories, and descriptions;
- sort filtered results by popularity, price, or rating; and
- open a detailed product view before adding an item to their cart.

### Client-side commerce flow

Cart and wishlist interactions are handled through React state and persisted between browser sessions with `localStorage`.

1. Add a product from a card or its quick-view modal.
2. Adjust quantities or remove items in the cart drawer.
3. Continue to a two-step checkout interface.
4. Submit shipping and payment-form details to see an order confirmation UI.

The checkout does not transmit, store, or process personal or payment data. It exists to demonstrate the interface and interaction flow a production checkout would require.

### UI decisions

- A sticky header keeps navigation, search, wishlist, and cart reachable while browsing.
- Drawers and modals keep users in context instead of forcing route changes for common actions.
- Product cards use consistent visual hierarchy for imagery, price, ratings, badges, and primary actions.
- Responsive grids progressively adapt from one to four product columns.
- Toast feedback and confirmation animation make cart and checkout actions immediately visible.

## Project structure

```text
src/
├── components/         # Reusable storefront sections, drawers, modals, and cards
├── data/products.ts    # Typed catalog, category metadata, prices, product details
├── App.tsx             # Client-side state, filtering, cart, wishlist, and UI orchestration
├── types.ts            # Shared TypeScript contracts
├── main.tsx            # React entry point
└── index.css           # Global styles and Tailwind imports
```

## Run locally

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
git clone <your-repository-url>
cd ShopZone
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create an optimized static production build in `dist/` |
| `npm run start` | Preview the production build locally |
| `npm run lint` | Run TypeScript validation without emitting files |

## Verification

The project is checked with:

```bash
npm run lint
npm run build
```

## Product data model

The catalog intentionally uses a consistent TypeScript shape so new products can be introduced safely. Add or update products in `src/data/products.ts`; category counts are defined alongside the data and each collection contains ten products.

```ts
type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  image: string;
  description: string;
  inStock: boolean;
};
```

## Future enhancements

For a production version, the same UI can be extended with:

- real inventory and product APIs;
- secure authentication and saved orders;
- a payment provider such as Stripe;
- server-side search, pagination, and inventory validation;
- automated unit, integration, and visual regression tests; and
- image optimization and a CDN-backed media pipeline.

## Skills demonstrated

- Building responsive interfaces from reusable React components
- Designing complete user journeys and meaningful interaction feedback
- Modeling UI data with TypeScript and deriving filtered/sorted views
- Managing client-side state and browser persistence
- Creating accessible, consistent ecommerce patterns
- Configuring a modern front-end build workflow with Vite and Tailwind CSS

---

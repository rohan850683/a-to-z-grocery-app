# A to Z — Grocery Delivery App 🛒

A full-stack, production-ready grocery delivery web app (Blinkit / Swiggy Instamart style) built with **React (Vite + Tailwind)**, **Node.js/Express**, and **MongoDB**.

## ✨ Features

- Responsive navbar with category links, search, cart, and auth
- Home page with hero carousel, auto-scrolling product marquee, offer banners, popular categories, trending & best-seller rows
- Dedicated category pages (Veg, Non-Veg, Cake, Cold Drinks, Chocolate, Ice Cream, Groceries, Pet Food) with sorting
- Product detail pages with images, pricing, ratings, ingredients, delivery time, quantity selector
- Auth: Sign up / Login (JWT-based) with validation, stored in MongoDB
- Cart (guest + logged-in, synced to DB) and full checkout flow that creates real Orders
- User profile page: edit details + order history
- Contact Us form saved to MongoDB
- Built-in AI shopping assistant chatbot (rule-based, product-aware; easy to swap for an LLM API)
- Amazon-style footer with app download section & social links
- Smooth Framer Motion animations, rounded cards, hover states, skeleton loaders

## 🧱 Tech Stack

- **Frontend:** React 18, Vite, React Router, Tailwind CSS, Framer Motion, lucide-react, axios
- **Backend:** Node.js, Express, JWT auth, bcrypt
- **Database:** MongoDB + Mongoose

## 📁 Project Structure

```
a-to-z-grocery/
├── backend/
│   ├── config/db.js
│   ├── controllers/         # auth, product, cart, order, contact, ai
│   ├── middleware/          # auth, error handler
│   ├── models/              # User, Product, Order, Cart, Contact
│   ├── routes/
│   ├── seed/seedProducts.js # sample product data across all categories
│   ├── server.js
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/      # Navbar, Footer, ProductCard, AIChatbot, etc.
    │   ├── pages/            # Home, Category, ProductDetail, Login, Signup, Contact, Profile, Cart, Checkout
    │   ├── context/          # AuthContext, CartContext
    │   ├── services/api.js
    │   └── constants/categories.js
    └── .env.example
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)

### 1. Backend setup

```bash
cd backend
cp .env.example .env      # edit MONGO_URI / JWT_SECRET if needed
npm install
npm run seed              # loads sample products into MongoDB
npm run dev                # starts API on http://localhost:5000
```

### 2. Frontend setup

```bash
cd frontend
cp .env.example .env      # points to the backend API
npm install
npm run dev                # starts app on http://localhost:5173
```

Open `http://localhost:5173` in your browser. Create an account via **Sign Up**, browse categories, add items to your cart, and place an order — everything is persisted in MongoDB.

### 3. Production build

```bash
cd frontend
npm run build              # outputs static files to frontend/dist
```
Deploy `frontend/dist` to any static host (Vercel/Netlify) and the `backend` folder to any Node host (Render/Railway), pointing `VITE_API_URL` to your deployed API URL.

## 🔌 API Overview

| Method | Route                  | Description                     |
|--------|-------------------------|----------------------------------|
| POST   | /api/auth/signup        | Register a new user             |
| POST   | /api/auth/login         | Log in                          |
| GET    | /api/auth/me            | Get current user (auth)         |
| PUT    | /api/auth/me            | Update profile (auth)           |
| GET    | /api/products           | List products (filters: category, search, trending, bestseller) |
| GET    | /api/products/:slug     | Get one product                 |
| GET    | /api/cart               | Get cart (auth)                 |
| POST   | /api/cart               | Add to cart (auth)              |
| PUT    | /api/cart/:productId    | Update quantity (auth)          |
| DELETE | /api/cart/:productId    | Remove item (auth)              |
| POST   | /api/orders             | Place an order (auth)           |
| GET    | /api/orders             | Order history (auth)            |
| POST   | /api/contact            | Submit contact form             |
| POST   | /api/ai/chat            | Chat with the AI assistant      |

## 🎨 Design

Brand palette: forest green (primary/trust), mango amber (CTAs), chili red (offers), soft mint/cream backgrounds. Display type: **Fredoka** paired with **Inter** for body copy — playful yet legible, distinct from generic template looks.

## 🔮 Next Steps / Ideas
- Swap the rule-based AI assistant for a real LLM (Anthropic/OpenAI) API call in `backend/controllers/aiController.js`
- Add admin dashboard for managing products & orders
- Integrate a real payment gateway (Razorpay/Stripe) at checkout
- Add product reviews & wishlists

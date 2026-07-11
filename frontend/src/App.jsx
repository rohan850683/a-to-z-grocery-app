import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import AIChatbot from "./components/AIChatbot.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Category from "./pages/Category.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import Profile from "./pages/Profile.jsx";
import CartPage from "./pages/CartPage.jsx";
import Checkout from "./pages/Checkout.jsx";
import Offers from "./pages/Offers.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import NotFound from "./pages/NotFound.jsx";
import TrackOrder from "./pages/TrackOrder.jsx";
import MyOrders from "./pages/MyOrders.jsx";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminCoupons from "./pages/AdminCoupons.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import AdminRevenue from "./pages/AdminRevenue.jsx";
import AdminStock from "./pages/AdminStock.jsx";
import AdminSettings from "./pages/AdminSettings.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />

      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />

          <Route
            path="/category/:categoryKey"
            element={<Category />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetail />}
          />

          <Route path="/offers" element={<Offers />} />

          <Route path="/login" element={<Login />} />
          <Route
  path="/forgot-password"
  element={<ForgotPassword />}
/>

<Route
  path="/reset-password/:token"
  element={<ResetPassword />}
/>

          <Route path="/signup" element={<Signup />} />

          <Route path="/contact" element={<ContactUs />} />

          <Route path="/cart" element={<CartPage />} />

          <Route path="/wishlist" element={<Wishlist />} />

          <Route
            path="/track-order/:id"
            element={<TrackOrder />}
          />

          {/* Protected User Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-orders"
            element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute adminOnly>
                <AdminProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute adminOnly>
                <AdminOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/coupons"
            element={
              <ProtectedRoute adminOnly>
                <AdminCoupons />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute adminOnly>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/revenue"
            element={
              <ProtectedRoute adminOnly>
                <AdminRevenue />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/stock"
            element={
              <ProtectedRoute adminOnly>
                <AdminStock />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute adminOnly>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      <AIChatbot />
    </div>
  );
}

export default App;

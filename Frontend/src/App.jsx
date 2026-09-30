import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/auth/Login';
import AdminLayout from './components/admin/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAccounts from './pages/admin/AdminAccounts';
import AdminHistory from './pages/admin/AdminHistory';
import AdminOrders from './pages/admin/AdminOrders';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
          </Route>

          {/* Auth Route */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOrders />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="accounts" element={<AdminAccounts />} />
            <Route path="history" element={<AdminHistory />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;

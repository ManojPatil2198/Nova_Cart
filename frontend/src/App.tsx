
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

// Components
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './components/AdminRoute'

// Pages
import { Home } from './pages/Home'
import { ProductDetails } from './pages/ProductDetails'
import { Cart } from './pages/Cart'
import { Orders } from './pages/Orders'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AdminDashboard } from './pages/AdminDashboard'
import { Checkout } from './pages/Checkout'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Customer routes */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                {/* Admin routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            
            {/* Footer */}
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

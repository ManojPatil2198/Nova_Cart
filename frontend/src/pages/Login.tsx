import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Where to redirect after login
  const from = (location.state as any)?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSubmitting(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Invalid email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20 flex flex-col justify-center min-h-[80vh]">
      <div className="glass rounded-3xl p-8 border border-white/5 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none"></div>
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400">
            Sign in to access your shopping cart and orders.
          </p>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-4 rounded-xl border border-red-500/20 bg-red-950/40 text-red-200 text-xs">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-350">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-355">Password</label>
              <Link to="/forgot-password" className="text-xs text-purple-400 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/10 hover:shadow-purple-500/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <LogIn size={16} />
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/5">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:underline font-semibold">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}

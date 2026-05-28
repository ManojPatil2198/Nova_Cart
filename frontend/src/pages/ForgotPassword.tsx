import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Send, AlertCircle, CheckCircle2 } from 'lucide-react'
import api from '../services/api'

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)
    setSubmitting(true)

    try {
      const response = await api.post('/auth/forgot-password', { email })
      setSuccessMsg(response.data.message || 'If an account with that email exists, we have sent a password reset link.')
    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'An error occurred. Please try again.')
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
          <h1 className="text-3xl font-extrabold text-white">Reset Password</h1>
          <p className="text-xs text-slate-400">
            Enter your email to receive a password reset link.
          </p>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-4 rounded-xl border border-red-500/20 bg-red-950/40 text-red-200 text-xs">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-4 rounded-xl border border-green-500/20 bg-green-950/40 text-green-200 text-xs">
            <CheckCircle2 size={16} className="flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        {!successMsg && (
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

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-xl shadow-purple-600/10 hover:shadow-purple-500/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Send size={16} />
              {submitting ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/5">
          Remember your password?{' '}
          <Link to="/login" className="text-purple-400 hover:underline font-semibold">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

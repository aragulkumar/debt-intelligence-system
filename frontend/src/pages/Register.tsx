import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" 
         style={{ background: 'var(--bg-base)' }}>
      <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full pointer-events-none fade-in" 
           style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
      
      <div className="relative z-10 w-full max-w-md px-4 fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
              <span className="text-white text-lg font-bold">D</span>
            </div>
            <span className="text-xl font-bold text-primary">Debt Helper</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">Create an account</h1>
          <p className="mt-1 text-sm text-secondary">Start your journey to financial freedom</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input 
              type="text" 
              className="input" 
              required 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input 
              type="email" 
              className="input" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label">Password <span className="text-xs font-normal text-muted ml-2">(min. 8 chars)</span></label>
            <input 
              type="password" 
              className="input" 
              required 
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full justify-center mt-2"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>
          
          <div className="text-center mt-4 text-sm text-secondary">
            Already have an account? <Link to="/login" className="text-indigo-500 hover:text-indigo-400 font-medium">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

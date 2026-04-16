import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Users, CreditCard, TrendingDown } from 'lucide-react';

export default function Admin() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get('/admin/stats')).data,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get('/admin/users')).data,
  });

  if (isLoading) return <p className="text-secondary fade-in">Loading admin dashboard...</p>;

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <p className="text-secondary mt-1">Platform-wide analytics and insights.</p>
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"><Users className="w-5 h-5" /></div>
            <h3 className="font-medium text-secondary">Total Users</h3>
          </div>
          <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500"><CreditCard className="w-5 h-5" /></div>
            <h3 className="font-medium text-secondary">Active Debts</h3>
          </div>
          <p className="text-3xl font-bold">{stats?.totalActiveDebts || 0}</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><TrendingDown className="w-5 h-5" /></div>
            <h3 className="font-medium text-secondary">Total Outstanding</h3>
          </div>
          <p className="text-3xl font-bold">₹{Number(stats?.totalOutstanding || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">Debt by Type</h3>
        <div className="grid-2">
          {stats?.debtByType?.map((t: any) => (
            <div key={t.type} className="p-3 bg-elevated border border-border rounded flex justify-between">
              <span className="badge badge-purple">{t.type.replace('_', ' ')}</span>
              <span className="text-secondary text-sm">{t._count.id} accounts — ₹{Number(t._sum.outstanding || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-4">All Users</h3>
        <div className="space-y-2">
          {users.map((u: any) => (
            <div key={u.id} className="flex justify-between items-center p-3 bg-elevated border border-border rounded">
              <div>
                <p className="font-medium text-sm">{u.name || 'Unnamed'}</p>
                <p className="text-xs text-muted">{u.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{u.debts?.length} debts</p>
                <p className="text-xs text-muted">₹{u.debts?.reduce((s: number, d: any) => s + d.outstanding, 0).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {users.length === 0 && <p className="text-secondary text-sm">No users yet.</p>}
        </div>
      </div>
    </div>
  );
}

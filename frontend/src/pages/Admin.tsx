import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, CreditCard, TrendingDown, IndianRupee } from 'lucide-react';

export default function Admin() {
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => (await api.get('/admin/stats')).data,
  });

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get('/admin/users')).data,
  });

  const DEBT_TYPE_COLORS: Record<string, string> = {
    CREDIT_CARD: 'bg-red-500/10 text-red-500',
    PERSONAL_LOAN: 'bg-blue-500/10 text-blue-500',
    BNPL: 'bg-amber-500/10 text-amber-500',
    MORTGAGE: 'bg-green-500/10 text-green-500',
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform-wide analytics and user management.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loadingStats ? (
          [1,2,3].map(i => <Skeleton key={i} className="h-28" />)
        ) : (
          <>
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                <div className="p-2 rounded-lg bg-indigo-500/10"><Users className="w-4 h-4 text-indigo-500" /></div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Debts</CardTitle>
                <div className="p-2 rounded-lg bg-red-500/10"><CreditCard className="w-4 h-4 text-red-500" /></div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.totalActiveDebts || 0}</p>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Outstanding</CardTitle>
                <div className="p-2 rounded-lg bg-amber-500/10"><IndianRupee className="w-4 h-4 text-amber-500" /></div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">₹{Number(stats?.totalOutstanding || 0).toLocaleString()}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Debt by Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-indigo-500" /> Debt Breakdown by Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingStats ? (
            <div className="grid grid-cols-2 gap-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-14" />)}</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats?.debtByType?.map((t: any) => (
                <div key={t.type} className="p-3 rounded-lg border bg-card">
                  <Badge className={`text-xs mb-2 ${DEBT_TYPE_COLORS[t.type] || ''}`}>
                    {t.type.replace('_', ' ')}
                  </Badge>
                  <p className="text-lg font-bold">{t._count?.id || 0}</p>
                  <p className="text-xs text-muted-foreground">accounts</p>
                  <p className="text-sm font-medium text-indigo-500 mt-1">₹{Number(t._sum?.outstanding || 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" /> All Users
          </CardTitle>
          <CardDescription>{users.length} registered user{users.length !== 1 ? 's' : ''}</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingUsers ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14" />)}</div>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No users yet.</p>
          ) : (
            <div className="space-y-2">
              {users.map((u: any) => {
                const totalOwed = u.debts?.reduce((s: number, d: any) => s + (d.outstanding || 0), 0) || 0;
                return (
                  <div key={u.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <Avatar className="w-9 h-9 shrink-0">
                      <AvatarFallback className="text-sm bg-indigo-500/20 text-indigo-500 font-bold">
                        {u.name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{u.name || 'Unnamed User'}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium">{u.debts?.length || 0} debts</p>
                      <p className="text-xs text-muted-foreground">₹{totalOwed.toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

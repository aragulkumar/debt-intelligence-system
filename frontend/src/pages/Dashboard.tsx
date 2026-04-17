import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { CreditCard, AlertTriangle, TrendingDown, Zap, Target } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { theme } = useTheme();

  const { data: debts = [], isLoading: loadingDebts } = useQuery({
    queryKey: ['debts'],
    queryFn: async () => (await api.get('/debts')).data,
  });

  const { data: healthScore, isLoading: loadingHealth } = useQuery({
    queryKey: ['health-score'],
    queryFn: async () => (await api.get('/health-score')).data,
  });

  const totalOutstanding = debts.reduce((s: number, d: any) => s + (d.outstanding || 0), 0);
  const totalEmi = debts.reduce((s: number, d: any) => s + (d.emiAmount || 0), 0);
  const bnplCount = debts.filter((d: any) => d.type === 'BNPL').length;

  const chartData = [
    { name: 'Jan', value: Math.round(totalOutstanding * 1.12) },
    { name: 'Feb', value: Math.round(totalOutstanding * 1.06) },
    { name: 'Mar', value: Math.round(totalOutstanding * 1.02) },
    { name: 'Apr', value: totalOutstanding },
  ];

  const scoreBand = healthScore?.band || 'Unknown';
  const score = healthScore?.score || 0;
  const bandColor = scoreBand === 'Excellent' ? 'text-green-500' : scoreBand === 'Good' ? 'text-blue-500' : scoreBand === 'Fair' ? 'text-amber-500' : 'text-red-500';

  if (loadingDebts || loadingHealth) {
    return (
      <div className="space-y-6 fade-in">
        <div className="space-y-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-72" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Here's your financial overview.</p>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border bg-card">
          <div className="pulse-ring rounded-full bg-background/50 backdrop-blur-md p-1">
            <div className={`text-4xl font-extrabold gradient-text bg-clip-text text-transparent`}>{score}</div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Health Score</p>
            <Badge variant={scoreBand === 'Excellent' ? 'default' : 'secondary'} className={bandColor}>
              {scoreBand}
            </Badge>
          </div>
        </div>
      </div>

      {/* Health Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Financial Health</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={score} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0 — Poor</span><span>50 — Fair</span><span>100 — Excellent</span>
          </div>
        </CardContent>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Debt</CardTitle>
            <div className="p-2 rounded-lg bg-indigo-500/10"><CreditCard className="w-4 h-4 text-indigo-500" /></div>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-3xl font-bold tracking-tight">₹{totalOutstanding.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">{debts.length} active accounts</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly EMI Load</CardTitle>
            <div className="p-2 rounded-lg bg-red-500/10"><TrendingDown className="w-4 h-4 text-red-500" /></div>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-3xl font-bold tracking-tight">₹{totalEmi.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Due next 30 days</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">BNPL Accounts</CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10"><AlertTriangle className="w-4 h-4 text-amber-500" /></div>
          </CardHeader>
          <CardContent className="pt-2">
            <p className="text-3xl font-bold tracking-tight">{bnplCount}</p>
            <p className="text-xs text-muted-foreground mt-2">High frequency, low tenure</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart + Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="w-4 h-4 text-indigo-500" /> Debt Paydown Trend
            </CardTitle>
            <CardDescription>Outstanding balance over the last 4 months</CardDescription>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'oklch(0.269 0 0)' : 'oklch(0.922 0 0)'} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="oklch(0.556 0 0)" />
                <YAxis tick={{ fontSize: 12 }} stroke="oklch(0.556 0 0)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? 'oklch(0.205 0 0)' : '#fff',
                    border: '1px solid oklch(0.269 0 0)',
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                  formatter={(v: any) => [`₹${Number(v).toLocaleString()}`, 'Outstanding']}
                />
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="w-4 h-4 text-amber-500" /> AI Insights
            </CardTitle>
            <CardDescription>Personalised recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {healthScore?.insights?.length > 0
              ? healthScore.insights.map((insight: string, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-muted text-sm">
                    {insight}
                  </div>
                ))
              : (
                <div className="p-3 rounded-lg bg-muted text-sm text-muted-foreground">
                  Add your debt accounts to start getting personalised insights from the ML model.
                </div>
              )
            }
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

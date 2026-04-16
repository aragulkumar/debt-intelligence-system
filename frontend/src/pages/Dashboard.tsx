import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { CreditCard, AlertTriangle, TrendingDown, Target, Zap } from 'lucide-react';
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

  const totalOutstanding = debts.reduce((s: number, d: any) => s + d.outstanding, 0);
  const totalEmi = debts.reduce((s: number, d: any) => s + (d.emiAmount || 0), 0);
  const bnplCount = debts.filter((d: any) => d.type === 'BNPL').length;
  
  // Mock history data for chart
  const historyData = [
    { name: 'Jan', outstanding: totalOutstanding * 1.1 },
    { name: 'Feb', outstanding: totalOutstanding * 1.05 },
    { name: 'Mar', outstanding: totalOutstanding },
  ];

  if (loadingDebts || loadingHealth) return <p className="text-secondary fade-in">Loading dashboard...</p>;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="text-secondary mt-1">Here is your financial overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary">Financial Health Score</p>
          <div className="flex items-center gap-2 justify-end">
            <span className={`text-3xl font-bold ${
              healthScore?.band === 'Excellent' ? 'text-green-500' :
              healthScore?.band === 'Good' ? 'text-blue-500' :
              healthScore?.band === 'Fair' ? 'text-amber-500' : 'text-red-500'
            }`}>
              {healthScore?.score || 0}
            </span>
            <span className={`badge ${
              healthScore?.band === 'Excellent' ? 'badge-green' :
              healthScore?.band === 'Good' ? 'badge-blue' :
              healthScore?.band === 'Fair' ? 'badge-amber' : 'badge-red'
            }`}>{healthScore?.band || 'Unknown'}</span>
          </div>
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"><CreditCard className="w-5 h-5" /></div>
            <h3 className="font-medium text-secondary">Total Debt</h3>
          </div>
          <p className="text-2xl font-bold">₹{totalOutstanding.toLocaleString()}</p>
          <p className="text-sm text-muted mt-1">{debts.length} active accounts</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500"><TrendingDown className="w-5 h-5" /></div>
            <h3 className="font-medium text-secondary">Monthly EMI Load</h3>
          </div>
          <p className="text-2xl font-bold">₹{totalEmi.toLocaleString()}</p>
          <p className="text-sm text-muted mt-1">Due next 30 days</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><AlertTriangle className="w-5 h-5" /></div>
            <h3 className="font-medium text-secondary">BNPL Accounts</h3>
          </div>
          <p className="text-2xl font-bold">{bnplCount}</p>
          <p className="text-sm text-muted mt-1">High frequency, low tenure</p>
        </div>
      </div>

      <div className="grid-2">
        <div className="card h-80 flex flex-col">
          <h3 className="font-medium mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-indigo-500" /> Debt Paydown Progress</h3>
          <div className="flex-1 min-h-[200px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={historyData}>
                 <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#27272a' : '#e4e4e7'} />
                 <XAxis dataKey="name" stroke={theme === 'dark' ? '#a1a1aa' : '#71717a'} />
                 <YAxis stroke={theme === 'dark' ? '#a1a1aa' : '#71717a'} />
                 <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#18181b' : '#fff', borderColor: theme === 'dark' ? '#3f3f46' : '#e4e4e7' }} />
                 <Line type="monotone" dataKey="outstanding" stroke="#6366f1" strokeWidth={3} />
               </LineChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3 className="font-medium mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Actionable Insights</h3>
          <ul className="space-y-3">
            {healthScore?.insights?.length > 0 ? (
              healthScore.insights.map((insight: string, i: number) => (
                <li key={i} className="p-3 rounded bg-elevated border border-border text-sm">
                  {insight}
                </li>
              ))
            ) : (
               <li className="text-secondary text-sm">No insights available right now. Let's add more debt data to analyze!</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

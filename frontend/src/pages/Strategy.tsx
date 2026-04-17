import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Calculator, TrendingDown, Snowflake, Zap, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const STRATEGIES = [
  { value: 'avalanche', label: 'Avalanche', icon: TrendingDown, desc: 'Pay highest interest first — minimises total interest paid.' },
  { value: 'snowball',  label: 'Snowball',  icon: Snowflake,   desc: 'Pay lowest balance first — builds momentum and motivation.' },
  { value: 'hybrid',   label: 'Hybrid AI', icon: Zap,          desc: 'ML-optimised mix of both strategies for your debt profile.' },
];

export default function Strategy() {
  const [strategy, setStrategy] = useState('hybrid');
  const [extraPayment, setExtraPayment] = useState('');
  const [result, setResult] = useState<any>(null);

  const { data: debts = [] } = useQuery({
    queryKey: ['debts'],
    queryFn: async () => (await api.get('/debts')).data,
  });

  const simulate = useMutation({
    mutationFn: async () =>
      (await api.post('/repayment/strategy', {
        strategy,
        extraMonthlyPayment: Number(extraPayment) || 0,
      })).data,
    onSuccess: (data) => { setResult(data); toast.success('Strategy calculated!'); },
    onError: () => toast.error('Simulation failed. Make sure you have debt accounts added.'),
  });

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Repayment Strategy</h1>
        <p className="text-muted-foreground">Simulate different payoff strategies to find your optimal plan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Config */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Choose Strategy</CardTitle>
              <CardDescription>Select how you want to prioritise your debt payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={strategy} onValueChange={setStrategy}>
                <TabsList className="grid grid-cols-3 w-full">
                  {STRATEGIES.map(s => (
                    <TabsTrigger key={s.value} value={s.value} className="flex items-center gap-1 text-xs">
                      <s.icon className="w-3 h-3" />{s.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {STRATEGIES.map(s => (
                  <TabsContent key={s.value} value={s.value}>
                    <div className="mt-3 p-3 rounded-lg bg-muted text-sm text-muted-foreground">{s.desc}</div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Extra Monthly Payment</CardTitle>
              <CardDescription>Any extra amount you can put towards debt each month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Additional Payment (₹)</Label>
                <Input
                  type="number" min={0} placeholder="e.g. 5000"
                  value={extraPayment}
                  onChange={e => setExtraPayment(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                onClick={() => simulate.mutate()}
                disabled={simulate.isPending || debts.length === 0}
              >
                <Calculator className="w-4 h-4 mr-2" />
                {simulate.isPending ? 'Calculating...' : 'Calculate Plan'}
              </Button>
              {debts.length === 0 && (
                <p className="text-xs text-muted-foreground text-center">Add debt accounts first to run the simulator.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-indigo-500" /> Recommended Payoff Order
            </CardTitle>
            <CardDescription>
              {result ? `Using ${STRATEGIES.find(s => s.value === strategy)?.label} strategy` : 'Run the simulator to see results'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {simulate.isPending ? (
              <div className="space-y-3">
                {[1,2,3].map(i => <Skeleton key={i} className="h-16" />)}
              </div>
            ) : result?.order?.length > 0 ? (
              <div className="space-y-3">
                {result.order.map((debt: any, i: number) => (
                  <div key={debt.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                    <div className="w-7 h-7 rounded-full bg-indigo-500 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{debt.name}</p>
                      <p className="text-xs text-muted-foreground">₹{debt.outstanding?.toLocaleString()} outstanding · {debt.interestRate}% p.a.</p>
                    </div>
                    {debt.suggestedExtra > 0 && (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 shrink-0">
                        +₹{debt.suggestedExtra}
                      </Badge>
                    )}
                  </div>
                ))}
                {result.summary && (
                  <div className="mt-4 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
                    {result.summary}
                  </div>
                )}
                
                {result.projection && result.projection.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-semibold mb-4 text-center">Long-Term Debt Impact</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={result.projection} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorBase" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOpt" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                          <XAxis 
                            dataKey="month" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                            minTickGap={30}
                          />
                          <YAxis 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(v) => \`₹\${v.toLocaleString()}\`} 
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
                            labelStyle={{ color: 'var(--muted-foreground)' }}
                            formatter={(value: number) => \`₹\${value.toLocaleString()}\`}
                          />
                          <Area type="monotone" dataKey="baseBalance" name="Min Pay Timeline" stroke="#ef4444" fillOpacity={1} fill="url(#colorBase)" />
                          <Area type="monotone" dataKey="optimizedBalance" name="Optimized Timeline" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorOpt)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calculator className="w-10 h-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">Configure your strategy and click Calculate Plan to see your personalised payoff order.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

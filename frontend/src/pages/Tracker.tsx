import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, CalendarDays, Wallet } from 'lucide-react';
import { toast } from 'sonner';

export default function Tracker() {
  const queryClient = useQueryClient();

  const { data: debts = [], isLoading } = useQuery({
    queryKey: ['debts'],
    queryFn: async () => (await api.get('/debts')).data,
  });

  const payDebt = useMutation({
    mutationFn: async (id: string) => (await api.post(`/debts/${id}/pay`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      toast.success('Payment logged! Due date advanced to next month.');
    },
    onError: () => toast.error('Failed to log payment'),
  });

  const getUrgency = (dueDateStr: string) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const dDate = new Date(dueDateStr);
    dDate.setHours(0,0,0,0);
    const diffDays = Math.ceil((dDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { label: 'Overdue!', color: 'destructive' };
    if (diffDays <= 3) return { label: \`Due in \${diffDays} days\`, color: 'destructive' };
    if (diffDays <= 7) return { label: \`Due in \${diffDays} days\`, color: 'amber-500' };
    return { label: \`Due in \${diffDays} days\`, color: 'primary' };
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payment Tracker</h1>
          <p className="text-muted-foreground">Log your monthly payments to silence automatic SMS/Email alerts.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
             <CalendarDays className="w-4 h-4 text-indigo-500" /> Upcoming EMIs
          </CardTitle>
          <CardDescription>
            Marking a debt as paid will deduct the EMI from your total and advance the due date by 1 month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-20" />)}</div>
          ) : debts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">No active debts to track. Add some debts on the My Debts page!</div>
          ) : (
            <div className="space-y-4">
              {debts.map((debt: any) => {
                const urgency = getUrgency(debt.dueDate);
                return (
                  <div key={debt.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-card/50 glass-panel gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-muted rounded-full text-foreground shrink-0">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-base font-semibold flex items-center gap-2">
                          {debt.name} 
                          <span className={\`text-xs px-2 py-0.5 rounded-full bg-\${urgency.color}/10 text-\${urgency.color}\`}>
                            {urgency.label}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                          <span>EMI: ₹{debt.emiAmount?.toLocaleString() || debt.outstanding.toLocaleString()}</span>
                          <span>•</span>
                          <span>Remaining Balance: ₹{debt.outstanding.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="shrink-0 hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors"
                      onClick={() => payDebt.mutate(debt.id)}
                      disabled={payDebt.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Mark as Paid
                    </Button>
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

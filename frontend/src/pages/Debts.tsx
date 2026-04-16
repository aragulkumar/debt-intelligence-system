import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, CreditCard, Calendar, Percent, IndianRupee } from 'lucide-react';
import { toast } from 'sonner';

const DEBT_TYPES = [
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'PERSONAL_LOAN', label: 'Personal Loan' },
  { value: 'BNPL', label: 'Buy Now Pay Later' },
  { value: 'MORTGAGE', label: 'Mortgage' },
  { value: 'AUTO_LOAN', label: 'Auto Loan' },
  { value: 'STUDENT_LOAN', label: 'Student Loan' },
];

const TYPE_COLORS: Record<string, string> = {
  CREDIT_CARD: 'bg-red-500/10 text-red-500 border-red-500/20',
  PERSONAL_LOAN: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  BNPL: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  MORTGAGE: 'bg-green-500/10 text-green-500 border-green-500/20',
  AUTO_LOAN: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  STUDENT_LOAN: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
};

const DEFAULT_FORM = { name: '', type: 'CREDIT_CARD', outstanding: '', emiAmount: '', interestRate: '', dueDate: new Date().toISOString().split('T')[0] };

export default function Debts() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);

  const { data: debts = [], isLoading } = useQuery({
    queryKey: ['debts'],
    queryFn: async () => (await api.get('/debts')).data,
  });

  const addDebt = useMutation({
    mutationFn: async () => await api.post('/debts', {
      ...form,
      outstanding: Number(form.outstanding),
      emiAmount: Number(form.emiAmount),
      interestRate: Number(form.interestRate),
      dueDate: new Date(form.dueDate).toISOString(),
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['health-score'] });
      setOpen(false);
      setForm(DEFAULT_FORM);
      toast.success('Debt account added!');
    },
    onError: () => toast.error('Failed to add debt'),
  });

  const deleteDebt = useMutation({
    mutationFn: async (id: string) => await api.delete(`/debts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['debts'] });
      queryClient.invalidateQueries({ queryKey: ['health-score'] });
      toast.success('Debt removed');
    },
  });

  const totalOutstanding = debts.reduce((s: number, d: any) => s + (d.outstanding || 0), 0);

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Debts</h1>
          <p className="text-muted-foreground">Manage your credit cards, loans, and BNPL accounts.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Account
        </Button>
      </div>

      {/* Summary */}
      {debts.length > 0 && (
        <Card className="border-indigo-500/20 bg-indigo-500/5">
          <CardContent className="pt-4 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Total Outstanding</p>
              <p className="text-2xl font-bold text-indigo-500">₹{totalOutstanding.toLocaleString()}</p>
            </div>
            <div className="flex gap-3">
              {DEBT_TYPES.map(t => {
                const count = debts.filter((d: any) => d.type === t.value).length;
                if (!count) return null;
                return <div key={t.value} className="text-center"><p className="text-lg font-bold">{count}</p><p className="text-xs text-muted-foreground">{t.label}</p></div>;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Debt Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-52" />)}
        </div>
      ) : debts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <CreditCard className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="font-medium">No debt accounts yet</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Add your first account to start tracking and optimising your debt</p>
            <Button onClick={() => setOpen(true)} variant="outline"><Plus className="w-4 h-4 mr-2" /> Add Account</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {debts.map((debt: any) => (
            <Card key={debt.id} className="card-hover group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className={`text-xs mb-2 ${TYPE_COLORS[debt.type] || ''}`}>
                      {DEBT_TYPES.find(t => t.value === debt.type)?.label || debt.type}
                    </Badge>
                    <CardTitle className="text-base">{debt.name}</CardTitle>
                  </div>
                  <Button
                    variant="ghost" size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteDebt.mutate(debt.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><IndianRupee className="w-3 h-3" />Outstanding</span>
                  <span className="font-semibold text-red-500">₹{debt.outstanding.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><IndianRupee className="w-3 h-3" />Monthly EMI</span>
                  <span className="font-medium">₹{(debt.emiAmount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><Percent className="w-3 h-3" />Interest Rate</span>
                  <span className="font-medium">{debt.interestRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />Due Date</span>
                  <span className="font-medium">{new Date(debt.dueDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Debt Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Debt Account</DialogTitle>
            <DialogDescription>Enter the details of your credit card, loan, or BNPL account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Account Name</Label>
              <Input placeholder="e.g. HDFC Credit Card" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Account Type</Label>
              <Select value={form.type} onValueChange={val => setForm({ ...form, type: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEBT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Outstanding (₹)</Label>
                <Input type="number" min={0} placeholder="e.g. 50000" value={form.outstanding} onChange={e => setForm({ ...form, outstanding: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Monthly EMI (₹)</Label>
                <Input type="number" min={0} placeholder="e.g. 2000" value={form.emiAmount} onChange={e => setForm({ ...form, emiAmount: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Interest Rate (%)</Label>
                <Input type="number" min={0} step="0.1" placeholder="e.g. 18.5" value={form.interestRate} onChange={e => setForm({ ...form, interestRate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Next Due Date</Label>
                <Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => addDebt.mutate()} disabled={addDebt.isPending || !form.name}>
              {addDebt.isPending ? 'Saving...' : 'Add Account'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

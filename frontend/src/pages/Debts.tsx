import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

export default function Debts() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'CREDIT_CARD', outstanding: 1000, emiAmount: 100, interestRate: 15, dueDate: new Date().toISOString().split('T')[0] });

  const { data: debts = [], isLoading } = useQuery({ queryKey: ['debts'], queryFn: async () => (await api.get('/debts')).data });

  const addDebt = useMutation({
    mutationFn: async (newDebt: any) => await api.post('/debts', { ...newDebt, dueDate: new Date(newDebt.dueDate).toISOString() }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['debts'] }); setShowModal(false); toast.success('Debt added successfully'); },
  });

  const deleteDebt = useMutation({
    mutationFn: async (id: string) => await api.delete(`/debts/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['debts'] }); toast.success('Debt removed'); },
  });

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); addDebt.mutate(form); };

  if (isLoading) return <p className="text-secondary fade-in">Loading your debts...</p>;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">My Debts</h2>
          <p className="text-secondary mt-1">Manage your active credit cards, loans, and BNPL accounts.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus className="w-4 h-4" /> Add Debt</button>
      </div>

      <div className="grid-3">
        {debts.map((debt: any) => (
          <div key={debt.id} className="card relative overflow-hidden group">
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => deleteDebt.mutate(debt.id)} className="p-1.5 text-red-500 bg-red-500/10 rounded hover:bg-red-500/20"><Trash2 className="w-4 h-4" /></button>
            </div>
            <div className="mb-4">
              <span className="badge badge-purple mb-2">{debt.type.replace('_', ' ')}</span>
              <h3 className="font-bold text-lg">{debt.name}</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between"><span className="text-secondary">Outstanding</span><span className="font-medium text-red-500">₹{debt.outstanding.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-secondary">Monthly EMI</span><span className="font-medium">₹{debt.emiAmount?.toLocaleString() || 0}</span></div>
              <div className="flex justify-between"><span className="text-secondary">Interest Rate</span><span className="font-medium">{debt.interestRate}%</span></div>
              <div className="flex justify-between"><span className="text-secondary">Due Date</span><span className="font-medium">{new Date(debt.dueDate).toLocaleDateString()}</span></div>
            </div>
          </div>
        ))}
        {debts.length === 0 && (
          <div className="col-span-full card border-dashed p-12 text-center text-secondary">
            No debts added yet. Start tracking your liabilities to get insights!
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center fade-in">
          <div className="card w-full max-w-md max-h-[90vh] overflow-y-auto m-4">
            <h2 className="text-xl font-bold mb-4">Add New Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="label">Account Name</label><input type="text" className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. HDFC Credit Card" /></div>
              <div>
                <label className="label">Type</label>
                <select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="CREDIT_CARD">Credit Card</option><option value="PERSONAL_LOAN">Personal Loan</option><option value="BNPL">Buy Now Pay Later (BNPL)</option><option value="MORTGAGE">Mortgage</option>
                </select>
              </div>
              <div><label className="label">Outstanding Amount (₹)</label><input type="number" className="input" required min={0} value={form.outstanding} onChange={e => setForm({...form, outstanding: +e.target.value})} /></div>
              <div><label className="label">Monthly EMI (₹)</label><input type="number" className="input" required min={0} value={form.emiAmount} onChange={e => setForm({...form, emiAmount: +e.target.value})} /></div>
              <div><label className="label">Interest Rate (%)</label><input type="number" className="input" required min={0} step="0.1" value={form.interestRate} onChange={e => setForm({...form, interestRate: +e.target.value})} /></div>
              <div><label className="label">Next Due Date</label><input type="date" className="input" required value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} /></div>
              <div className="flex gap-3 pt-4">
                <button type="button" className="btn btn-ghost flex-1 justify-center" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary flex-1 justify-center" disabled={addDebt.isPending}>{addDebt.isPending ? 'Saving...' : 'Save Debt'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { toast } from 'sonner';
import { User, DollarSign, Save } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get('/auth/me')).data,
  });

  const [form, setForm] = useState({ name: '', monthlyIncome: 0, phone: '' });

  React.useEffect(() => {
    if (profile) setForm({ name: profile.name || '', monthlyIncome: profile.monthlyIncome || 0, phone: profile.phone || '' });
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async () => (await api.put('/settings/profile', form)).data,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['me'] }); toast.success('Profile updated!'); },
    onError: () => toast.error('Failed to update profile'),
  });

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-secondary mt-1">Manage your account and preferences.</p>
      </div>

      <div className="card max-w-lg space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2"><User className="w-5 h-5 text-indigo-500" /> Profile</h3>

        <div>
          <label className="label">Full Name</label>
          <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
        </div>

        <div>
          <label className="label">Email Address</label>
          <input className="input" value={user?.email || ''} disabled style={{ opacity: 0.5 }} />
          <p className="text-xs text-muted mt-1">Email cannot be changed.</p>
        </div>

        <div>
          <label className="label">Phone Number</label>
          <input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 99999 99999" />
        </div>

        <div>
          <label className="label flex items-center gap-2"><DollarSign className="w-4 h-4" /> Monthly Income (₹)</label>
          <input type="number" className="input" min={0} value={form.monthlyIncome} onChange={e => setForm({ ...form, monthlyIncome: +e.target.value })} placeholder="e.g. 50000" />
          <p className="text-xs text-muted mt-1">Used to calculate DTI ratio and repayment strategies.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => updateProfile.mutate()}
          disabled={updateProfile.isPending}
        >
          <Save className="w-4 h-4" />
          {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { User, DollarSign, Phone, Save, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', monthlyIncome: '', phone: '' });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get('/auth/me')).data,
  });

  useEffect(() => {
    if (profile) setForm({
      name: profile.name || '',
      monthlyIncome: profile.monthlyIncome?.toString() || '',
      phone: profile.phone || '',
    });
  }, [profile]);

  const updateProfile = useMutation({
    mutationFn: async () => await api.put('/settings/profile', {
      name: form.name,
      monthlyIncome: Number(form.monthlyIncome) || 0,
      phone: form.phone,
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['me'] }); toast.success('Profile updated!'); },
    onError: () => toast.error('Failed to update profile'),
  });

  if (isLoading) return (
    <div className="space-y-6 fade-in max-w-lg">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-64" />
    </div>
  );

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account details and financial preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-3xl">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" /> Profile
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={user?.email || ''} disabled className="opacity-60" />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> Phone Number
              </Label>
              <Input id="phone" placeholder="+91 99999 99999" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        {/* Financial Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" /> Financial Info
            </CardTitle>
            <CardDescription>Used to calculate DTI ratio and repayment strategies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="income">Monthly Income (₹)</Label>
              <Input
                id="income"
                type="number"
                min={0}
                placeholder="e.g. 75000"
                value={form.monthlyIncome}
                onChange={e => setForm({ ...form, monthlyIncome: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Your monthly take-home income after taxes.
              </p>
            </div>

            <Separator />

            <div className="p-3 rounded-lg bg-muted text-xs text-muted-foreground space-y-1">
              <p className="flex items-center gap-1"><Lock className="w-3 h-3" /> Your data is encrypted and never shared.</p>
              <p>Used only for personalised ML-powered debt analysis.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={() => updateProfile.mutate()}
        disabled={updateProfile.isPending}
        className="flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </div>
  );
}

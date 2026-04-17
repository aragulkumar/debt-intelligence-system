import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Zap, Plus, Trash2, Mail, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function Triggers() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [triggerType, setTriggerType] = useState('EMI_DUE');
  const [threshold, setThreshold] = useState('3');
  const [action, setAction] = useState('EMAIL');

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['triggers'],
    queryFn: async () => (await api.get('/triggers')).data,
  });

  const createTrigger = useMutation({
    mutationFn: async (newTrigger: any) => (await api.post('/triggers', newTrigger)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triggers'] });
      setShowForm(false);
      toast.success('Smart Trigger created!');
    },
    onError: () => toast.error('Failed to create trigger'),
  });

  const deleteTrigger = useMutation({
    mutationFn: async (id: string) => (await api.delete(`/triggers/${id}`)).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['triggers'] });
      toast.success('Trigger deleted');
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createTrigger.mutate({ trigger: triggerType, threshold: Number(threshold), action });
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Smart Triggers</h1>
          <p className="text-muted-foreground">Automate real-world SMS and Email alerts for your debts.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" /> New Trigger
        </Button>
      </div>

      {showForm && (
        <Card className="border-indigo-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-500" /> Create Automation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">IF condition</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={triggerType} onChange={e => setTriggerType(e.target.value)}>
                    <option className="bg-background" value="EMI_DUE">EMI Due Date is within</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Threshold (Days)</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={threshold} onChange={e => setThreshold(e.target.value)}>
                    <option className="bg-background" value="7">7 Days</option>
                    <option className="bg-background" value="3">3 Days</option>
                    <option className="bg-background" value="1">1 Day</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">THEN action</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={action} onChange={e => setAction(e.target.value)}>
                    <option className="bg-background" value="EMAIL">Send Email</option>
                    <option className="bg-background" value="SMS">Send SMS</option>
                    <option className="bg-background" value="EMAIL_SMS">Send Both</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" disabled={createTrigger.isPending}>Save Trigger</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Triggers List */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-3">{[1,2].map(i => <Skeleton key={i} className="h-14" />)}</div>
          ) : rules.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">No automations currently active. Create one to get started!</div>
          ) : (
            <div className="space-y-3">
              {rules.map((rule: any) => (
                <div key={rule.id} className="flex items-center justify-between p-4 rounded-xl border bg-card/50 glass-panel">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted rounded-full text-foreground shrink-0">
                      {rule.action.includes('SMS') ? <MessageSquare className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold flex items-center gap-2">
                        IF <Badge variant="secondary">{rule.trigger.replace('_', ' ')}</Badge> is ≤ {rule.threshold} days
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        THEN dispatch {rule.action.replace('_', ' and ')} alert.
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteTrigger.mutate(rule.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

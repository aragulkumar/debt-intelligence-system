import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldAlert, PlayCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function Rules() {
  const [evalResult, setEvalResult] = useState<any>(null);

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['rules'],
    queryFn: async () => (await api.get('/rules')).data,
  });

  const runEngine = useMutation({
    mutationFn: async () => (await api.post('/rules/evaluate')).data,
    onSuccess: (data) => { setEvalResult(data); toast.success(`Engine ran — ${data.triggered?.length || 0} rule(s) triggered`); },
    onError: () => toast.error('Failed to run rules engine'),
  });

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rules Engine</h1>
          <p className="text-muted-foreground">Automated alerts and triggers based on your debt profile.</p>
        </div>
        <Button onClick={() => runEngine.mutate()} disabled={runEngine.isPending}>
          <PlayCircle className="w-4 h-4 mr-2" />
          {runEngine.isPending ? 'Running...' : 'Run Engine Now'}
        </Button>
      </div>

      {/* Evaluation Result */}
      {evalResult && (
        <Card className={`border-${evalResult.triggered?.length > 0 ? 'amber' : 'green'}-500/30 bg-${evalResult.triggered?.length > 0 ? 'amber' : 'green'}-500/5`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              {evalResult.triggered?.length > 0
                ? <AlertTriangle className="w-4 h-4 text-amber-500" />
                : <CheckCircle className="w-4 h-4 text-green-500" />}
              Engine Evaluation Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Evaluated <span className="font-medium text-foreground">{evalResult.evaluated}</span> rules · <span className="font-medium text-foreground">{evalResult.triggered?.length || 0}</span> triggered
            </p>
            {evalResult.triggered?.map((t: any, i: number) => (
              <div key={i} className="p-2 rounded-lg bg-amber-500/10 text-sm flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                <span>{t.message}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Rules List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-500" /> Active Rules
          </CardTitle>
          <CardDescription>{rules.length} rule{rules.length !== 1 ? 's' : ''} configured</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-14" />)}</div>
          ) : rules.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground text-sm">No rules configured yet.</div>
          ) : (
            <div className="space-y-2">
              {rules.map((rule: any) => (
                <div key={rule.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                  <div>
                    <p className="text-sm font-medium">{rule.name}</p>
                    <p className="text-xs text-muted-foreground">{rule.description}</p>
                  </div>
                  <Badge variant={rule.isActive ? 'default' : 'secondary'} className="shrink-0">
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

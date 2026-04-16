import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export default function Rules() {
  const { data: rules = [] } = useQuery({ queryKey: ['rules'], queryFn: async () => (await api.get('/rules')).data });
  const [evalLog, setEvalLog] = useState<any>(null);

  const testEngine = async () => {
    const { data } = await api.post('/rules/evaluate');
    setEvalLog(data);
  };

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <div><h2 className="text-2xl font-bold">Rules Engine</h2><p className="text-secondary mt-1">Configure automated alerts.</p></div>
        <button onClick={testEngine} className="btn btn-primary">Run Engine</button>
      </div>
      <div className="card">
        {evalLog && (
          <div className="mb-4 p-4 rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-200">
            Engine evaluated {evalLog.evaluated} rules. Triggered: {evalLog.triggered.length}
            <ul className="list-disc pl-5 mt-2 text-sm">{evalLog.triggered.map((t: any, i: number) => <li key={i}>{t.message}</li>)}</ul>
          </div>
        )}
        <p className="text-secondary">Currently tracking {rules.length} active rules.</p>
      </div>
    </div>
  );
}

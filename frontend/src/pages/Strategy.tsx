import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import { Calculator } from 'lucide-react';

export default function Strategy() {
  const [strategy, setStrategy] = useState('hybrid');
  const [extraPayment, setExtraPayment] = useState(0);

  const { data: order = [], isLoading, mutate } = useMutation({
    mutationFn: async () => (await api.post('/repayment/strategy', { strategy, extraMonthlyPayment: extraPayment })).data.order,
  });

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Repayment Strategy</h2>
          <p className="text-secondary mt-1">Optimize your payoff plan.</p>
        </div>
      </div>
      <div className="grid-2">
        <div className="card space-y-4">
          <h3 className="font-medium text-lg">Configure Simulator</h3>
          <div>
            <label className="label">Algorithm</label>
            <select className="input" value={strategy} onChange={e => setStrategy(e.target.value)}>
              <option value="avalanche">Avalanche (Highest Interest First)</option>
              <option value="snowball">Snowball (Lowest Balance First)</option>
              <option value="hybrid">Hybrid (AI Optimized)</option>
            </select>
          </div>
          <div>
            <label className="label">Extra Monthly Payment (₹)</label>
            <input type="number" className="input" value={extraPayment} onChange={e => setExtraPayment(+e.target.value)} />
          </div>
          <button className="btn btn-primary w-full justify-center" onClick={() => mutate()}><Calculator className="w-4 h-4"/> Calculate Plan</button>
        </div>
        <div className="card space-y-4">
          <h3 className="font-medium text-lg">Recommended Order</h3>
          {isLoading ? <p className="text-secondary">Simulating...</p> : (
            order.length ? order.map((d: any) => (
              <div key={d.id} className="p-3 bg-elevated border border-border rounded flex justify-between items-center">
                <div><span className="badge badge-blue mr-2">#{d.priority}</span> <span className="font-medium">{d.name}</span></div>
                {d.suggestedExtra > 0 ? <span className="text-green-500 font-medium">+₹{d.suggestedExtra}</span> : <span className="text-secondary">Minimum</span>}
              </div>
            )) : <p className="text-secondary">Run the simulator to view your plan.</p>
          )}
        </div>
      </div>
    </div>
  );
}

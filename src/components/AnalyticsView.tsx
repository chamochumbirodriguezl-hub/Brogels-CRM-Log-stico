import React from 'react';
import { BarChart3, TrendingUp, Building2, Users, MapPin, Award } from 'lucide-react';
import { Lead, STAGES } from '../types/crm';
import { COMMERCIAL_AGENTS } from '../data/mockData';

interface AnalyticsViewProps {
  leads: Lead[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ leads }) => {
  const totalVolume = leads.reduce((acc, curr) => acc + (Number(curr.volumenCbm) || 0), 0);
  const totalVenta = leads.reduce((acc, curr) => acc + (Number(curr.precioVenta) || 0), 0);
  const totalProfit = leads.reduce((acc, curr) => acc + (Number(curr.profit) || 0), 0);

  // Desglose por empresa
  const brankoLeads = leads.filter(l => l.empresaGrupo === 'Branko');
  const hogelsLeads = leads.filter(l => l.empresaGrupo === 'Hogels');

  const brankoVenta = brankoLeads.reduce((a, b) => a + (Number(b.precioVenta) || 0), 0);
  const brankoProfit = brankoLeads.reduce((a, b) => a + (Number(b.profit) || 0), 0);

  const hogelsVenta = hogelsLeads.reduce((a, b) => a + (Number(b.precioVenta) || 0), 0);
  const hogelsProfit = hogelsLeads.reduce((a, b) => a + (Number(b.profit) || 0), 0);

  // Desglose por etapas (funnel)
  const stageStats = STAGES.map(s => {
    const list = leads.filter(l => l.etapa === s.key);
    const sum = list.reduce((a, b) => a + (Number(b.precioVenta) || 0), 0);
    return {
      stage: s,
      count: list.length,
      sum
    };
  });

  // Performance por comercial
  const agentPerformance = COMMERCIAL_AGENTS.map(agent => {
    const agentLeads = leads.filter(l => l.comercial === agent.nombre);
    const sumVenta = agentLeads.reduce((a, b) => a + (Number(b.precioVenta) || 0), 0);
    const sumProfit = agentLeads.reduce((a, b) => a + (Number(b.profit) || 0), 0);
    const wonCount = agentLeads.filter(l => l.etapa === 'GANADO').length;
    return {
      name: agent.nombre,
      empresa: agent.empresa,
      count: agentLeads.length,
      sumVenta,
      sumProfit,
      wonCount
    };
  }).sort((a, b) => b.sumVenta - a.sumVenta);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      
      {/* HEADER DE RENDIMIENTO */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-red-500" />
            <span>Panel de Analítica y Cierre Comercial</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Métricas consolidadas de rendimiento para Grupo Brogels (Branko Cargo & Hogels Aduanas).
          </p>
        </div>

        <div className="flex items-center space-x-6 text-xs font-mono">
          <div>
            <span className="text-slate-400 block text-[10px]">Facturación Pipeline:</span>
            <span className="text-base font-bold text-white">${totalVenta.toLocaleString()} USD</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Profit Neto Estimado:</span>
            <span className="text-base font-bold text-emerald-400">+${totalProfit.toLocaleString()} USD</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* EMBUDO DE CONVERSIÓN (FUNNEL) */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
              Embudo Comercial por Etapas
            </h3>
            <span className="text-slate-500 text-[11px]">{leads.length} leads totales</span>
          </div>

          <div className="space-y-3 pt-2">
            {stageStats.map(({ stage, count, sum }) => {
              const pct = leads.length > 0 ? (count / leads.length) * 100 : 0;
              return (
                <div key={stage.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-300">{stage.title}</span>
                    <span className="font-mono text-slate-400">
                      {count} operaciones · ${sum.toLocaleString()} USD ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        stage.key === 'GANADO' ? 'bg-emerald-500' :
                        stage.key === 'PERDIDO' ? 'bg-rose-500' :
                        stage.key === 'COTIZADO' ? 'bg-purple-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DISTRIBUCIÓN POR EMPRESA (BRANKO VS HOGELS) */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
            Distribución por Empresa del Grupo
          </h3>

          <div className="grid grid-cols-2 gap-4 pt-2">
            {/* BRANKO CARGO */}
            <div className="bg-slate-900 p-4 rounded-xl border border-red-900/50 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <h4 className="font-bold text-white text-sm">Branko Cargo</h4>
              </div>
              <p className="text-[11px] text-slate-400">Agencia de Carga Internacional</p>
              
              <div className="pt-2 border-t border-slate-800 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Operaciones:</span>
                  <span className="font-bold text-white">{brankoLeads.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Venta Total:</span>
                  <span className="font-bold text-white">${brankoVenta.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Profit Bruto:</span>
                  <span className="font-bold text-emerald-400">+${brankoProfit.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* HOGELS ADUANAS */}
            <div className="bg-slate-900 p-4 rounded-xl border border-indigo-900/50 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <h4 className="font-bold text-white text-sm">Hogels Aduanas</h4>
              </div>
              <p className="text-[11px] text-slate-400">Agenciamiento Aduanal & SLI</p>
              
              <div className="pt-2 border-t border-slate-800 space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Operaciones:</span>
                  <span className="font-bold text-white">{hogelsLeads.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Venta Total:</span>
                  <span className="font-bold text-white">${hogelsVenta.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-[11px]">Profit Bruto:</span>
                  <span className="font-bold text-emerald-400">+${hogelsProfit.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RANKING DE RENDIMIENTO POR EJECUTIVO */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Rendimiento por Ejecutivo Comercial</span>
          </h3>
          <span className="text-slate-500 text-[11px]">Pipeline y ganancias generadas</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Ejecutivo</th>
                <th className="p-3">Empresa</th>
                <th className="p-3">Operaciones</th>
                <th className="p-3">Cierres Ganados</th>
                <th className="p-3 text-right">Pipeline Venta (USD)</th>
                <th className="p-3 text-right">Profit Generado (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {agentPerformance.map(agent => (
                <tr key={agent.name} className="hover:bg-slate-900/50 transition">
                  <td className="p-3 font-bold text-white">{agent.name}</td>
                  <td className="p-3 text-slate-400">{agent.empresa}</td>
                  <td className="p-3 font-mono">{agent.count}</td>
                  <td className="p-3 font-mono text-emerald-400 font-semibold">{agent.wonCount}</td>
                  <td className="p-3 text-right font-mono font-bold text-slate-100">${agent.sumVenta.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400">+${agent.sumProfit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

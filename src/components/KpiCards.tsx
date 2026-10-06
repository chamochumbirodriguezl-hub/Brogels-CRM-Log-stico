import React from 'react';
import { DollarSign, TrendingUp, Box, CheckCircle2 } from 'lucide-react';
import { Lead } from '../types/crm';

interface KpiCardsProps {
  leads: Lead[];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ leads }) => {
  // Calculamos métricas reales basadas en leads actuales
  const totalPipeline = leads.reduce((acc, curr) => acc + (Number(curr.precioVenta) || 0), 0);
  const totalProfit = leads.reduce((acc, curr) => acc + (Number(curr.profit) || 0), 0);
  const totalCbm = leads.reduce((acc, curr) => acc + (Number(curr.volumenCbm) || 0), 0);
  
  const ganadosCount = leads.filter(l => l.etapa === 'GANADO').length;
  const perdidosCount = leads.filter(l => l.etapa === 'PERDIDO').length;
  const totalCerrados = ganadosCount + perdidosCount;
  const tasaCierre = totalCerrados > 0 ? Math.round((ganadosCount / totalCerrados) * 100) : 0;
  
  const avgMargin = totalPipeline > 0 ? ((totalProfit / totalPipeline) * 100).toFixed(1) : '0';

  return (
    <section className="bg-slate-900/60 p-4 border-b border-slate-800/90 grid grid-cols-2 md:grid-cols-4 gap-3.5 shrink-0">
      {/* 1. PIPELINE ACTIVO */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex justify-between items-center">
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Pipeline Activo Total</p>
          <p className="text-lg md:text-xl font-bold font-mono text-white mt-1 tabular-nums">
            ${totalPipeline.toLocaleString('en-US')}
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {leads.length} expedientes registrados
          </p>
        </div>
        <div className="h-9 w-9 bg-indigo-950/80 border border-indigo-800/50 text-indigo-400 rounded-lg flex items-center justify-center">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      {/* 2. PROFIT PROYECTADO */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex justify-between items-center">
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Profit Proyectado (Margen)</p>
          <p className="text-lg md:text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
            +${totalProfit.toLocaleString('en-US')}
          </p>
          <p className="text-[10px] text-emerald-500/80 mt-0.5 font-mono">
            {avgMargin}% margen comercial medio
          </p>
        </div>
        <div className="h-9 w-9 bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* 3. VOLUMEN CBM */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex justify-between items-center">
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Volumen Cotizado (CBM)</p>
          <p className="text-lg md:text-xl font-bold font-mono text-sky-400 mt-1 tabular-nums">
            {totalCbm.toFixed(1)} <span className="text-xs text-sky-300 font-normal">CBM</span>
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            FCL / LCL consolidado
          </p>
        </div>
        <div className="h-9 w-9 bg-sky-950/80 border border-sky-800/50 text-sky-400 rounded-lg flex items-center justify-center">
          <Box className="w-5 h-5" />
        </div>
      </div>

      {/* 4. TASA DE CIERRE GANADO */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex justify-between items-center">
        <div>
          <p className="text-[11px] text-slate-400 font-medium">Efectividad de Cierre</p>
          <p className="text-lg md:text-xl font-bold font-mono text-amber-400 mt-1 tabular-nums">
            {tasaCierre}%
          </p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {ganadosCount} ganados · {perdidosCount} perdidos
          </p>
        </div>
        <div className="h-9 w-9 bg-amber-950/80 border border-amber-800/50 text-amber-400 rounded-lg flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
};

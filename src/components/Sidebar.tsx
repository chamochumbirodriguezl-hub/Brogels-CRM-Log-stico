import React from 'react';
import { 
  LayoutDashboard, 
  TableProperties, 
  Calculator, 
  BarChart3, 
  Ship, 
  Building2, 
  RotateCcw, 
  UserCheck 
} from 'lucide-react';
import { CompanyGroup } from '../types/crm';
import { COMMERCIAL_AGENTS } from '../data/mockData';

interface SidebarProps {
  viewMode: 'kanban' | 'table' | 'quoter' | 'analytics';
  setViewMode: (mode: 'kanban' | 'table' | 'quoter' | 'analytics') => void;
  filterCompany: 'ALL' | CompanyGroup;
  setFilterCompany: (comp: 'ALL' | CompanyGroup) => void;
  selectedAgent: string;
  setSelectedAgent: (agent: string) => void;
  onResetData: () => void;
  leadCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  viewMode,
  setViewMode,
  filterCompany,
  setFilterCompany,
  selectedAgent,
  setSelectedAgent,
  onResetData,
  leadCount
}) => {
  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen select-none">
      <div className="flex flex-col overflow-y-auto">
        {/* BRANDING: BROGELS CRM */}
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-red-950/50">
              <Ship className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-wider text-white">BROGELS</h1>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">Logistics CRM Engine</p>
            </div>
          </div>

          {/* GRUPO COMERCIAL INFO */}
          <div className="mt-3.5 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>Grupo Comercial:</span>
              <span className="text-red-400 font-bold">Branko, Hogels & Sourcing</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
              <span>Carga, Aduanas & China:</span>
              <span className="text-emerald-400 font-semibold">{leadCount} operaciones</span>
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN PRINCIPAL */}
        <div className="p-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
            Vistas Operativas
          </div>
          <nav className="space-y-1">
            <button 
              onClick={() => setViewMode('kanban')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'kanban' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Pipeline Kanban</span>
              </div>
            </button>

            <button 
              onClick={() => setViewMode('table')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'table' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <TableProperties className="w-4 h-4" />
                <span>Lista de Leads</span>
              </div>
            </button>

            <button 
              onClick={() => setViewMode('quoter')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'quoter' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Calculator className="w-4 h-4" />
                <span>Cotizador Rápido</span>
              </div>
            </button>

            <button 
              onClick={() => setViewMode('analytics')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'analytics' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-950/40' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <BarChart3 className="w-4 h-4" />
                <span>Métricas & Cierre</span>
              </div>
            </button>
          </nav>
        </div>

        {/* FILTROS POR EMPRESA OPERATIVA */}
        <div className="p-3 border-t border-slate-800/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1 flex items-center justify-between">
            <span>Filtro por Empresa</span>
            <Building2 className="w-3.5 h-3.5" />
          </div>

          <div className="mt-2 space-y-1">
            <button
              onClick={() => setFilterCompany('ALL')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                filterCompany === 'ALL'
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
              }`}
            >
              <span>Todo el Grupo (Brogels)</span>
              {filterCompany === 'ALL' && <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>}
            </button>

            <button
              onClick={() => setFilterCompany('Branko')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                filterCompany === 'Branko'
                  ? 'bg-red-950/70 border border-red-800/60 text-red-200 font-semibold'
                  : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span>Branko Cargo (Fletes)</span>
              </div>
            </button>

            <button
              onClick={() => setFilterCompany('Hogels')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                filterCompany === 'Hogels'
                  ? 'bg-indigo-950/70 border border-indigo-800/60 text-indigo-200 font-semibold'
                  : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                <span>Hogels Aduanas</span>
              </div>
            </button>

            <button
              onClick={() => setFilterCompany('Compras Internacionales')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                filterCompany === 'Compras Internacionales'
                  ? 'bg-amber-950/70 border border-amber-800/60 text-amber-200 font-semibold'
                  : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Compras Internacionales (China)</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER DEL SIDEBAR: USUARIO COMERCIAL Y RESET */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
        <div>
          <label className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
            <span>Ejecutivo en Turno:</span>
            <UserCheck className="w-3 h-3 text-slate-400" />
          </label>
          <select 
            value={selectedAgent} 
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg text-xs p-2 text-slate-200 focus:outline-none focus:border-red-500"
          >
            <option value="ALL">Todos los Ejecutivos</option>
            {COMMERCIAL_AGENTS.map(agent => (
              <option key={agent.nombre} value={agent.nombre}>
                {agent.nombre} ({agent.empresa})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center space-x-2">
            <div className="h-7 w-7 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center font-bold text-xs text-red-400">
              YV
            </div>
            <div className="text-[11px] leading-tight">
              <p className="font-semibold text-slate-200">Yuri Vega</p>
              <p className="text-slate-400 text-[10px]">Broker Logístico</p>
            </div>
          </div>

          <button 
            onClick={onResetData}
            title="Restablecer datos de muestra"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

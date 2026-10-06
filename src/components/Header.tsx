import React from 'react';
import { Plus, Download, Search, RefreshCw } from 'lucide-react';
import { CompanyGroup } from '../types/crm';

interface HeaderProps {
  viewMode: 'kanban' | 'table' | 'quoter' | 'analytics';
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  onOpenNewModal: () => void;
  onExportCsv: () => void;
  filterCompany: 'ALL' | CompanyGroup;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  searchTerm,
  setSearchTerm,
  onOpenNewModal,
  onExportCsv,
  filterCompany
}) => {
  const getTitle = () => {
    switch (viewMode) {
      case 'kanban':
        return 'Pipeline Logístico Comercial';
      case 'table':
        return 'Cartera de Operaciones & Leads';
      case 'quoter':
        return 'Cotizador de Tarifas FCL / LCL / Aduanas';
      case 'analytics':
        return 'Rendimiento y Métricas de Cierre';
      default:
        return 'CRM Logístico Brogels';
    }
  };

  const getSubtitle = () => {
    const companyLabel = 
      filterCompany === 'ALL' 
        ? 'Grupo Brogels (Branko, Hogels & Compras Internacionales)' 
        : filterCompany === 'Branko' 
          ? 'Branko Cargo (Fletes Marítimos y Aéreos)' 
          : filterCompany === 'Hogels'
            ? 'Hogels Aduanas (Agenciamiento de Aduanas y SLI)'
            : 'Compras Internacionales & Sourcing en China (Maquinaria Pesada)';
    return companyLabel;
  };

  return (
    <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
      <div>
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {getTitle()}
          </h2>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-medium text-slate-400">
            {getSubtitle()}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Control de fletes, vistas aduaneras, costeo de compra/venta y margen de profit en tiempo real.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* BUSCADOR RÁPIDO */}
        <div className="relative w-56 md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar cliente, RUC, POL, POD..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* EXPORTAR CSV */}
        <button
          onClick={onExportCsv}
          className="flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold transition"
          title="Descargar reporte en Excel / CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Exportar CSV</span>
        </button>

        {/* BOTÓN NUEVO LEAD */}
        <button
          onClick={onOpenNewModal}
          className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg text-xs font-bold shadow-lg shadow-red-950/50 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nuevo Lead Logístico</span>
        </button>
      </div>
    </header>
  );
};

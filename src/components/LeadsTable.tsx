import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  FileText,
  Filter,
  Ship,
  Plane,
  Truck
} from 'lucide-react';
import { Lead, LeadStage, ServiceType, STAGES } from '../types/crm';

interface LeadsTableProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onMoveStage: (leadId: string, newStage: LeadStage) => void;
}

type SortField = 'fecha' | 'cliente' | 'precioVenta' | 'profit' | 'volumenCbm';

export const LeadsTable: React.FC<LeadsTableProps> = ({
  leads,
  onSelectLead,
  onEditLead,
  onDeleteLead,
  onMoveStage
}) => {
  const [sortField, setSortField] = useState<SortField>('fecha');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [filterStage, setFilterStage] = useState<string>('ALL');
  const [filterService, setFilterService] = useState<string>('ALL');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending
    }
  };

  const processedLeads = useMemo(() => {
    return leads
      .filter((l) => (filterStage === 'ALL' ? true : l.etapa === filterStage))
      .filter((l) => (filterService === 'ALL' ? true : l.servicio === filterService))
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          return sortAsc
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }

        return sortAsc ? (Number(valA) - Number(valB)) : (Number(valB) - Number(valA));
      });
  }, [leads, filterStage, filterService, sortField, sortAsc]);

  const getStageBadge = (etapa: LeadStage) => {
    const stage = STAGES.find(s => s.key === etapa);
    return (
      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${stage?.badgeBg || 'bg-slate-800 text-slate-300'}`}>
        {stage?.title || etapa}
      </span>
    );
  };

  return (
    <div className="bg-slate-950 rounded-xl border border-slate-800 flex flex-col h-full overflow-hidden">
      {/* BARRA DE FILTROS RÁPIDOS */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium">Filtrar tabla:</span>

          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-red-500"
          >
            <option value="ALL">Todas las Etapas ({leads.length})</option>
            {STAGES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.title}
              </option>
            ))}
          </select>

          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-red-500"
          >
            <option value="ALL">Todos los Servicios</option>
            <option value="SLI">SLI (Carga + Aduana)</option>
            <option value="Carga">Carga Internacional</option>
            <option value="Aduana">Aduanas</option>
          </select>
        </div>

        <div className="text-slate-400 font-mono text-[11px]">
          Mostrando <strong className="text-white">{processedLeads.length}</strong> de {leads.length} leads
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800 sticky top-0 z-10 backdrop-blur-sm">
            <tr>
              <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('fecha')}>
                <div className="flex items-center space-x-1">
                  <span>ID / Fecha</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('cliente')}>
                <div className="flex items-center space-x-1">
                  <span>Cliente / RUC</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5">Empresa</th>
              <th className="p-3.5">Servicio / Incoterm</th>
              <th className="p-3.5">Ruta (POL ➔ POD)</th>
              <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('volumenCbm')}>
                <div className="flex items-center space-x-1">
                  <span>Carga & CBM</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5">Etapa Actual</th>
              <th className="p-3.5 text-right cursor-pointer hover:text-white" onClick={() => handleSort('precioVenta')}>
                <div className="flex items-center justify-end space-x-1">
                  <span>Venta USD</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5 text-right cursor-pointer hover:text-white" onClick={() => handleSort('profit')}>
                <div className="flex items-center justify-end space-x-1">
                  <span>Profit USD</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="p-3.5">Comercial</th>
              <th className="p-3.5 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {processedLeads.length === 0 ? (
              <tr>
                <td colSpan={11} className="p-8 text-center text-slate-500">
                  No se encontraron operaciones con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              processedLeads.map((item) => {
                const marginPct =
                  item.precioVenta > 0
                    ? ((item.profit / item.precioVenta) * 100).toFixed(0)
                    : '0';

                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-slate-900/60 transition group cursor-pointer"
                    onClick={() => onSelectLead(item)}
                  >
                    <td className="p-3.5">
                      <p className="font-mono font-bold text-slate-200">{item.id}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{item.fecha}</p>
                    </td>

                    <td className="p-3.5 max-w-[200px]">
                      <p className="font-bold text-slate-100 group-hover:text-red-400 transition truncate">
                        {item.cliente}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        RUC: {item.ruc}
                      </p>
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.empresaGrupo === 'Branko'
                            ? 'bg-red-950/80 text-red-300 border border-red-800/60'
                            : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60'
                        }`}
                      >
                        {item.empresaGrupo}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className="font-semibold text-slate-200">{item.servicio}</span>
                      <span className="text-slate-500 mx-1">·</span>
                      <span className="font-mono text-slate-400 font-bold">{item.incoterm}</span>
                    </td>

                    <td className="p-3.5 font-mono text-[11px]">
                      <div className="flex items-center space-x-1 text-slate-300">
                        <span className="truncate max-w-[90px]">{item.pol}</span>
                        <span className="text-slate-600">➔</span>
                        <span className="truncate max-w-[90px]">{item.pod}</span>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-[11px]">
                      <p className="text-slate-200">{item.volumenCbm} CBM</p>
                      <p className="text-[10px] text-slate-400">{item.equipos}</p>
                    </td>

                    <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={item.etapa}
                        onChange={(e) => onMoveStage(item.id, e.target.value as LeadStage)}
                        className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-[11px] font-semibold text-slate-200 focus:outline-none focus:border-red-500"
                      >
                        {STAGES.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.title}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-3.5 text-right font-mono font-bold text-slate-100 tabular-nums">
                      ${Number(item.precioVenta || 0).toLocaleString()}
                    </td>

                    <td className="p-3.5 text-right font-mono tabular-nums">
                      <span className="font-bold text-emerald-400">
                        +${Number(item.profit || 0).toLocaleString()}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {marginPct}% margen
                      </p>
                    </td>

                    <td className="p-3.5 text-slate-400">
                      <span className="truncate block max-w-[100px]">{item.comercial}</span>
                    </td>

                    <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onSelectLead(item)}
                          title="Ver cotización y detalle"
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEditLead(item)}
                          title="Editar expediente"
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded transition"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Seguro que deseas eliminar la operación ${item.id} de ${item.cliente}?`)) {
                              onDeleteLead(item.id);
                            }
                          }}
                          title="Eliminar lead"
                          className="p-1.5 hover:bg-rose-950 text-slate-500 hover:text-rose-400 rounded transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

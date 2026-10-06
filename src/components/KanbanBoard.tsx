import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Ship, 
  Plane, 
  Truck, 
  ExternalLink,
  Phone,
  MessageSquare,
  Wrench
} from 'lucide-react';
import { Lead, LeadStage, STAGES } from '../types/crm';

interface KanbanBoardProps {
  leads: Lead[];
  onMoveStage: (leadId: string, newStage: LeadStage) => void;
  onSelectLead: (lead: Lead) => void;
  onCallLead: (lead: Lead) => void;
  onWhatsAppLead: (lead: Lead) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads,
  onMoveStage,
  onSelectLead,
  onCallLead,
  onWhatsAppLead,
}) => {
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const getTransportIcon = (modo: string) => {
    if (modo.includes('Aérea')) return <Plane className="w-3.5 h-3.5 text-sky-400" />;
    if (modo.includes('Terrestre')) return <Truck className="w-3.5 h-3.5 text-amber-400" />;
    return <Ship className="w-3.5 h-3.5 text-blue-400" />;
  };

  const getCompanyBadgeClass = (empresa: string) => {
    if (empresa === 'Branko') {
      return 'bg-red-950/80 text-red-300 border border-red-800/60';
    }
    if (empresa === 'Hogels') {
      return 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60';
    }
    return 'bg-amber-950/80 text-amber-300 border border-amber-800/60';
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    setDraggedLeadId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, stageKey: LeadStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (id) {
      onMoveStage(id, stageKey);
    }
    setDraggedLeadId(null);
  };

  return (
    <div className="grid grid-cols-5 gap-3.5 min-w-[1280px] h-full pb-4 select-none">
      {STAGES.map((stage) => {
        const stageLeads = leads.filter((l) => l.etapa === stage.key);
        const stageTotal = stageLeads.reduce((acc, curr) => acc + (Number(curr.precioVenta) || 0), 0);
        const stageProfit = stageLeads.reduce((acc, curr) => acc + (Number(curr.profit) || 0), 0);

        return (
          <div
            key={stage.key}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.key)}
            className="bg-slate-950/70 rounded-xl border border-slate-800/90 flex flex-col h-full overflow-hidden transition-colors"
          >
            {/* CABECERA DE LA ETAPA */}
            <div className={`p-3 border-b-2 ${stage.colorBorder} bg-slate-900/40`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-200 tracking-wide">
                  {stage.title}
                </h3>
                <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  {stageLeads.length}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Venta: ${stageTotal.toLocaleString('en-US')}</span>
                <span className="text-emerald-400 font-semibold">
                  +${stageProfit.toLocaleString('en-US')}
                </span>
              </div>
            </div>

            {/* LISTA DE TARJETAS */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
              {stageLeads.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-slate-600 text-xs border border-dashed border-slate-800/60 rounded-xl p-3 text-center">
                  <p>Sin expedientes en esta etapa</p>
                  <p className="text-[10px] text-slate-700 mt-1">Arrastra aquí para mover</p>
                </div>
              ) : (
                stageLeads.map((item) => {
                  const marginPct =
                    item.precioVenta > 0
                      ? Math.round((item.profit / item.precioVenta) * 100)
                      : 0;

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onClick={() => onSelectLead(item)}
                      className="bg-slate-900/90 hover:bg-slate-900 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2"
                    >
                      {/* HEADER TARJETA: EMPRESA, ID Y SERVICIO */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getCompanyBadgeClass(item.empresaGrupo)}`}
                          >
                            {item.empresaGrupo === 'Compras Internacionales' ? 'Sourcing China' : item.empresaGrupo}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 font-semibold">
                            {item.servicio}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.id}
                        </span>
                      </div>

                      {/* CLIENTE Y RUC */}
                      <div>
                        <div className="flex items-start justify-between">
                          <h4 className="font-bold text-xs text-slate-100 group-hover:text-red-400 transition leading-snug">
                            {item.cliente}
                          </h4>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-200 shrink-0 mt-0.5 ml-1 transition" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          RUC {item.ruc} {item.contacto ? `· ${item.contacto}` : ''}
                        </p>
                      </div>

                      {/* DATOS DE SOURCING / MAQUINARIA (SI APLICA) */}
                      {item.sourcing && (
                        <div className="bg-amber-950/40 border border-amber-800/50 p-2 rounded-lg text-[10px] space-y-1">
                          <div className="flex items-center justify-between text-amber-300 font-semibold">
                            <span className="flex items-center gap-1">
                              <Wrench className="w-3 h-3 text-amber-400" />
                              <span>{item.sourcing.maquinariaMarca} {item.sourcing.maquinariaModelo}</span>
                            </span>
                            <span className="text-[9px] px-1 py-0.2 bg-amber-900/60 rounded text-amber-200 font-mono">
                              {item.sourcing.estadoSourcing}
                            </span>
                          </div>
                          {item.sourcing.ciudadInspeccion && (
                            <p className="text-slate-400 text-[9px]">
                              Inspección: <strong className="text-slate-300">{item.sourcing.ciudadInspeccion}</strong>
                            </p>
                          )}
                        </div>
                      )}

                      {/* RUTA Y ESPECIFICACIÓN LOGÍSTICA */}
                      <div className="bg-slate-950/80 p-2 rounded-lg text-[11px] space-y-1 text-slate-300 border border-slate-800/60">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                            {getTransportIcon(item.modo)}
                            <span>{item.modo}</span>
                          </span>
                          <span className="font-mono text-[10px] font-bold text-slate-300">
                            {item.incoterm}
                          </span>
                        </div>
                        <div className="flex items-center justify-between font-mono text-[10px] text-slate-300 pt-0.5 border-t border-slate-800/50">
                          <span className="truncate max-w-[85px]" title={item.pol}>
                            {item.pol.split('-')[0].trim()}
                          </span>
                          <span className="text-slate-600">➔</span>
                          <span className="truncate max-w-[85px] text-right" title={item.pod}>
                            {item.pod.split('-')[0].trim()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                          <span>{item.equipos}</span>
                          <span>{item.volumenCbm} CBM · {item.pesoKg.toLocaleString()} kg</span>
                        </div>
                      </div>

                      {/* FINANZAS: VENTA Y PROFIT */}
                      <div className="flex justify-between items-center pt-1 border-t border-slate-800/70">
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider">
                            Venta Total
                          </p>
                          <p className="font-bold font-mono text-xs text-slate-100">
                            ${Number(item.precioVenta || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-slate-400 uppercase tracking-wider">
                            Profit ({marginPct}%)
                          </p>
                          <p className="font-bold font-mono text-xs text-emerald-400">
                            +${Number(item.profit || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* BOTONES DE TELEFONÍA IP Y WHATSAPP INTEGRADOS */}
                      <div 
                        className="flex items-center gap-1.5 pt-1.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => onCallLead(item)}
                          className="flex-1 py-1.5 px-2 bg-blue-950/80 hover:bg-blue-900 border border-blue-800/70 text-blue-200 rounded-lg text-[10px] font-bold transition flex items-center justify-center space-x-1 shadow-xs"
                          title="Iniciar llamada IP / WebRTC con el cliente"
                        >
                          <Phone className="w-3 h-3 text-blue-400" />
                          <span>Llamar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onWhatsAppLead(item)}
                          className="flex-1 py-1.5 px-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/70 text-emerald-200 rounded-lg text-[10px] font-bold transition flex items-center justify-center space-x-1 shadow-xs"
                          title="Abrir chat integrado de WhatsApp Business API"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-400" />
                          <span>WhatsApp</span>
                        </button>
                      </div>

                      {/* COMERCIAL Y CONTROLES DE ETAPA */}
                      <div 
                        className="pt-2 flex items-center justify-between gap-1 border-t border-slate-800/60"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {stage.key !== 'PROSPECCION' && (
                          <button
                            onClick={() => {
                              const prevMap: Record<LeadStage, LeadStage> = {
                                GESTION_INFO: 'PROSPECCION',
                                COTIZADO: 'GESTION_INFO',
                                GANADO: 'COTIZADO',
                                PERDIDO: 'COTIZADO',
                                PROSPECCION: 'PROSPECCION'
                              };
                              onMoveStage(item.id, prevMap[stage.key]);
                            }}
                            className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition"
                            title="Regresar a etapa anterior"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        )}

                        <div className="flex items-center gap-1 ml-auto">
                          {stage.key !== 'COTIZADO' && stage.key !== 'GANADO' && (
                            <button
                              onClick={() => onMoveStage(item.id, 'COTIZADO')}
                              className="px-2 py-0.5 bg-purple-950/70 hover:bg-purple-900 border border-purple-800 text-purple-300 hover:text-white rounded text-[10px] font-semibold transition"
                            >
                              Cotizar
                            </button>
                          )}

                          {stage.key !== 'GANADO' && (
                            <button
                              onClick={() => onMoveStage(item.id, 'GANADO')}
                              className="px-2 py-0.5 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 hover:text-white rounded text-[10px] font-semibold transition flex items-center gap-1"
                              title="Marcar como operación ganada"
                            >
                              <CheckCircle className="w-2.5 h-2.5" />
                              <span>Ganado</span>
                            </button>
                          )}

                          {stage.key !== 'PERDIDO' && stage.key !== 'GANADO' && (
                            <button
                              onClick={() => onMoveStage(item.id, 'PERDIDO')}
                              className="p-1 bg-slate-800 hover:bg-rose-950 hover:text-rose-300 rounded text-slate-400 transition"
                              title="Marcar como perdido"
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

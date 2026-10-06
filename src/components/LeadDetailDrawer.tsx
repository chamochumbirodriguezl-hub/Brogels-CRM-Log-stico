import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  Send, 
  Phone, 
  Mail, 
  Ship, 
  Plane, 
  Truck, 
  Edit3, 
  Trash2, 
  DollarSign, 
  Calendar, 
  MessageSquare, 
  Building2,
  FileCheck2,
  AlertCircle,
  Wrench,
  Clock,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { Lead, LeadStage, STAGES } from '../types/crm';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onMoveStage: (leadId: string, newStage: LeadStage) => void;
  onAddNote: (leadId: string, noteText: string) => void;
  onCallLead?: (lead: Lead) => void;
  onWhatsAppLead?: (lead: Lead) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  onClose,
  onEdit,
  onDelete,
  onMoveStage,
  onAddNote,
  onCallLead,
  onWhatsAppLead
}) => {
  const [activeTab, setActiveTab] = useState<'detalle' | 'proforma' | 'historial'>('detalle');
  const [newNote, setNewNote] = useState('');
  const [copied, setCopied] = useState(false);

  if (!lead) return null;

  const marginPct = lead.precioVenta > 0 
    ? ((lead.profit / lead.precioVenta) * 100).toFixed(1) 
    : '0';

  const handleCopyQuote = () => {
    const text = `
*BROGELS LOGÍSTICA INTEGRAL & SOURCING CHINA*
_Branko Cargo · Hogels Aduanas · Compras Internacionales_
----------------------------------
*Cotización Logística:* ${lead.id}
*Cliente:* ${lead.cliente} (RUC: ${lead.ruc})
*Atención:* ${lead.contacto || 'Dpto. de Compras e Importaciones'}
*Servicio:* ${lead.servicio} (${lead.incoterm})
*Ruta:* ${lead.pol} ➔ ${lead.pod}
*Modo:* ${lead.modo} | ${lead.equipos}
${lead.sourcing ? `*Maquinaria:* ${lead.sourcing.maquinariaMarca} ${lead.sourcing.maquinariaModelo} | ${lead.sourcing.ciudadInspeccion}
*Partida Arancelaria:* ${lead.sourcing.partidaArancelaria || '-'}` : ''}
*Carga:* ${lead.pesoKg.toLocaleString()} kg | ${lead.volumenCbm} CBM

*TARIFA OFERTA:* $${lead.precioVenta.toLocaleString()} USD
- Incluye: ${lead.sourcing ? 'Costo Maquinaria FOB + Flete Branko + Aduanas Hogels + Comisión Sourcing' : `Flete internacional y/o agenciamiento según Incoterm ${lead.incoterm}`}.
- Validez: 15 días calendario o según vigencia naviera.
- Ejecutivo asignado: ${lead.comercial} (${lead.empresaGrupo})
----------------------------------
Gracias por su confianza en Grupo Brogels.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(lead.id, newNote.trim());
    setNewNote('');
  };

  const formatDuration = (secs?: number) => {
    if (!secs) return '';
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-2xl bg-slate-950 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* HEADER DRAWER */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                lead.empresaGrupo === 'Branko'
                  ? 'bg-red-950 text-red-300 border border-red-800'
                  : lead.empresaGrupo === 'Hogels'
                    ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                    : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}
            >
              {lead.empresaGrupo}
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-white">{lead.id}</h3>
                <span className="text-slate-400 font-mono text-xs">({lead.servicio} · {lead.incoterm})</span>
              </div>
              <p className="text-xs text-slate-400 truncate max-w-sm">{lead.cliente}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(lead)}
              className="p-1.5 hover:bg-slate-800 text-slate-300 hover:text-amber-400 rounded-lg transition"
              title="Editar expediente"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`¿Eliminar la operación ${lead.id}?`)) {
                  onDelete(lead.id);
                  onClose();
                }
              }}
              className="p-1.5 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg transition"
              title="Eliminar lead"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEPPER DE ETAPA ACTUAL */}
        <div className="px-5 py-3 bg-slate-900/40 border-b border-slate-800">
          <div className="flex items-center justify-between text-[11px] mb-2">
            <span className="text-slate-400 font-medium">Etapa Comercial Actual:</span>
            <span className="font-bold text-white uppercase">{lead.etapa}</span>
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {STAGES.map((stg) => {
              const isCurrent = lead.etapa === stg.key;
              return (
                <button
                  key={stg.key}
                  onClick={() => onMoveStage(lead.id, stg.key)}
                  className={`text-center py-1.5 px-1 rounded text-[10px] font-bold transition truncate ${
                    isCurrent
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                  title={`Mover a ${stg.title}`}
                >
                  {stg.title.split('.')[1] || stg.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* TABS DE VISTA */}
        <div className="px-5 pt-2 border-b border-slate-800 bg-slate-950 flex space-x-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('detalle')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'detalle'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Ficha Operativa
          </button>
          <button
            onClick={() => setActiveTab('proforma')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'proforma'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Cotización Formal (Proforma)
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'historial'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Bitácora & Llamadas ({lead.historial?.length || 0})
          </button>
        </div>

        {/* CONTENIDO DEL DRAWER */}
        <div className="flex-1 overflow-y-auto p-5 text-xs">
          
          {/* TAB 1: FICHA OPERATIVA */}
          {activeTab === 'detalle' && (
            <div className="space-y-4">
              
              {/* CONTACTO DIRECTO & CLICK-TO-CALL VOIP / WHATSAPP */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-sm text-white">{lead.cliente}</h4>
                  <p className="text-slate-400 text-xs font-mono mt-0.5">RUC: {lead.ruc}</p>
                  <p className="text-slate-300 text-xs mt-1">
                    Contacto: <strong className="text-white">{lead.contacto || 'No especificado'}</strong>
                  </p>
                  <p className="text-red-400 font-mono text-xs font-bold mt-0.5">
                    {lead.telefono || 'Sin teléfono'}
                  </p>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0">
                  {onCallLead && (
                    <button
                      type="button"
                      onClick={() => onCallLead(lead)}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Llamar VoIP</span>
                    </button>
                  )}

                  {onWhatsAppLead && (
                    <button
                      type="button"
                      onClick={() => onWhatsAppLead(lead)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center space-x-1.5 transition shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp API</span>
                    </button>
                  )}
                </div>
              </div>

              {/* SECCIÓN: GESTIÓN DE COMPRA EN ORIGEN (CHINA / SOURCING) */}
              {(lead.sourcing || lead.empresaGrupo === 'Compras Internacionales') && (
                <div className="bg-amber-950/30 p-4 rounded-xl border border-amber-800/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-amber-200 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Wrench className="w-4 h-4 text-amber-400" />
                      <span>Gestión de Compra en Origen (China & Maquinaria)</span>
                    </h5>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-900/60 text-amber-300 border border-amber-700/60">
                      {lead.sourcing?.estadoSourcing || 'Búsqueda Proveedor'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Proveedor / Fábrica en China:</span>
                      <span className="font-bold text-slate-100">{lead.sourcing?.proveedorChina || 'En negociación'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Ciudad / Oficina Inspección:</span>
                      <span className="font-bold text-slate-100">{lead.sourcing?.ciudadInspeccion || 'Shanghai'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Maquinaria (Marca & Modelo):</span>
                      <span className="font-bold text-amber-300">
                        {lead.sourcing?.maquinariaMarca || '-'} {lead.sourcing?.maquinariaModelo || ''}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[11px] block">Partida Arancelaria (HS Code):</span>
                      <span className="font-mono text-slate-200 font-bold">{lead.sourcing?.partidaArancelaria || '-'}</span>
                    </div>
                  </div>

                  {lead.sourcing?.maquinariaEspecificaciones && (
                    <div className="pt-2 border-t border-amber-900/40 text-[11px] text-slate-300">
                      <span className="text-slate-400 block mb-0.5">Especificaciones Técnicas:</span>
                      <p className="bg-slate-950/70 p-2 rounded border border-amber-950">{lead.sourcing.maquinariaEspecificaciones}</p>
                    </div>
                  )}
                </div>
              )}

              {/* RUTA Y CARGA */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <h5 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                  Especificaciones del Envío
                </h5>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Puerto / Origen (POL):</span>
                    <span className="font-mono font-bold text-slate-100">{lead.pol}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Puerto / Destino (POD):</span>
                    <span className="font-mono font-bold text-slate-100">{lead.pod}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Incoterm & Modo:</span>
                    <span className="font-bold text-slate-200">{lead.incoterm} · {lead.modo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Equipos / Bultos:</span>
                    <span className="font-mono text-slate-200">{lead.equipos}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Peso Bruto:</span>
                    <span className="font-mono text-slate-200">{lead.pesoKg.toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Volumen CBM:</span>
                    <span className="font-mono text-slate-200">{lead.volumenCbm} CBM</span>
                  </div>
                </div>
              </div>

              {/* FINANZAS Y PROFIT */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <h5 className="font-bold text-slate-200 text-xs uppercase tracking-wider">
                  Estructura Financiera (USD)
                </h5>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Costo Compra</span>
                    <span className="text-sm font-bold font-mono text-slate-300">
                      ${Number(lead.costoCompra || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Precio Venta</span>
                    <span className="text-sm font-bold font-mono text-white">
                      ${Number(lead.precioVenta || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Profit Comercial</span>
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      +${Number(lead.profit || 0).toLocaleString()} ({marginPct}%)
                    </span>
                  </div>
                </div>

                {lead.costosDesglose && (
                  <div className="mt-2 text-[11px] space-y-1 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-slate-400 font-semibold block mb-1">Costos Directos Desglosados:</span>
                    {lead.costosDesglose.costoMaquinariaFob ? <div className="flex justify-between text-amber-300"><span>Costo Maquinaria FOB:</span><span className="font-mono font-bold">${lead.costosDesglose.costoMaquinariaFob.toLocaleString()}</span></div> : null}
                    {lead.costosDesglose.fleteUsd ? <div className="flex justify-between text-slate-300"><span>Flete Marítimo (Branko):</span><span className="font-mono">${lead.costosDesglose.fleteUsd.toLocaleString()}</span></div> : null}
                    {lead.costosDesglose.gastosLocalesUsd ? <div className="flex justify-between text-slate-300"><span>Gastos Locales / THC:</span><span className="font-mono">${lead.costosDesglose.gastosLocalesUsd.toLocaleString()}</span></div> : null}
                    {lead.costosDesglose.agenciamientoAduanalUsd ? <div className="flex justify-between text-slate-300"><span>Agenciamiento de Aduanas (Hogels):</span><span className="font-mono">${lead.costosDesglose.agenciamientoAduanalUsd.toLocaleString()}</span></div> : null}
                    {lead.costosDesglose.comisionSourcingUsd ? <div className="flex justify-between text-emerald-300"><span>Comisión Sourcing Brogels:</span><span className="font-mono font-bold">+${lead.costosDesglose.comisionSourcingUsd.toLocaleString()}</span></div> : null}
                  </div>
                )}
              </div>

              {/* COMERCIAL Y NOTAS */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs">
                  <span>Ejecutivo Asignado: <strong className="text-slate-200">{lead.comercial}</strong></span>
                  <span>Registrado el: <strong className="text-slate-200">{lead.fecha}</strong></span>
                </div>
                {lead.notas && (
                  <div className="bg-slate-950 p-2.5 rounded-lg text-slate-300 border border-slate-800/70 mt-2">
                    <span className="text-slate-400 font-semibold block mb-0.5">Observaciones:</span>
                    <p>{lead.notas}</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: COTIZACIÓN FORMAL (PROFORMA) */}
          {activeTab === 'proforma' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">
                  Formato de proforma oficial para envío a cliente o impresión.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopyQuote}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copiado' : 'Copiar Texto'}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimir</span>
                  </button>
                </div>
              </div>

              {/* HOJA DE COTIZACIÓN */}
              <div className="bg-white text-slate-900 p-6 rounded-xl shadow-lg space-y-4 border border-slate-300 text-xs print:m-0">
                
                {/* CABECERA MEMBRETADA */}
                <div className="flex justify-between items-start border-b-2 border-red-600 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-950 tracking-wider">GRUPO BROGELS</h2>
                    <p className="text-[11px] font-semibold text-red-600">
                      BRANKO CARGO · HOGELS ADUANAS · COMPRAS INTERNACIONALES
                    </p>
                    <p className="text-[10px] text-slate-500">Av. Elmer Faucett 2851, Callao · Perú</p>
                    <p className="text-[10px] text-slate-500">operaciones@grupobrogels.com</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-800 block">PROFORMA Nº {lead.id}</span>
                    <span className="text-[10px] text-slate-500 block">Fecha: {lead.fecha}</span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                      Unidad: {lead.empresaGrupo}
                    </span>
                  </div>
                </div>

                {/* DATOS DEL CLIENTE */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Cliente / Razón Social</p>
                    <p className="font-bold text-slate-900">{lead.cliente}</p>
                    <p className="font-mono text-slate-600 text-[11px]">RUC: {lead.ruc}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Contacto</p>
                    <p className="font-medium text-slate-900">{lead.contacto || '-'}</p>
                    <p className="text-slate-600 text-[11px]">{lead.telefono || lead.email || '-'}</p>
                  </div>
                </div>

                {/* DETALLE LOGÍSTICO Y MAQUINARIA */}
                <table className="w-full text-left text-[11px] border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-2 border">Incoterm</th>
                      <th className="p-2 border">Origen (POL)</th>
                      <th className="p-2 border">Destino (POD)</th>
                      <th className="p-2 border">Equipo / Carga</th>
                      <th className="p-2 border">Peso / Vol</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border font-bold">{lead.incoterm}</td>
                      <td className="p-2 border">{lead.pol}</td>
                      <td className="p-2 border">{lead.pod}</td>
                      <td className="p-2 border">{lead.modo} ({lead.equipos})</td>
                      <td className="p-2 border">{lead.pesoKg.toLocaleString()} kg / {lead.volumenCbm} CBM</td>
                    </tr>
                  </tbody>
                </table>

                {/* SI HAY MAQUINARIA */}
                {lead.sourcing && (
                  <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 space-y-1">
                    <p className="font-bold text-amber-900 text-xs">
                      Detalle de Maquinaria Pesada: {lead.sourcing.maquinariaMarca} {lead.sourcing.maquinariaModelo}
                    </p>
                    <p className="text-[10px] text-amber-800">
                      Proveedor: {lead.sourcing.proveedorChina || '-'} · Inspección: {lead.sourcing.ciudadInspeccion || 'China'} · HS Code: {lead.sourcing.partidaArancelaria || '-'}
                    </p>
                  </div>
                )}

                {/* TARIFARIO OFERTA */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                    <span>TOTAL OFERTA COMERCIAL CONSOLIDADA:</span>
                    <span className="text-xl font-mono text-red-700">
                      ${Number(lead.precioVenta || 0).toLocaleString()} USD
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600">
                    * Incluye costos de origen, flete internacional, agenciamiento aduanero y comisión de gestión según negociación.
                  </p>
                </div>

                {/* CONDICIONES */}
                <div className="text-[9px] text-slate-500 space-y-1 border-t pt-2">
                  <p className="font-bold text-slate-700">Términos y Condiciones:</p>
                  <p>1. Validez de oferta: 15 días calendario a partir de la fecha de emisión.</p>
                  <p>2. Pago de flete: Pre-paid o Collect sujeto a aprobación crediticia.</p>
                  <p>3. Agente comercial: {lead.comercial} · Grupo Brogels Logística Integral.</p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: HISTORIAL & BITÁCORA */}
          {activeTab === 'historial' && (
            <div className="space-y-4">
              
              {/* FORMULARIO AGREGAR NOTA */}
              <form onSubmit={handleAddNoteSubmit} className="space-y-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                <label className="text-slate-300 font-semibold block text-xs">
                  Agregar Nueva Entrada a la Bitácora:
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ej. Se envió ficha técnica de maquinaria por WhatsApp / Cliente confirmó aprobación de proforma..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-xs focus:outline-none focus:border-red-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
                  >
                    <Send className="w-3 h-3" />
                    <span>Guardar Nota</span>
                  </button>
                </div>
              </form>

              {/* TIMELINE DE ENTRADAS Y LLAMADAS */}
              <div className="space-y-3 pt-2">
                {lead.historial && lead.historial.length > 0 ? (
                  lead.historial.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <div className="flex items-center space-x-1.5">
                          {item.tipo === 'llamada' ? (
                            <span className="px-1.5 py-0.5 bg-blue-950 text-blue-300 border border-blue-800 rounded font-bold flex items-center gap-1">
                              <PhoneCall className="w-2.5 h-2.5" />
                              <span>Llamada VoIP ({formatDuration(item.duracionSegundos)})</span>
                            </span>
                          ) : item.tipo === 'whatsapp' ? (
                            <span className="px-1.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-bold flex items-center gap-1">
                              <MessageSquare className="w-2.5 h-2.5" />
                              <span>WhatsApp API</span>
                            </span>
                          ) : (
                            <span className="font-semibold text-slate-200">{item.autor}</span>
                          )}

                          {item.resultadoLlamada && (
                            <span className="text-amber-400 font-mono text-[9px]">
                              · {item.resultadoLlamada}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-slate-500">{item.fecha}</span>
                      </div>
                      <p className="text-xs text-slate-300">{item.contenido}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No hay registros en la bitácora todavía.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

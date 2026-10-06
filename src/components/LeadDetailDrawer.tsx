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
  AlertCircle
} from 'lucide-react';
import { Lead, LeadStage, STAGES } from '../types/crm';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  onMoveStage: (leadId: string, newStage: LeadStage) => void;
  onAddNote: (leadId: string, noteText: string) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  onClose,
  onEdit,
  onDelete,
  onMoveStage,
  onAddNote,
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
*BROGELS LOGÍSTICA INTEGRAL*
_Branko Cargo & Hogels Aduanas_
----------------------------------
*Cotización Logística:* ${lead.id}
*Cliente:* ${lead.cliente} (RUC: ${lead.ruc})
*Atención:* ${lead.contacto || 'Dpto. de Importaciones'}
*Servicio:* ${lead.servicio} (${lead.incoterm})
*Ruta:* ${lead.pol} ➔ ${lead.pod}
*Modo:* ${lead.modo} | ${lead.equipos}
*Carga:* ${lead.pesoKg.toLocaleString()} kg | ${lead.volumenCbm} CBM

*TARIFA OFERTA:* $${lead.precioVenta.toLocaleString()} USD
- Incluye: Flete internacional y/o agenciamiento según Incoterm ${lead.incoterm}.
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

  const getCleanPhone = (phone: string) => {
    return phone.replace(/[^\d+]/g, '');
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
                  : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
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
            Bitácora & Notas ({lead.historial?.length || 0})
          </button>
        </div>

        {/* CONTENIDO DEL DRAWER */}
        <div className="flex-1 overflow-y-auto p-5 text-xs">
          
          {/* TAB 1: FICHA OPERATIVA */}
          {activeTab === 'detalle' && (
            <div className="space-y-4">
              
              {/* CONTACTO DIRECTO */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{lead.cliente}</h4>
                  <p className="text-slate-400 text-xs font-mono mt-0.5">RUC: {lead.ruc}</p>
                  <p className="text-slate-300 text-xs mt-1">
                    Contacto: <strong className="text-white">{lead.contacto || 'No especificado'}</strong>
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  {lead.telefono && (
                    <a
                      href={`https://wa.me/${getCleanPhone(lead.telefono)}?text=${encodeURIComponent(
                        `Hola ${lead.contacto || ''}, te saluda ${lead.comercial} de Grupo Brogels. Te escribo respecto a la cotización ${lead.id} para la ruta ${lead.pol} a ${lead.pod}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {lead.email && (
                    <a
                      href={`mailto:${lead.email}?subject=Cotización Logística ${lead.id} - Grupo Brogels`}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email</span>
                    </a>
                  )}
                </div>
              </div>

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
                    {lead.costosDesglose.fleteUsd ? <div className="flex justify-between text-slate-300"><span>Flete Internacional:</span><span className="font-mono">${lead.costosDesglose.fleteUsd}</span></div> : null}
                    {lead.costosDesglose.gastosLocalesUsd ? <div className="flex justify-between text-slate-300"><span>Gastos Locales / THC:</span><span className="font-mono">${lead.costosDesglose.gastosLocalesUsd}</span></div> : null}
                    {lead.costosDesglose.agenciamientoAduanalUsd ? <div className="flex justify-between text-slate-300"><span>Agenciamiento de Aduanas:</span><span className="font-mono">${lead.costosDesglose.agenciamientoAduanalUsd}</span></div> : null}
                    {lead.costosDesglose.seguroUsd ? <div className="flex justify-between text-slate-300"><span>Seguro de Carga:</span><span className="font-mono">${lead.costosDesglose.seguroUsd}</span></div> : null}
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
                    <p className="text-[11px] font-semibold text-red-600">BRANKO CARGO & HOGELS ADUANAS</p>
                    <p className="text-[10px] text-slate-500">Av. Elmer Faucett 2851, Callao · Perú</p>
                    <p className="text-[10px] text-slate-500">operaciones@grupobrogels.com</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-800 block">PROFORMA Nº {lead.id}</span>
                    <span className="text-[10px] text-slate-500 block">Fecha: {lead.fecha}</span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                      Servicio: {lead.servicio}
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

                {/* DETALLE LOGÍSTICO */}
                <table className="w-full text-left text-[11px] border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="p-2 border">Incoterm</th>
                      <th className="p-2 border">Origen (POL)</th>
                      <th className="p-2 border">Destino (POD)</th>
                      <th className="p-2 border">Modo / Equipo</th>
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

                {/* TARIFARIO OFERTA */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                    <span>TOTAL OFERTA COMERCIAL:</span>
                    <span className="text-xl font-mono text-red-700">
                      ${Number(lead.precioVenta || 0).toLocaleString()} USD
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-600">
                    * No incluye tributos de importación (Ad-valorem, IGV, IPM, Percepción) ni sobreestadías no acordadas.
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
                  placeholder="Ej. Cliente solicitó extensión de cotización / Confirmó envío de documentos..."
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

              {/* TIMELINE DE ENTRADAS */}
              <div className="space-y-3 pt-2">
                {lead.historial && lead.historial.length > 0 ? (
                  lead.historial.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-200">{item.autor}</span>
                        <span className="font-mono">{item.fecha}</span>
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

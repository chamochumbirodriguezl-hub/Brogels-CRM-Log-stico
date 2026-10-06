import React, { useState } from 'react';
import { 
  X, 
  Send, 
  MessageSquare, 
  ExternalLink, 
  CheckCheck, 
  Sparkles, 
  Copy, 
  Check, 
  Phone 
} from 'lucide-react';
import { Lead } from '../types/crm';

interface WhatsAppModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (leadId: string, messageText: string) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSendMessage,
}) => {
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !lead) return null;

  const cleanPhone = (lead.telefono || '').replace(/[^\d+]/g, '');

  // Plantillas automáticas según el tipo de operación y sourcing
  const isSourcing = lead.servicio === 'Sourcing China' || lead.empresaGrupo === 'Compras Internacionales';

  const templates = [
    {
      id: 'quote',
      title: '📋 Envío de Cotización Logística',
      text: `Hola ${lead.contacto || lead.cliente}, te saluda ${lead.comercial} de Grupo Brogels (Branko Cargo & Hogels Aduanas). Te comparto la cotización formal *${lead.id}* para tu embarque ${lead.pol} ➔ ${lead.pod} (${lead.equipos}). Tarifa propuesta: *$${lead.precioVenta.toLocaleString()} USD*. ¿Pudiste revisarla para coordinar los espacios?`
    },
    {
      id: 'sourcing',
      title: '🚜 Sourcing & Maquinaria Pesada en China',
      text: `Hola ${lead.contacto || lead.cliente}, te saluda ${lead.comercial} de Brogels Compras Internacionales. Te confirmamos avance en la gestión de tu maquinaria ${lead.sourcing?.maquinariaMarca || ''} ${lead.sourcing?.maquinariaModelo || 'pesada'} en origen China (${lead.sourcing?.ciudadInspeccion || 'Shanghai'}). Nuestro equipo realizó el peritaje técnico de fábrica. ¿Cuándo podemos reunirnos para revisar la proforma y reporte de inspección?`
    },
    {
      id: 'tracking',
      title: '🚢 Seguimiento de Reserva / Booking',
      text: `Estimado(a) ${lead.contacto || lead.cliente}, te escribo para dar seguimiento a tu orden *${lead.id}*. Las tarifas con naviera están vigentes esta semana. ¿Procedemos con la emisión del booking para asegurar la fecha de zarpe estimada?`
    }
  ];

  const handleSelectTemplate = (tmplText: string) => {
    setMessage(tmplText);
  };

  const handleSendAndLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendMessage(lead.id, message.trim());
    onClose();
  };

  const handleOpenExternalWa = () => {
    const textEncoded = encodeURIComponent(message || templates[0].text);
    const url = `https://wa.me/${cleanPhone.replace('+', '')}?text=${textEncoded}`;
    window.open(url, '_blank');
    onSendMessage(lead.id, `Mensaje enviado vía WhatsApp Web/App: ${message || templates[0].text}`);
    onClose();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message || templates[0].text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* HEADER WHATSAPP BUSINESS */}
        <div className="bg-emerald-950/80 px-5 py-3.5 border-b border-emerald-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-white">{lead.cliente}</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] px-1.5 py-0.2 rounded font-bold uppercase">
                  WhatsApp Business API
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80 font-mono">
                {lead.telefono || 'Sin teléfono'} · {lead.contacto || 'Contacto Principal'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTENIDO Y PLANTILLAS */}
        <div className="p-5 space-y-4 text-xs">
          
          {/* SELECTOR DE PLANTILLAS RÁPIDAS */}
          <div>
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Plantillas Automáticas de Seguimiento:</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {templates.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tmpl.text)}
                  className={`text-left p-2.5 rounded-xl border text-[11px] transition ${
                    message === tmpl.text
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                      : 'bg-slate-900 hover:bg-slate-800/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <p className="font-bold text-slate-200">{tmpl.title}</p>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5">{tmpl.text}</p>
                </button>
              ))}
            </div>
          </div>

          {/* EDITOR DE MENSAJE */}
          <form onSubmit={handleSendAndLog} className="space-y-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Mensaje a Enviar por WhatsApp:
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe o selecciona una plantilla automática arriba..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-emerald-500 leading-relaxed"
              />
            </div>

            {/* ACCIONES Y BOTONES */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800">
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenExternalWa}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-emerald-900/60 text-emerald-300 rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
                  title="Abrir chat en la aplicación WhatsApp Web o móvil"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir en WhatsApp</span>
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-950 flex items-center space-x-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Registrar en CRM</span>
                </button>
              </div>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};

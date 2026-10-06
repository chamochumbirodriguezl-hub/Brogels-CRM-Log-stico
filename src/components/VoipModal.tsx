import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Grid, 
  CheckCircle2, 
  X, 
  Clock, 
  Radio, 
  AlertCircle 
} from 'lucide-react';
import { Lead, CallOutcome } from '../types/crm';

interface VoipModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveCallLog: (leadId: string, duracionSegundos: number, outcome: CallOutcome, notas: string) => void;
}

export const VoipModal: React.FC<VoipModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSaveCallLog,
}) => {
  const [callState, setCallState] = useState<'IDLE' | 'DIALING' | 'CONNECTED' | 'ENDED'>('IDLE');
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [outcome, setOutcome] = useState<CallOutcome>('Contestó - Interesado');
  const [callNotes, setCallNotes] = useState('');
  const timerRef = useRef<number | null>(null);

  // Inicializar llamada al abrir
  useEffect(() => {
    if (isOpen && lead) {
      setCallState('DIALING');
      setDuration(0);
      setIsMuted(false);
      setShowKeypad(false);
      setOutcome('Contestó - Interesado');
      setCallNotes('');

      // Simular tiempo de repique y conexión WebRTC (2.5 segundos)
      const dialTimer = window.setTimeout(() => {
        setCallState('CONNECTED');
      }, 2400);

      return () => {
        clearTimeout(dialTimer);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    } else {
      setCallState('IDLE');
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen, lead]);

  // Cronómetro durante llamada conectada
  useEffect(() => {
    if (callState === 'CONNECTED') {
      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  if (!isOpen || !lead) return null;

  const handleHangup = () => {
    setCallState('ENDED');
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleSaveAndClose = () => {
    onSaveCallLog(lead.id, duration, outcome, callNotes.trim());
    onClose();
  };

  const dtmfKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* HEADER DE TELEFONÍA IP */}
        <div className="bg-slate-900/90 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              Brogels Softphone WebRTC
            </span>
            <span className="text-[10px] text-slate-400 font-mono">SIP: Trunk Callao</span>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="p-6 text-center space-y-4">
          
          {/* INFORMACIÓN DEL DESTINATARIO */}
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">{lead.cliente}</h3>
            <p className="text-xs text-slate-400">
              {lead.contacto ? `${lead.contacto} · ` : ''}RUC: {lead.ruc}
            </p>
            <p className="text-sm font-mono font-bold text-red-400 pt-1 tracking-wider">
              {lead.telefono || '+51 (Número no registrado)'}
            </p>
          </div>

          {/* ESTADO DE LA LLAMADA */}
          {callState === 'DIALING' && (
            <div className="py-6 space-y-3">
              <div className="inline-flex p-4 rounded-full bg-red-600/20 text-red-400 border border-red-500/40 animate-bounce">
                <Radio className="w-8 h-8" />
              </div>
              <p className="text-xs font-semibold text-slate-300">
                Marcando por ruta VoIP troncal...
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                Estableciendo enlace de audio SIP
              </p>
            </div>
          )}

          {callState === 'CONNECTED' && (
            <div className="py-4 space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 shadow-lg shadow-emerald-950/50">
                <PhoneCall className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">
                  Llamada en Curso
                </span>
                <span className="text-3xl font-black font-mono text-white tabular-nums">
                  {formatDuration(duration)}
                </span>
              </div>

              {/* CONTROLES DE LA LLAMADA */}
              <div className="flex items-center justify-center space-x-4 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full border transition ${
                    isMuted 
                      ? 'bg-amber-600/20 text-amber-300 border-amber-500' 
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title={isMuted ? 'Desmutear' : 'Mutear'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setShowKeypad(!showKeypad)}
                  className={`p-3 rounded-full border transition ${
                    showKeypad 
                      ? 'bg-red-600/20 text-red-300 border-red-500' 
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                  title="Teclado numérico DTMF"
                >
                  <Grid className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleHangup}
                  className="p-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/60 transition"
                  title="Colgar llamada"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>
              </div>

              {/* TECLADO DTMF (SI ESTÁ ACTIVO) */}
              {showKeypad && (
                <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto pt-2 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  {dtmfKeys.map((k) => (
                    <button
                      key={k}
                      type="button"
                      className="py-2 bg-slate-950 hover:bg-slate-800 rounded font-mono font-bold text-slate-200 text-xs border border-slate-800 active:scale-95 transition"
                    >
                      {k}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {callState === 'ENDED' && (
            <div className="py-2 space-y-4 text-left">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Llamada Finalizada
                  </span>
                  <span className="text-sm font-bold text-white">
                    Duración: <span className="font-mono text-emerald-400">{formatDuration(duration)}</span>
                  </span>
                </div>
                <Clock className="w-5 h-5 text-slate-500" />
              </div>

              {/* SELECTOR DE RESULTADO */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Resultado de la Llamada: <span className="text-red-400">*</span>
                </label>
                <select
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value as CallOutcome)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500 font-semibold"
                >
                  <option value="Contestó - Interesado">Contestó - Interesado</option>
                  <option value="Contestó - Enviar Cotización">Contestó - Enviar Cotización</option>
                  <option value="Venta Realizada / Booking">Venta Realizada / Booking Confirmado</option>
                  <option value="Ocupado / Buzón">Ocupado / Buzón de Voz</option>
                  <option value="No Contesta">No Contesta / Reintentar</option>
                  <option value="Número Inválido">Número Inválido</option>
                </select>
              </div>

              {/* NOTAS DE LA LLAMADA */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Notas / Acuerdos de la Conversación:
                </label>
                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Ej. Cliente requiere confirmación de flete FOB Ningbo y peritaje de maquinaria en Shanghai..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Descartar
                </button>
                <button
                  type="button"
                  onClick={handleSaveAndClose}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-red-950 flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guardar en Bitácora del Lead</span>
                </button>
              </div>
            </div>
          )}

          {callState === 'DIALING' && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleHangup}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 mx-auto"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Cancelar Llamada</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

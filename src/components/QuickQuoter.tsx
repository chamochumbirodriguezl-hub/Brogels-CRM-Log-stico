import React, { useState } from 'react';
import { Calculator, ArrowRight, Copy, Check, Plus, Ship, Plane } from 'lucide-react';
import { Lead } from '../types/crm';

interface QuickQuoterProps {
  onConvertToLead: (partial: Partial<Lead>) => void;
}

export const QuickQuoter: React.FC<QuickQuoterProps> = ({ onConvertToLead }) => {
  const [route, setRoute] = useState('CNNBO - Ningbo a PECLL - Callao');
  const [service, setService] = useState<'SLI' | 'Carga' | 'Aduana'>('SLI');
  const [incoterm, setIncoterm] = useState<'FOB' | 'EXW' | 'CIF'>('FOB');
  const [equipment, setEquipment] = useState("1x40'HC");
  const [cbm, setCbm] = useState(55);
  const [weightKg, setWeightKg] = useState(16000);
  
  // Costos base
  const [oceanFreightCost, setOceanFreightCost] = useState(1950);
  const [localChargesCost, setLocalChargesCost] = useState(350);
  const [customsFeeCost, setCustomsFeeCost] = useState(180);
  const [insuranceCost, setInsuranceCost] = useState(80);
  
  // Margen objetivo
  const [targetMarginPct, setTargetMarginPct] = useState(25);
  const [copied, setCopied] = useState(false);

  const totalCost = oceanFreightCost + localChargesCost + customsFeeCost + insuranceCost;
  // Precio venta = Costo / (1 - Margin/100)
  const targetSellingPrice = Math.round(totalCost / (1 - (targetMarginPct / 100)));
  const calculatedProfit = targetSellingPrice - totalCost;

  const handleCreateLead = () => {
    const [pol, pod] = route.split(' a ');
    onConvertToLead({
      servicio: service,
      incoterm,
      pol: pol || 'CNNBO - Ningbo',
      pod: pod || 'PECLL - Callao',
      equipos: equipment,
      volumenCbm: cbm,
      pesoKg: weightKg,
      costoCompra: totalCost,
      precioVenta: targetSellingPrice,
      profit: calculatedProfit,
      costosDesglose: {
        fleteUsd: oceanFreightCost,
        gastosLocalesUsd: localChargesCost,
        agenciamientoAduanalUsd: customsFeeCost,
        seguroUsd: insuranceCost
      }
    });
  };

  const handleCopySummary = () => {
    const text = `
*BROGELS LOGÍSTICA INTEGRAL*
Cotización Rápida
Ruta: ${route}
Equipo: ${equipment} (${cbm} CBM / ${weightKg} kg)
Incoterm: ${incoterm} · Servicio: ${service}
Tarifa Venta Estimada: $${targetSellingPrice.toLocaleString()} USD
Validez: 7 días calendario sujeto a espacio naviero.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Calculadora & Cotizador Rápido de Fletes</h2>
            <p className="text-xs text-slate-400">
              Cotiza al instante fletes marítimos, aéreos y agenciamiento aduanal calculando el margen comercial deseado.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* PARÁMETROS OPERATIVOS */}
        <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5 text-xs">
          <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
            1. Parámetros de la Operación
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 block mb-1 font-medium">Corredor de Carga (Ruta POL ➔ POD):</label>
              <select
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-red-500 font-mono"
              >
                <option value="CNNBO - Ningbo a PECLL - Callao">CNNBO - Ningbo ➔ PECLL - Callao (China)</option>
                <option value="CNSHA - Shanghai a PECLL - Callao">CNSHA - Shanghai ➔ PECLL - Callao (China)</option>
                <option value="CNSZX - Shenzhen a PECLL - Callao">CNSZX - Shenzhen ➔ PECLL - Callao (China)</option>
                <option value="USMIA - Miami a LIM - Jorge Chávez">USMIA - Miami ➔ LIM - Jorge Chávez (USA Aéreo)</option>
                <option value="DEHAM - Hamburgo a PECLL - Callao">DEHAM - Hamburgo ➔ PECLL - Callao (Europa)</option>
                <option value="PEPAI - Paita a USMIA - Miami">PEPAI - Paita ➔ USMIA - Miami (Exportación)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Tipo de Servicio Logístico:</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-red-500 font-semibold"
              >
                <option value="SLI">SLI (Carga Internacional + Aduana Integrada)</option>
                <option value="Carga">Solo Carga / Flete Internacional</option>
                <option value="Aduana">Solo Agenciamiento de Aduana</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-slate-300 block mb-1 font-medium">Incoterm:</label>
              <select
                value={incoterm}
                onChange={(e) => setIncoterm(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-bold focus:outline-none focus:border-red-500"
              >
                <option value="FOB">FOB</option>
                <option value="EXW">EXW</option>
                <option value="CIF">CIF</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Equipo:</label>
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
              >
                <option value="1x40'HC">1x40'HC</option>
                <option value="1x20'GP">1x20'GP</option>
                <option value="2x40'HC">2x40'HC</option>
                <option value="1x40'Reefer">1x40'Reefer</option>
                <option value="Consolidado LCL">Consolidado LCL</option>
                <option value="Carga Aérea">Carga Aérea</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Volumen (CBM):</label>
              <input
                type="number"
                value={cbm}
                onChange={(e) => setCbm(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-300">Costeo Operativo Neto de Compra (USD)</h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Flete Base ($):</label>
                <input
                  type="number"
                  value={oceanFreightCost}
                  onChange={(e) => setOceanFreightCost(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Gastos Locales / THC ($):</label>
                <input
                  type="number"
                  value={localChargesCost}
                  onChange={(e) => setLocalChargesCost(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Aduanas / Agenciamiento ($):</label>
                <input
                  type="number"
                  value={customsFeeCost}
                  onChange={(e) => setCustomsFeeCost(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Seguro / Otros ($):</label>
                <input
                  type="number"
                  value={insuranceCost}
                  onChange={(e) => setInsuranceCost(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RESULTADO Y OFERTA COMERCIAL */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
              2. Margen & Precio de Venta
            </h3>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Margen Deseado (%):</span>
                <span className="font-mono font-bold text-red-400">{targetMarginPct}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={targetMarginPct}
                onChange={(e) => setTargetMarginPct(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Costo Total Compra:</span>
                <span className="font-mono text-slate-200 font-bold">${totalCost.toLocaleString()} USD</span>
              </div>

              <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800">
                <span className="font-semibold">Precio de Venta Sugerido:</span>
                <span className="font-mono font-bold text-xl text-white">
                  ${targetSellingPrice.toLocaleString()} USD
                </span>
              </div>

              <div className="flex justify-between items-center text-emerald-400 pt-1">
                <span>Profit Neto Estimado:</span>
                <span className="font-mono font-bold text-base">
                  +${calculatedProfit.toLocaleString()} USD
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleCreateLead}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-950 transition flex items-center justify-center space-x-2 text-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Crear Lead desde esta Cotización</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition flex items-center justify-center space-x-2 text-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado al Portapapeles' : 'Copiar Resumen para WhatsApp'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

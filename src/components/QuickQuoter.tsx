import React, { useState } from 'react';
import { Calculator, ArrowRight, Copy, Check, Plus, Ship, Wrench, Sparkles } from 'lucide-react';
import { Lead } from '../types/crm';

interface QuickQuoterProps {
  onConvertToLead: (partial: Partial<Lead>) => void;
}

export const QuickQuoter: React.FC<QuickQuoterProps> = ({ onConvertToLead }) => {
  const [quoterMode, setQuoterMode] = useState<'sourcing' | 'flete'>('sourcing');

  // Parámetros de Sourcing y Maquinaria Pesada
  const [machineryBrand, setMachineryBrand] = useState('SANY');
  const [machineryModel, setMachineryModel] = useState('SY215C (Excavadora 22T)');
  const [machineryCostFob, setMachineryCostFob] = useState(52000); // USD FOB China
  const [brankoFreightCost, setBrankoFreightCost] = useState(4800); // Flete Branko
  const [hogelsCustomsCost, setHogelsCustomsCost] = useState(650); // Aduana Hogels
  const [localCharges, setLocalCharges] = useState(450); // Gastos Locales / THC
  const [insuranceCost, setInsuranceCost] = useState(350); // Seguro
  const [sourcingCommissionPct, setSourcingCommissionPct] = useState(8); // % Comisión Sourcing
  const [freightMarginPct, setFreightMarginPct] = useState(15); // Margen en flete Branko

  // Parámetros estándar Flete
  const [route, setRoute] = useState('CNNBO - Ningbo a PECLL - Callao');
  const [service, setService] = useState<'SLI' | 'Carga' | 'Aduana'>('SLI');
  const [incoterm, setIncoterm] = useState<'FOB' | 'EXW' | 'CIF'>('FOB');
  const [equipment, setEquipment] = useState("1x40'HC");
  const [cbm, setCbm] = useState(55);
  const [weightKg, setWeightKg] = useState(16000);
  const [oceanFreightCost, setOceanFreightCost] = useState(1950);
  const [localChargesCost, setLocalChargesCost] = useState(350);
  const [customsFeeCost, setCustomsFeeCost] = useState(180);
  const [targetMarginPct, setTargetMarginPct] = useState(25);

  const [copied, setCopied] = useState(false);

  // FÓRMULA MÓDULO SOURCING:
  // Costo Maquinaria (FOB) + Flete (Branko) + Gastos Aduana (Hogels) + Comisión Sourcing (%)
  const sourcingCommissionUsd = Math.round((machineryCostFob * sourcingCommissionPct) / 100);
  const brankoFreightSelling = Math.round(brankoFreightCost / (1 - freightMarginPct / 100));
  const hogelsCustomsSelling = Math.round(hogelsCustomsCost * 1.25); // 25% margen en aduana
  
  const totalCostSourcing = machineryCostFob + brankoFreightCost + hogelsCustomsCost + localCharges + insuranceCost;
  const totalPriceSourcing = machineryCostFob + brankoFreightSelling + hogelsCustomsSelling + localCharges + insuranceCost + sourcingCommissionUsd;
  const totalProfitSourcing = totalPriceSourcing - totalCostSourcing;

  // FÓRMULA FLETE ESTÁNDAR:
  const totalCostFlete = oceanFreightCost + localChargesCost + customsFeeCost;
  const targetSellingPriceFlete = Math.round(totalCostFlete / (1 - targetMarginPct / 100));
  const calculatedProfitFlete = targetSellingPriceFlete - totalCostFlete;

  const handleCreateLead = () => {
    if (quoterMode === 'sourcing') {
      onConvertToLead({
        servicio: 'Sourcing China',
        empresaGrupo: 'Compras Internacionales',
        incoterm: 'FOB',
        pol: 'CNSHA - Shanghai, China',
        pod: 'PECLL - Callao, Perú',
        modo: 'Marítimo FCL',
        equipos: "1x40'Flat Rack + 1x40'HC",
        pesoKg: 22000,
        volumenCbm: 65,
        costoCompra: totalCostSourcing,
        precioVenta: totalPriceSourcing,
        profit: totalProfitSourcing,
        costosDesglose: {
          costoMaquinariaFob: machineryCostFob,
          fleteUsd: brankoFreightCost,
          gastosLocalesUsd: localCharges,
          agenciamientoAduanalUsd: hogelsCustomsCost,
          seguroUsd: insuranceCost,
          comisionSourcingUsd: sourcingCommissionUsd
        },
        sourcing: {
          proveedorChina: `${machineryBrand} Heavy Machinery Factory`,
          ciudadInspeccion: 'Shanghai / Changsha',
          estadoSourcing: 'Cotización Maquinaria',
          maquinariaMarca: machineryBrand,
          maquinariaModelo: machineryModel,
          maquinariaEspecificaciones: `Maquinaria pesada certificada ${machineryBrand}. Incluye peritaje e inspección en fábrica.`,
          partidaArancelaria: '8429.52.00.00',
          costoMaquinariaFob: machineryCostFob,
          comisionSourcingPct: sourcingCommissionPct
        }
      });
    } else {
      const [pol, pod] = route.split(' a ');
      onConvertToLead({
        servicio: service,
        empresaGrupo: 'Branko',
        incoterm,
        pol: pol || 'CNNBO - Ningbo',
        pod: pod || 'PECLL - Callao',
        equipos: equipment,
        volumenCbm: cbm,
        pesoKg: weightKg,
        costoCompra: totalCostFlete,
        precioVenta: targetSellingPriceFlete,
        profit: calculatedProfitFlete,
        costosDesglose: {
          fleteUsd: oceanFreightCost,
          gastosLocalesUsd: localChargesCost,
          agenciamientoAduanalUsd: customsFeeCost
        }
      });
    }
  };

  const handleCopySummary = () => {
    let text = '';
    if (quoterMode === 'sourcing') {
      text = `
*BROGELS COMPRAS INTERNACIONALES & SOURCING CHINA*
Cotización Integral Maquinaria Pesada:
• Maquinaria: ${machineryBrand} ${machineryModel}
• Costo FOB China: $${machineryCostFob.toLocaleString()} USD
• Flete Internacional (Branko Cargo): $${brankoFreightSelling.toLocaleString()} USD
• Agenciamiento de Aduanas (Hogels): $${hogelsCustomsSelling.toLocaleString()} USD
• Comisión Sourcing (${sourcingCommissionPct}%): $${sourcingCommissionUsd.toLocaleString()} USD
---------------------------------------------
*PRECIO TOTAL OFERTA CONSOLIDADA:* $${totalPriceSourcing.toLocaleString()} USD
(Incluye peritaje técnico de fábrica en China e inspección previa al embarque).
      `.trim();
    } else {
      text = `
*BROGELS LOGÍSTICA INTEGRAL*
Cotización Rápida
Ruta: ${route}
Equipo: ${equipment} (${cbm} CBM / ${weightKg} kg)
Incoterm: ${incoterm} · Servicio: ${service}
Tarifa Venta Estimada: $${targetSellingPriceFlete.toLocaleString()} USD
      `.trim();
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      
      {/* HEADER Y SELECTOR DE MODO */}
      <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-600 to-red-600 flex items-center justify-center text-white shadow-lg shadow-amber-950/50">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Cotizador Integrado Multimodal & Sourcing</h2>
            <p className="text-xs text-slate-400">
              Calcula en vivo: Costo Maquinaria FOB + Flete Branko + Aduanas Hogels + Comisión Sourcing.
            </p>
          </div>
        </div>

        {/* SELECTOR DE MODO */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setQuoterMode('sourcing')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
              quoterMode === 'sourcing'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Sourcing Maquinaria China</span>
          </button>

          <button
            type="button"
            onClick={() => setQuoterMode('flete')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center space-x-1.5 ${
              quoterMode === 'flete'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>Fletes & Aduanas Estándar</span>
          </button>
        </div>
      </div>

      {quoterMode === 'sourcing' ? (
        /* MODO SOURCING MAQUINARIA PESADA */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ENTRADAS SOURCING */}
          <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>1. Costeo de Maquinaria en Origen & Operación Integral</span>
              </h3>
              <span className="text-slate-400 text-[11px] font-mono">Fórmula Estratégica Brogels</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Marca de Maquinaria:</label>
                <select
                  value={machineryBrand}
                  onChange={(e) => setMachineryBrand(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="SANY">SANY Heavy Industry</option>
                  <option value="XCMG">XCMG Construction Machinery</option>
                  <option value="LiuGong">LiuGong Machinery</option>
                  <option value="Zoomlion">Zoomlion</option>
                  <option value="CAT">Caterpillar (China Sourcing)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Modelo / Especificación:</label>
                <input
                  type="text"
                  value={machineryModel}
                  onChange={(e) => setMachineryModel(e.target.value)}
                  placeholder="Ej. SY215C (Excavadora 22T)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* COSTOS INDIVIDUALES DE LA FÓRMULA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-900/60">
                <label className="text-amber-300 block mb-1 text-[11px] font-bold">
                  1. Costo Maquinaria FOB ($):
                </label>
                <input
                  type="number"
                  value={machineryCostFob}
                  onChange={(e) => setMachineryCostFob(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-amber-800 rounded-lg p-2 text-white font-mono font-bold text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Precio neto de fábrica</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <label className="text-red-300 block mb-1 text-[11px] font-bold">
                  2. Flete Branko Cargo ($):
                </label>
                <input
                  type="number"
                  value={brankoFreightCost}
                  onChange={(e) => setBrankoFreightCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Flat Rack / Break Bulk</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <label className="text-indigo-300 block mb-1 text-[11px] font-bold">
                  3. Gastos Aduana Hogels ($):
                </label>
                <input
                  type="number"
                  value={hogelsCustomsCost}
                  onChange={(e) => setHogelsCustomsCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Agenciamiento Callao</span>
              </div>
            </div>

            {/* ADICIONALES Y COMISIONES */}
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800">
              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Comisión Sourcing (%):</label>
                <input
                  type="number"
                  value={sourcingCommissionPct}
                  onChange={(e) => setSourcingCommissionPct(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-amber-300 font-mono font-bold"
                />
                <span className="text-[10px] text-emerald-400 font-mono block mt-1">
                  =+${sourcingCommissionUsd.toLocaleString()} USD
                </span>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Gastos Locales / THC ($):</label>
                <input
                  type="number"
                  value={localCharges}
                  onChange={(e) => setLocalCharges(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Seguro Transporte ($):</label>
                <input
                  type="number"
                  value={insuranceCost}
                  onChange={(e) => setInsuranceCost(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* RESUMEN COMERCIAL SOURCING */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
                2. Oferta Consolidada al Cliente
              </h3>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Maquinaria FOB China:</span>
                  <span className="font-mono font-bold">${machineryCostFob.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Flete Branko (Venta):</span>
                  <span className="font-mono">${brankoFreightSelling.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Aduana Hogels (Venta):</span>
                  <span className="font-mono">${hogelsCustomsSelling.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-amber-300 font-semibold">
                  <span>Comisión Sourcing ({sourcingCommissionPct}%):</span>
                  <span className="font-mono">+${sourcingCommissionUsd.toLocaleString()} USD</span>
                </div>

                <div className="flex justify-between items-center text-slate-200 pt-3 border-t border-slate-800">
                  <span className="font-bold text-sm">PRECIO TOTAL VENTA:</span>
                  <span className="font-mono font-black text-xl text-white">
                    ${totalPriceSourcing.toLocaleString()} USD
                  </span>
                </div>

                <div className="flex justify-between items-center text-emerald-400 pt-1">
                  <span className="font-semibold">Profit Consolidado Brogels:</span>
                  <span className="font-mono font-bold text-base">
                    +${totalProfitSourcing.toLocaleString()} USD
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCreateLead}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-bold rounded-xl shadow-lg shadow-amber-950 transition flex items-center justify-center space-x-2 text-xs"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Crear Lead de Sourcing Maquinaria</span>
              </button>

              <button
                onClick={handleCopySummary}
                className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition flex items-center justify-center space-x-2 text-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                <span>{copied ? 'Copiado al Portapapeles' : 'Copiar Resumen para WhatsApp'}</span>
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* MODO FLETE ESTÁNDAR */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5 text-xs">
            <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
              1. Parámetros de Operación Estándar
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Corredor de Carga (POL ➔ POD):</label>
                <select
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-red-500 font-mono"
                >
                  <option value="CNNBO - Ningbo a PECLL - Callao">CNNBO - Ningbo ➔ PECLL - Callao</option>
                  <option value="CNSHA - Shanghai a PECLL - Callao">CNSHA - Shanghai ➔ PECLL - Callao</option>
                  <option value="USMIA - Miami a LIM - Jorge Chávez">USMIA - Miami ➔ LIM Aéreo</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Servicio:</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-red-500 font-semibold"
                >
                  <option value="SLI">SLI (Carga + Aduana)</option>
                  <option value="Carga">Solo Flete Internacional</option>
                  <option value="Aduana">Solo Agenciamiento Aduana</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Equipo:</label>
                <select
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="1x40'HC">1x40'HC</option>
                  <option value="1x20'GP">1x20'GP</option>
                  <option value="Consolidado LCL">Consolidado LCL</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Flete Base ($):</label>
                <input
                  type="number"
                  value={oceanFreightCost}
                  onChange={(e) => setOceanFreightCost(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Gastos Locales ($):</label>
                <input
                  type="number"
                  value={localChargesCost}
                  onChange={(e) => setLocalChargesCost(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
                2. Margen & Venta
              </h3>

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Costo Total:</span>
                  <span className="font-mono text-white font-bold">${totalCostFlete.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-slate-800">
                  <span className="font-semibold">Precio Venta Sugerido:</span>
                  <span className="font-mono font-bold text-xl text-white">
                    ${targetSellingPriceFlete.toLocaleString()} USD
                  </span>
                </div>
                <div className="flex justify-between items-center text-emerald-400 pt-1">
                  <span>Profit:</span>
                  <span className="font-mono font-bold text-base">
                    +${calculatedProfitFlete.toLocaleString()} USD
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
                <span>Crear Lead de Flete</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

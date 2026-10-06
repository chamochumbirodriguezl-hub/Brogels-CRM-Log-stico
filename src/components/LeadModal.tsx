import React, { useState, useEffect } from 'react';
import { X, Calculator, Ship, DollarSign, Check, Info, Wrench, Building2, MapPin } from 'lucide-react';
import { 
  Lead, 
  ServiceType, 
  CompanyGroup, 
  IncotermType, 
  TransportMode,
  CostBreakdown,
  SourcingData,
  SourcingStage 
} from '../types/crm';
import { COMMERCIAL_AGENTS, COMMON_PORTS, SOURCING_CITIES } from '../data/mockData';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveLead: (lead: Lead) => void;
  leadToEdit?: Lead | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSaveLead,
  leadToEdit,
}) => {
  const isEditing = !!leadToEdit;

  const [formData, setFormData] = useState<Partial<Lead>>({
    cliente: '',
    ruc: '',
    contacto: '',
    telefono: '',
    email: '',
    origen: 'Meta Ads',
    servicio: 'SLI',
    etapa: 'PROSPECCION',
    incoterm: 'FOB',
    pol: 'CNNBO - Ningbo',
    pod: 'PECLL - Callao',
    modo: 'Marítimo FCL',
    equipos: "1x40'HC",
    pesoKg: 15000,
    volumenCbm: 50,
    costoCompra: 2200,
    precioVenta: 2900,
    profit: 700,
    comercial: 'Yuri Vega',
    empresaGrupo: 'Branko',
    notas: '',
    costosDesglose: {
      fleteUsd: 1800,
      gastosLocalesUsd: 250,
      agenciamientoAduanalUsd: 150,
      seguroUsd: 0,
      almacenajeCuadrillaUsd: 0,
    },
    sourcing: {
      proveedorChina: '',
      ciudadInspeccion: 'Shanghai',
      estadoSourcing: 'Búsqueda Proveedor',
      maquinariaMarca: '',
      maquinariaModelo: '',
      maquinariaEspecificaciones: '',
      partidaArancelaria: '8429.52.00.00',
      costoMaquinariaFob: 0,
      comisionSourcingPct: 7
    }
  });

  const [activeTab, setActiveTab] = useState<'general' | 'sourcing' | 'logistica' | 'costos'>('general');

  useEffect(() => {
    if (leadToEdit) {
      setFormData({
        ...leadToEdit,
        sourcing: leadToEdit.sourcing || {
          proveedorChina: '',
          ciudadInspeccion: 'Shanghai',
          estadoSourcing: 'Búsqueda Proveedor',
          maquinariaMarca: '',
          maquinariaModelo: '',
          maquinariaEspecificaciones: '',
          partidaArancelaria: '8429.52.00.00',
          costoMaquinariaFob: 0,
          comisionSourcingPct: 7
        }
      });
    } else {
      setFormData({
        cliente: '',
        ruc: '',
        contacto: '',
        telefono: '',
        email: '',
        origen: 'Meta Ads',
        servicio: 'SLI',
        etapa: 'PROSPECCION',
        incoterm: 'FOB',
        pol: 'CNNBO - Ningbo',
        pod: 'PECLL - Callao',
        modo: 'Marítimo FCL',
        equipos: "1x40'HC",
        pesoKg: 15000,
        volumenCbm: 50,
        costoCompra: 2200,
        precioVenta: 2900,
        profit: 700,
        comercial: 'Yuri Vega',
        empresaGrupo: 'Branko',
        notas: '',
        costosDesglose: {
          fleteUsd: 1800,
          gastosLocalesUsd: 250,
          agenciamientoAduanalUsd: 150,
          seguroUsd: 0,
          almacenajeCuadrillaUsd: 0,
        },
        sourcing: {
          proveedorChina: '',
          ciudadInspeccion: 'Shanghai',
          estadoSourcing: 'Búsqueda Proveedor',
          maquinariaMarca: '',
          maquinariaModelo: '',
          maquinariaEspecificaciones: '',
          partidaArancelaria: '8429.52.00.00',
          costoMaquinariaFob: 0,
          comisionSourcingPct: 7
        }
      });
    }
  }, [leadToEdit, isOpen]);

  if (!isOpen) return null;

  // Auto calcular costo compra desde desglose si se modifica
  const updateDesglose = (field: keyof CostBreakdown, value: number) => {
    const updated = {
      ...(formData.costosDesglose || {}),
      [field]: value
    };
    const sumCompra = Object.values(updated).reduce((a, b) => (a || 0) + (Number(b) || 0), 0);
    const venta = Number(formData.precioVenta) || 0;
    const profit = venta - sumCompra;

    setFormData({
      ...formData,
      costosDesglose: updated,
      costoCompra: sumCompra,
      profit: profit > 0 ? profit : 0
    });
  };

  const updateSourcing = (field: keyof SourcingData, value: any) => {
    const updatedSourcing = {
      ...(formData.sourcing || {}),
      [field]: value
    };
    setFormData({
      ...formData,
      sourcing: updatedSourcing
    });
  };

  const handlePriceChange = (venta: number) => {
    const compra = Number(formData.costoCompra) || 0;
    const profit = venta - compra;
    setFormData({
      ...formData,
      precioVenta: venta,
      profit: profit > 0 ? profit : 0
    });
  };

  const handleCostChange = (compra: number) => {
    const venta = Number(formData.precioVenta) || 0;
    const profit = venta - compra;
    setFormData({
      ...formData,
      costoCompra: compra,
      profit: profit > 0 ? profit : 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const venta = Number(formData.precioVenta) || 0;
    const compra = Number(formData.costoCompra) || 0;
    const profit = venta - compra;

    // Generar prefijo de ID según servicio
    let prefix = 'SLI';
    if (formData.servicio === 'Carga') prefix = 'CAR';
    if (formData.servicio === 'Aduana') prefix = 'ADU';
    if (formData.servicio === 'Sourcing China' || formData.empresaGrupo === 'Compras Internacionales') prefix = 'SRC';

    const id = formData.id || `${prefix}-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const fecha = formData.fecha || new Date().toISOString().split('T')[0];

    const finalizedLead: Lead = {
      id,
      fecha,
      cliente: formData.cliente?.trim() || 'Cliente Sin Nombre',
      ruc: formData.ruc?.trim() || '',
      contacto: formData.contacto?.trim() || '',
      telefono: formData.telefono?.trim() || '',
      email: formData.email?.trim() || '',
      origen: formData.origen || 'Meta Ads',
      servicio: (formData.servicio as ServiceType) || 'SLI',
      etapa: formData.etapa || 'PROSPECCION',
      motivoPerdido: formData.motivoPerdido,
      incoterm: (formData.incoterm as IncotermType) || 'FOB',
      pol: formData.pol || 'CNNBO - Ningbo',
      pod: formData.pod || 'PECLL - Callao',
      modo: (formData.modo as TransportMode) || 'Marítimo FCL',
      equipos: formData.equipos || "1x40'HC",
      pesoKg: Number(formData.pesoKg) || 0,
      volumenCbm: Number(formData.volumenCbm) || 0,
      costoCompra: compra,
      precioVenta: venta,
      profit: profit > 0 ? profit : 0,
      comercial: formData.comercial || 'Yuri Vega',
      empresaGrupo: (formData.empresaGrupo as CompanyGroup) || 'Branko',
      costosDesglose: formData.costosDesglose,
      sourcing: formData.sourcing,
      notas: formData.notas || '',
      historial: formData.historial || [
        {
          id: `h_${Date.now()}`,
          fecha: new Date().toLocaleString(),
          autor: formData.comercial || 'Yuri Vega',
          tipo: 'nota',
          contenido: isEditing ? 'Expediente actualizado' : 'Lead registrado en Brogels CRM'
        }
      ]
    };

    onSaveLead(finalizedLead);
    onClose();
  };

  const marginPct = (Number(formData.precioVenta) || 0) > 0 
    ? ((((Number(formData.precioVenta) || 0) - (Number(formData.costoCompra) || 0)) / (Number(formData.precioVenta) || 1)) * 100).toFixed(1)
    : '0';

  const isSourcingSelected = formData.empresaGrupo === 'Compras Internacionales' || formData.servicio === 'Sourcing China';

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* HEADER MODAL */}
        <div className="bg-slate-900/80 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 font-bold">
              {isSourcingSelected ? <Wrench className="w-5 h-5 text-amber-400" /> : <Ship className="w-5 h-5 text-red-400" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {isEditing ? `Editar Expediente: ${leadToEdit?.id}` : 'Nuevo Lead Logístico (Brogels CRM)'}
              </h3>
              <p className="text-xs text-slate-400">
                Grupo Brogels: Branko Cargo · Hogels Aduanas · Compras Internacionales China
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TABS DE SECCIONES */}
        <div className="px-6 pt-3 border-b border-slate-800 bg-slate-950 flex flex-wrap gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'general'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Cliente & Operación
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sourcing')}
            className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'sourcing'
                ? 'border-amber-500 text-amber-300'
                : isSourcingSelected
                  ? 'border-transparent text-amber-400/90 hover:text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>2. Sourcing & Maquinaria China</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logistica')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'logistica'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Ruta & Carga (POL/POD)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('costos')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'costos'
                ? 'border-red-500 text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            4. Costeo, Tarifas & Profit
          </button>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* TAB 1: DATOS GENERALES */}
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Empresa Comercial Asignada:
                  </label>
                  <select 
                    value={formData.empresaGrupo} 
                    onChange={e => {
                      const newEmpresa = e.target.value as CompanyGroup;
                      const newServicio = newEmpresa === 'Compras Internacionales' ? 'Sourcing China' : formData.servicio;
                      setFormData({...formData, empresaGrupo: newEmpresa, servicio: newServicio});
                    }}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500 font-semibold"
                  >
                    <option value="Branko">Branko (Agencia de Carga Internacional)</option>
                    <option value="Hogels">Hogels (Agencia de Aduanas)</option>
                    <option value="Compras Internacionales">Compras Internacionales (Sourcing & Maquinaria en China)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Tipo de Servicio Solicitado:
                  </label>
                  <select 
                    value={formData.servicio} 
                    onChange={e => setFormData({...formData, servicio: e.target.value as ServiceType})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500 font-semibold"
                  >
                    <option value="SLI">SLI (Servicio Logístico Integral: Carga + Aduana)</option>
                    <option value="Carga">Solo Flete Internacional (Carga Marítima/Aérea)</option>
                    <option value="Aduana">Solo Agenciamiento de Aduanas</option>
                    <option value="Sourcing China">Sourcing China (Gestión de Compra & Maquinaria Pesada)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Razón Social / Cliente: <span className="text-red-400">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    placeholder="Ej. Constructora & Minera del Centro S.A.C."
                    value={formData.cliente} 
                    onChange={e => setFormData({...formData, cliente: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    RUC (11 dígitos): <span className="text-red-400">*</span>
                  </label>
                  <input 
                    required 
                    type="text" 
                    maxLength={11}
                    placeholder="Ej. 20551122334"
                    value={formData.ruc} 
                    onChange={e => setFormData({...formData, ruc: e.target.value.replace(/\D/g, '')})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Persona de Contacto:</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Ing. Roberto Alarcón"
                    value={formData.contacto} 
                    onChange={e => setFormData({...formData, contacto: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Teléfono / WhatsApp (VoIP):</label>
                  <input 
                    type="text" 
                    placeholder="+51 984512369"
                    value={formData.telefono} 
                    onChange={e => setFormData({...formData, telefono: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Correo Electrónico:</label>
                  <input 
                    type="email" 
                    placeholder="compras@mineradelcentro.pe"
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Ejecutivo Comercial Responsable:</label>
                  <select 
                    value={formData.comercial} 
                    onChange={e => setFormData({...formData, comercial: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                  >
                    {COMMERCIAL_AGENTS.map(agent => (
                      <option key={agent.nombre} value={agent.nombre}>
                        {agent.nombre} ({agent.cargo} - {agent.empresa})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Canal de Origen del Lead:</label>
                  <select 
                    value={formData.origen} 
                    onChange={e => setFormData({...formData, origen: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Sourcing China">Sourcing China (Maquinaria Pesada)</option>
                    <option value="Meta Ads">Meta Ads (Facebook / Instagram)</option>
                    <option value="Google Search">Google Search (Campaña SEM)</option>
                    <option value="Cartera">Cartera Recurrente</option>
                    <option value="Referido">Referido Comercial</option>
                    <option value="Llamada Fría">Prospección en Frío / Outbound</option>
                    <option value="Feria Expo">Feria Logística / Canton Fair</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Notas u Observaciones Iniciales:</label>
                <textarea 
                  rows={2}
                  placeholder="Detalles de mercadería o maquinaria, requerimientos de entrega, inspección técnica, etc."
                  value={formData.notas} 
                  onChange={e => setFormData({...formData, notas: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: SOURCING CHINA & MAQUINARIA PESADA */}
          {activeTab === 'sourcing' && (
            <div className="space-y-4">
              <div className="bg-amber-950/30 p-3 rounded-xl border border-amber-900/60 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-amber-200">
                    Gestión de Compra en Origen (China & Maquinaria Pesada)
                  </span>
                </div>
                <span className="text-[10px] text-amber-400/80 font-mono">
                  Brogels International Sourcing Division
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Proveedor / Fábrica en China:
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ej. SANY Heavy Industry / XCMG Group / LiuGong"
                    value={formData.sourcing?.proveedorChina || ''} 
                    onChange={e => updateSourcing('proveedorChina', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                  <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-slate-400">
                    <span className="text-slate-500">Comunes:</span>
                    <button type="button" onClick={() => updateSourcing('proveedorChina', 'SANY Heavy Industry Co., Ltd.')} className="hover:text-amber-300 underline">SANY</button>
                    <button type="button" onClick={() => updateSourcing('proveedorChina', 'Xuzhou Construction Machinery (XCMG)')} className="hover:text-amber-300 underline">XCMG</button>
                    <button type="button" onClick={() => updateSourcing('proveedorChina', 'LiuGong Machinery Co., Ltd.')} className="hover:text-amber-300 underline">LiuGong</button>
                    <button type="button" onClick={() => updateSourcing('proveedorChina', 'Zoomlion Heavy Industry')} className="hover:text-amber-300 underline">Zoomlion</button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Ciudad / Oficina de Inspección:
                  </label>
                  <select 
                    value={formData.sourcing?.ciudadInspeccion || 'Shanghai'} 
                    onChange={e => updateSourcing('ciudadInspeccion', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    {SOURCING_CITIES.map(c => (
                      <option key={c} value={c.split('(')[0].trim()}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Estado del Sourcing en China:
                  </label>
                  <select 
                    value={formData.sourcing?.estadoSourcing || 'Búsqueda Proveedor'} 
                    onChange={e => updateSourcing('estadoSourcing', e.target.value as SourcingStage)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-amber-300 focus:outline-none focus:border-amber-500 font-bold"
                  >
                    <option value="Búsqueda Proveedor">1. Búsqueda Proveedor</option>
                    <option value="Cotización Maquinaria">2. Cotización Maquinaria</option>
                    <option value="Inspección en China">3. Inspección en China (Peritaje Técnico)</option>
                    <option value="Proforma Aprobada">4. Proforma Aprobada</option>
                    <option value="Pago Realizado">5. Pago Realizado (T/T o L/C)</option>
                    <option value="En Tránsito">6. En Tránsito (Embarcado a Callao)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Partida Arancelaria (HS Code Perú):
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ej. 8429.52.00.00 (Excavadoras)"
                    value={formData.sourcing?.partidaArancelaria || ''} 
                    onChange={e => updateSourcing('partidaArancelaria', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                  <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-slate-400">
                    <span className="text-slate-500">Atajos:</span>
                    <button type="button" onClick={() => updateSourcing('partidaArancelaria', '8429.52.00.00')} className="hover:text-amber-300 underline">8429.52 (Excavadoras)</button>
                    <button type="button" onClick={() => updateSourcing('partidaArancelaria', '8429.51.00.00')} className="hover:text-amber-300 underline">8429.51 (Cargadores)</button>
                    <button type="button" onClick={() => updateSourcing('partidaArancelaria', '8429.11.00.00')} className="hover:text-amber-300 underline">8429.11 (Tractores)</button>
                  </div>
                </div>
              </div>

              {/* FICHA TÉCNICA DE LA MAQUINARIA */}
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="font-bold text-slate-200 block text-xs">
                  Ficha Técnica de Maquinaria Pesada
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1 text-[11px]">Marca de Maquinaria:</label>
                    <input 
                      type="text" 
                      placeholder="Ej. SANY / XCMG / LiuGong"
                      value={formData.sourcing?.maquinariaMarca || ''} 
                      onChange={e => updateSourcing('maquinariaMarca', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 text-[11px]">Modelo / Versión:</label>
                    <input 
                      type="text" 
                      placeholder="Ej. SY215C / LW300KN / 22T"
                      value={formData.sourcing?.maquinariaModelo || ''} 
                      onChange={e => updateSourcing('maquinariaModelo', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 text-[11px]">
                    Especificaciones Técnicas (Motor, Capacidad, Balde, Accesorios):
                  </label>
                  <textarea 
                    rows={2}
                    placeholder="Ej. Motor Isuzu 4HK1X 128kW, Balde HD 1.0 m³, Zapatas de 600mm, Certificación CE, Cabina ROPS/FOPS con A/C..."
                    value={formData.sourcing?.maquinariaEspecificaciones || ''} 
                    onChange={e => updateSourcing('maquinariaEspecificaciones', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white text-[11px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-slate-400 block mb-1 text-[11px]">Costo FOB Maquinaria en China ($):</label>
                    <input 
                      type="number" 
                      value={formData.sourcing?.costoMaquinariaFob || 0} 
                      onChange={e => {
                        const val = Number(e.target.value);
                        updateSourcing('costoMaquinariaFob', val);
                        updateDesglose('costoMaquinariaFob', val);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 text-[11px]">Comisión Sourcing Brogels (%):</label>
                    <input 
                      type="number" 
                      value={formData.sourcing?.comisionSourcingPct || 7} 
                      onChange={e => {
                        const pct = Number(e.target.value);
                        updateSourcing('comisionSourcingPct', pct);
                        const fob = Number(formData.sourcing?.costoMaquinariaFob || 0);
                        const comisionUsd = Math.round((fob * pct) / 100);
                        updateDesglose('comisionSourcingUsd', comisionUsd);
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-amber-300 font-mono text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RUTA Y LOGÍSTICA */}
          {activeTab === 'logistica' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Incoterm de Negociación:</label>
                  <select 
                    value={formData.incoterm} 
                    onChange={e => setFormData({...formData, incoterm: e.target.value as IncotermType})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500 font-bold"
                  >
                    <option value="FOB">FOB (Free On Board - Puerto Origen)</option>
                    <option value="EXW">EXW (Ex Works - En Fábrica)</option>
                    <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                    <option value="CFR">CFR (Cost & Freight)</option>
                    <option value="DDP">DDP (Delivered Duty Paid)</option>
                    <option value="DAP">DAP (Delivered At Place)</option>
                    <option value="FCA">FCA (Free Carrier)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Modo de Transporte:</label>
                  <select 
                    value={formData.modo} 
                    onChange={e => setFormData({...formData, modo: e.target.value as TransportMode})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="Marítimo FCL">Marítimo FCL (Contenedor Completo / Flat Rack / Ro-Ro)</option>
                    <option value="Marítimo LCL">Marítimo LCL (Carga Consolidada)</option>
                    <option value="Carga Aérea">Carga Aérea (Air Freight)</option>
                    <option value="Terrestre Internacional">Terrestre Internacional</option>
                    <option value="Multimodal">Multimodal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Puerto / Origen (POL):</label>
                  <input 
                    type="text" 
                    placeholder="Ej. CNSHA - Shanghai, China"
                    value={formData.pol} 
                    onChange={e => setFormData({...formData, pol: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-slate-400">
                    <span className="text-slate-500">Atajos:</span>
                    <button type="button" onClick={() => setFormData({...formData, pol: "CNSHA - Shanghai, China"})} className="hover:text-red-400 underline">Shanghai</button>
                    <button type="button" onClick={() => setFormData({...formData, pol: "CNNBO - Ningbo, China"})} className="hover:text-red-400 underline">Ningbo</button>
                    <button type="button" onClick={() => setFormData({...formData, pol: "CNTAO - Qingdao, China"})} className="hover:text-red-400 underline">Qingdao</button>
                    <button type="button" onClick={() => setFormData({...formData, pol: "USMIA - Miami"})} className="hover:text-red-400 underline">Miami</button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Puerto / Destino (POD):</label>
                  <input 
                    type="text" 
                    placeholder="Ej. PECLL - Callao, Perú"
                    value={formData.pod} 
                    onChange={e => setFormData({...formData, pod: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500 font-mono"
                  />
                  <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-slate-400">
                    <span className="text-slate-500">Atajos:</span>
                    <button type="button" onClick={() => setFormData({...formData, pod: "PECLL - Callao, Perú"})} className="hover:text-red-400 underline">Callao</button>
                    <button type="button" onClick={() => setFormData({...formData, pod: "PEPAI - Paita, Perú"})} className="hover:text-red-400 underline">Paita</button>
                    <button type="button" onClick={() => setFormData({...formData, pod: "PEMAT - Matarani, Perú"})} className="hover:text-red-400 underline">Matarani</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Tipo de Equipo / Bultos:</label>
                  <select 
                    value={formData.equipos} 
                    onChange={e => setFormData({...formData, equipos: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="1x40'Flat Rack + 1x40'HC">1x40'Flat Rack + 1x40'HC (Maquinaria)</option>
                    <option value="1x40'FR (Flat Rack)">1x40'FR (Flat Rack Maquinaria)</option>
                    <option value="1x40'Open Top">1x40'Open Top</option>
                    <option value="1x40'HC">1x40'HC (High Cube)</option>
                    <option value="1x20'GP">1x20'GP (Standard)</option>
                    <option value="Consolidado LCL">Consolidado LCL</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Peso Bruto Estimado (Kg):</label>
                  <input 
                    type="number" 
                    value={formData.pesoKg} 
                    onChange={e => setFormData({...formData, pesoKg: Number(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">Volumen Carga (CBM):</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={formData.volumenCbm} 
                    onChange={e => setFormData({...formData, volumenCbm: Number(e.target.value)})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COSTEO, PRICING Y MARGEN */}
          {activeTab === 'costos' && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">Desglose de Costo Compra (USD)</span>
                  <span className="text-slate-400 text-[11px]">Costos operativos directos y comisiones</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {isSourcingSelected && (
                    <div className="bg-amber-950/40 p-2 rounded border border-amber-900/60">
                      <label className="text-amber-300 block mb-1 text-[11px] font-bold">Costo Maquinaria FOB ($):</label>
                      <input 
                        type="number"
                        value={formData.costosDesglose?.costoMaquinariaFob || 0}
                        onChange={e => updateDesglose('costoMaquinariaFob', Number(e.target.value))}
                        className="w-full bg-slate-950 border border-amber-800/80 rounded p-2 text-white font-mono font-bold"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-slate-400 block mb-1 text-[11px]">Flete Marítimo (Branko) ($):</label>
                    <input 
                      type="number"
                      value={formData.costosDesglose?.fleteUsd || 0}
                      onChange={e => updateDesglose('fleteUsd', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 text-[11px]">Gastos Aduanas (Hogels) ($):</label>
                    <input 
                      type="number"
                      value={formData.costosDesglose?.agenciamientoAduanalUsd || 0}
                      onChange={e => updateDesglose('agenciamientoAduanalUsd', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 text-[11px]">Gastos Locales / THC ($):</label>
                    <input 
                      type="number"
                      value={formData.costosDesglose?.gastosLocalesUsd || 0}
                      onChange={e => updateDesglose('gastosLocalesUsd', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1 text-[11px]">Seguro Internacional ($):</label>
                    <input 
                      type="number"
                      value={formData.costosDesglose?.seguroUsd || 0}
                      onChange={e => updateDesglose('seguroUsd', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono"
                    />
                  </div>

                  {isSourcingSelected && (
                    <div className="bg-amber-950/40 p-2 rounded border border-amber-900/60">
                      <label className="text-amber-300 block mb-1 text-[11px] font-bold">Comisión Sourcing Brogels ($):</label>
                      <input 
                        type="number"
                        value={formData.costosDesglose?.comisionSourcingUsd || 0}
                        onChange={e => updateDesglose('comisionSourcingUsd', Number(e.target.value))}
                        className="w-full bg-slate-950 border border-amber-800/80 rounded p-2 text-white font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* RESUMEN COMERCIAL Y MARGEN */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-400 block mb-1 font-semibold">Costo Total Compra ($):</label>
                    <input 
                      type="number" 
                      value={formData.costoCompra} 
                      onChange={e => handleCostChange(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 font-mono text-sm"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Suma de costos operativos netos</p>
                  </div>

                  <div>
                    <label className="text-emerald-400 block mb-1 font-semibold">Precio Venta al Cliente ($):</label>
                    <input 
                      type="number" 
                      value={formData.precioVenta} 
                      onChange={e => handlePriceChange(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-emerald-900/60 rounded-lg p-2.5 text-emerald-300 font-mono text-sm font-bold"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">Cotización final consolidada</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-300 font-semibold">Margen Estimado de Operación:</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {marginPct}% Margen Bruto
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 mr-2 text-[11px]">Profit Comercial Consolidado:</span>
                    <span className="font-bold font-mono text-emerald-400 text-base">
                      +${((Number(formData.precioVenta) || 0) - (Number(formData.costoCompra) || 0)).toLocaleString()} USD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER ACTIONS */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="flex space-x-2">
              {activeTab !== 'general' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'costos') setActiveTab('logistica');
                    else if (activeTab === 'logistica') setActiveTab('sourcing');
                    else if (activeTab === 'sourcing') setActiveTab('general');
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold transition"
                >
                  Anterior
                </button>
              )}
              {activeTab !== 'costos' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'general') setActiveTab('sourcing');
                    else if (activeTab === 'sourcing') setActiveTab('logistica');
                    else if (activeTab === 'logistica') setActiveTab('costos');
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition"
                >
                  Siguiente
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold transition"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold shadow-lg shadow-red-950 transition flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isEditing ? 'Guardar Cambios' : 'Crear Lead Logístico'}</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};

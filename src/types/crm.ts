export type LeadStage = 'PROSPECCION' | 'GESTION_INFO' | 'COTIZADO' | 'GANADO' | 'PERDIDO';

export type ServiceType = 'SLI' | 'Carga' | 'Aduana' | 'Sourcing China';

export type CompanyGroup = 'Branko' | 'Hogels' | 'Compras Internacionales';

export type IncotermType = 'FOB' | 'EXW' | 'CIF' | 'CFR' | 'DDP' | 'DAP' | 'FCA' | 'CIP';

export type TransportMode = 'Marítimo FCL' | 'Marítimo LCL' | 'Carga Aérea' | 'Terrestre Internacional' | 'Multimodal';

export type SourcingStage = 
  | 'Búsqueda Proveedor'
  | 'Cotización Maquinaria'
  | 'Inspección en China'
  | 'Proforma Aprobada'
  | 'Pago Realizado'
  | 'En Tránsito';

export interface SourcingData {
  proveedorChina?: string;
  ciudadInspeccion?: string; // Ej. Shanghai, Ningbo, Guangzhou, Qingdao, Changsha
  estadoSourcing?: SourcingStage;
  maquinariaMarca?: string; // Ej. SANY, XCMG, LiuGong, Zoomlion, CAT
  maquinariaModelo?: string; // Ej. SY215C, XE215D, CLG922E
  maquinariaEspecificaciones?: string; // Ej. Excavadora sobre orugas 22T, Balde 1.0m3, Motor Isuzu
  partidaArancelaria?: string; // Ej. 8429.52.00.00
  costoMaquinariaFob?: number;
  comisionSourcingPct?: number;
}

export type CallOutcome = 
  | 'Contestó - Interesado'
  | 'Contestó - Enviar Cotización'
  | 'Venta Realizada / Booking'
  | 'Ocupado / Buzón'
  | 'No Contesta'
  | 'Número Inválido';

export interface ActivityNote {
  id: string;
  fecha: string;
  autor: string;
  contenido: string;
  tipo: 'nota' | 'cambio_etapa' | 'contacto' | 'cotizacion' | 'llamada' | 'whatsapp';
  duracionSegundos?: number;
  resultadoLlamada?: CallOutcome;
}

export interface CostBreakdown {
  fleteUsd?: number;
  gastosLocalesUsd?: number;
  agenciamientoAduanalUsd?: number;
  seguroUsd?: number;
  almacenajeCuadrillaUsd?: number;
  otrosGastosUsd?: number;
  // Sourcing
  costoMaquinariaFob?: number;
  comisionSourcingUsd?: number;
}

export interface Lead {
  id: string;
  fecha: string;
  cliente: string;
  ruc: string;
  contacto: string;
  telefono: string;
  email?: string;
  origen: string; // Meta Ads, Google Search, Referido, Cartera, Llamada Fría, Sourcing China
  servicio: ServiceType; // SLI, Carga, Aduana, Sourcing China
  etapa: LeadStage;
  motivoPerdido?: string;
  incoterm: IncotermType;
  pol: string; // Puerto de Origen
  pod: string; // Puerto de Destino
  modo: TransportMode;
  equipos: string; // 1x40'HC, 1x20'GP, Flat Rack, etc.
  pesoKg: number;
  volumenCbm: number;
  costoCompra: number;
  precioVenta: number;
  profit: number;
  comercial: string;
  empresaGrupo: CompanyGroup;
  costosDesglose?: CostBreakdown;
  sourcing?: SourcingData;
  notas?: string;
  historial?: ActivityNote[];
}

export interface StageDefinition {
  key: LeadStage;
  title: string;
  description: string;
  colorBorder: string;
  badgeBg: string;
  badgeText: string;
}

export const STAGES: StageDefinition[] = [
  {
    key: 'PROSPECCION',
    title: '1. Prospección',
    description: 'Primer contacto y calificación de cliente',
    colorBorder: 'border-blue-500',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    badgeText: 'text-blue-400',
  },
  {
    key: 'GESTION_INFO',
    title: '2. Gestión Info',
    description: 'Recolección de BL, Packing List, Invoice, ficha de maquinaria',
    colorBorder: 'border-amber-500',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    badgeText: 'text-amber-400',
  },
  {
    key: 'COTIZADO',
    title: '3. Cotización',
    description: 'Tarifario emitido: Maquinaria + Flete + Aduana + Sourcing',
    colorBorder: 'border-purple-500',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    badgeText: 'text-purple-400',
  },
  {
    key: 'GANADO',
    title: '4. Cierre Ganado',
    description: 'Booking confirmado y orden de compra aprobada',
    colorBorder: 'border-emerald-500',
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    badgeText: 'text-emerald-400',
  },
  {
    key: 'PERDIDO',
    title: '5. Cierre Perdido',
    description: 'Operación desestimada o perdida por tarifa/frecuencia',
    colorBorder: 'border-rose-500',
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    badgeText: 'text-rose-400',
  },
];

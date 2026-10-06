export type LeadStage = 'PROSPECCION' | 'GESTION_INFO' | 'COTIZADO' | 'GANADO' | 'PERDIDO';

export type ServiceType = 'SLI' | 'Carga' | 'Aduana';

export type CompanyGroup = 'Branko' | 'Hogels';

export type IncotermType = 'FOB' | 'EXW' | 'CIF' | 'CFR' | 'DDP' | 'DAP' | 'FCA' | 'CIP';

export type TransportMode = 'Marítimo FCL' | 'Marítimo LCL' | 'Carga Aérea' | 'Terrestre Internacional' | 'Multimodal';

export interface ActivityNote {
  id: string;
  fecha: string;
  autor: string;
  contenido: string;
  tipo: 'nota' | 'cambio_etapa' | 'contacto' | 'cotizacion';
}

export interface CostBreakdown {
  fleteUsd?: number;
  gastosLocalesUsd?: number;
  agenciamientoAduanalUsd?: number;
  seguroUsd?: number;
  almacenajeCuadrillaUsd?: number;
  otrosGastosUsd?: number;
}

export interface Lead {
  id: string;
  fecha: string;
  cliente: string;
  ruc: string;
  contacto: string;
  telefono: string;
  email?: string;
  origen: string; // Meta Ads, Google Search, Referido, Cartera, Llamada Fría
  servicio: ServiceType; // SLI, Carga, Aduana
  etapa: LeadStage;
  motivoPerdido?: string;
  incoterm: IncotermType;
  pol: string; // Puerto de Origen
  pod: string; // Puerto de Destino
  modo: TransportMode;
  equipos: string; // 1x40'HC, 1x20'GP, 15 Bultos, etc.
  pesoKg: number;
  volumenCbm: number;
  costoCompra: number;
  precioVenta: number;
  profit: number;
  comercial: string;
  empresaGrupo: CompanyGroup;
  costosDesglose?: CostBreakdown;
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
    description: 'Recolección de BL, Packing List, Invoice y pesos',
    colorBorder: 'border-amber-500',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    badgeText: 'text-amber-400',
  },
  {
    key: 'COTIZADO',
    title: '3. Cotización',
    description: 'Tarifario emitido y negociación de flete/aduanas',
    colorBorder: 'border-purple-500',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    badgeText: 'text-purple-400',
  },
  {
    key: 'GANADO',
    title: '4. Cierre Ganado',
    description: 'Booking confirmado y orden de servicio aprobada',
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

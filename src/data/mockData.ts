import { Lead } from '../types/crm';

export const INITIAL_LEADS: Lead[] = [
  {
    id: "SRC-2026-0810",
    fecha: "2026-10-06",
    cliente: "Constructora & Minera del Centro S.A.C.",
    ruc: "20551122334",
    contacto: "Ing. Roberto Alarcón",
    telefono: "+51 984512369",
    email: "ralarcon@mineradelcentro.pe",
    origen: "Sourcing China",
    servicio: "Sourcing China",
    etapa: "GESTION_INFO",
    incoterm: "FOB",
    pol: "CNSHA - Shanghai, China",
    pod: "PECLL - Callao, Perú",
    modo: "Marítimo FCL",
    equipos: "1x40'Flat Rack + 1x40'HC",
    pesoKg: 22500,
    volumenCbm: 68,
    costoCompra: 58500, // Maquinaria FOB 52,000 + Flete 4,800 + Gastos Locales 1,700
    precioVenta: 66900, // Venta total con comisión sourcing y margen flete/aduana
    profit: 8400,
    comercial: "Yuri Vega",
    empresaGrupo: "Compras Internacionales",
    costosDesglose: {
      costoMaquinariaFob: 52000,
      fleteUsd: 4800,
      gastosLocalesUsd: 1700,
      agenciamientoAduanalUsd: 450,
      seguroUsd: 350,
      comisionSourcingUsd: 4200
    },
    sourcing: {
      proveedorChina: "SANY Heavy Industry Co., Ltd.",
      ciudadInspeccion: "Changsha / Shanghai",
      estadoSourcing: "Inspección en China",
      maquinariaMarca: "SANY",
      maquinariaModelo: "SY215C (Excavadora 22T)",
      maquinariaEspecificaciones: "Motor Isuzu 4HK1X, Balde HD 1.0 m³, Zapatas 600mm, Certificación CE/ISO",
      partidaArancelaria: "8429.52.00.00",
      costoMaquinariaFob: 52000,
      comisionSourcingPct: 7
    },
    notas: "Inspección técnica programada con peritaje en planta de Shanghai antes del despacho.",
    historial: [
      {
        id: "h-src1",
        fecha: "2026-10-06 10:15",
        autor: "Yuri Vega",
        tipo: "whatsapp",
        contenido: "Se envió por WhatsApp video de prueba hidráulica emitido por inspector en Changsha."
      },
      {
        id: "h-src2",
        fecha: "2026-10-06 11:40",
        autor: "Yuri Vega",
        tipo: "llamada",
        duracionSegundos: 195,
        resultadoLlamada: "Contestó - Enviar Cotización",
        contenido: "Llamada VoIP de 3m 15s. Cliente revisó especificaciones y solicita proforma consolidada CIF Callao."
      }
    ]
  },
  {
    id: "SLI-2026-1089",
    fecha: "2026-10-06",
    cliente: "Importadora San Martín S.A.C.",
    ruc: "20512345678",
    contacto: "Luis Rodríguez",
    telefono: "+51 987654321",
    email: "lrodriguez@sanmartin.pe",
    origen: "Meta Ads",
    servicio: "SLI",
    etapa: "GESTION_INFO",
    incoterm: "FOB",
    pol: "CNNBO - Ningbo",
    pod: "PECLL - Callao",
    modo: "Marítimo FCL",
    equipos: "1x40'HC",
    pesoKg: 18500,
    volumenCbm: 62,
    costoCompra: 2420,
    precioVenta: 3180,
    profit: 760,
    comercial: "Yuri Vega",
    empresaGrupo: "Branko",
    costosDesglose: {
      fleteUsd: 1950,
      gastosLocalesUsd: 320,
      agenciamientoAduanalUsd: 150,
      seguroUsd: 0,
      almacenajeCuadrillaUsd: 0,
    },
    notas: "Cliente solicita 21 días libres de sobreestadía (demurrage). Carga de luminarias LED.",
    historial: [
      {
        id: "h1",
        fecha: "2026-10-06 09:30",
        autor: "Yuri Vega",
        tipo: "whatsapp",
        contenido: "Se contactó al cliente por WhatsApp. Envió ficha técnica preliminar."
      },
      {
        id: "h2",
        fecha: "2026-10-06 11:15",
        autor: "Yuri Vega",
        tipo: "cambio_etapa",
        contenido: "Pasó de Prospección a Gestión Info."
      }
    ]
  },
  {
    id: "ADU-2026-042",
    fecha: "2026-10-05",
    cliente: "Comercializadora del Sur E.I.R.L.",
    ruc: "20600112233",
    contacto: "Carlos Mendoza",
    telefono: "+51 912345678",
    email: "cmendoza@comdelsur.com",
    origen: "Google Search",
    servicio: "Aduana",
    etapa: "COTIZADO",
    incoterm: "CIF",
    pol: "MIA - Miami",
    pod: "LIM - Aeropuerto Jorge Chávez",
    modo: "Carga Aérea",
    equipos: "12 Bultos",
    pesoKg: 450,
    volumenCbm: 2.5,
    costoCompra: 300,
    precioVenta: 600,
    profit: 300,
    comercial: "Mario Esteban",
    empresaGrupo: "Hogels",
    costosDesglose: {
      agenciamientoAduanalUsd: 220,
      gastosLocalesUsd: 80,
    },
    notas: "Repuestos electromecánicos con urgencia. Despacho anticipado requerido.",
    historial: [
      {
        id: "h3",
        fecha: "2026-10-05 14:20",
        autor: "Mario Esteban",
        tipo: "cotizacion",
        contenido: "Cotización #COT-ADU-88 emitida por $600 USD con tarifa aduanal fija."
      }
    ]
  },
  {
    id: "SRC-2026-0745",
    fecha: "2026-10-04",
    cliente: "Maquinarias & Canteras del Norte S.R.L.",
    ruc: "20488990011",
    contacto: "David Cárdenas",
    telefono: "+51 976543210",
    email: "dcardenas@maquinariasnorte.pe",
    origen: "Sourcing China",
    servicio: "Sourcing China",
    etapa: "COTIZADO",
    incoterm: "FOB",
    pol: "CNTAO - Qingdao, China",
    pod: "PECLL - Callao, Perú",
    modo: "Marítimo FCL",
    equipos: "1x40'FR (Flat Rack)",
    pesoKg: 17200,
    volumenCbm: 52,
    costoCompra: 44000,
    precioVenta: 50800,
    profit: 6800,
    comercial: "Yuri Vega",
    empresaGrupo: "Compras Internacionales",
    costosDesglose: {
      costoMaquinariaFob: 39000,
      fleteUsd: 3800,
      gastosLocalesUsd: 1200,
      comisionSourcingUsd: 3500
    },
    sourcing: {
      proveedorChina: "Xuzhou Construction Machinery Group (XCMG)",
      ciudadInspeccion: "Xuzhou / Qingdao",
      estadoSourcing: "Proforma Aprobada",
      maquinariaMarca: "XCMG",
      maquinariaModelo: "LW300KN (Cargador Frontal 3T)",
      maquinariaEspecificaciones: "Motor Weichai Deutz 125HP, Balde 1.8 m³, Cabina con aire acondicionado ROPS/FOPS",
      partidaArancelaria: "8429.51.00.00",
      costoMaquinariaFob: 39000,
      comisionSourcingPct: 8
    },
    notas: "Cliente solicitó confirmación de repuestos incluidos en paquete inicial (filtros, sellos, dientes de balde).",
    historial: [
      {
        id: "h-src3",
        fecha: "2026-10-04 15:30",
        autor: "Yuri Vega",
        tipo: "llamada",
        duracionSegundos: 140,
        resultadoLlamada: "Contestó - Interesado",
        contenido: "Llamada VoIP de 2m 20s. Se acordó emisión de contrato de comisión y proforma de fábrica."
      }
    ]
  },
  {
    id: "CAR-2026-0318",
    fecha: "2026-10-04",
    cliente: "Textiles Andinos Global S.A.",
    ruc: "20498765432",
    contacto: "Patricia Valenzuela",
    telefono: "+51 945612378",
    email: "pvalenzuela@textilesandinos.pe",
    origen: "Cartera",
    servicio: "Carga",
    etapa: "GANADO",
    incoterm: "FOB",
    pol: "CNSHA - Shanghai",
    pod: "PECLL - Callao",
    modo: "Marítimo FCL",
    equipos: "2x40'HC",
    pesoKg: 34000,
    volumenCbm: 128,
    costoCompra: 4800,
    precioVenta: 6200,
    profit: 1400,
    comercial: "Yuri Vega",
    empresaGrupo: "Branko",
    costosDesglose: {
      fleteUsd: 4100,
      gastosLocalesUsd: 700,
    },
    notas: "Booking confirmado con Cosco Shipping. ETD Shanghai 14 de Octubre.",
    historial: [
      {
        id: "h4",
        fecha: "2026-10-04 16:45",
        autor: "Yuri Vega",
        tipo: "cambio_etapa",
        contenido: "Cliente aprobó cotización por correo formal. Booking solicitado."
      }
    ]
  },
  {
    id: "SLI-2026-1095",
    fecha: "2026-10-03",
    cliente: "Distribuidora Ferretera del Pacífico",
    ruc: "20556677889",
    contacto: "Jorge Quispe",
    telefono: "+51 978901234",
    email: "jquispe@ferreteradelpacifico.com",
    origen: "Referido",
    servicio: "SLI",
    etapa: "COTIZADO",
    incoterm: "EXW",
    pol: "DEHAM - Hamburgo",
    pod: "PECLL - Callao",
    modo: "Marítimo FCL",
    equipos: "1x20'GP",
    pesoKg: 14200,
    volumenCbm: 28,
    costoCompra: 3100,
    precioVenta: 3950,
    profit: 850,
    comercial: "Mario Esteban",
    empresaGrupo: "Branko",
    costosDesglose: {
      fleteUsd: 2200,
      gastosLocalesUsd: 550,
      agenciamientoAduanalUsd: 200,
      seguroUsd: 150,
    },
    notas: "Incluye recojo en fábrica en Colonia y agenciamiento en Hamburgo.",
    historial: [
      {
        id: "h5",
        fecha: "2026-10-03 10:10",
        autor: "Mario Esteban",
        tipo: "nota",
        contenido: "En espera de confirmación de dimensiones de embalaje de madera certificada."
      }
    ]
  }
];

export const COMMERCIAL_AGENTS = [
  { nombre: "Yuri Vega", cargo: "Senior Freight & Sourcing Broker", empresa: "Grupo Brogels", initials: "YV" },
  { nombre: "Mario Esteban", cargo: "Agente Aduanal Senior", empresa: "Hogels Aduanas", initials: "ME" },
  { nombre: "Diana Paredes", cargo: "Key Account Manager SLI & Maquinarias", empresa: "Compras Internacionales", initials: "DP" },
  { nombre: "Carlos Vivanco", cargo: "Pricing & China Logistics", empresa: "Branko Cargo", initials: "CV" }
];

export const COMMON_PORTS = [
  "CNNBO - Ningbo, China",
  "CNSHA - Shanghai, China",
  "CNSZX - Shenzhen, China",
  "CNQDG - Qingdao, China",
  "HKHKG - Hong Kong",
  "USMIA - Miami, Estados Unidos",
  "USLAX - Los Angeles, Estados Unidos",
  "PECLL - Callao, Perú",
  "PEPAI - Paita, Perú",
  "PEMAT - Matarani, Perú",
  "LIM - Jorge Chávez (Aéreo), Perú",
  "DEHAM - Hamburgo, Alemania",
  "NLRTM - Rotterdam, Países Bajos",
  "ESBCN - Barcelona, España"
];

export const SOURCING_CITIES = [
  "Shanghai (Hub Financiero y Puerto)",
  "Ningbo (Puerto y Maquinaria Ligera)",
  "Changsha (Hub SANY & Zoomlion)",
  "Xuzhou (Hub Central XCMG)",
  "Qingdao (Puerto Norte y Shandong Heavy)",
  "Guangzhou / Foshan (Canton Fair y Equipamiento)",
  "Yiwu (Sourcing de Bienes y Repuestos)",
  "Tianjin (Puerto Norte Maquinaria Pesada)"
];

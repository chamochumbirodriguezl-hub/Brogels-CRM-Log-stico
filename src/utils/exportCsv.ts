import { Lead } from '../types/crm';

export function exportLeadsToCsv(leads: Lead[], filename = 'brogels_crm_leads.csv') {
  const headers = [
    'ID Operación',
    'Fecha',
    'Cliente / Razón Social',
    'RUC',
    'Contacto',
    'Teléfono',
    'Email',
    'Empresa Grupo',
    'Servicio',
    'Etapa',
    'Incoterm',
    'POL (Origen)',
    'POD (Destino)',
    'Modo Transporte',
    'Equipos / Bultos',
    'Peso (Kg)',
    'Volumen (CBM)',
    'Costo Compra USD',
    'Precio Venta USD',
    'Profit USD',
    'Margen %',
    'Ejecutivo Comercial',
    'Notas'
  ];

  const rows = leads.map(l => {
    const marginPct = l.precioVenta > 0 ? ((l.profit / l.precioVenta) * 100).toFixed(1) : '0';
    return [
      `"${l.id}"`,
      `"${l.fecha}"`,
      `"${(l.cliente || '').replace(/"/g, '""')}"`,
      `"${l.ruc || ''}"`,
      `"${(l.contacto || '').replace(/"/g, '""')}"`,
      `"${l.telefono || ''}"`,
      `"${l.email || ''}"`,
      `"${l.empresaGrupo}"`,
      `"${l.servicio}"`,
      `"${l.etapa}"`,
      `"${l.incoterm}"`,
      `"${(l.pol || '').replace(/"/g, '""')}"`,
      `"${(l.pod || '').replace(/"/g, '""')}"`,
      `"${l.modo}"`,
      `"${l.equipos}"`,
      l.pesoKg || 0,
      l.volumenCbm || 0,
      l.costoCompra || 0,
      l.precioVenta || 0,
      l.profit || 0,
      `"${marginPct}%"`,
      `"${l.comercial}"`,
      `"${(l.notas || '').replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

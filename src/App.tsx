/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { KpiCards } from './components/KpiCards';
import { KanbanBoard } from './components/KanbanBoard';
import { LeadsTable } from './components/LeadsTable';
import { LeadModal } from './components/LeadModal';
import { LeadDetailDrawer } from './components/LeadDetailDrawer';
import { QuickQuoter } from './components/QuickQuoter';
import { AnalyticsView } from './components/AnalyticsView';
import { Lead, LeadStage, CompanyGroup } from './types/crm';
import { INITIAL_LEADS } from './data/mockData';
import { exportLeadsToCsv } from './utils/exportCsv';

const STORAGE_KEY = 'brogels_crm_leads_v2';

export default function App() {
  // Estado principal de leads con persistencia en localStorage
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error cargando leads de localStorage', e);
    }
    return INITIAL_LEADS;
  });

  // Guardar en localStorage cuando cambie leads
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error('Error guardando leads en localStorage', e);
    }
  }, [leads]);

  // Vistas y filtros
  const [viewMode, setViewMode] = useState<'kanban' | 'table' | 'quoter' | 'analytics'>('kanban');
  const [filterCompany, setFilterCompany] = useState<'ALL' | CompanyGroup>('ALL');
  const [selectedAgent, setSelectedAgent] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modales y drawers
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [selectedLeadForDetail, setSelectedLeadForDetail] = useState<Lead | null>(null);

  // Filtrado de leads en memoria
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      // Filtro de empresa (Branko vs Hogels vs Todo)
      if (filterCompany !== 'ALL' && l.empresaGrupo !== filterCompany) {
        return false;
      }
      // Filtro de ejecutivo
      if (selectedAgent !== 'ALL' && l.comercial !== selectedAgent) {
        return false;
      }
      // Búsqueda de texto
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const match =
          l.cliente.toLowerCase().includes(term) ||
          l.ruc.toLowerCase().includes(term) ||
          (l.contacto && l.contacto.toLowerCase().includes(term)) ||
          l.id.toLowerCase().includes(term) ||
          l.pol.toLowerCase().includes(term) ||
          l.pod.toLowerCase().includes(term) ||
          l.comercial.toLowerCase().includes(term);
        if (!match) return false;
      }
      return true;
    });
  }, [leads, filterCompany, selectedAgent, searchTerm]);

  // Manejador para mover etapas
  const handleMoveStage = (leadId: string, newStage: LeadStage) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const updatedHistorial = [
            ...(l.historial || []),
            {
              id: `h_${Date.now()}`,
              fecha: new Date().toLocaleString(),
              autor: l.comercial,
              tipo: 'cambio_etapa' as const,
              contenido: `Etapa cambiada a ${newStage}`
            }
          ];
          const updated = { ...l, etapa: newStage, historial: updatedHistorial };
          if (selectedLeadForDetail?.id === leadId) {
            setSelectedLeadForDetail(updated);
          }
          return updated;
        }
        return l;
      })
    );
  };

  // Guardar (crear o editar)
  const handleSaveLead = (savedLead: Lead) => {
    setLeads((prev) => {
      const exists = prev.some((l) => l.id === savedLead.id);
      if (exists) {
        return prev.map((l) => (l.id === savedLead.id ? savedLead : l));
      }
      return [savedLead, ...prev];
    });

    if (selectedLeadForDetail?.id === savedLead.id) {
      setSelectedLeadForDetail(savedLead);
    }
  };

  // Eliminar lead
  const handleDeleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (selectedLeadForDetail?.id === id) {
      setSelectedLeadForDetail(null);
    }
  };

  // Agregar nota en bitácora
  const handleAddNote = (leadId: string, noteText: string) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const newHist = [
            ...(l.historial || []),
            {
              id: `h_${Date.now()}`,
              fecha: new Date().toLocaleString(),
              autor: l.comercial,
              tipo: 'nota' as const,
              contenido: noteText
            }
          ];
          const updated = { ...l, historial: newHist };
          if (selectedLeadForDetail?.id === leadId) {
            setSelectedLeadForDetail(updated);
          }
          return updated;
        }
        return l;
      })
    );
  };

  // Restablecer datos iniciales de demostración
  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer los datos de demostración de Grupo Brogels?')) {
      setLeads(INITIAL_LEADS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
    }
  };

  // Exportar a CSV
  const handleExportCsv = () => {
    exportLeadsToCsv(filteredLeads, `brogels_leads_${filterCompany.toLowerCase()}.csv`);
  };

  // Abrir modal desde cotizador rápido
  const handleConvertFromQuoter = (partial: Partial<Lead>) => {
    setLeadToEdit({
      id: '',
      fecha: new Date().toISOString().split('T')[0],
      cliente: '',
      ruc: '',
      contacto: '',
      telefono: '',
      email: '',
      origen: 'Cotizador',
      servicio: partial.servicio || 'SLI',
      etapa: 'COTIZADO',
      incoterm: partial.incoterm || 'FOB',
      pol: partial.pol || 'CNNBO - Ningbo',
      pod: partial.pod || 'PECLL - Callao',
      modo: 'Marítimo FCL',
      equipos: partial.equipos || "1x40'HC",
      pesoKg: partial.pesoKg || 15000,
      volumenCbm: partial.volumenCbm || 50,
      costoCompra: partial.costoCompra || 2000,
      precioVenta: partial.precioVenta || 2600,
      profit: partial.profit || 600,
      comercial: 'Yuri Vega',
      empresaGrupo: 'Branko',
      costosDesglose: partial.costosDesglose
    });
    setIsNewModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* SIDEBAR NAVEGACIÓN Y FILTROS */}
      <Sidebar
        viewMode={viewMode}
        setViewMode={setViewMode}
        filterCompany={filterCompany}
        setFilterCompany={setFilterCompany}
        selectedAgent={selectedAgent}
        setSelectedAgent={setSelectedAgent}
        onResetData={handleResetData}
        leadCount={leads.length}
      />

      {/* ÁREA CENTRAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-950">
        
        {/* CABECERA SUPERIOR */}
        <Header
          viewMode={viewMode}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onOpenNewModal={() => {
            setLeadToEdit(null);
            setIsNewModalOpen(true);
          }}
          onExportCsv={handleExportCsv}
          filterCompany={filterCompany}
        />

        {/* TARJETAS KPI DE NEGOCIO */}
        <KpiCards leads={filteredLeads} />

        {/* VISTAS PRINCIPALES */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-slate-950/40">
          {viewMode === 'kanban' && (
            <KanbanBoard
              leads={filteredLeads}
              onMoveStage={handleMoveStage}
              onSelectLead={(l) => setSelectedLeadForDetail(l)}
            />
          )}

          {viewMode === 'table' && (
            <LeadsTable
              leads={filteredLeads}
              onSelectLead={(l) => setSelectedLeadForDetail(l)}
              onEditLead={(l) => {
                setLeadToEdit(l);
                setIsNewModalOpen(true);
              }}
              onDeleteLead={handleDeleteLead}
              onMoveStage={handleMoveStage}
            />
          )}

          {viewMode === 'quoter' && (
            <QuickQuoter onConvertToLead={handleConvertFromQuoter} />
          )}

          {viewMode === 'analytics' && (
            <AnalyticsView leads={filteredLeads} />
          )}
        </main>
      </div>

      {/* MODAL DE CREACIÓN / EDICIÓN DE LEAD */}
      <LeadModal
        isOpen={isNewModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          setLeadToEdit(null);
        }}
        onSaveLead={handleSaveLead}
        leadToEdit={leadToEdit}
      />

      {/* DRAWER / DETALLE DEL LEAD & PROFORMA */}
      <LeadDetailDrawer
        lead={selectedLeadForDetail}
        onClose={() => setSelectedLeadForDetail(null)}
        onEdit={(l) => {
          setSelectedLeadForDetail(null);
          setLeadToEdit(l);
          setIsNewModalOpen(true);
        }}
        onDelete={handleDeleteLead}
        onMoveStage={handleMoveStage}
        onAddNote={handleAddNote}
      />

    </div>
  );
}

import { loadAgents } from '../services/agentsService.js';
import { TelemetryService } from '../services/TelemetryService.js';

// Estado do componente
let agentsData = [];

export function AgentsGrid() {
  return `
    <div class="agents-grid-container">
      <h2 class="ag-header">Agentes</h2>
      <p class="ag-subnote">Selecione um agente para visualizar manifest e prompt. O campo está vibrando 💎</p>
      
      <div id="agents-grid" class="ag-grid">
        <div class="ag-loading">
          <span class="ag-loading-dot">●</span>
          <span class="ag-loading-dot">●</span>
          <span class="ag-loading-dot">●</span>
        </div>
      </div>
      
      <div id="agent-details" class="ag-details-wrap"></div>
    </div>
  `;
}

export async function initializeAgentsGrid() {
  try {
    agentsData = await loadAgents();
    renderAgentCards();
    TelemetryService.track('agents_grid.initialized', { total_agents: agentsData.length });
  } catch (error) {
    console.error('Erro ao carregar agentes:', error);
    document.getElementById('agents-grid').innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
        <p>❌ Erro ao carregar agentes</p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem;">${error.message}</p>
      </div>
    `;
    TelemetryService.track('agents_grid.error', { error: error.message });
  }
}

function renderAgentCards() {
  const grid = document.getElementById('agents-grid');
  
  if (!agentsData || agentsData.length === 0) {
    grid.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
        📭 Nenhum agente encontrado
      </div>
    `;
    return;
  }

  grid.innerHTML = agentsData.map(agent => `
    <button type="button" class="ag-card" data-agent-id="${agent.id}">
      <div class="ag-card-hd">
        <span class="ag-name">${agent.name}</span>
        ${renderBadge(agent.status)}
      </div>
      <div class="ag-metrics">
        <span class="ag-role">${agent.role || agent.type || '-'}</span>
        <span class="ag-maturity">${agent.maturity || agent.version || 'N/A'}</span>
        <span class="ag-public">${agent.public ? 'Público' : 'Privado'}</span>
      </div>
      ${renderCapabilities(agent.capabilities || agent.manifest?.capabilities)}
    </button>
  `).join('');

  // Event listeners elegantes
  grid.querySelectorAll('.ag-card').forEach(card => {
    card.addEventListener('click', () => {
      const agentId = card.dataset.agentId;
      const agent = agentsData.find(a => a.id === agentId);
      if (agent) {
        openDetails(agent);
        TelemetryService.track('agent.selected', { agent_id: agentId });
      }
    });
  });
}

function renderBadge(status) {
  const map = {
    'Active': 'ag-badge ag-active',
    'active': 'ag-badge ag-active',
    'Ready': 'ag-badge ag-ready',
    'ready': 'ag-badge ag-ready',
    'Planned': 'ag-badge ag-planned',
    'planned': 'ag-badge ag-planned',
    'Concept': 'ag-badge ag-concept',
    'concept': 'ag-badge ag-concept',
    'Processing': 'ag-badge ag-ready',
    'processing': 'ag-badge ag-ready'
  };
  const statusText = status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() || 'Unknown';
  return `<span class="${map[status] || 'ag-badge'}">${statusText}</span>`;
}

function renderCapabilities(arr) {
  if (!arr?.length) return '';
  return `<div class="ag-caps"><span class="ag-caps-label">Capacidades:</span> ${
    arr.slice(0, 4).map(cap => `<span class="ag-pill">${cap}</span>`).join(' ')
  }</div>`;
}

function openDetails(agent) {
  const detailsWrap = document.getElementById('agent-details');
  if (!detailsWrap) return;
  
  detailsWrap.innerHTML = `
    <div class="agent-details-card" style="
      background: var(--bg-app, #fff);
      border: 2px solid var(--brand-green, #138f6b);
      border-radius: 14px;
      padding: 1.5rem;
      box-shadow: 0 4px 12px rgba(18, 34, 49, 0.08);
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    ">
      <div class="agent-details-header" style="
        border-bottom: 1px solid var(--border-color, #e2e8f0);
        padding-bottom: 1rem;
        margin-bottom: 1.5rem;
      ">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <h3 style="font-size: 1.1rem; font-weight: 600; margin: 0; color: var(--text-primary);">${agent.name}</h3>
          ${renderBadge(agent.status)}
        </div>
        <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">${agent.description || 'Agente inteligente do ecossistema Lichtara'}</p>
      </div>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem;">
        <div class="info-section" style="background: rgba(248, 250, 252, 0.6); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
          <h4 style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin: 0 0 0.75rem;">Informações</h4>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem;">
              <span style="color: var(--text-muted); font-weight: 500;">ID:</span>
              <code style="font-size: 0.75rem; padding: 0.1rem 0.3rem; background: var(--bg-code, #f5f7fa); border-radius: 3px;">${agent.id}</code>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem;">
              <span style="color: var(--text-muted); font-weight: 500;">Tipo:</span>
              <span>${agent.type || agent.role || 'Standard'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem;">
              <span style="color: var(--text-muted); font-weight: 500;">Versão:</span>
              <span>${agent.version || agent.maturity || 'N/A'}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem;">
              <span style="color: var(--text-muted); font-weight: 500;">Visibilidade:</span>
              <span>${agent.public ? 'Público' : 'Interno'}</span>
            </div>
          </div>
        </div>
        
        ${agent.capabilities && agent.capabilities.length > 0 ? `
          <div class="capabilities-section" style="background: rgba(248, 250, 252, 0.6); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
            <h4 style="font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin: 0 0 0.75rem;">Capacidades</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
              ${agent.capabilities.map(cap => 
                `<span style="
                  font-size: 0.7rem;
                  padding: 0.3rem 0.7rem;
                  background: var(--brand-green-soft, #e4f7f1);
                  color: var(--brand-green, #138f6b);
                  border-radius: 999px;
                  font-weight: 500;
                  border: 1px solid #a5d6c4;
                ">${cap}</span>`
              ).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
  
  // Smooth scroll para detalhes
  detailsWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

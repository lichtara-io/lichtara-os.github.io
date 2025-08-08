import { loadAgents } from '../services/agentsService.js';
import { TelemetryService } from '../services/TelemetryService.js';

// Estado do componente
let agentsData = [];
let selectedAgentId = null;

export function AgentsGrid() {
  return `
    <div class="agents-container">
      <header class="agents-header">
        <h2 class="section-title">Agentes</h2>
        <p class="section-description">Selecione um agente para visualizar Manifest e Prompt (quando público).</p>
        
        <div class="agents-stats" id="agents-stats">
          <div class="stat-item">
            <span class="stat-value">-</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">-</span>
            <span class="stat-label">Ativos</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">-</span>
            <span class="stat-label">Processando</span>
          </div>
        </div>
      </header>
      
      <div class="agents-grid" id="agents-grid">
        <div class="loading-indicator">
          <div class="loading-dots">
            <span></span><span></span><span></span>
          </div>
          <p>Carregando agentes...</p>
        </div>
      </div>
      
      <div id="agent-details-panel" style="margin-top: 1.8rem;"></div>
    </div>
  `;
}

export async function initializeAgentsGrid() {
  try {
    // Carregar dados dos agentes
    agentsData = await loadAgents();
    
    // Renderizar grid de agentes
    renderAgentCards();
    
    // Atualizar estatísticas
    updateAgentsStats();
    
    TelemetryService.track('agents_grid.initialized', { 
      total_agents: agentsData.length 
    });
    
  } catch (error) {
    console.error('Erro ao inicializar grid de agentes:', error);
    document.getElementById('agents-grid').innerHTML = `
      <div class="error-state">
        <h3>❌ Erro ao carregar agentes</h3>
        <p>${error.message}</p>
        <button onclick="location.reload()" class="retry-btn">Tentar Novamente</button>
      </div>
    `;
    
    TelemetryService.track('agents_grid.error', { error: error.message });
  }
}

function renderAgentCards() {
  const grid = document.getElementById('agents-grid');
  
  if (!agentsData || agentsData.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <p>📭 Nenhum agente encontrado</p>
      </div>
    `;
    return;
  }
  
  grid.style.display = 'grid';
  grid.style.gap = '1rem';
  grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(280px, 1fr))';
  
  grid.innerHTML = agentsData.map(agent => `
    <div class="agent-card card" data-agent-id="${agent.id}">
      <div class="agent-card-header">
        <h3 class="agent-name">${agent.name}</h3>
        ${createStatusBadge(agent.status)}
      </div>
      
      <p class="agent-description">${agent.description || 'Agente inteligente do sistema Lichtara'}</p>
      
      <div class="agent-metadata">
        <div class="metadata-item">
          <span class="metadata-label">Role</span>
          <strong class="metadata-value">${agent.role || agent.type || '-'}</strong>
        </div>
        <div class="metadata-item">
          <span class="metadata-label">Maturity</span>
          <span class="metadata-value">${agent.maturity || agent.version || 'N/A'}</span>
        </div>
        <div class="metadata-item">
          <span class="metadata-label">Público</span>
          <span class="metadata-value">${agent.public ? 'Sim' : 'Não'}</span>
        </div>
      </div>
      
      ${agent.capabilities && agent.capabilities.length > 0 ? `
        <div class="agent-capabilities">
          ${agent.capabilities.slice(0, 3).map(cap => 
            `<span class="capability-tag">${cap}</span>`
          ).join('')}
        </div>
      ` : ''}
    </div>
  `).join('');
  
  // Adicionar event listeners elegantes
  grid.querySelectorAll('.agent-card').forEach(card => {
    card.addEventListener('click', () => {
      const agentId = card.dataset.agentId;
      const agent = agentsData.find(a => a.id === agentId);
      if (agent) {
        showAgentDetails(agent);
        TelemetryService.track('agent.selected', { agent_id: agentId });
      }
    });
  });
}

function createAgentCard(agent) {
  const statusClass = getStatusClass(agent.status);
  const statusIcon = getStatusIcon(agent.status);
  
  return `
    <div class="agent-card" data-agent-id="${agent.id}">
      <div class="agent-card-header">
        <div class="agent-icon">${agent.icon || '🤖'}</div>
        <div class="agent-status ${statusClass}">
          ${statusIcon}
          <span>${agent.status || 'unknown'}</span>
        </div>
      </div>
      
      <div class="agent-info">
        <h3 class="agent-name">${agent.name}</h3>
        <p class="agent-description">${agent.description || 'Agente sem descrição disponível'}</p>
        
        <div class="agent-metrics">
          <div class="metric">
            <span class="metric-label">Versão:</span>
            <span class="metric-value">${agent.version || 'N/A'}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Tipo:</span>
            <span class="metric-value">${agent.type || 'Standard'}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Última Atividade:</span>
            <span class="metric-value">${formatLastActivity(agent.lastActivity)}</span>
          </div>
        </div>
        
        <div class="agent-capabilities">
          ${(agent.capabilities || []).map(cap => 
            `<span class="capability-badge">${cap}</span>`
          ).join('')}
        </div>
      </div>
      
      <div class="agent-actions">
        <button class="action-btn primary" onclick="window.openAgentDetails('${agent.id}'); event.stopPropagation();">
          Ver Detalhes
        </button>
      </div>
    </div>
  `;
}

function getStatusClass(status) {
  const statusMap = {
    'active': 'status-active',
    'ready': 'status-ready', 
    'processing': 'status-processing',
    'inactive': 'status-inactive',
    'error': 'status-error'
  };
  return statusMap[status?.toLowerCase()] || 'status-unknown';
}

function getStatusIcon(status) {
  const iconMap = {
    'active': '🟢',
    'ready': '🟡',
    'processing': '🔵',
    'inactive': '⚪',
    'error': '🔴'
  };
  return iconMap[status?.toLowerCase()] || '❓';
}

function formatLastActivity(timestamp) {
  if (!timestamp) return 'Nunca';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Agora mesmo';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min atrás`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} h atrás`;
  
  return date.toLocaleDateString('pt-BR');
}

function updateAgentsStats() {
  const statsContainer = document.getElementById('agents-stats');
  if (!statsContainer) return;
  
  const totalAgents = agentsData.length;
  const activeAgents = agentsData.filter(a => a.status === 'active').length;
  const processingAgents = agentsData.filter(a => a.status === 'processing').length;
  
  const statCards = statsContainer.querySelectorAll('.stat-card .stat-value');
  statCards[0].textContent = totalAgents;
  statCards[1].textContent = activeAgents;
  statCards[2].textContent = processingAgents;
}

function renderAgentOverview(agent) {
  return `
    <div class="overview-content">
      <div class="overview-grid">
        <div class="info-section">
          <h4>Informações Básicas</h4>
          <div class="info-grid">
            <div class="info-item">
              <label>ID:</label>
              <span>${agent.id}</span>
            </div>
            <div class="info-item">
              <label>Versão:</label>
              <span>${agent.version || 'N/A'}</span>
            </div>
            <div class="info-item">
              <label>Tipo:</label>
              <span>${agent.type || 'Standard'}</span>
            </div>
            <div class="info-item">
              <label>Criado em:</label>
              <span>${agent.created ? new Date(agent.created).toLocaleDateString('pt-BR') : 'N/A'}</span>
            </div>
          </div>
        </div>
        
        <div class="capabilities-section">
          <h4>Capacidades</h4>
          <div class="capabilities-list">
            ${(agent.capabilities || []).map(cap => 
              `<span class="capability-tag">${cap}</span>`
            ).join('') || '<p>Nenhuma capacidade listada</p>'}
          </div>
        </div>
        
        <div class="metrics-section">
          <h4>Métricas de Performance</h4>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-value">${agent.metrics?.uptime || '0%'}</div>
              <div class="metric-label">Uptime</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${agent.metrics?.processedTasks || '0'}</div>
              <div class="metric-label">Tarefas Processadas</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">${agent.metrics?.avgResponseTime || '0ms'}</div>
              <div class="metric-label">Tempo Médio</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Funções globais para o modal
window.openAgentDetails = function(agentId) {
  const agent = agentsData.find(a => a.id === agentId);
  if (!agent) return;
  
  selectedAgentId = agentId;
  
  const modal = document.getElementById('agent-details-modal');
  const content = document.getElementById('agent-details-content');
  
  content.innerHTML = `
    <div class="agent-details-full">
      <div class="agent-header-full">
        <div class="agent-icon-large">${agent.icon || '🤖'}</div>
        <div class="agent-info-full">
          <h2>${agent.name}</h2>
          <div class="status-badge ${getStatusClass(agent.status)}">
            ${getStatusIcon(agent.status)} ${agent.status}
          </div>
          <p>${agent.description}</p>
        </div>
      </div>
      
      <div class="agent-tabs">
        <button class="tab-btn active" onclick="showAgentTab('overview')">Visão Geral</button>
        <button class="tab-btn" onclick="showAgentTab('config')">Configuração</button>
        <button class="tab-btn" onclick="showAgentTab('logs')">Logs</button>
      </div>
      
      <div class="agent-tab-content" id="agent-tab-content">
        ${renderAgentOverview(agent)}
      </div>
    </div>
  `;
  
  modal.style.display = 'flex';
  
  TelemetryService.track('agent_details.opened', { agent_id: agentId });
};

window.closeAgentModal = function() {
  document.getElementById('agent-details-modal').style.display = 'none';
  selectedAgentId = null;
  TelemetryService.track('agent_details.closed');
};

window.showAgentTab = function(tabName) {
  // Atualizar botões das abas
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Renderizar conteúdo da aba
  const content = document.getElementById('agent-tab-content');
  const agent = agentsData.find(a => a.id === selectedAgentId);
  
  switch (tabName) {
    case 'overview':
      content.innerHTML = renderAgentOverview(agent);
      break;
    case 'config':
      content.innerHTML = '<p>Configurações do agente em desenvolvimento...</p>';
      break;
    case 'logs':
      content.innerHTML = '<p>Sistema de logs em desenvolvimento...</p>';
      break;
  }
  
  TelemetryService.track('agent_tab.changed', { 
    agent_id: selectedAgentId, 
    tab: tabName 
  });
};

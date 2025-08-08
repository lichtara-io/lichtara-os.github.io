import { AgentDetails } from './AgentDetails.js';
import { TelemetryService } from '../services/TelemetryService.js';

export function AgentsGrid() {
  return `
    <div class="fade-in" style="padding: 2rem; max-width: 1300px; margin: 0 auto;">
      <h1 style="font-size: 1.45rem; font-weight: 550; margin-bottom: 0.5rem; color: var(--text-primary);">
        Ecossistema de Agentes
      </h1>
      <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 2rem;">
        Campo vivo • 8 entidades vibracionais • Interface de monitoramento
      </p>
      <div id="agents-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;"></div>
    </div>
  `;
}

export async function initializeAgentsGrid() {
  try {
    TelemetryService.track('agents.grid.load_start');
    
    const response = await fetch('/agents.json');
    const data = await response.json();
    
    const container = document.getElementById('agents-container');
    if (!container) return;
    
    container.innerHTML = data.agents.map(agent => createAgentCard(agent)).join('');
    
    // Adicionar event listeners para os cartões
    container.addEventListener('click', (e) => {
      const card = e.target.closest('.agent-card');
      if (card) {
        const agentId = card.dataset.agentId;
        const agent = data.agents.find(a => a.id === agentId);
        if (agent) {
          TelemetryService.track('agents.card.click', { agentId });
          showAgentDetails(agent);
        }
      }
    });
    
    TelemetryService.track('agents.grid.load_success', { count: data.agents.length });
  } catch (error) {
    console.error('Erro ao carregar agentes:', error);
    TelemetryService.track('agents.grid.load_error', { error: error.message });
    
    const container = document.getElementById('agents-container');
    if (container) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-secondary);">
          <p>❌ Erro ao carregar agentes</p>
          <p style="font-size: 0.8rem; margin-top: 0.5rem;">${error.message}</p>
        </div>
      `;
    }
  }
}

function createAgentCard(agent) {
  const statusClass = `badge-${agent.status}`;
  
  return `
    <div class="agent-card card" data-agent-id="${agent.id}" style="cursor: pointer; padding: 1.25rem;">
      <div style="display: flex; justify-content: between; align-items: flex-start; margin-bottom: 1rem;">
        <div style="flex: 1;">
          <h3 style="font-size: 1.1rem; font-weight: 550; color: var(--text-primary); margin-bottom: 0.25rem;">
            ${agent.name}
          </h3>
          <p style="color: var(--text-secondary); font-size: 0.8rem; line-height: 1.4;">
            ${agent.description || 'Descrição não disponível'}
          </p>
        </div>
        <span class="badge ${statusClass}" style="margin-left: 1rem;">
          ${agent.status}
        </span>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
          <span class="inline-kv">Especialização</span>
          <span style="font-size: 0.75rem; color: var(--text-primary); font-weight: 500;">
            ${agent.specialization || 'Geral'}
          </span>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
          <span class="inline-kv">Versão</span>
          <span style="font-size: 0.75rem; color: var(--text-primary); font-weight: 500; font-family: var(--mono-font);">
            ${agent.version || '1.0.0'}
          </span>
        </div>
        
        <div style="display: flex; justify-content: space-between;">
          <span class="inline-kv">Última Atividade</span>
          <span style="font-size: 0.75rem; color: var(--text-secondary);">
            ${formatLastActivity(agent.lastActivity)}
          </span>
        </div>
      </div>
      
      ${agent.tags && agent.tags.length > 0 ? `
        <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
          ${agent.tags.map(tag => `
            <span style="background: var(--bg-alt); color: var(--text-secondary); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); font-size: 0.65rem; border: 1px solid var(--border-color);">
              ${tag}
            </span>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function formatLastActivity(lastActivity) {
  if (!lastActivity) return 'Nunca';
  
  try {
    const date = new Date(lastActivity);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  } catch (e) {
    return 'Data inválida';
  }
}

function showAgentDetails(agent) {
  const viewRoot = document.getElementById('view-root');
  if (!viewRoot) return;
  
  viewRoot.innerHTML = AgentDetails(agent);
  
  // Event listener para voltar
  const backButton = document.getElementById('back-to-grid');
  if (backButton) {
    backButton.addEventListener('click', () => {
      TelemetryService.track('agents.details.back_click');
      viewRoot.innerHTML = AgentsGrid();
      initializeAgentsGrid();
    });
  }
}

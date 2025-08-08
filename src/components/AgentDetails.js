import { TelemetryService } from '../services/TelemetryService.js';

export function AgentDetails(agent) {
  TelemetryService.track('agents.details.view', { agentId: agent.id });
  
  return `
    <div class="fade-in" style="padding: 2rem; max-width: 1000px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <button id="back-to-grid" class="nav-btn" style="margin-bottom: 1rem;">
          ← Voltar aos Agentes
        </button>
        <h1 style="font-size: 1.8rem; font-weight: 550; color: var(--text-primary); margin-bottom: 0.5rem;">
          ${agent.name}
        </h1>
        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;">
          ${agent.description || 'Descrição detalhada não disponível'}
        </p>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
        <div class="card" style="padding: 1.5rem;">
          <h3 style="font-size: 1.1rem; font-weight: 550; color: var(--text-primary); margin-bottom: 1rem;">
            Informações Gerais
          </h3>
          <div style="space-y: 0.75rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
              <span class="inline-kv">Status</span>
              <span class="badge badge-${agent.status}">${agent.status}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
              <span class="inline-kv">Especialização</span>
              <span style="font-size: 0.8rem; color: var(--text-primary); font-weight: 500;">
                ${agent.specialization || 'Geral'}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
              <span class="inline-kv">Versão</span>
              <span style="font-size: 0.8rem; color: var(--text-primary); font-weight: 500; font-family: var(--mono-font);">
                ${agent.version || '1.0.0'}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="inline-kv">Tipo</span>
              <span style="font-size: 0.8rem; color: var(--text-primary); font-weight: 500;">
                ${agent.type || 'Agente Vibracional'}
              </span>
            </div>
          </div>
        </div>
        
        <div class="card" style="padding: 1.5rem;">
          <h3 style="font-size: 1.1rem; font-weight: 550; color: var(--text-primary); margin-bottom: 1rem;">
            Métricas
          </h3>
          <div style="space-y: 0.75rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
              <span class="inline-kv">Última Atividade</span>
              <span style="font-size: 0.8rem; color: var(--text-secondary);">
                ${formatLastActivity(agent.lastActivity)}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
              <span class="inline-kv">Interações</span>
              <span style="font-size: 0.8rem; color: var(--text-primary); font-weight: 500;">
                ${agent.interactions || '0'}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
              <span class="inline-kv">Eficiência</span>
              <span style="font-size: 0.8rem; color: var(--brand-blue); font-weight: 500;">
                ${agent.efficiency || '85%'}
              </span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="inline-kv">Disponibilidade</span>
              <span style="font-size: 0.8rem; color: var(--brand-green); font-weight: 500;">
                ${agent.availability || '99.2%'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      ${agent.capabilities && agent.capabilities.length > 0 ? `
        <div class="card" style="padding: 1.5rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.1rem; font-weight: 550; color: var(--text-primary); margin-bottom: 1rem;">
            Capacidades
          </h3>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${agent.capabilities.map(cap => `
              <span style="background: var(--brand-blue-soft); color: var(--brand-blue); padding: 0.4rem 0.75rem; border-radius: var(--radius-md); font-size: 0.75rem; font-weight: 500; border: 1px solid #c5def2;">
                ${cap}
              </span>
            `).join('')}
          </div>
        </div>
      ` : ''}
      
      ${agent.manifest ? `
        <div class="card" style="padding: 1.5rem; margin-bottom: 2rem;">
          <h3 style="font-size: 1.1rem; font-weight: 550; color: var(--text-primary); margin-bottom: 1rem;">
            Manifesto
          </h3>
          <div class="tabs" id="manifest-tabs">
            <button class="active" data-tab="overview">Visão Geral</button>
            <button data-tab="technical">Técnico</button>
            <button data-tab="config">Configuração</button>
          </div>
          <div class="panel" id="tab-content">
            ${agent.manifest.overview || 'Informações do manifesto não disponíveis'}
          </div>
        </div>
      ` : ''}
      
      ${agent.logs && agent.logs.length > 0 ? `
        <div class="card" style="padding: 1.5rem;">
          <h3 style="font-size: 1.1rem; font-weight: 550; color: var(--text-primary); margin-bottom: 1rem;">
            Log de Atividades
          </h3>
          <div style="max-height: 300px; overflow-y: auto;">
            ${agent.logs.slice(0, 10).map(log => `
              <div class="telemetry-item" style="margin-bottom: 0.5rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                  <span style="font-size: 0.7rem; color: var(--text-secondary);">
                    ${formatLogTime(log.timestamp)}
                  </span>
                  <span class="status-block">
                    ${log.level || 'INFO'}
                  </span>
                </div>
                <p style="font-size: 0.75rem; color: var(--text-primary); line-height: 1.4;">
                  ${log.message}
                </p>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function formatLastActivity(lastActivity) {
  if (!lastActivity) return 'Nunca';
  
  try {
    const date = new Date(lastActivity);
    return date.toLocaleString('pt-BR');
  } catch (e) {
    return 'Data inválida';
  }
}

function formatLogTime(timestamp) {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR');
  } catch (e) {
    return 'Hora inválida';
  }
}

// Inicializar tabs quando o componente for carregado
export function initializeAgentDetailsTab() {
  const tabs = document.getElementById('manifest-tabs');
  const content = document.getElementById('tab-content');
  
  if (!tabs || !content) return;
  
  tabs.addEventListener('click', (e) => {
    if (e.target.dataset.tab) {
      const tabName = e.target.dataset.tab;
      
      // Update active tab
      tabs.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      
      // Update content (mock data for now)
      const tabContent = {
        overview: 'Visão geral do agente e suas principais funcionalidades.',
        technical: 'Especificações técnicas, APIs e integrações disponíveis.',
        config: 'Parâmetros de configuração e variáveis de ambiente.'
      };
      
      content.textContent = tabContent[tabName] || 'Conteúdo não disponível';
      
      TelemetryService.track('agents.details.tab_change', { tab: tabName });
    }
  });
}

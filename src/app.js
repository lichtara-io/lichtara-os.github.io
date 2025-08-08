import { AgentsGrid, initializeAgentsGrid } from './components/AgentsGrid.js';
import { PipelineSimulator, initializePipelineSimulator } from './components/PipelineSimulator.js';
import { TelemetryPanel, initializeTelemetryPanel } from './components/TelemetryPanel.js';
import { TelemetryService } from './services/TelemetryService.js';

// Inicializar timestamp global para uptime
window.startTime = new Date();

// Estado global da aplicação
let currentView = 'agents';

export function initApp() {
  TelemetryService.track('app.init');
  initializeNavigation();
  showView('agents');
}

function initializeNavigation() {
  const navButtons = document.querySelectorAll('[data-view]');
  
  navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const view = e.target.dataset.view;
      showView(view);
      
      // Atualizar estado ativo dos botões
      navButtons.forEach(btn => btn.classList.remove('active', 'is-active'));
      e.target.classList.add('active', 'is-active');
      
      TelemetryService.track('navigation.view_change', { view });
    });
  });
  
  // Marcar primeira view como ativa
  const firstButton = document.querySelector('[data-view="agents"]');
  if (firstButton) {
    firstButton.classList.add('active', 'is-active');
  }
}

async function showView(viewName) {
  const viewRoot = document.getElementById('view-root');
  if (!viewRoot) return;
  
  currentView = viewName;
  
  // Limpar conteúdo anterior
  viewRoot.innerHTML = '';
  
  try {
    switch (viewName) {
      case 'agents':
        viewRoot.innerHTML = AgentsGrid();
        await initializeAgentsGrid();
        break;
        
      case 'pipeline':
        viewRoot.innerHTML = PipelineSimulator();
        await initializePipelineSimulator();
        break;
        
      case 'telemetry':
        viewRoot.innerHTML = TelemetryPanel();
        initializeTelemetryPanel();
        break;
        
      default:
        viewRoot.innerHTML = `
          <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
            <h2>View não encontrada</h2>
            <p>A view "${viewName}" não está disponível.</p>
          </div>
        `;
    }
    
    TelemetryService.track('view.loaded', { view: viewName });
  } catch (error) {
    console.error('Erro ao carregar view:', error);
    TelemetryService.track('view.error', { view: viewName, error: error.message });
    
    viewRoot.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
        <h2>❌ Erro ao carregar</h2>
        <p>Não foi possível carregar a view "${viewName}"</p>
        <p style="font-size: 0.8rem; margin-top: 1rem; color: var(--text-muted);">${error.message}</p>
      </div>
    `;
  }
}

// Exportar funcionalidades globais
window.LichtaraApp = {
  showView,
  getCurrentView: () => currentView,
  TelemetryService
};

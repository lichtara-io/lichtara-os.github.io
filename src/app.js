import { loadAgents } from './services/agentsService.js';
import { renderAgentsGrid } from './components/AgentsGrid.js';
import { renderPipelineSimulator } from './components/PipelineSimulator.js';
import { renderTelemetryPanel } from './components/TelemetryPanel.js';
import { telemetry } from './core/telemetry.js';

let state = {
  agents: [],
  selectedAgent: null
};

export async function initApp() {
  await bootstrap();
  bindNav();
  showView('agents');
}

async function bootstrap() {
  telemetry.emit('app:init', { message: 'Inicializando interface' });
  try {
    state.agents = await loadAgents();
    telemetry.emit('agents:loaded', { count: state.agents.length });
  } catch (e) {
    console.error(e);
    telemetry.emit('error', { scope: 'bootstrap', error: e.message });
  }
}

function bindNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active state from all buttons  
      document.querySelectorAll('.nav-btn').forEach(b => {
        b.className = 'nav-btn text-gray-600 hover:text-blue-600';
      });
      // Add active state to clicked button
      btn.className = 'nav-btn text-blue-600 font-medium border-b-2 border-blue-600 pb-1';
      showView(btn.dataset.view);
    });
  });
}

function showView(view) {
  const root = document.getElementById('view-root');
  root.innerHTML = '';
  if (view === 'agents') {
    root.appendChild(renderAgentsGrid(state));
  } else if (view === 'pipeline') {
    root.appendChild(renderPipelineSimulator(state));
  } else if (view === 'telemetry') {
    root.appendChild(renderTelemetryPanel(state));
  }
  telemetry.emit('ui:view', { view });
}

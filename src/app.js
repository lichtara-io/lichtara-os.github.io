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
    root.appendChild(renderPipelineSimulator(state.agents));
  } else if (view === 'telemetry') {
    root.appendChild(renderTelemetryPanel());
  }
  telemetry.emit('ui:view', { view });
}

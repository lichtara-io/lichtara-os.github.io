import { TelemetryService } from '../services/TelemetryService.js';

export function TelemetryPanel() {
  return `
    <div class="fade-in" style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
      <h1 style="font-size: 1.45rem; font-weight: 550; margin-bottom: 0.5rem; color: var(--text-primary);">
        Telemetria do Sistema
      </h1>
      <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 2rem;">
        Monitoramento em tempo real • Métricas de performance • Log de eventos
      </p>
      
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem;">
        <div class="card" style="padding: 1.25rem;">
          <h3 style="font-size: 1rem; font-weight: 550; color: var(--text-primary); margin-bottom: 1rem;">
            Status do Sistema
          </h3>
          <div id="system-status">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span class="inline-kv">Uptime</span>
              <span style="font-size: 0.8rem; color: var(--brand-green); font-weight: 500;" id="uptime">--:--:--</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span class="inline-kv">Agentes Ativos</span>
              <span style="font-size: 0.8rem; color: var(--text-primary); font-weight: 500;" id="active-agents">0</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="inline-kv">Última Sincronização</span>
              <span style="font-size: 0.8rem; color: var(--text-secondary);" id="last-sync">Nunca</span>
            </div>
          </div>
        </div>
        
        <div class="card" style="padding: 1.25rem;">
          <h3 style="font-size: 1rem; font-weight: 550; color: var(--text-primary); margin-bottom: 1rem;">
            Métricas de Performance
          </h3>
          <div id="performance-metrics">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span class="inline-kv">Latência Média</span>
              <span style="font-size: 0.8rem; color: var(--text-primary); font-weight: 500;" id="avg-latency">0ms</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span class="inline-kv">Taxa de Sucesso</span>
              <span style="font-size: 0.8rem; color: var(--brand-green); font-weight: 500;" id="success-rate">100%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="inline-kv">Eventos/min</span>
              <span style="font-size: 0.8rem; color: var(--text-primary); font-weight: 500;" id="events-per-min">0</span>
            </div>
          </div>
        </div>
        
        <div class="card" style="padding: 1.25rem;">
          <h3 style="font-size: 1rem; font-weight: 550; color: var(--text-primary); margin-bottom: 1rem;">
            Controles
          </h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <button id="clear-telemetry" class="soft" style="font-size: 0.75rem; padding: 0.5rem;">
              Limpar Dados
            </button>
            <button id="export-telemetry" class="soft" style="font-size: 0.75rem; padding: 0.5rem;">
              Exportar Log
            </button>
            <button id="refresh-metrics" class="primary" style="font-size: 0.75rem; padding: 0.5rem;">
              Atualizar
            </button>
          </div>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 2rem;">
        <div class="card" style="padding: 1.5rem;">
          <h3 style="font-size: 1.1rem; font-weight: 550; color: var(--text-primary); margin-bottom: 1rem;">
            Log de Eventos
          </h3>
          <div id="telemetry-events" style="max-height: 400px; overflow-y: auto;">
            <div class="loader-pulse" style="text-align: center; padding: 2rem;">
              Carregando dados de telemetria...
            </div>
          </div>
        </div>
        
        <div class="card" style="padding: 1.5rem;">
          <h3 style="font-size: 1.1rem; font-weight: 550; color: var(--text-primary); margin-bottom: 1rem;">
            Alertas
          </h3>
          <div id="system-alerts">
            <div style="padding: 1rem; text-align: center; color: var(--text-secondary); font-size: 0.8rem;">
              Nenhum alerta ativo
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initializeTelemetryPanel() {
  // Event listeners
  const clearButton = document.getElementById('clear-telemetry');
  const exportButton = document.getElementById('export-telemetry');
  const refreshButton = document.getElementById('refresh-metrics');
  
  if (clearButton) {
    clearButton.addEventListener('click', () => {
      TelemetryService.clear();
      loadTelemetryEvents();
      TelemetryService.track('telemetry.clear');
    });
  }
  
  if (exportButton) {
    exportButton.addEventListener('click', () => {
      exportTelemetryData();
      TelemetryService.track('telemetry.export');
    });
  }
  
  if (refreshButton) {
    refreshButton.addEventListener('click', () => {
      updateMetrics();
      loadTelemetryEvents();
      TelemetryService.track('telemetry.refresh');
    });
  }
  
  // Inicializar dados
  updateMetrics();
  loadTelemetryEvents();
  
  // Auto-refresh a cada 5 segundos
  setInterval(() => {
    updateMetrics();
    loadTelemetryEvents();
  }, 5000);
}

function updateMetrics() {
  const events = TelemetryService.getEvents();
  const now = new Date();
  
  // Calcular uptime (simular desde que a página foi carregada)
  const uptime = Math.floor((now - window.startTime || now) / 1000);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;
  
  const uptimeElement = document.getElementById('uptime');
  if (uptimeElement) {
    uptimeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Simular métricas
  const activeAgentsElement = document.getElementById('active-agents');
  if (activeAgentsElement) {
    activeAgentsElement.textContent = Math.floor(Math.random() * 3) + 1;
  }
  
  const lastSyncElement = document.getElementById('last-sync');
  if (lastSyncElement) {
    lastSyncElement.textContent = new Date().toLocaleTimeString('pt-BR');
  }
  
  const avgLatencyElement = document.getElementById('avg-latency');
  if (avgLatencyElement) {
    avgLatencyElement.textContent = `${Math.floor(Math.random() * 50) + 15}ms`;
  }
  
  const successRateElement = document.getElementById('success-rate');
  if (successRateElement) {
    successRateElement.textContent = `${(95 + Math.random() * 5).toFixed(1)}%`;
  }
  
  const eventsPerMinElement = document.getElementById('events-per-min');
  if (eventsPerMinElement) {
    eventsPerMinElement.textContent = Math.floor(Math.random() * 20) + 5;
  }
}

function loadTelemetryEvents() {
  const container = document.getElementById('telemetry-events');
  if (!container) return;
  
  const events = TelemetryService.getEvents().slice(-20).reverse(); // Últimos 20 eventos
  
  if (events.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-secondary); font-size: 0.85rem;">
        Nenhum evento registrado ainda
      </div>
    `;
    return;
  }
  
  container.innerHTML = events.map(event => `
    <div class="telemetry-item" style="margin-bottom: 0.5rem;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
        <span style="font-size: 0.7rem; color: var(--text-secondary);">
          ${formatEventTime(event.timestamp)}
        </span>
        <span class="status-block">
          ${getEventLevel(event.event)}
        </span>
      </div>
      <p style="font-size: 0.75rem; color: var(--text-primary); line-height: 1.4;">
        <strong>${event.event}</strong>
        ${event.data ? ` • ${formatEventData(event.data)}` : ''}
      </p>
    </div>
  `).join('');
}

function formatEventTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });
}

function getEventLevel(eventName) {
  if (eventName.includes('error')) return 'ERROR';
  if (eventName.includes('warning')) return 'WARN';
  if (eventName.includes('load') || eventName.includes('click')) return 'INFO';
  return 'DEBUG';
}

function formatEventData(data) {
  if (typeof data === 'object') {
    return JSON.stringify(data).substring(0, 50) + (JSON.stringify(data).length > 50 ? '...' : '');
  }
  return String(data).substring(0, 50);
}

function exportTelemetryData() {
  const events = TelemetryService.getEvents();
  const data = {
    exportDate: new Date().toISOString(),
    totalEvents: events.length,
    events: events
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `lichtara-telemetry-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

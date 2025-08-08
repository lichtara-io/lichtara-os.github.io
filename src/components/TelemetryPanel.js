export function renderTelemetryPanel(state) {
  const container = document.createElement('div');
  container.className = 'p-6 space-y-6 bg-white';

  const header = document.createElement('div');
  header.className = 'flex items-center justify-between';
  header.innerHTML = `
    <div>
      <h2 class="text-lg font-semibold mb-1 text-gray-900">Telemetria</h2>
      <p class="text-sm text-gray-600">Logs e eventos do sistema em tempo real.</p>
    </div>
    <div class="flex gap-2">
      <button 
        id="clear-logs" 
        type="button"
        class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition text-gray-700"
      >
        Limpar
      </button>
      <button 
        id="toggle-auto-scroll" 
        type="button"
        class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition text-gray-700"
        data-auto="true"
      >
        Auto-scroll: ON
      </button>
    </div>
  `;
  container.appendChild(header);

  const stats = document.createElement('div');
  stats.className = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4';
  stats.innerHTML = `
    <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div class="text-xs text-gray-600 mb-1 font-medium">Total de Eventos</div>
      <div id="total-events" class="text-lg font-semibold text-gray-900">0</div>
    </div>
    <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div class="text-xs text-gray-600 mb-1 font-medium">Último Evento</div>
      <div id="last-event" class="text-sm text-gray-800">-</div>
    </div>
    <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div class="text-xs text-gray-600 mb-1 font-medium">Agentes Ativos</div>
      <div id="active-agents" class="text-lg font-semibold text-green-600">0</div>
    </div>
    <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div class="text-xs text-gray-600 mb-1 font-medium">Taxa de Eventos</div>
      <div id="event-rate" class="text-sm text-gray-800">0/min</div>
    </div>
  `;
  container.appendChild(stats);

  const filters = document.createElement('div');
  filters.className = 'flex flex-wrap gap-2';
  filters.innerHTML = `
    <span class="text-xs text-gray-600 self-center font-medium">Filtros:</span>
    ${['all', 'info', 'warning', 'error', 'debug'].map(level => `
      <button 
        type="button"
        class="filter-btn px-3 py-1 text-xs rounded-full border transition ${level === 'all' ? 
          'bg-blue-600 border-blue-600 text-white' : 
          'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }" 
        data-level="${level}"
      >
        ${level.toUpperCase()}
      </button>
    `).join('')}
  `;
  container.appendChild(filters);

  const logs = document.createElement('div');
  logs.id = 'telemetry-logs';
  logs.className = 'bg-white border border-gray-200 rounded-lg h-96 overflow-y-auto font-mono text-xs shadow-sm';
  container.appendChild(logs);

  // State
  let currentFilter = 'all';
  let autoScroll = true;

  // Event listeners
  const clearBtn = header.querySelector('#clear-logs');
  const toggleBtn = header.querySelector('#toggle-auto-scroll');
  const filterBtns = filters.querySelectorAll('.filter-btn');

  clearBtn.addEventListener('click', () => {
    state.telemetry.clearEvents();
    updateDisplay();
  });

  toggleBtn.addEventListener('click', () => {
    autoScroll = !autoScroll;
    toggleBtn.textContent = `Auto-scroll: ${autoScroll ? 'ON' : 'OFF'}`;
    toggleBtn.dataset.auto = autoScroll.toString();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update filter
      filterBtns.forEach(b => {
        b.className = b.className.replace(/bg-blue-\w+ border-blue-\w+ text-white/, 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50');
      });
      btn.className = btn.className.replace(/bg-white border-gray-\w+ text-gray-\w+ hover:bg-gray-\w+/, 'bg-blue-600 border-blue-600 text-white');
      
      currentFilter = btn.dataset.level;
      updateDisplay();
    });
  });

  // Auto-update
  const updateInterval = setInterval(updateDisplay, 1000);
  
  // Cleanup on removal
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.removedNodes.forEach((node) => {
          if (node === container) {
            clearInterval(updateInterval);
            observer.disconnect();
          }
        });
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  function updateDisplay() {
    const events = state.telemetry.getEvents();
    const filtered = currentFilter === 'all' ? events : events.filter(e => e.level === currentFilter);

    // Update stats
    const totalEvents = stats.querySelector('#total-events');
    const lastEvent = stats.querySelector('#last-event');
    const activeAgents = stats.querySelector('#active-agents');
    const eventRate = stats.querySelector('#event-rate');

    totalEvents.textContent = events.length;
    lastEvent.textContent = events.length > 0 ? 
      new Date(events[events.length - 1].timestamp).toLocaleTimeString() : '-';
    activeAgents.textContent = state.agents.filter(a => a.status === 'active').length;
    
    // Calculate event rate (events in last minute)
    const oneMinuteAgo = Date.now() - 60000;
    const recentEvents = events.filter(e => e.timestamp > oneMinuteAgo);
    eventRate.textContent = `${recentEvents.length}/min`;

    // Update logs
    logs.innerHTML = filtered.map(event => formatLogEntry(event)).join('');
    
    if (autoScroll) {
      logs.scrollTop = logs.scrollHeight;
    }
  }

  function formatLogEntry(event) {
    const levelColors = {
      info: 'text-blue-600',
      warning: 'text-amber-600',
      error: 'text-red-600',
      debug: 'text-gray-500'
    };
    
    const timeStr = new Date(event.timestamp).toLocaleTimeString();
    const levelColor = levelColors[event.level] || 'text-gray-800';
    
    return `
      <div class="p-3 border-b border-gray-100 hover:bg-gray-50">
        <div class="flex items-center gap-3 mb-1">
          <span class="text-gray-500 text-[11px]">${timeStr}</span>
          <span class="${levelColor} uppercase font-medium text-[11px]">[${event.level}]</span>
          ${event.source ? `<span class="text-gray-600 text-[11px]">${event.source}</span>` : ''}
        </div>
        <div class="text-gray-900 pl-4 text-xs">${event.message}</div>
        ${event.data ? `
          <div class="pl-4 mt-1">
            <pre class="text-gray-600 text-[10px] bg-gray-50 p-2 rounded border overflow-x-auto">${JSON.stringify(event.data, null, 2)}</pre>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Initial update
  updateDisplay();

  return container;
}

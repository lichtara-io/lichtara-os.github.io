export function renderTelemetryPanel(state) {
  const container = document.createElement('div');
  container.className = 'p-6 space-y-6';

  const header = document.createElement('div');
  header.className = 'flex items-center justify-between';
  header.innerHTML = `
    <div>
      <h2 class="text-lg font-semibold mb-1">Telemetria</h2>
      <p class="text-sm text-slate-400">Logs e eventos do sistema em tempo real.</p>
    </div>
    <div class="flex gap-2">
      <button 
        id="clear-logs" 
        type="button"
        class="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition"
      >
        Limpar
      </button>
      <button 
        id="toggle-auto-scroll" 
        type="button"
        class="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition"
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
    <div class="bg-slate-900/60 border border-slate-800 rounded p-3">
      <div class="text-xs text-slate-400 mb-1">Total de Eventos</div>
      <div id="total-events" class="text-lg font-semibold text-slate-100">0</div>
    </div>
    <div class="bg-slate-900/60 border border-slate-800 rounded p-3">
      <div class="text-xs text-slate-400 mb-1">Último Evento</div>
      <div id="last-event" class="text-sm text-slate-300">-</div>
    </div>
    <div class="bg-slate-900/60 border border-slate-800 rounded p-3">
      <div class="text-xs text-slate-400 mb-1">Agentes Ativos</div>
      <div id="active-agents" class="text-lg font-semibold text-emerald-300">0</div>
    </div>
    <div class="bg-slate-900/60 border border-slate-800 rounded p-3">
      <div class="text-xs text-slate-400 mb-1">Taxa de Eventos</div>
      <div id="event-rate" class="text-sm text-slate-300">0/min</div>
    </div>
  `;
  container.appendChild(stats);

  const filters = document.createElement('div');
  filters.className = 'flex flex-wrap gap-2';
  filters.innerHTML = `
    <span class="text-xs text-slate-400 self-center">Filtros:</span>
    ${['all', 'info', 'warning', 'error', 'debug'].map(level => `
      <button 
        type="button"
        class="filter-btn px-3 py-1 text-xs rounded border transition ${level === 'all' ? 
          'bg-emerald-600 border-emerald-600 text-white' : 
          'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
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
  logs.className = 'bg-slate-950 border border-slate-800 rounded h-96 overflow-y-auto font-mono text-xs';
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
        b.className = b.className.replace(/bg-emerald-\w+ border-emerald-\w+ text-white/, 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700');
      });
      btn.className = btn.className.replace(/bg-slate-\w+ border-slate-\w+ text-slate-\w+ hover:bg-slate-\w+/, 'bg-emerald-600 border-emerald-600 text-white');
      
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
      info: 'text-blue-400',
      warning: 'text-yellow-400',
      error: 'text-red-400',
      debug: 'text-slate-500'
    };
    
    const timeStr = new Date(event.timestamp).toLocaleTimeString();
    const levelColor = levelColors[event.level] || 'text-slate-300';
    
    return `
      <div class="p-2 border-b border-slate-800/50 hover:bg-slate-900/30">
        <div class="flex items-center gap-3 mb-1">
          <span class="text-slate-500">${timeStr}</span>
          <span class="${levelColor} uppercase font-medium">[${event.level}]</span>
          ${event.source ? `<span class="text-slate-400">${event.source}</span>` : ''}
        </div>
        <div class="text-slate-200 pl-4">${event.message}</div>
        ${event.data ? `
          <div class="pl-4 mt-1">
            <pre class="text-slate-400 text-[11px]">${JSON.stringify(event.data, null, 2)}</pre>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Initial update
  updateDisplay();

  return container;
}

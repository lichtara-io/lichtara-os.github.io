import { renderAgentDetails } from './AgentDetails.js';

export function renderAgentsGrid(state) {
  const container = document.createElement('div');
  container.className = 'p-6 space-y-6';

  const header = document.createElement('div');
  header.innerHTML = `
    <h2 class="text-lg font-semibold mb-2">Agentes</h2>
    <p class="text-sm text-slate-400">Selecione um agente para visualizar Manifest e Prompt (se público).</p>
  `;
  container.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  
  state.agents.forEach(agent => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `
      text-left rounded border border-slate-800 bg-slate-900/60 p-4 hover:border-emerald-500
      transition focus:outline-none focus:ring-2 focus:ring-emerald-500
    `;
    card.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-medium">${agent.name || agent.code}</h3>
        ${badge(agent.status)}
      </div>
      <div class="text-xs space-y-1">
        <div><span class="text-slate-400">Role:</span> ${agent.role || '-'}</div>
        <div><span class="text-slate-400">Maturity:</span> ${agent.maturity}</div>
        <div><span class="text-slate-400">Public:</span> ${agent.public ? 'Sim' : 'Não'}</div>
        ${agent.capabilities ? `<div><span class="text-slate-400">Capabilities:</span> ${agent.capabilities.slice(0,2).join(', ')}</div>` : ''}
      </div>
    `;
    card.addEventListener('click', () => openDetails(agent));
    grid.appendChild(card);
  });

  container.appendChild(grid);

  const detailsWrap = document.createElement('div');
  detailsWrap.id = 'agent-details';
  container.appendChild(detailsWrap);

  function openDetails(agent) {
    detailsWrap.innerHTML = '';
    detailsWrap.appendChild(renderAgentDetails(agent));
  }

  return container;
}

function badge(status) {
  const statusNormalized = status?.toLowerCase() || 'unknown';
  const map = {
    'active': 'bg-emerald-600/20 text-emerald-300 border border-emerald-600/30',
    'ready': 'bg-sky-600/20 text-sky-300 border border-sky-600/30',
    'planned': 'bg-amber-600/20 text-amber-300 border border-amber-600/30',
    'concept': 'bg-slate-600/20 text-slate-300 border border-slate-600/30'
  };
  const cls = map[statusNormalized] || 'bg-slate-700/30 text-slate-300 border border-slate-700/50';
  return `<span class="text-[10px] px-2 py-1 rounded ${cls} uppercase tracking-wide">${status || 'Unknown'}</span>`;
}

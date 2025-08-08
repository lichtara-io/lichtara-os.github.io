import { renderAgentDetails } from './AgentDetails.js';

export function renderAgentsGrid(state) {
  const container = document.createElement('div');
  container.className = 'p-6 space-y-6 bg-white';

  const header = document.createElement('div');
  header.innerHTML = `
    <h2 class="text-lg font-semibold mb-2 text-gray-900">Agentes</h2>
    <p class="text-sm text-gray-600">Selecione um agente para visualizar Manifest e Prompt (se público).</p>
  `;
  container.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  
  state.agents.forEach(agent => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `
      text-left rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-md
      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    `;
    card.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-medium text-gray-900">${agent.name || agent.code}</h3>
        ${badge(agent.status)}
      </div>
      <div class="text-xs space-y-2">
        <div><span class="text-gray-500 font-medium">Role:</span> <span class="text-gray-700">${agent.role || '-'}</span></div>
        <div><span class="text-gray-500 font-medium">Maturity:</span> <span class="text-gray-700">${agent.maturity}</span></div>
        <div><span class="text-gray-500 font-medium">Public:</span> <span class="text-gray-700">${agent.public ? 'Sim' : 'Não'}</span></div>
        ${agent.capabilities ? `<div><span class="text-gray-500 font-medium">Capabilities:</span> <span class="text-gray-700">${agent.capabilities.slice(0,2).join(', ')}</span></div>` : ''}
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
    'active': 'bg-green-100 text-green-700 border border-green-200',
    'ready': 'bg-blue-100 text-blue-700 border border-blue-200',
    'planned': 'bg-amber-100 text-amber-700 border border-amber-200',
    'concept': 'bg-gray-100 text-gray-700 border border-gray-200'
  };
  const cls = map[statusNormalized] || 'bg-gray-100 text-gray-600 border border-gray-200';
  return `<span class="text-[10px] px-2 py-1 rounded-full ${cls} uppercase tracking-wide font-medium">${status || 'Unknown'}</span>`;
}

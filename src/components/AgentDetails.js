export function renderAgentDetails(agent) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50';
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.remove();
  });

  const content = document.createElement('div');
  content.className = 'bg-slate-950 border border-slate-800 rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-hidden flex flex-col';
  content.innerHTML = `
    <div class="flex items-center justify-between p-4 border-b border-slate-800 flex-shrink-0">
      <h2 class="text-lg font-semibold">${agent.name || agent.code}</h2>
      <button id="close-details" type="button" class="text-slate-400 hover:text-white">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <div class="flex-1 overflow-auto p-4 space-y-6">
      ${buildAgentInfo(agent)}
      ${buildManifestSection(agent)}
      ${buildPromptSection(agent)}
    </div>
  `;

  content.querySelector('#close-details').addEventListener('click', () => modal.remove());
  modal.appendChild(content);
  return modal;
}

function buildAgentInfo(agent) {
  const info = [
    { label: 'Status', value: agent.status || 'Unknown' },
    { label: 'Role', value: agent.role || '-' },
    { label: 'Maturity', value: agent.maturity || '-' },
    { label: 'Public', value: agent.public ? 'Sim' : 'Não' },
    { label: 'Description', value: agent.description || '-' }
  ];

  return `
    <div>
      <h3 class="font-medium mb-3">Informações do Agente</h3>
      <dl class="grid gap-y-1 text-sm">
        ${info.map(i => `
          <div class="grid grid-cols-[120px,1fr] gap-x-2">
            <dt class="text-slate-400">${i.label}:</dt>
            <dd class="text-slate-100">${i.value}</dd>
          </div>
        `).join('')}
      </dl>
    </div>
  `;
}

function buildManifestSection(agent) {
  if (!agent.manifest) {
    return `
      <div>
        <h3 class="font-medium mb-3">Manifest</h3>
        <p class="text-slate-400 text-sm">Manifest não disponível para este agente.</p>
      </div>
    `;
  }

  return `
    <div>
      <h3 class="font-medium mb-3">Manifest</h3>
      <pre class="bg-slate-900 p-3 rounded text-xs overflow-x-auto text-slate-200 border border-slate-800">${JSON.stringify(agent.manifest, null, 2)}</pre>
    </div>
  `;
}

function buildPromptSection(agent) {
  if (!agent.public || !agent.prompt) {
    return `
      <div>
        <h3 class="font-medium mb-3">Prompt</h3>
        <p class="text-slate-400 text-sm">
          ${!agent.public ? 'Este agente é privado. Prompt não disponível.' : 'Prompt não disponível para este agente.'}
        </p>
      </div>
    `;
  }

  return `
    <div>
      <h3 class="font-medium mb-3">Prompt</h3>
      <div class="bg-slate-900 p-4 rounded text-sm whitespace-pre-wrap border border-slate-800 text-slate-200 font-mono max-h-96 overflow-y-auto">
${agent.prompt}
      </div>
    </div>
  `;
}

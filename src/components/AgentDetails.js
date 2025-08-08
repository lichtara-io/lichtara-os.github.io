export function renderAgentDetails(agent) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4';
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.remove();
  });

  const content = document.createElement('div');
  content.className = 'bg-white border border-gray-200 rounded-xl shadow-xl max-w-4xl max-h-[90vh] overflow-hidden flex flex-col';
  content.innerHTML = `
    <div class="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
      <h2 class="text-xl font-semibold text-gray-900">${agent.name || agent.code}</h2>
      <button id="close-details" type="button" class="text-gray-400 hover:text-gray-600 transition">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <div class="flex-1 overflow-auto p-6 space-y-8 bg-gray-50">
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
      <h3 class="font-semibold mb-4 text-gray-900">Informações do Agente</h3>
      <dl class="grid gap-y-3 text-sm">
        ${info.map(i => `
          <div class="grid grid-cols-[140px,1fr] gap-x-4">
            <dt class="text-gray-600 font-medium">${i.label}:</dt>
            <dd class="text-gray-900">${i.value}</dd>
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
        <h3 class="font-semibold mb-4 text-gray-900">Manifest</h3>
        <p class="text-gray-600 text-sm">Manifest não disponível para este agente.</p>
      </div>
    `;
  }

  return `
    <div>
      <h3 class="font-semibold mb-4 text-gray-900">Manifest</h3>
      <pre class="bg-white p-4 rounded-lg text-xs overflow-x-auto text-gray-800 border border-gray-200 shadow-sm"><code>${JSON.stringify(agent.manifest, null, 2)}</code></pre>
    </div>
  `;
}

function buildPromptSection(agent) {
  if (!agent.public || !agent.prompt) {
    return `
      <div>
        <h3 class="font-semibold mb-4 text-gray-900">Prompt</h3>
        <p class="text-gray-600 text-sm">
          ${!agent.public ? 'Este agente é privado. Prompt não disponível.' : 'Prompt não disponível para este agente.'}
        </p>
      </div>
    `;
  }

  return `
    <div>
      <h3 class="font-semibold mb-4 text-gray-900">Prompt</h3>
      <div class="bg-white p-4 rounded-lg text-sm whitespace-pre-wrap border border-gray-200 text-gray-800 font-mono max-h-96 overflow-y-auto shadow-sm">
${agent.prompt}
      </div>
    </div>
  `;
}

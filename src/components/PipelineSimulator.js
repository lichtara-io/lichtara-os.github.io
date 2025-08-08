export function renderPipelineSimulator(state) {
  const container = document.createElement('div');
  container.className = 'p-6 space-y-6 bg-white';

  const header = document.createElement('div');
  header.innerHTML = `
    <h2 class="text-lg font-semibold mb-2 text-gray-900">Pipeline Simulator</h2>
    <p class="text-sm text-gray-600">Simule pipelines de processamento com os agentes disponíveis.</p>
  `;
  container.appendChild(header);

  const controls = document.createElement('div');
  controls.className = 'flex flex-wrap gap-4';
  controls.innerHTML = `
    <select id="agent-select" class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
      <option value="">Selecionar agente...</option>
      ${state.agents.filter(a => a.status === 'active' || a.status === 'ready').map(a => 
        `<option value="${a.code}">${a.name || a.code}</option>`
      ).join('')}
    </select>
    <input 
      type="text" 
      id="input-data" 
      placeholder="Input de exemplo..." 
      class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
    <button 
      id="run-pipeline" 
      type="button"
      class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition text-white shadow-sm"
    >
      Executar
    </button>
  `;
  container.appendChild(controls);

  const status = document.createElement('div');
  status.id = 'pipeline-status';
  status.className = 'hidden p-4 bg-blue-50 rounded-lg border border-blue-200';
  container.appendChild(status);

  const results = document.createElement('div');
  results.id = 'pipeline-results';
  results.className = 'space-y-4';
  container.appendChild(results);

  // Event listeners
  const runBtn = controls.querySelector('#run-pipeline');
  const agentSelect = controls.querySelector('#agent-select');
  const inputData = controls.querySelector('#input-data');

  runBtn.addEventListener('click', () => {
    const agentCode = agentSelect.value;
    const input = inputData.value.trim();
    
    if (!agentCode) {
      showError('Selecione um agente');
      return;
    }
    if (!input) {
      showError('Digite um input de exemplo');
      return;
    }

    runPipelineSimulation(agentCode, input);
  });

  function showError(msg) {
    status.className = 'p-4 bg-red-50 border border-red-200 rounded-lg';
    status.innerHTML = `<p class="text-red-700 text-sm">${msg}</p>`;
    setTimeout(() => status.classList.add('hidden'), 3000);
  }

  function runPipelineSimulation(agentCode, input) {
    const agent = state.agents.find(a => a.code === agentCode);
    if (!agent) return;

    status.classList.remove('hidden');
    status.className = 'p-4 bg-blue-50 border border-blue-200 rounded-lg';
    status.innerHTML = '<p class="text-blue-700 text-sm">Executando pipeline...</p>';

    // Simulate async processing
    setTimeout(() => {
      const simulation = state.pipelineSimulator.simulate(agent, input);
      displayResults(simulation);
      status.classList.add('hidden');
    }, 1500);
  }

  function displayResults(simulation) {
    const resultCard = document.createElement('div');
    resultCard.className = 'bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm';
    
    resultCard.innerHTML = `
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-gray-900">Execução #${Date.now().toString().slice(-6)}</h4>
        <span class="text-xs text-gray-500">${new Date().toLocaleTimeString()}</span>
      </div>
      
      <div class="grid gap-4 text-sm">
        <div>
          <div class="text-gray-600 mb-1 font-medium">Agente:</div>
          <div class="text-blue-600 font-medium">${simulation.agent.name || simulation.agent.code}</div>
        </div>
        
        <div>
          <div class="text-gray-600 mb-1 font-medium">Input:</div>
          <div class="bg-gray-100 p-3 rounded-lg text-xs font-mono text-gray-800 border">${simulation.input}</div>
        </div>
        
        <div>
          <div class="text-gray-600 mb-1 font-medium">Processamento:</div>
          <div class="space-y-2">
            ${simulation.phases.map(phase => `
              <div class="flex items-center gap-3 text-xs">
                <span class="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                <span class="text-gray-800 font-medium">${phase.name}</span>
                <span class="text-gray-500">(${phase.duration}ms)</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div>
          <div class="text-gray-600 mb-1 font-medium">Output:</div>
          <div class="bg-gray-100 p-3 rounded-lg text-xs font-mono text-gray-800 border max-h-32 overflow-y-auto">${JSON.stringify(simulation.output, null, 2)}</div>
        </div>
        
        <div class="pt-2 border-t border-gray-200">
          <div class="text-gray-600 mb-1 font-medium">Métricas:</div>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>Duração: <span class="text-blue-600 font-medium">${simulation.metrics.totalDuration}ms</span></div>
            <div>Status: <span class="text-green-600 font-medium">${simulation.metrics.status}</span></div>
          </div>
        </div>
      </div>
    `;
    
    results.insertBefore(resultCard, results.firstChild);
    
    // Keep only last 5 results
    while (results.children.length > 5) {
      results.removeChild(results.lastChild);
    }
  }

  return container;
}

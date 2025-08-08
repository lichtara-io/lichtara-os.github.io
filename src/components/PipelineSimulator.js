export function renderPipelineSimulator(state) {
  const container = document.createElement('div');
  container.className = 'p-6 space-y-6';

  const header = document.createElement('div');
  header.innerHTML = `
    <h2 class="text-lg font-semibold mb-2">Pipeline Simulator</h2>
    <p class="text-sm text-slate-400">Simule pipelines de processamento com os agentes disponíveis.</p>
  `;
  container.appendChild(header);

  const controls = document.createElement('div');
  controls.className = 'flex flex-wrap gap-4';
  controls.innerHTML = `
    <select id="agent-select" class="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm">
      <option value="">Selecionar agente...</option>
      ${state.agents.filter(a => a.status === 'active' || a.status === 'ready').map(a => 
        `<option value="${a.code}">${a.name || a.code}</option>`
      ).join('')}
    </select>
    <input 
      type="text" 
      id="input-data" 
      placeholder="Input de exemplo..." 
      class="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm flex-1 min-w-[200px]"
    >
    <button 
      id="run-pipeline" 
      type="button"
      class="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded text-sm font-medium transition"
    >
      Executar
    </button>
  `;
  container.appendChild(controls);

  const status = document.createElement('div');
  status.id = 'pipeline-status';
  status.className = 'hidden p-4 bg-slate-900/50 rounded border border-slate-800';
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
    status.className = 'p-4 bg-red-900/30 border border-red-600/30 rounded';
    status.innerHTML = `<p class="text-red-300 text-sm">${msg}</p>`;
    setTimeout(() => status.classList.add('hidden'), 3000);
  }

  function runPipelineSimulation(agentCode, input) {
    const agent = state.agents.find(a => a.code === agentCode);
    if (!agent) return;

    status.classList.remove('hidden');
    status.className = 'p-4 bg-blue-900/30 border border-blue-600/30 rounded';
    status.innerHTML = '<p class="text-blue-300 text-sm">Executando pipeline...</p>';

    // Simulate async processing
    setTimeout(() => {
      const simulation = state.pipelineSimulator.simulate(agent, input);
      displayResults(simulation);
      status.classList.add('hidden');
    }, 1500);
  }

  function displayResults(simulation) {
    const resultCard = document.createElement('div');
    resultCard.className = 'bg-slate-900/60 border border-slate-800 rounded p-4 space-y-3';
    
    resultCard.innerHTML = `
      <div class="flex items-center justify-between">
        <h4 class="font-medium">Execução #${Date.now().toString().slice(-6)}</h4>
        <span class="text-xs text-slate-400">${new Date().toLocaleTimeString()}</span>
      </div>
      
      <div class="grid gap-3 text-sm">
        <div>
          <div class="text-slate-400 mb-1">Agente:</div>
          <div class="text-emerald-300">${simulation.agent.name || simulation.agent.code}</div>
        </div>
        
        <div>
          <div class="text-slate-400 mb-1">Input:</div>
          <div class="bg-slate-800 p-2 rounded text-xs font-mono">${simulation.input}</div>
        </div>
        
        <div>
          <div class="text-slate-400 mb-1">Processamento:</div>
          <div class="space-y-1">
            ${simulation.phases.map(phase => `
              <div class="flex items-center gap-2 text-xs">
                <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>${phase.name}</span>
                <span class="text-slate-400">(${phase.duration}ms)</span>
              </div>
            `).join('')}
          </div>
        </div>
        
        <div>
          <div class="text-slate-400 mb-1">Output:</div>
          <div class="bg-slate-800 p-2 rounded text-xs font-mono">${JSON.stringify(simulation.output, null, 2)}</div>
        </div>
        
        <div>
          <div class="text-slate-400 mb-1">Métricas:</div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>Duração: <span class="text-emerald-300">${simulation.metrics.totalDuration}ms</span></div>
            <div>Status: <span class="text-emerald-300">${simulation.metrics.status}</span></div>
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

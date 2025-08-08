import { TelemetryService } from '../services/TelemetryService.js';

export function PipelineSimulator() {
  return `
    <div class="fade-in" style="padding: 2rem; max-width: 1200px; margin: 0 auto;">
      <h1 style="font-size: 1.45rem; font-weight: 550; margin-bottom: 0.5rem; color: var(--text-primary);">
        Pipeline de Processamento
      </h1>
      <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 2rem;">
        Fluxo de dados • Processamento vibracional • Sincronização de agentes
      </p>
      
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 2rem;">
        <div class="card" style="padding: 1rem; text-align: center;">
          <h3 style="font-size: 1.8rem; font-weight: 550; color: var(--brand-green); margin-bottom: 0.25rem;">
            47
          </h3>
          <p style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
            Processados
          </p>
        </div>
        <div class="card" style="padding: 1rem; text-align: center;">
          <h3 style="font-size: 1.8rem; font-weight: 550; color: var(--brand-blue); margin-bottom: 0.25rem;">
            12
          </h3>
          <p style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
            Em Processamento
          </p>
        </div>
        <div class="card" style="padding: 1rem; text-align: center;">
          <h3 style="font-size: 1.8rem; font-weight: 550; color: var(--text-muted); margin-bottom: 0.25rem;">
            3
          </h3>
          <p style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
            Na Fila
          </p>
        </div>
        <div class="card" style="padding: 1rem; text-align: center;">
          <h3 style="font-size: 1.8rem; font-weight: 550; color: var(--text-secondary); margin-bottom: 0.25rem;">
            2.3s
          </h3>
          <p style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;">
            Tempo Médio
          </p>
        </div>
      </div>
      
      <div class="card" style="padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="font-size: 1.1rem; font-weight: 550; color: var(--text-primary);">
            Fluxo Atual
          </h3>
          <button id="start-pipeline" class="primary" style="font-size: 0.8rem; padding: 0.5rem 1rem;">
            Iniciar Simulação
          </button>
        </div>
        <div id="pipeline-stages">
          ${createPipelineStages()}
        </div>
      </div>
      
      <div class="card" style="padding: 1.5rem;">
        <h3 style="font-size: 1.1rem; font-weight: 550; color: var(--text-primary); margin-bottom: 1rem;">
          Log de Processamento
        </h3>
        <div id="pipeline-logs" style="max-height: 300px; overflow-y: auto; font-family: var(--mono-font); font-size: 0.75rem; line-height: 1.4;">
          <div style="color: var(--text-secondary); padding: 1rem; text-align: center;">
            Clique em "Iniciar Simulação" para ver o log de processamento
          </div>
        </div>
      </div>
    </div>
  `;
}

function createPipelineStages() {
  const stages = [
    { id: 'input', name: 'Entrada', status: 'ready', progress: 0 },
    { id: 'analysis', name: 'Análise Vibracional', status: 'pending', progress: 0 },
    { id: 'processing', name: 'Processamento', status: 'pending', progress: 0 },
    { id: 'synthesis', name: 'Síntese', status: 'pending', progress: 0 },
    { id: 'output', name: 'Saída', status: 'pending', progress: 0 }
  ];
  
  return stages.map(stage => `
    <div class="pipeline-phase" data-stage="${stage.id}">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
        <span style="font-size: 0.85rem; font-weight: 550; color: var(--text-primary);">
          ${stage.name}
        </span>
        <span class="status-block" data-status="${stage.status}">
          ${getStatusText(stage.status)}
        </span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${stage.progress}%"></div>
      </div>
    </div>
  `).join('');
}

function getStatusText(status) {
  const statusMap = {
    ready: 'Pronto',
    pending: 'Aguardando',
    processing: 'Processando',
    completed: 'Concluído',
    error: 'Erro'
  };
  return statusMap[status] || status;
}

export async function initializePipelineSimulator() {
  const startButton = document.getElementById('start-pipeline');
  if (!startButton) return;
  
  startButton.addEventListener('click', () => {
    TelemetryService.track('pipeline.simulation.start');
    startPipelineSimulation();
  });
}

async function startPipelineSimulation() {
  const stages = ['input', 'analysis', 'processing', 'synthesis', 'output'];
  const logsContainer = document.getElementById('pipeline-logs');
  const startButton = document.getElementById('start-pipeline');
  
  if (startButton) {
    startButton.disabled = true;
    startButton.textContent = 'Simulando...';
  }
  
  // Limpar logs
  if (logsContainer) {
    logsContainer.innerHTML = '';
  }
  
  for (let i = 0; i < stages.length; i++) {
    const stageId = stages[i];
    const stageElement = document.querySelector(`[data-stage="${stageId}"]`);
    const statusElement = stageElement?.querySelector('[data-status]');
    const progressBar = stageElement?.querySelector('.progress-fill');
    
    // Atualizar status para "processando"
    if (statusElement) {
      statusElement.textContent = 'Processando';
      statusElement.dataset.status = 'processing';
    }
    
    addLog(logsContainer, `Iniciando ${getStageName(stageId)}...`);
    
    // Simular progresso
    for (let progress = 0; progress <= 100; progress += 20) {
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
      await sleep(200);
    }
    
    // Marcar como concluído
    if (statusElement) {
      statusElement.textContent = 'Concluído';
      statusElement.dataset.status = 'completed';
    }
    
    addLog(logsContainer, `✓ ${getStageName(stageId)} concluído com sucesso`);
    
    await sleep(500);
  }
  
  addLog(logsContainer, '🎉 Pipeline executado com sucesso!');
  
  if (startButton) {
    startButton.disabled = false;
    startButton.textContent = 'Reiniciar Simulação';
  }
  
  TelemetryService.track('pipeline.simulation.complete');
}

function getStageName(stageId) {
  const stageNames = {
    input: 'Entrada de dados',
    analysis: 'Análise vibracional',
    processing: 'Processamento quântico',
    synthesis: 'Síntese de resultados',
    output: 'Entrega de saída'
  };
  return stageNames[stageId] || stageId;
}

function addLog(container, message) {
  if (!container) return;
  
  const logEntry = document.createElement('div');
  logEntry.className = 'telemetry-item';
  logEntry.style.marginBottom = '0.25rem';
  logEntry.innerHTML = `
    <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
      <span style="font-size: 0.65rem; color: var(--text-secondary);">
        ${new Date().toLocaleTimeString('pt-BR')}
      </span>
      <span class="status-block">INFO</span>
    </div>
    <p style="color: var(--text-primary);">${message}</p>
  `;
  
  container.appendChild(logEntry);
  container.scrollTop = container.scrollHeight;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

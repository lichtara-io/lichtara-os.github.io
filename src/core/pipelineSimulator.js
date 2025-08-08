import { telemetry } from './telemetry.js';

// Simulação local simplificada do pipeline (placeholders)
export async function simulateFullPipeline(input) {
  const start = performance.now();
  telemetry.emit('pipeline:start', { input });

  const phases = [];
  
  async function runPhase(name, fn) {
    const t0 = performance.now();
    try {
      const output = await fn();
      const phase = {
        name,
        output,
        duration: Math.round(performance.now() - t0)
      };
      phases.push(phase);
      telemetry.emit('pipeline:phase', { name, duration: phase.duration });
    } catch (err) {
      phases.push({
        name,
        error: true,
        output: { error: err.message },
        duration: Math.round(performance.now() - t0)
      });
      telemetry.emit('pipeline:error', { name, error: err.message });
      throw err;
    }
  }

  await runPhase('SYNTARIS', () => {
    return {
      essence_core: extractEssence(input.intencao),
      noise_reduction: 0.82,
      alignment_vector: ['claridade', 'propósito', 'foco']
    };
  });

  await runPhase('NAVROS', () => {
    return {
      route: ['LUMORA', 'FLUX', 'KAORAN'],
      decision_basis: 'padrão clássico pipeline interno',
      alternatives_considered: 3
    };
  });

  await runPhase('LUMORA', () => {
    return {
      symbolic_layers: buildSymbolicLayers(input.intencao, input.profundidade),
      pattern_id: genId('pat'),
      integrity_vector: [0.91, 0.88, 0.93]
    };
  });

  await runPhase('FLUX', () => {
    return {
      structured_manifest: {
        title: summarize(input.intencao),
        steps: deriveSteps(input.intencao),
        channel: 'internal-mvp'
      },
      organization_score: 0.87
    };
  });

  await runPhase('KAORAN', () => {
    const score = 0.92;
    return {
      status: score > 0.85 ? 'aligned' : 'marginal',
      score,
      anomalies: [],
      verification_hash: genId('vh')
    };
  });

  telemetry.emit('pipeline:complete', {
    totalDuration: Math.round(performance.now() - start),
    phases: phases.length
  });

  return phases;
}

// Helpers (simples / placeholder)
function extractEssence(text) {
  return text.slice(0, 80).toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').trim();
}

function buildSymbolicLayers(text, depth) {
  const base = extractKeywords(text);
  const layers = [];
  for (let i = 0; i <= depth; i++) {
    layers.push({
      depth: i,
      tokens: base.slice(0, Math.max(3, base.length - i)),
      mode: i === 0 ? 'core' : i === depth ? 'fractal-expansion' : 'structural'
    });
  }
  return layers;
}

function extractKeywords(text) {
  return [...new Set(text.toLowerCase().split(/\s+/)
    .map(w => w.replace(/[^a-záàâãéêíóôõúüç0-9-]/gi,''))
    .filter(w => w.length > 3))];
}

function deriveSteps(text) {
  const kws = extractKeywords(text);
  return kws.slice(0, 5).map((k, i) => ({
    id: i + 1,
    label: 'Etapa ' + (i + 1),
    focus: k
  }));
}

function summarize(text) {
  return text.split(/[.!?]/)[0].slice(0, 60) + (text.length > 60 ? '…' : '');
}

function genId(prefix) {
  return prefix + '_' + Math.random().toString(36).slice(2, 10);
}

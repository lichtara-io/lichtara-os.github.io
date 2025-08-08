export async function loadAgents() {
  const res = await fetch('/agents/agents-interface.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Falha ao carregar agents-interface.json');
  const data = await res.json();
  return data.agents || data; // Compatibilidade com diferentes estruturas
}

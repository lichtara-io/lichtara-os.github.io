export async function loadAgents() {
  const res = await fetch('/public/agents/agents.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Falha ao carregar agents.json');
  const data = await res.json();
  return data.agents || data; // Compatibilidade com diferentes estruturas
}

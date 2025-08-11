document.getElementById('agent-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const question = document.getElementById('agent-input').value.trim();
  const responseDiv = document.getElementById('agent-response');
  if (!question) return;
  // Resposta simples mockada (pode integrar API depois)
  if (question.match(/licença|LL/gi)) {
    responseDiv.textContent = 'A Lichtara License v1.0 reconhece coautoria interdimensional e jurisdição mista. Saiba mais em Licenças.';
  } else if (question.match(/agentes?|ecossistema/gi)) {
    responseDiv.textContent = 'O ecossistema Lichtara reúne agentes vibracionais integrados para missões conscientes. Veja mais na página inicial.';
  } else if (question.match(/missão|aurora/gi)) {
    responseDiv.textContent = 'A Missão Aurora é o campo vivo que originou Lichtara. Descubra a história na página Sobre.';
  } else {
    responseDiv.textContent = 'Pergunta recebida! Aguarde evolução do assistente para respostas mais profundas.';
  }
});
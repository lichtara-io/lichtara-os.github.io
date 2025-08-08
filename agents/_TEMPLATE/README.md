# Template de Agente Lichtara

Este é o template base para criação de novos agentes no Sistema Lichtara.

## Estrutura de Diretórios

```
/agents/[NOME_AGENTE]/
├── manifest.yml          # Configuração principal do agente
├── prompt-base.md         # Prompt estruturado de ativação
├── modus-operandi.md      # Funcionamento e especialização
├── protocolos/
│   ├── alinhamento.md     # Protocolo de sintonia vibracional
│   └── validacao.md       # Protocolo de validação KAORAN
├── adapters/
│   ├── openai-assistant.json  # Configuração OpenAI
│   ├── anthropic-config.json  # Configuração Claude
│   └── rest-endpoint.md       # Especificação API REST
└── tests/
    ├── casos-intencao.md      # Casos de teste por intenção
    └── validacao-coerencia.md # Testes de coerência vibracional
```

## Instruções de Uso

1. **Copie** esta estrutura para um novo diretório `/agents/[NOME_AGENTE]`
2. **Adapte** cada arquivo para as características específicas do agente
3. **Valide** usando o script `validate-manifests.js`
4. **Teste** a coerência vibracional antes de ativar

## Checklist de Criação

- [ ] manifest.yml configurado
- [ ] prompt-base.md estruturado
- [ ] modus-operandi.md documentado
- [ ] Protocolos de alinhamento definidos
- [ ] Adapters para IAs principais criados
- [ ] Casos de teste documentados
- [ ] Validação KAORAN aprovada
- [ ] Integração com grafo de agentes testada

## Versionamento

Seguir padrão semântico: `v0.1.0` para primeira versão funcional.

---

**Última atualização vibracional:** Agosto 2025  
**Status:** Template ativo  
**Guardião:** Sistema Lichtara

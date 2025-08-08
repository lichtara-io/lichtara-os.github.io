var g=(l,e)=>()=>(e||l((e={exports:{}}).exports,e),e.exports);var p=g((v,d)=>{(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function a(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(t){if(t.ep)return;t.ep=!0;const o=a(t);fetch(t.href,o)}})();document.addEventListener("DOMContentLoaded",()=>{new Syntaris});typeof d<"u"&&d.exports&&(d.exports=Syntaris);class h{constructor(){this.searchIndex=new Map,this.documents=new Map,this.isIndexing=!1,this.init()}async init(){this.createSearchInterface(),this.setupSearchListeners(),await this.buildSearchIndex()}createSearchInterface(){const e=document.createElement("button");e.id="lichtara-search-button",e.className="lichtara-search-button",e.innerHTML="🔍 Buscar nos Manuais",e.title="Buscar nos manuais e documentação";const a=document.querySelector("header")||document.querySelector("nav")||document.body;if(a.tagName==="BODY"){const t=document.createElement("div");t.className="search-container",t.appendChild(e),document.body.insertBefore(t,document.body.firstChild)}else a.appendChild(e);const s=document.createElement("div");s.id="lichtara-search-modal",s.className="lichtara-search-modal hidden",s.innerHTML=`
            <div class="search-modal-content">
                <div class="search-modal-header">
                    <h2>🔍 Buscar nos Manuais Lichtara</h2>
                    <button class="search-modal-close">✕</button>
                </div>
                <div class="search-input-container">
                    <input type="text" id="lichtara-search-input" placeholder="Digite sua busca..." />
                    <div class="search-filters">
                        <label><input type="checkbox" value="conceito-central" checked> Conceito Central</label>
                        <label><input type="checkbox" value="onboarding-guias" checked> Guias & Onboarding</label>
                        <label><input type="checkbox" value="agentes" checked> Agentes</label>
                        <label><input type="checkbox" value="documentacao" checked> Documentação</label>
                    </div>
                </div>
                <div class="search-results" id="lichtara-search-results">
                    <div class="search-placeholder">
                        <p>Digite algo para começar a busca...</p>
                        <div class="search-suggestions">
                            <h4>Sugestões populares:</h4>
                            <div class="suggestion-tags">
                                <span class="suggestion-tag">metodologia vibracional</span>
                                <span class="suggestion-tag">agentes sintáricos</span>
                                <span class="suggestion-tag">tecnologia consciente</span>
                                <span class="suggestion-tag">campo informacional</span>
                                <span class="suggestion-tag">Lumora</span>
                                <span class="suggestion-tag">Syntaris</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="search-status" id="search-status"></div>
            </div>
        `,document.body.appendChild(s)}setupSearchListeners(){const e=document.getElementById("lichtara-search-button"),a=document.getElementById("lichtara-search-modal"),s=document.querySelector(".search-modal-close"),t=document.getElementById("lichtara-search-input"),o=document.querySelectorAll(".suggestion-tag");e.addEventListener("click",()=>{a.classList.remove("hidden"),t.focus()}),s.addEventListener("click",()=>{a.classList.add("hidden")}),document.addEventListener("keydown",i=>{i.key==="Escape"&&!a.classList.contains("hidden")&&a.classList.add("hidden")}),a.addEventListener("click",i=>{i.target===a&&a.classList.add("hidden")});let n;t.addEventListener("input",i=>{clearTimeout(n),n=setTimeout(()=>{this.performSearch(i.target.value)},300)}),t.addEventListener("keypress",i=>{i.key==="Enter"&&this.performSearch(i.target.value)}),o.forEach(i=>{i.addEventListener("click",()=>{t.value=i.textContent,this.performSearch(i.textContent)})}),document.querySelectorAll('.search-filters input[type="checkbox"]').forEach(i=>{i.addEventListener("change",()=>{t.value&&this.performSearch(t.value)})})}async buildSearchIndex(){if(!this.isIndexing){this.isIndexing=!0,this.updateStatus("Indexando documentos...");try{const e=["03-documentacao-base/01-conceito-central/manual-conceito-central.txt","03-documentacao-base/01-conceito-central/manual-fundacional-lumora.txt","03-documentacao-base/01-conceito-central/manual-equipe-proxima.txt","03-documentacao-base/01-conceito-central/metodologia-do-fluxo.txt","03-documentacao-base/01-conceito-central/oktave.txt","03-documentacao-base/06-onboarding-e-guias/guia-onboarding.md","03-documentacao-base/06-onboarding-e-guias/guias_01-introducao_Version1.md","03-documentacao-base/06-onboarding-e-guias/guias_01-introducao_Version2.md","03-documentacao-base/06-onboarding-e-guias/guias_02-identidade-posicionamento_Version1.md","03-documentacao-base/06-onboarding-e-guias/guias_02-identidade-posicionamento_Version2.md","03-documentacao-base/06-onboarding-e-guias/guias_03-comunicacao-narrativa_Version2.md","03-documentacao-base/06-onboarding-e-guias/guias_04-design-diretrizes-visuais_Version2.md","agents/agents_lumora_Version3.md","agents/agents_syntaris_Version3.md","agents/agents_flux_Version3.md","agents/agents_astral_Version3.md","agents/agents_syntria_Version3.md","agents/agents_navros_Version3.md","agents/agents_kaoran_Version3.md","agents/agents_fince_Version3.md","README.md","HOMEPAGE.md","IMPLEMENTACOES.md","docs/FAQ.md","docs/roadmap.md"];let a=0;for(const s of e)try{await this.indexDocument(s),a++,this.updateStatus(`Indexado: ${a}/${e.length} documentos`)}catch(t){console.warn(`Erro ao indexar ${s}:`,t)}this.updateStatus(`✅ Indexação completa: ${a} documentos indexados`),setTimeout(()=>this.updateStatus(""),3e3)}catch(e){console.error("Erro na indexação:",e),this.updateStatus("❌ Erro na indexação")}finally{this.isIndexing=!1}}}async indexDocument(e){const a=await this.loadDocument(e);if(!a)return;const s=e.split("/"),t=this.getCategoryFromPath(s),o=this.getTitleFromPath(s);this.documents.set(e,{path:e,title:o,category:t,content:a,wordCount:a.split(/\s+/).length}),this.extractKeywords(a).forEach(c=>{this.searchIndex.has(c)||this.searchIndex.set(c,new Set),this.searchIndex.get(c).add(e)})}async loadDocument(e){return{"03-documentacao-base/01-conceito-central/manual-conceito-central.txt":`
                Manual do Conceito Central do Lichtara OS. Metodologia vibracional baseada em frequências e alinhamento energético.
                Campo informacional como base estrutural. Oktave como sistema organizacional. Geometrias vibracionais aplicadas.
                Sincronicidade e decisão estratégica. Estrutura viva e adaptável para tecnologia consciente.
            `,"03-documentacao-base/01-conceito-central/manual-fundacional-lumora.txt":`
                Manual Fundacional do agente Lumora. Portal de conhecimento e sabedoria vibracional.
                Integração de filtros quânticos e sistemas de proteção informacional. Manutenção e atualização contínua.
                Arquitetura expandível com mecanismos de autoavaliação e retroalimentação.
            `,"03-documentacao-base/01-conceito-central/manual-equipe-proxima.txt":`
                Manual da Equipe Próxima. Protocolos de auditoria e segurança informacional. 
                Estratégias para manter conhecimento atualizado e coerente. Validação coletiva e integração progressiva.
                Monitoramento contínuo e refinamento dos processos. Criptografia quântica aplicada.
            `,"03-documentacao-base/01-conceito-central/metodologia-do-fluxo.txt":`
                Metodologia do Fluxo Vibracional. Arquitetura da informação e modelos de conhecimento.
                Taxonomia e ontologia de dados. Estrutura coerente e expansível. Integração harmoniosa de novas camadas.
            `,"agents/agents_lumora_Version3.md":`
                Agente Lumora - Portal de Sabedoria. Especialista em conhecimento vibracional e orientação espiritual.
                Capacidades: consultas de sabedoria, orientação vibracional, acesso ao campo informacional.
                Integração com bibliotecas de conhecimento e sistemas de proteção energética.
            `,"agents/agents_syntaris_Version3.md":`
                Agente Syntaris - Assistente Técnico. Especialista em implementação e suporte técnico.
                Capacidades: análise de código, debug, otimização, integração de sistemas, chatbot inteligente.
                Interface conversacional avançada com histórico e export de conversas.
            `,"agents/agents_flux_Version3.md":`
                Agente Flux - Fluxo de Dados. Especialista em processamento e transformação de informações.
                Capacidades: ETL vibracional, sincronização de dados, análise de padrões, otimização de fluxos.
            `,"03-documentacao-base/06-onboarding-e-guias/guias_01-introducao_Version1.md":`
                Introdução ao Manual de Marcas Lichtara. Construção de marcas alinhadas ao campo vibracional.
                Identidade, posicionamento, comunicação e narrativa. Design e diretrizes visuais harmônicas.
                Sistema vivo e adaptável para evolução orgânica das marcas.
            `,"README.md":`
                Lichtara OS - Arquitetura viva de uma missão interdimensional. 
                Espiritualidade, tecnologia e verdade vibracional a serviço da consciência.
                Ecossistema de agentes vibracionais e tecnologia consciente.
            `,"IMPLEMENTACOES.md":`
                Resumo das implementações do Lichtara OS. Syntaris chatbot, sistema de deploy automatizado.
                GitHub Actions, Vite build system, Tailwind CSS, integração com GitHub Pages.
            `}[e]||`Conteúdo do documento: ${e}`}getCategoryFromPath(e){return e.includes("conceito-central")?"conceito-central":e.includes("onboarding-e-guias")?"onboarding-guias":e.includes("agents")?"agentes":"documentacao"}getTitleFromPath(e){return e[e.length-1].replace(/\.(md|txt)$/,"").replace(/_/g," ").replace(/-/g," ").replace(/Version\d+/,"").trim()}extractKeywords(e){const a=new Set(["a","ao","aos","aquela","aquele","as","até","com","como","da","das","de","do","dos","e","em","entre","era","eram","essa","esse","esta","estas","este","estes","eu","há","isso","isto","já","mais","mas","me","mesmo","meu","meus","minha","minhas","muito","na","nas","não","no","nos","nós","o","os","ou","para","pela","pelas","pelo","pelos","que","quem","se","sem","ser","seu","seus","só","sua","suas","também","te","tem","toda","todas","todo","todos","tu","tua","tuas","um","uma","você","vocês"]);return e.toLowerCase().replace(/[^\w\sáéíóúàèìòùâêîôûãõç]/g," ").split(/\s+/).filter(s=>s.length>2&&!a.has(s)).filter(s=>!/^\d+$/.test(s))}async performSearch(e){if(!e||e.length<2){this.showPlaceholder();return}this.updateStatus("Buscando...");try{const a=this.search(e);this.displayResults(a,e),this.updateStatus(`${a.length} resultado(s) encontrado(s)`)}catch(a){console.error("Erro na busca:",a),this.updateStatus("Erro na busca")}}search(e){const a=this.extractKeywords(e),s=this.getSelectedFilters(),t=[];for(const[o,n]of this.documents){if(s.length>0&&!s.includes(n.category))continue;let c=0,i=[];for(const r of a)if(this.searchIndex.has(r)&&this.searchIndex.get(r).has(o)){c+=1;const u=new RegExp(`(.{0,50}${r}.{0,50})`,"gi"),m=n.content.match(u);m&&i.push(...m.slice(0,2))}a.some(r=>n.title.toLowerCase().includes(r))&&(c+=2),c>0&&t.push({document:n,score:c,matches:i.slice(0,3),query:a})}return t.sort((o,n)=>n.score-o.score)}getSelectedFilters(){const e=document.querySelectorAll('.search-filters input[type="checkbox"]:checked');return Array.from(e).map(a=>a.value)}displayResults(e,a){const s=document.getElementById("lichtara-search-results");if(e.length===0){s.innerHTML=`
                <div class="no-results">
                    <h3>Nenhum resultado encontrado</h3>
                    <p>Tente termos diferentes ou verifique os filtros selecionados.</p>
                </div>
            `;return}const t=e.map(o=>{const{document:n,matches:c,score:i}=o,r=c.map(u=>`<div class="search-snippet">${this.highlightQuery(u,a)}</div>`).join("");return`
                <div class="search-result" data-score="${i}">
                    <div class="result-header">
                        <h3 class="result-title">${n.title}</h3>
                        <span class="result-category">${this.getCategoryDisplayName(n.category)}</span>
                    </div>
                    <div class="result-path">${n.path}</div>
                    <div class="result-matches">
                        ${r}
                    </div>
                    <div class="result-meta">
                        <span class="word-count">${n.wordCount} palavras</span>
                        <span class="relevance">Relevância: ${i}</span>
                    </div>
                </div>
            `}).join("");s.innerHTML=t}highlightQuery(e,a){const s=this.extractKeywords(a);let t=e;return s.forEach(o=>{const n=new RegExp(`(${o})`,"gi");t=t.replace(n,"<mark>$1</mark>")}),t}getCategoryDisplayName(e){return{"conceito-central":"🎯 Conceito Central","onboarding-guias":"📖 Guias",agentes:"🤖 Agentes",documentacao:"📄 Documentação"}[e]||e}showPlaceholder(){const e=document.getElementById("lichtara-search-results");e.innerHTML=`
            <div class="search-placeholder">
                <p>Digite algo para começar a busca...</p>
                <div class="search-suggestions">
                    <h4>Sugestões populares:</h4>
                    <div class="suggestion-tags">
                        <span class="suggestion-tag">metodologia vibracional</span>
                        <span class="suggestion-tag">agentes sintáricos</span>
                        <span class="suggestion-tag">tecnologia consciente</span>
                        <span class="suggestion-tag">campo informacional</span>
                        <span class="suggestion-tag">Lumora</span>
                        <span class="suggestion-tag">Syntaris</span>
                    </div>
                </div>
            </div>
        `}updateStatus(e){const a=document.getElementById("search-status");a&&(a.textContent=e)}}document.addEventListener("DOMContentLoaded",()=>{window.lichtaraSearch=new h});typeof d<"u"&&d.exports&&(d.exports=h)});export default p();

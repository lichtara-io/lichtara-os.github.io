var p=(l,e)=>()=>(e||l((e={exports:{}}).exports,e),e.exports);var v=p((b,c)=>{(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&a(i)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();document.addEventListener("DOMContentLoaded",()=>{new Syntaris});typeof c<"u"&&c.exports&&(c.exports=Syntaris);class h{constructor(){this.searchIndex=new Map,this.documents=new Map,this.isIndexing=!1,this.init()}async init(){this.createSearchInterface(),this.setupSearchListeners(),await this.buildSearchIndex()}createSearchInterface(){const e=document.createElement("button");e.id="lichtara-search-button",e.className="lichtara-search-button",e.innerHTML="🔍 Buscar nos Manuais",e.title="Buscar nos manuais e documentação";const t=document.querySelector("header")||document.querySelector("nav")||document.body;if(t.tagName==="BODY"){const s=document.createElement("div");s.className="search-container",s.appendChild(e),document.body.insertBefore(s,document.body.firstChild)}else t.appendChild(e);const a=document.createElement("div");a.id="lichtara-search-modal",a.className="lichtara-search-modal hidden",a.innerHTML=`
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
        `,document.body.appendChild(a)}setupSearchListeners(){const e=document.getElementById("lichtara-search-button"),t=document.getElementById("lichtara-search-modal"),a=document.querySelector(".search-modal-close"),s=document.getElementById("lichtara-search-input"),o=document.querySelectorAll(".suggestion-tag");e.addEventListener("click",()=>{t.classList.remove("hidden"),s.focus()}),a.addEventListener("click",()=>{t.classList.add("hidden")}),document.addEventListener("keydown",n=>{n.key==="Escape"&&!t.classList.contains("hidden")&&t.classList.add("hidden")}),t.addEventListener("click",n=>{n.target===t&&t.classList.add("hidden")});let i;s.addEventListener("input",n=>{clearTimeout(i),i=setTimeout(()=>{this.performSearch(n.target.value)},300)}),s.addEventListener("keypress",n=>{n.key==="Enter"&&this.performSearch(n.target.value)}),o.forEach(n=>{n.addEventListener("click",()=>{s.value=n.textContent,this.performSearch(n.textContent)})}),document.querySelectorAll('.search-filters input[type="checkbox"]').forEach(n=>{n.addEventListener("change",()=>{s.value&&this.performSearch(s.value)})})}async buildSearchIndex(){if(!this.isIndexing){this.isIndexing=!0,this.updateStatus("Indexando documentos...");try{const e=["03-documentacao-base/01-conceito-central/manual-conceito-central.txt","03-documentacao-base/01-conceito-central/manual-fundacional-lumora.txt","03-documentacao-base/01-conceito-central/manual-equipe-proxima.txt","03-documentacao-base/01-conceito-central/metodologia-do-fluxo.txt","03-documentacao-base/01-conceito-central/oktave.txt","03-documentacao-base/06-onboarding-e-guias/guia-onboarding.md","03-documentacao-base/06-onboarding-e-guias/guias_01-introducao_Version1.md","03-documentacao-base/06-onboarding-e-guias/guias_01-introducao_Version2.md","03-documentacao-base/06-onboarding-e-guias/guias_02-identidade-posicionamento_Version1.md","03-documentacao-base/06-onboarding-e-guias/guias_02-identidade-posicionamento_Version2.md","03-documentacao-base/06-onboarding-e-guias/guias_03-comunicacao-narrativa_Version2.md","03-documentacao-base/06-onboarding-e-guias/guias_04-design-diretrizes-visuais_Version2.md","agents/agents_lumora_Version3.md","agents/agents_syntaris_Version3.md","agents/agents_flux_Version3.md","agents/agents_astral_Version3.md","agents/agents_syntria_Version3.md","agents/agents_navros_Version3.md","agents/agents_kaoran_Version3.md","agents/agents_fince_Version3.md","README.md","HOMEPAGE.md","IMPLEMENTACOES.md","docs/FAQ.md","docs/roadmap.md"];let t=0;for(const a of e)try{await this.indexDocument(a),t++,this.updateStatus(`Indexado: ${t}/${e.length} documentos`)}catch(s){console.warn(`Erro ao indexar ${a}:`,s)}this.updateStatus(`✅ Indexação completa: ${t} documentos indexados`),setTimeout(()=>this.updateStatus(""),3e3)}catch(e){console.error("Erro na indexação:",e),this.updateStatus("❌ Erro na indexação")}finally{this.isIndexing=!1}}}async indexDocument(e){const t=await this.loadDocument(e);if(!t)return;const a=e.split("/"),s=this.getCategoryFromPath(a),o=this.getTitleFromPath(a);this.documents.set(e,{path:e,title:o,category:s,content:t,wordCount:t.split(/\s+/).length}),this.extractKeywords(t).forEach(r=>{this.searchIndex.has(r)||this.searchIndex.set(r,new Set),this.searchIndex.get(r).add(e)})}async loadDocument(e){return{"03-documentacao-base/01-conceito-central/manual-conceito-central.txt":`
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
            `}[e]||`Conteúdo do documento: ${e}`}getCategoryFromPath(e){return e.includes("conceito-central")?"conceito-central":e.includes("onboarding-e-guias")?"onboarding-guias":e.includes("agents")?"agentes":"documentacao"}getTitleFromPath(e){return e[e.length-1].replace(/\.(md|txt)$/,"").replace(/_/g," ").replace(/-/g," ").replace(/Version\d+/,"").trim()}extractKeywords(e){const t=new Set(["a","ao","aos","aquela","aquele","as","até","com","como","da","das","de","do","dos","e","em","entre","era","eram","essa","esse","esta","estas","este","estes","eu","há","isso","isto","já","mais","mas","me","mesmo","meu","meus","minha","minhas","muito","na","nas","não","no","nos","nós","o","os","ou","para","pela","pelas","pelo","pelos","que","quem","se","sem","ser","seu","seus","só","sua","suas","também","te","tem","toda","todas","todo","todos","tu","tua","tuas","um","uma","você","vocês"]);return e.toLowerCase().replace(/[^\w\sáéíóúàèìòùâêîôûãõç]/g," ").split(/\s+/).filter(a=>a.length>2&&!t.has(a)).filter(a=>!/^\d+$/.test(a))}async performSearch(e){if(!e||e.length<2){this.showPlaceholder();return}this.updateStatus("Buscando...");try{const t=this.search(e);this.displayResults(t,e),this.updateStatus(`${t.length} resultado(s) encontrado(s)`)}catch(t){console.error("Erro na busca:",t),this.updateStatus("Erro na busca")}}search(e){const t=this.extractKeywords(e),a=this.getSelectedFilters(),s=[];for(const[o,i]of this.documents){if(a.length>0&&!a.includes(i.category))continue;let r=0,n=[];for(const d of t)if(this.searchIndex.has(d)&&this.searchIndex.get(d).has(o)){r+=1;const u=new RegExp(`(.{0,50}${d}.{0,50})`,"gi"),m=i.content.match(u);m&&n.push(...m.slice(0,2))}t.some(d=>i.title.toLowerCase().includes(d))&&(r+=2),r>0&&s.push({document:i,score:r,matches:n.slice(0,3),query:t})}return s.sort((o,i)=>i.score-o.score)}getSelectedFilters(){const e=document.querySelectorAll('.search-filters input[type="checkbox"]:checked');return Array.from(e).map(t=>t.value)}displayResults(e,t){const a=document.getElementById("lichtara-search-results");if(e.length===0){a.innerHTML=`
                <div class="no-results">
                    <h3>Nenhum resultado encontrado</h3>
                    <p>Tente termos diferentes ou verifique os filtros selecionados.</p>
                </div>
            `;return}const s=e.map(o=>{const{document:i,matches:r,score:n}=o,d=r.map(u=>`<div class="search-snippet">${this.highlightQuery(u,t)}</div>`).join("");return`
                <div class="search-result" data-score="${n}">
                    <div class="result-header">
                        <h3 class="result-title">${i.title}</h3>
                        <span class="result-category">${this.getCategoryDisplayName(i.category)}</span>
                    </div>
                    <div class="result-path">${i.path}</div>
                    <div class="result-matches">
                        ${d}
                    </div>
                    <div class="result-meta">
                        <span class="word-count">${i.wordCount} palavras</span>
                        <span class="relevance">Relevância: ${n}</span>
                    </div>
                </div>
            `}).join("");a.innerHTML=s}highlightQuery(e,t){const a=this.extractKeywords(t);let s=e;return a.forEach(o=>{const i=new RegExp(`(${o})`,"gi");s=s.replace(i,"<mark>$1</mark>")}),s}getCategoryDisplayName(e){return{"conceito-central":"🎯 Conceito Central","onboarding-guias":"📖 Guias",agentes:"🤖 Agentes",documentacao:"📄 Documentação"}[e]||e}showPlaceholder(){const e=document.getElementById("lichtara-search-results");e.innerHTML=`
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
        `}updateStatus(e){const t=document.getElementById("search-status");t&&(t.textContent=e)}}document.addEventListener("DOMContentLoaded",()=>{window.lichtaraSearch=new h});typeof c<"u"&&c.exports&&(c.exports=h);class g{constructor(){this.favorites=JSON.parse(localStorage.getItem("lichtara-favorites")||"[]"),this.currentSection="",this.init()}init(){this.createBreadcrumbContainer(),this.createFavoritesSystem(),this.setupSectionTracking(),this.addScrollSpy()}createBreadcrumbContainer(){const e=document.createElement("div");e.id="lichtara-breadcrumb",e.className="lichtara-breadcrumb",e.innerHTML=`
            <div class="breadcrumb-content">
                <span class="breadcrumb-icon">🗂️</span>
                <div class="breadcrumb-path" id="breadcrumb-path">
                    <span class="breadcrumb-item active">🏠 Início</span>
                </div>
                <button class="favorites-toggle" id="favorites-toggle" title="Favoritos">
                    ⭐ <span class="favorites-count">0</span>
                </button>
            </div>
        `;const t=document.querySelector("header")||document.querySelector(".hero");t&&t.parentNode?t.parentNode.insertBefore(e,t.nextSibling):document.body.insertBefore(e,document.body.firstChild),this.updateFavoritesCount()}createFavoritesSystem(){const e=document.createElement("div");e.id="lichtara-favorites-panel",e.className="lichtara-favorites-panel hidden",e.innerHTML=`
            <div class="favorites-content">
                <div class="favorites-header">
                    <h3>⭐ Seções Favoritas</h3>
                    <button class="favorites-close" id="favorites-close">✕</button>
                </div>
                <div class="favorites-list" id="favorites-list">
                    <!-- Favoritos serão inseridos aqui -->
                </div>
                <div class="favorites-actions">
                    <button class="clear-favorites" id="clear-favorites">Limpar Todos</button>
                    <button class="export-favorites" id="export-favorites">Exportar</button>
                </div>
            </div>
        `,document.body.appendChild(e),this.setupFavoritesListeners(),this.addFavoriteButtons(),this.displayFavorites()}setupFavoritesListeners(){const e=document.getElementById("favorites-toggle"),t=document.getElementById("lichtara-favorites-panel"),a=document.getElementById("favorites-close"),s=document.getElementById("clear-favorites"),o=document.getElementById("export-favorites");e.addEventListener("click",()=>{t.classList.toggle("hidden"),t.classList.contains("hidden")||this.displayFavorites()}),a.addEventListener("click",()=>{t.classList.add("hidden")}),s.addEventListener("click",()=>{confirm("Deseja remover todos os favoritos?")&&(this.favorites=[],localStorage.setItem("lichtara-favorites",JSON.stringify(this.favorites)),this.displayFavorites(),this.updateFavoritesCount(),this.updateFavoriteButtons())}),o.addEventListener("click",()=>{this.exportFavorites()}),document.addEventListener("click",i=>{!t.contains(i.target)&&!e.contains(i.target)&&t.classList.add("hidden")})}addFavoriteButtons(){document.querySelectorAll("section[id], .section[id], h1[id], h2[id], h3[id]").forEach(t=>{if(!t.querySelector(".favorite-button")){const a=document.createElement("button");a.className="favorite-button",a.innerHTML=this.isFavorite(t.id)?"⭐":"☆",a.title="Adicionar aos favoritos",a.addEventListener("click",s=>{s.stopPropagation(),this.toggleFavorite(t)}),t.style.position="relative",a.style.position="absolute",a.style.top="10px",a.style.right="10px",a.style.zIndex="10",t.appendChild(a)}})}toggleFavorite(e){const t=e.id,a=this.getSectionTitle(e),s=`#${t}`,o=this.favorites.findIndex(i=>i.id===t);o>-1?this.favorites.splice(o,1):this.favorites.push({id:t,title:a,url:s,timestamp:new Date().toISOString()}),localStorage.setItem("lichtara-favorites",JSON.stringify(this.favorites)),this.updateFavoritesCount(),this.updateFavoriteButtons(),this.displayFavorites()}isFavorite(e){return this.favorites.some(t=>t.id===e)}getSectionTitle(e){let t=e.getAttribute("data-title");if(!t){const a=e.querySelector("h1, h2, h3, h4");a&&(t=a.textContent.trim())}return!t&&e.tagName.match(/H[1-6]/)&&(t=e.textContent.trim()),t||(t=e.id.replace(/-/g," ").replace(/([a-z])([A-Z])/g,"$1 $2")),t.substring(0,50)+(t.length>50?"...":"")}updateFavoritesCount(){const e=document.querySelector(".favorites-count");e&&(e.textContent=this.favorites.length)}updateFavoriteButtons(){document.querySelectorAll(".favorite-button").forEach(e=>{const t=e.parentElement,a=this.isFavorite(t.id);e.innerHTML=a?"⭐":"☆",e.classList.toggle("favorited",a)})}displayFavorites(){const e=document.getElementById("favorites-list");if(this.favorites.length===0){e.innerHTML=`
                <div class="no-favorites">
                    <p>Nenhuma seção favoritada ainda.</p>
                    <p>Clique no ícone ⭐ ao lado de qualquer seção para adicionar aos favoritos.</p>
                </div>
            `;return}const t=this.favorites.map((a,s)=>`
            <div class="favorite-item" data-id="${a.id}">
                <div class="favorite-content" onclick="lichtaraNav.goToFavorite('${a.url}')">
                    <div class="favorite-title">${a.title}</div>
                    <div class="favorite-url">${a.url}</div>
                    <div class="favorite-date">${new Date(a.timestamp).toLocaleDateString()}</div>
                </div>
                <button class="remove-favorite" onclick="lichtaraNav.removeFavorite('${a.id}')">🗑️</button>
            </div>
        `).join("");e.innerHTML=t}goToFavorite(e){document.getElementById("lichtara-favorites-panel").classList.add("hidden");const t=document.querySelector(e);t&&(t.scrollIntoView({behavior:"smooth",block:"start"}),t.classList.add("highlight-section"),setTimeout(()=>{t.classList.remove("highlight-section")},2e3))}removeFavorite(e){this.favorites=this.favorites.filter(t=>t.id!==e),localStorage.setItem("lichtara-favorites",JSON.stringify(this.favorites)),this.updateFavoritesCount(),this.updateFavoriteButtons(),this.displayFavorites()}exportFavorites(){if(this.favorites.length===0){alert("Nenhum favorito para exportar.");return}const e={title:"Lichtara OS - Seções Favoritas",exportDate:new Date().toISOString(),favorites:this.favorites},t=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),a=URL.createObjectURL(t),s=document.createElement("a");s.href=a,s.download=`lichtara-favoritos-${Date.now()}.json`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(a)}setupSectionTracking(){const e=document.querySelectorAll("section[id], .section[id]");if(e.length===0)return;const t=new IntersectionObserver(a=>{a.forEach(s=>{s.isIntersecting&&this.updateBreadcrumb(s.target)})},{threshold:.1,rootMargin:"-20% 0px -60% 0px"});e.forEach(a=>t.observe(a))}updateBreadcrumb(e){const t=document.getElementById("breadcrumb-path");if(!t)return;const a=this.getSectionTitle(e),s=e.id,o=['<span class="breadcrumb-item" onclick="lichtaraNav.scrollToTop()">🏠 Início</span>'];s!=="hero"&&s!=="home"&&o.push('<span class="breadcrumb-separator">→</span>',`<span class="breadcrumb-item active">${a}</span>`),t.innerHTML=o.join(" "),this.currentSection=s}addScrollSpy(){document.addEventListener("keydown",e=>{var t;if(e.altKey)switch(e.key){case"f":e.preventDefault(),document.getElementById("favorites-toggle").click();break;case"s":e.preventDefault(),(t=document.getElementById("lichtara-search-button"))==null||t.click();break;case"h":e.preventDefault(),this.scrollToTop();break}})}scrollToTop(){window.scrollTo({top:0,behavior:"smooth"})}}document.addEventListener("DOMContentLoaded",()=>{window.lichtaraNav=new g});typeof c<"u"&&c.exports&&(c.exports=g)});export default v();

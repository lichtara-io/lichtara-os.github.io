(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))o(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const d of a.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function s(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function o(r){if(r.ep)return;r.ep=!0;const a=s(r);fetch(r.href,a)}})();async function N(){const t=await fetch("/agents/agents-interface.json",{cache:"no-store"});if(!t.ok)throw new Error("Falha ao carregar agents-interface.json");const e=await t.json();return e.agents||e}function T(t){const e=document.createElement("div");e.className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4",e.addEventListener("click",o=>{o.target===e&&e.remove()});const s=document.createElement("div");return s.className="bg-white border border-gray-200 rounded-xl shadow-xl max-w-4xl max-h-[90vh] overflow-hidden flex flex-col",s.innerHTML=`
    <div class="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
      <h2 class="text-xl font-semibold text-gray-900">${t.name||t.code}</h2>
      <button id="close-details" type="button" class="text-gray-400 hover:text-gray-600 transition">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <div class="flex-1 overflow-auto p-6 space-y-8 bg-gray-50">
      ${M(t)}
      ${k(t)}
      ${A(t)}
    </div>
  `,s.querySelector("#close-details").addEventListener("click",()=>e.remove()),e.appendChild(s),e}function M(t){return`
    <div>
      <h3 class="font-semibold mb-4 text-gray-900">Informações do Agente</h3>
      <dl class="grid gap-y-3 text-sm">
        ${[{label:"Status",value:t.status||"Unknown"},{label:"Role",value:t.role||"-"},{label:"Maturity",value:t.maturity||"-"},{label:"Public",value:t.public?"Sim":"Não"},{label:"Description",value:t.description||"-"}].map(s=>`
          <div class="grid grid-cols-[140px,1fr] gap-x-4">
            <dt class="text-gray-600 font-medium">${s.label}:</dt>
            <dd class="text-gray-900">${s.value}</dd>
          </div>
        `).join("")}
      </dl>
    </div>
  `}function k(t){return t.manifest?`
    <div>
      <h3 class="font-semibold mb-4 text-gray-900">Manifest</h3>
      <pre class="bg-white p-4 rounded-lg text-xs overflow-x-auto text-gray-800 border border-gray-200 shadow-sm"><code>${JSON.stringify(t.manifest,null,2)}</code></pre>
    </div>
  `:`
      <div>
        <h3 class="font-semibold mb-4 text-gray-900">Manifest</h3>
        <p class="text-gray-600 text-sm">Manifest não disponível para este agente.</p>
      </div>
    `}function A(t){return!t.public||!t.prompt?`
      <div>
        <h3 class="font-semibold mb-4 text-gray-900">Prompt</h3>
        <p class="text-gray-600 text-sm">
          ${t.public?"Prompt não disponível para este agente.":"Este agente é privado. Prompt não disponível."}
        </p>
      </div>
    `:`
    <div>
      <h3 class="font-semibold mb-4 text-gray-900">Prompt</h3>
      <div class="bg-white p-4 rounded-lg text-sm whitespace-pre-wrap border border-gray-200 text-gray-800 font-mono max-h-96 overflow-y-auto shadow-sm">
${t.prompt}
      </div>
    </div>
  `}function O(t){const e=document.createElement("div");e.className="p-6 space-y-6 bg-white";const s=document.createElement("div");s.innerHTML=`
    <h2 class="text-lg font-semibold mb-2 text-gray-900">Agentes</h2>
    <p class="text-sm text-gray-600">Selecione um agente para visualizar Manifest e Prompt (se público).</p>
  `,e.appendChild(s);const o=document.createElement("div");o.className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",t.agents.forEach(d=>{const l=document.createElement("button");l.type="button",l.className=`
      text-left rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-md
      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    `,l.innerHTML=`
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-medium text-gray-900">${d.name||d.code}</h3>
        ${D(d.status)}
      </div>
      <div class="text-xs space-y-2">
        <div><span class="text-gray-500 font-medium">Role:</span> <span class="text-gray-700">${d.role||"-"}</span></div>
        <div><span class="text-gray-500 font-medium">Maturity:</span> <span class="text-gray-700">${d.maturity}</span></div>
        <div><span class="text-gray-500 font-medium">Public:</span> <span class="text-gray-700">${d.public?"Sim":"Não"}</span></div>
        ${d.capabilities?`<div><span class="text-gray-500 font-medium">Capabilities:</span> <span class="text-gray-700">${d.capabilities.slice(0,2).join(", ")}</span></div>`:""}
      </div>
    `,l.addEventListener("click",()=>a(d)),o.appendChild(l)}),e.appendChild(o);const r=document.createElement("div");r.id="agent-details",e.appendChild(r);function a(d){r.innerHTML="",r.appendChild(T(d))}return e}function D(t){const e=t?.toLowerCase()||"unknown";return`<span class="text-[10px] px-2 py-1 rounded-full ${{active:"bg-green-100 text-green-700 border border-green-200",ready:"bg-blue-100 text-blue-700 border border-blue-200",planned:"bg-amber-100 text-amber-700 border border-amber-200",concept:"bg-gray-100 text-gray-700 border border-gray-200"}[e]||"bg-gray-100 text-gray-600 border border-gray-200"} uppercase tracking-wide font-medium">${t||"Unknown"}</span>`}function H(t){const e=document.createElement("div");e.className="p-6 space-y-6 bg-white";const s=document.createElement("div");s.innerHTML=`
    <h2 class="text-lg font-semibold mb-2 text-gray-900">Pipeline Simulator</h2>
    <p class="text-sm text-gray-600">Simule pipelines de processamento com os agentes disponíveis.</p>
  `,e.appendChild(s);const o=document.createElement("div");o.className="flex flex-wrap gap-4",o.innerHTML=`
    <select id="agent-select" class="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
      <option value="">Selecionar agente...</option>
      ${t.agents.filter(i=>i.status==="active"||i.status==="ready").map(i=>`<option value="${i.code}">${i.name||i.code}</option>`).join("")}
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
  `,e.appendChild(o);const r=document.createElement("div");r.id="pipeline-status",r.className="hidden p-4 bg-blue-50 rounded-lg border border-blue-200",e.appendChild(r);const a=document.createElement("div");a.id="pipeline-results",a.className="space-y-4",e.appendChild(a);const d=o.querySelector("#run-pipeline"),l=o.querySelector("#agent-select"),f=o.querySelector("#input-data");d.addEventListener("click",()=>{const i=l.value,c=f.value.trim();if(!i){p("Selecione um agente");return}if(!c){p("Digite um input de exemplo");return}h(i,c)});function p(i){r.className="p-4 bg-red-50 border border-red-200 rounded-lg",r.innerHTML=`<p class="text-red-700 text-sm">${i}</p>`,setTimeout(()=>r.classList.add("hidden"),3e3)}function h(i,c){const m=t.agents.find(n=>n.code===i);m&&(r.classList.remove("hidden"),r.className="p-4 bg-blue-50 border border-blue-200 rounded-lg",r.innerHTML='<p class="text-blue-700 text-sm">Executando pipeline...</p>',setTimeout(()=>{const n=t.pipelineSimulator.simulate(m,c);y(n),r.classList.add("hidden")},1500))}function y(i){const c=document.createElement("div");for(c.className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm",c.innerHTML=`
      <div class="flex items-center justify-between">
        <h4 class="font-medium text-gray-900">Execução #${Date.now().toString().slice(-6)}</h4>
        <span class="text-xs text-gray-500">${new Date().toLocaleTimeString()}</span>
      </div>
      
      <div class="grid gap-4 text-sm">
        <div>
          <div class="text-gray-600 mb-1 font-medium">Agente:</div>
          <div class="text-blue-600 font-medium">${i.agent.name||i.agent.code}</div>
        </div>
        
        <div>
          <div class="text-gray-600 mb-1 font-medium">Input:</div>
          <div class="bg-gray-100 p-3 rounded-lg text-xs font-mono text-gray-800 border">${i.input}</div>
        </div>
        
        <div>
          <div class="text-gray-600 mb-1 font-medium">Processamento:</div>
          <div class="space-y-2">
            ${i.phases.map(m=>`
              <div class="flex items-center gap-3 text-xs">
                <span class="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                <span class="text-gray-800 font-medium">${m.name}</span>
                <span class="text-gray-500">(${m.duration}ms)</span>
              </div>
            `).join("")}
          </div>
        </div>
        
        <div>
          <div class="text-gray-600 mb-1 font-medium">Output:</div>
          <div class="bg-gray-100 p-3 rounded-lg text-xs font-mono text-gray-800 border max-h-32 overflow-y-auto">${JSON.stringify(i.output,null,2)}</div>
        </div>
        
        <div class="pt-2 border-t border-gray-200">
          <div class="text-gray-600 mb-1 font-medium">Métricas:</div>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>Duração: <span class="text-blue-600 font-medium">${i.metrics.totalDuration}ms</span></div>
            <div>Status: <span class="text-green-600 font-medium">${i.metrics.status}</span></div>
          </div>
        </div>
      </div>
    `,a.insertBefore(c,a.firstChild);a.children.length>5;)a.removeChild(a.lastChild)}return e}function P(t){const e=document.createElement("div");e.className="p-6 space-y-6 bg-white";const s=document.createElement("div");s.className="flex items-center justify-between",s.innerHTML=`
    <div>
      <h2 class="text-lg font-semibold mb-1 text-gray-900">Telemetria</h2>
      <p class="text-sm text-gray-600">Logs e eventos do sistema em tempo real.</p>
    </div>
    <div class="flex gap-2">
      <button 
        id="clear-logs" 
        type="button"
        class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition text-gray-700"
      >
        Limpar
      </button>
      <button 
        id="toggle-auto-scroll" 
        type="button"
        class="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 transition text-gray-700"
        data-auto="true"
      >
        Auto-scroll: ON
      </button>
    </div>
  `,e.appendChild(s);const o=document.createElement("div");o.className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4",o.innerHTML=`
    <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div class="text-xs text-gray-600 mb-1 font-medium">Total de Eventos</div>
      <div id="total-events" class="text-lg font-semibold text-gray-900">0</div>
    </div>
    <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div class="text-xs text-gray-600 mb-1 font-medium">Último Evento</div>
      <div id="last-event" class="text-sm text-gray-800">-</div>
    </div>
    <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div class="text-xs text-gray-600 mb-1 font-medium">Agentes Ativos</div>
      <div id="active-agents" class="text-lg font-semibold text-green-600">0</div>
    </div>
    <div class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div class="text-xs text-gray-600 mb-1 font-medium">Taxa de Eventos</div>
      <div id="event-rate" class="text-sm text-gray-800">0/min</div>
    </div>
  `,e.appendChild(o);const r=document.createElement("div");r.className="flex flex-wrap gap-2",r.innerHTML=`
    <span class="text-xs text-gray-600 self-center font-medium">Filtros:</span>
    ${["all","info","warning","error","debug"].map(n=>`
      <button 
        type="button"
        class="filter-btn px-3 py-1 text-xs rounded-full border transition ${n==="all"?"bg-blue-600 border-blue-600 text-white":"bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}" 
        data-level="${n}"
      >
        ${n.toUpperCase()}
      </button>
    `).join("")}
  `,e.appendChild(r);const a=document.createElement("div");a.id="telemetry-logs",a.className="bg-white border border-gray-200 rounded-lg h-96 overflow-y-auto font-mono text-xs shadow-sm",e.appendChild(a);let d="all",l=!0;const f=s.querySelector("#clear-logs"),p=s.querySelector("#toggle-auto-scroll"),h=r.querySelectorAll(".filter-btn");f.addEventListener("click",()=>{t.telemetry.clearEvents(),c()}),p.addEventListener("click",()=>{l=!l,p.textContent=`Auto-scroll: ${l?"ON":"OFF"}`,p.dataset.auto=l.toString()}),h.forEach(n=>{n.addEventListener("click",()=>{h.forEach(u=>{u.className=u.className.replace(/bg-blue-\w+ border-blue-\w+ text-white/,"bg-white border-gray-300 text-gray-700 hover:bg-gray-50")}),n.className=n.className.replace(/bg-white border-gray-\w+ text-gray-\w+ hover:bg-gray-\w+/,"bg-blue-600 border-blue-600 text-white"),d=n.dataset.level,c()})});const y=setInterval(c,1e3),i=new MutationObserver(n=>{n.forEach(u=>{u.type==="childList"&&u.removedNodes.forEach(b=>{b===e&&(clearInterval(y),i.disconnect())})})});i.observe(document.body,{childList:!0,subtree:!0});function c(){const n=t.telemetry.getEvents(),u=d==="all"?n:n.filter(g=>g.level===d),b=o.querySelector("#total-events"),w=o.querySelector("#last-event"),S=o.querySelector("#active-agents"),L=o.querySelector("#event-rate");b.textContent=n.length,w.textContent=n.length>0?new Date(n[n.length-1].timestamp).toLocaleTimeString():"-",S.textContent=t.agents.filter(g=>g.status==="active").length;const $=Date.now()-6e4,C=n.filter(g=>g.timestamp>$);L.textContent=`${C.length}/min`,a.innerHTML=u.map(g=>m(g)).join(""),l&&(a.scrollTop=a.scrollHeight)}function m(n){const u={info:"text-blue-600",warning:"text-amber-600",error:"text-red-600",debug:"text-gray-500"},b=new Date(n.timestamp).toLocaleTimeString(),w=u[n.level]||"text-gray-800";return`
      <div class="p-3 border-b border-gray-100 hover:bg-gray-50">
        <div class="flex items-center gap-3 mb-1">
          <span class="text-gray-500 text-[11px]">${b}</span>
          <span class="${w} uppercase font-medium text-[11px]">[${n.level}]</span>
          ${n.source?`<span class="text-gray-600 text-[11px]">${n.source}</span>`:""}
        </div>
        <div class="text-gray-900 pl-4 text-xs">${n.message}</div>
        ${n.data?`
          <div class="pl-4 mt-1">
            <pre class="text-gray-600 text-[10px] bg-gray-50 p-2 rounded border overflow-x-auto">${JSON.stringify(n.data,null,2)}</pre>
          </div>
        `:""}
      </div>
    `}return c(),e}class j{#e=[];#t=1e3;emit(e,s={}){const o={type:e,data:s,ts:Date.now()};return this.#e.push(o),this.#e.length>this.#t&&this.#e.shift(),o}events(){return[...this.#e]}clear(){this.#e=[]}}const x=new j;let v={agents:[],selectedAgent:null};async function q(){await B(),I(),E("agents")}async function B(){x.emit("app:init",{message:"Inicializando interface"});try{v.agents=await N(),x.emit("agents:loaded",{count:v.agents.length})}catch(t){console.error(t),x.emit("error",{scope:"bootstrap",error:t.message})}}function I(){document.querySelectorAll(".nav-btn").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".nav-btn").forEach(e=>{e.className="nav-btn text-gray-600 hover:text-blue-600"}),t.className="nav-btn text-blue-600 font-medium border-b-2 border-blue-600 pb-1",E(t.dataset.view)})})}function E(t){const e=document.getElementById("view-root");e.innerHTML="",t==="agents"?e.appendChild(O(v)):t==="pipeline"?e.appendChild(H(v)):t==="telemetry"&&e.appendChild(P(v)),x.emit("ui:view",{view:t})}document.addEventListener("DOMContentLoaded",()=>{q()});class R{constructor(){this.routes={"/":()=>this.showHomepage(),"/os":()=>this.redirectToOS(),"/os/":()=>this.redirectToOS(),"/syntaris":()=>this.showSyntaris(),"/docs":()=>this.showDocs(),"/blog":()=>this.showBlog()},this.init()}init(){this.handleRoute(),window.addEventListener("popstate",()=>this.handleRoute()),document.addEventListener("click",e=>{const s=e.target.closest('a[href^="/"]');if(s&&!s.hasAttribute("target")){e.preventDefault();const o=s.getAttribute("href");this.navigateTo(o)}})}handleRoute(){const e=window.location.pathname,s=this.routes[e];s?s():e.startsWith("/os")?this.redirectToOS():e.startsWith("/docs")?this.showDocs():this.show404()}navigateTo(e){window.history.pushState({},"",e),this.handleRoute()}showHomepage(){console.log("Homepage loaded")}redirectToOS(){window.location.href="/os/index.html"}showSyntaris(){this.showComingSoon("Syntaris Agent","Interface dedicada do Syntaris em desenvolvimento...")}showDocs(){window.location.href="/03-documentacao-base/"}showBlog(){this.showComingSoon("Blog Lichtara","Blog em desenvolvimento com insights sobre tecnologia consciente...")}showComingSoon(e,s){const o=document.createElement("div");o.innerHTML=`
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255, 255, 255, 0.95); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
                <div style="background: white; padding: 3rem; border-radius: 12px; text-align: center; max-width: 500px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;">
                    <h2 style="color: #1a1a1a; margin-bottom: 1rem; font-size: 1.75rem; font-weight: 500;">${e}</h2>
                    <p style="color: #6b7280; margin-bottom: 2rem; line-height: 1.6;">${s}</p>
                    <button id="closeOverlay" style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                        Voltar para Home
                    </button>
                </div>
            </div>
        `,document.body.appendChild(o),document.getElementById("closeOverlay").addEventListener("click",()=>{document.body.removeChild(o),this.navigateTo("/")})}show404(){this.showComingSoon("Página não encontrada","Esta página ainda não está disponível.")}}document.addEventListener("DOMContentLoaded",()=>{new R});

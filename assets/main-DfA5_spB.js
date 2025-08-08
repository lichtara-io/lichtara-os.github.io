(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const l of r.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&a(l)}).observe(document,{childList:!0,subtree:!0});function n(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(s){if(s.ep)return;s.ep=!0;const r=n(s);fetch(s.href,r)}})();async function N(){const t=await fetch("/public/agents/agents.json",{cache:"no-store"});if(!t.ok)throw new Error("Falha ao carregar agents.json");const e=await t.json();return e.agents||e}function T(t){const e=document.createElement("div");e.className="fixed inset-0 bg-black/70 flex items-center justify-center z-50",e.addEventListener("click",a=>{a.target===e&&e.remove()});const n=document.createElement("div");return n.className="bg-slate-950 border border-slate-800 rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-hidden flex flex-col",n.innerHTML=`
    <div class="flex items-center justify-between p-4 border-b border-slate-800 flex-shrink-0">
      <h2 class="text-lg font-semibold">${t.name||t.code}</h2>
      <button id="close-details" type="button" class="text-slate-400 hover:text-white">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    <div class="flex-1 overflow-auto p-4 space-y-6">
      ${M(t)}
      ${k(t)}
      ${O(t)}
    </div>
  `,n.querySelector("#close-details").addEventListener("click",()=>e.remove()),e.appendChild(n),e}function M(t){return`
    <div>
      <h3 class="font-medium mb-3">Informações do Agente</h3>
      <dl class="grid gap-y-1 text-sm">
        ${[{label:"Status",value:t.status||"Unknown"},{label:"Role",value:t.role||"-"},{label:"Maturity",value:t.maturity||"-"},{label:"Public",value:t.public?"Sim":"Não"},{label:"Description",value:t.description||"-"}].map(n=>`
          <div class="grid grid-cols-[120px,1fr] gap-x-2">
            <dt class="text-slate-400">${n.label}:</dt>
            <dd class="text-slate-100">${n.value}</dd>
          </div>
        `).join("")}
      </dl>
    </div>
  `}function k(t){return t.manifest?`
    <div>
      <h3 class="font-medium mb-3">Manifest</h3>
      <pre class="bg-slate-900 p-3 rounded text-xs overflow-x-auto text-slate-200 border border-slate-800">${JSON.stringify(t.manifest,null,2)}</pre>
    </div>
  `:`
      <div>
        <h3 class="font-medium mb-3">Manifest</h3>
        <p class="text-slate-400 text-sm">Manifest não disponível para este agente.</p>
      </div>
    `}function O(t){return!t.public||!t.prompt?`
      <div>
        <h3 class="font-medium mb-3">Prompt</h3>
        <p class="text-slate-400 text-sm">
          ${t.public?"Prompt não disponível para este agente.":"Este agente é privado. Prompt não disponível."}
        </p>
      </div>
    `:`
    <div>
      <h3 class="font-medium mb-3">Prompt</h3>
      <div class="bg-slate-900 p-4 rounded text-sm whitespace-pre-wrap border border-slate-800 text-slate-200 font-mono max-h-96 overflow-y-auto">
${t.prompt}
      </div>
    </div>
  `}function A(t){const e=document.createElement("div");e.className="p-6 space-y-6";const n=document.createElement("div");n.innerHTML=`
    <h2 class="text-lg font-semibold mb-2">Agentes</h2>
    <p class="text-sm text-slate-400">Selecione um agente para visualizar Manifest e Prompt (se público).</p>
  `,e.appendChild(n);const a=document.createElement("div");a.className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",t.agents.forEach(l=>{const d=document.createElement("button");d.type="button",d.className=`
      text-left rounded border border-slate-800 bg-slate-900/60 p-4 hover:border-emerald-500
      transition focus:outline-none focus:ring-2 focus:ring-emerald-500
    `,d.innerHTML=`
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-medium">${l.name||l.code}</h3>
        ${D(l.status)}
      </div>
      <div class="text-xs space-y-1">
        <div><span class="text-slate-400">Role:</span> ${l.role||"-"}</div>
        <div><span class="text-slate-400">Maturity:</span> ${l.maturity}</div>
        <div><span class="text-slate-400">Public:</span> ${l.public?"Sim":"Não"}</div>
        ${l.capabilities?`<div><span class="text-slate-400">Capabilities:</span> ${l.capabilities.slice(0,2).join(", ")}</div>`:""}
      </div>
    `,d.addEventListener("click",()=>r(l)),a.appendChild(d)}),e.appendChild(a);const s=document.createElement("div");s.id="agent-details",e.appendChild(s);function r(l){s.innerHTML="",s.appendChild(T(l))}return e}function D(t){const e=t?.toLowerCase()||"unknown";return`<span class="text-[10px] px-2 py-1 rounded ${{active:"bg-emerald-600/20 text-emerald-300 border border-emerald-600/30",ready:"bg-sky-600/20 text-sky-300 border border-sky-600/30",planned:"bg-amber-600/20 text-amber-300 border border-amber-600/30",concept:"bg-slate-600/20 text-slate-300 border border-slate-600/30"}[e]||"bg-slate-700/30 text-slate-300 border border-slate-700/50"} uppercase tracking-wide">${t||"Unknown"}</span>`}function H(t){const e=document.createElement("div");e.className="p-6 space-y-6";const n=document.createElement("div");n.innerHTML=`
    <h2 class="text-lg font-semibold mb-2">Pipeline Simulator</h2>
    <p class="text-sm text-slate-400">Simule pipelines de processamento com os agentes disponíveis.</p>
  `,e.appendChild(n);const a=document.createElement("div");a.className="flex flex-wrap gap-4",a.innerHTML=`
    <select id="agent-select" class="bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm">
      <option value="">Selecionar agente...</option>
      ${t.agents.filter(i=>i.status==="active"||i.status==="ready").map(i=>`<option value="${i.code}">${i.name||i.code}</option>`).join("")}
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
  `,e.appendChild(a);const s=document.createElement("div");s.id="pipeline-status",s.className="hidden p-4 bg-slate-900/50 rounded border border-slate-800",e.appendChild(s);const r=document.createElement("div");r.id="pipeline-results",r.className="space-y-4",e.appendChild(r);const l=a.querySelector("#run-pipeline"),d=a.querySelector("#agent-select"),f=a.querySelector("#input-data");l.addEventListener("click",()=>{const i=d.value,c=f.value.trim();if(!i){v("Selecione um agente");return}if(!c){v("Digite um input de exemplo");return}g(i,c)});function v(i){s.className="p-4 bg-red-900/30 border border-red-600/30 rounded",s.innerHTML=`<p class="text-red-300 text-sm">${i}</p>`,setTimeout(()=>s.classList.add("hidden"),3e3)}function g(i,c){const m=t.agents.find(o=>o.code===i);m&&(s.classList.remove("hidden"),s.className="p-4 bg-blue-900/30 border border-blue-600/30 rounded",s.innerHTML='<p class="text-blue-300 text-sm">Executando pipeline...</p>',setTimeout(()=>{const o=t.pipelineSimulator.simulate(m,c);y(o),s.classList.add("hidden")},1500))}function y(i){const c=document.createElement("div");for(c.className="bg-slate-900/60 border border-slate-800 rounded p-4 space-y-3",c.innerHTML=`
      <div class="flex items-center justify-between">
        <h4 class="font-medium">Execução #${Date.now().toString().slice(-6)}</h4>
        <span class="text-xs text-slate-400">${new Date().toLocaleTimeString()}</span>
      </div>
      
      <div class="grid gap-3 text-sm">
        <div>
          <div class="text-slate-400 mb-1">Agente:</div>
          <div class="text-emerald-300">${i.agent.name||i.agent.code}</div>
        </div>
        
        <div>
          <div class="text-slate-400 mb-1">Input:</div>
          <div class="bg-slate-800 p-2 rounded text-xs font-mono">${i.input}</div>
        </div>
        
        <div>
          <div class="text-slate-400 mb-1">Processamento:</div>
          <div class="space-y-1">
            ${i.phases.map(m=>`
              <div class="flex items-center gap-2 text-xs">
                <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span>${m.name}</span>
                <span class="text-slate-400">(${m.duration}ms)</span>
              </div>
            `).join("")}
          </div>
        </div>
        
        <div>
          <div class="text-slate-400 mb-1">Output:</div>
          <div class="bg-slate-800 p-2 rounded text-xs font-mono">${JSON.stringify(i.output,null,2)}</div>
        </div>
        
        <div>
          <div class="text-slate-400 mb-1">Métricas:</div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>Duração: <span class="text-emerald-300">${i.metrics.totalDuration}ms</span></div>
            <div>Status: <span class="text-emerald-300">${i.metrics.status}</span></div>
          </div>
        </div>
      </div>
    `,r.insertBefore(c,r.firstChild);r.children.length>5;)r.removeChild(r.lastChild)}return e}function P(t){const e=document.createElement("div");e.className="p-6 space-y-6";const n=document.createElement("div");n.className="flex items-center justify-between",n.innerHTML=`
    <div>
      <h2 class="text-lg font-semibold mb-1">Telemetria</h2>
      <p class="text-sm text-slate-400">Logs e eventos do sistema em tempo real.</p>
    </div>
    <div class="flex gap-2">
      <button 
        id="clear-logs" 
        type="button"
        class="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition"
      >
        Limpar
      </button>
      <button 
        id="toggle-auto-scroll" 
        type="button"
        class="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition"
        data-auto="true"
      >
        Auto-scroll: ON
      </button>
    </div>
  `,e.appendChild(n);const a=document.createElement("div");a.className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4",a.innerHTML=`
    <div class="bg-slate-900/60 border border-slate-800 rounded p-3">
      <div class="text-xs text-slate-400 mb-1">Total de Eventos</div>
      <div id="total-events" class="text-lg font-semibold text-slate-100">0</div>
    </div>
    <div class="bg-slate-900/60 border border-slate-800 rounded p-3">
      <div class="text-xs text-slate-400 mb-1">Último Evento</div>
      <div id="last-event" class="text-sm text-slate-300">-</div>
    </div>
    <div class="bg-slate-900/60 border border-slate-800 rounded p-3">
      <div class="text-xs text-slate-400 mb-1">Agentes Ativos</div>
      <div id="active-agents" class="text-lg font-semibold text-emerald-300">0</div>
    </div>
    <div class="bg-slate-900/60 border border-slate-800 rounded p-3">
      <div class="text-xs text-slate-400 mb-1">Taxa de Eventos</div>
      <div id="event-rate" class="text-sm text-slate-300">0/min</div>
    </div>
  `,e.appendChild(a);const s=document.createElement("div");s.className="flex flex-wrap gap-2",s.innerHTML=`
    <span class="text-xs text-slate-400 self-center">Filtros:</span>
    ${["all","info","warning","error","debug"].map(o=>`
      <button 
        type="button"
        class="filter-btn px-3 py-1 text-xs rounded border transition ${o==="all"?"bg-emerald-600 border-emerald-600 text-white":"bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"}" 
        data-level="${o}"
      >
        ${o.toUpperCase()}
      </button>
    `).join("")}
  `,e.appendChild(s);const r=document.createElement("div");r.id="telemetry-logs",r.className="bg-slate-950 border border-slate-800 rounded h-96 overflow-y-auto font-mono text-xs",e.appendChild(r);let l="all",d=!0;const f=n.querySelector("#clear-logs"),v=n.querySelector("#toggle-auto-scroll"),g=s.querySelectorAll(".filter-btn");f.addEventListener("click",()=>{t.telemetry.clearEvents(),c()}),v.addEventListener("click",()=>{d=!d,v.textContent=`Auto-scroll: ${d?"ON":"OFF"}`,v.dataset.auto=d.toString()}),g.forEach(o=>{o.addEventListener("click",()=>{g.forEach(p=>{p.className=p.className.replace(/bg-emerald-\w+ border-emerald-\w+ text-white/,"bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700")}),o.className=o.className.replace(/bg-slate-\w+ border-slate-\w+ text-slate-\w+ hover:bg-slate-\w+/,"bg-emerald-600 border-emerald-600 text-white"),l=o.dataset.level,c()})});const y=setInterval(c,1e3),i=new MutationObserver(o=>{o.forEach(p=>{p.type==="childList"&&p.removedNodes.forEach(b=>{b===e&&(clearInterval(y),i.disconnect())})})});i.observe(document.body,{childList:!0,subtree:!0});function c(){const o=t.telemetry.getEvents(),p=l==="all"?o:o.filter(u=>u.level===l),b=a.querySelector("#total-events"),w=a.querySelector("#last-event"),S=a.querySelector("#active-agents"),L=a.querySelector("#event-rate");b.textContent=o.length,w.textContent=o.length>0?new Date(o[o.length-1].timestamp).toLocaleTimeString():"-",S.textContent=t.agents.filter(u=>u.status==="active").length;const $=Date.now()-6e4,C=o.filter(u=>u.timestamp>$);L.textContent=`${C.length}/min`,r.innerHTML=p.map(u=>m(u)).join(""),d&&(r.scrollTop=r.scrollHeight)}function m(o){const p={info:"text-blue-400",warning:"text-yellow-400",error:"text-red-400",debug:"text-slate-500"},b=new Date(o.timestamp).toLocaleTimeString(),w=p[o.level]||"text-slate-300";return`
      <div class="p-2 border-b border-slate-800/50 hover:bg-slate-900/30">
        <div class="flex items-center gap-3 mb-1">
          <span class="text-slate-500">${b}</span>
          <span class="${w} uppercase font-medium">[${o.level}]</span>
          ${o.source?`<span class="text-slate-400">${o.source}</span>`:""}
        </div>
        <div class="text-slate-200 pl-4">${o.message}</div>
        ${o.data?`
          <div class="pl-4 mt-1">
            <pre class="text-slate-400 text-[11px]">${JSON.stringify(o.data,null,2)}</pre>
          </div>
        `:""}
      </div>
    `}return c(),e}class j{#e=[];#t=1e3;emit(e,n={}){const a={type:e,data:n,ts:Date.now()};return this.#e.push(a),this.#e.length>this.#t&&this.#e.shift(),a}events(){return[...this.#e]}clear(){this.#e=[]}}const h=new j;let x={agents:[],selectedAgent:null};async function q(){await B(),I(),E("agents")}async function B(){h.emit("app:init",{message:"Inicializando interface"});try{x.agents=await N(),h.emit("agents:loaded",{count:x.agents.length})}catch(t){console.error(t),h.emit("error",{scope:"bootstrap",error:t.message})}}function I(){document.querySelectorAll(".nav-btn").forEach(t=>{t.addEventListener("click",()=>{E(t.dataset.view)})})}function E(t){const e=document.getElementById("view-root");e.innerHTML="",t==="agents"?e.appendChild(A(x)):t==="pipeline"?e.appendChild(H(x.agents)):t==="telemetry"&&e.appendChild(P()),h.emit("ui:view",{view:t})}document.addEventListener("DOMContentLoaded",()=>{q()});class R{constructor(){this.routes={"/":()=>this.showHomepage(),"/os":()=>this.redirectToOS(),"/os/":()=>this.redirectToOS(),"/syntaris":()=>this.showSyntaris(),"/docs":()=>this.showDocs(),"/blog":()=>this.showBlog()},this.init()}init(){this.handleRoute(),window.addEventListener("popstate",()=>this.handleRoute()),document.addEventListener("click",e=>{const n=e.target.closest('a[href^="/"]');if(n&&!n.hasAttribute("target")){e.preventDefault();const a=n.getAttribute("href");this.navigateTo(a)}})}handleRoute(){const e=window.location.pathname,n=this.routes[e];n?n():e.startsWith("/os")?this.redirectToOS():e.startsWith("/docs")?this.showDocs():this.show404()}navigateTo(e){window.history.pushState({},"",e),this.handleRoute()}showHomepage(){console.log("Homepage loaded")}redirectToOS(){window.location.href="/os/index.html"}showSyntaris(){this.showComingSoon("Syntaris Agent","Interface dedicada do Syntaris em desenvolvimento...")}showDocs(){window.location.href="/03-documentacao-base/"}showBlog(){this.showComingSoon("Blog Lichtara","Blog em desenvolvimento com insights sobre tecnologia consciente...")}showComingSoon(e,n){const a=document.createElement("div");a.innerHTML=`
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255, 255, 255, 0.95); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
                <div style="background: white; padding: 3rem; border-radius: 12px; text-align: center; max-width: 500px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;">
                    <h2 style="color: #1a1a1a; margin-bottom: 1rem; font-size: 1.75rem; font-weight: 500;">${e}</h2>
                    <p style="color: #6b7280; margin-bottom: 2rem; line-height: 1.6;">${n}</p>
                    <button id="closeOverlay" style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                        Voltar para Home
                    </button>
                </div>
            </div>
        `,document.body.appendChild(a),document.getElementById("closeOverlay").addEventListener("click",()=>{document.body.removeChild(a),this.navigateTo("/")})}show404(){this.showComingSoon("Página não encontrada","Esta página ainda não está disponível.")}}document.addEventListener("DOMContentLoaded",()=>{new R});

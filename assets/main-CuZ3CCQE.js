(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const l of a.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function o(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=o(s);fetch(s.href,a)}})();async function N(){const t=await fetch("/agents/agents-interface.json",{cache:"no-store"});if(!t.ok)throw new Error("Falha ao carregar agents-interface.json");const e=await t.json();return e.agents||e}function T(t){const e=document.createElement("div");e.className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4",e.addEventListener("click",n=>{n.target===e&&e.remove()});const o=document.createElement("div");return o.className="bg-white border border-gray-200 rounded-xl shadow-xl max-w-4xl max-h-[90vh] overflow-hidden flex flex-col",o.innerHTML=`
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
      ${O(t)}
    </div>
  `,o.querySelector("#close-details").addEventListener("click",()=>e.remove()),e.appendChild(o),e}function M(t){return`
    <div>
      <h3 class="font-semibold mb-4 text-gray-900">Informações do Agente</h3>
      <dl class="grid gap-y-3 text-sm">
        ${[{label:"Status",value:t.status||"Unknown"},{label:"Role",value:t.role||"-"},{label:"Maturity",value:t.maturity||"-"},{label:"Public",value:t.public?"Sim":"Não"},{label:"Description",value:t.description||"-"}].map(o=>`
          <div class="grid grid-cols-[140px,1fr] gap-x-4">
            <dt class="text-gray-600 font-medium">${o.label}:</dt>
            <dd class="text-gray-900">${o.value}</dd>
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
    `}function O(t){return!t.public||!t.prompt?`
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
  `}function A(t){const e=document.createElement("div");e.className="p-6 space-y-6 bg-white";const o=document.createElement("div");o.innerHTML=`
    <h2 class="text-lg font-semibold mb-2 text-gray-900">Agentes</h2>
    <p class="text-sm text-gray-600">Selecione um agente para visualizar Manifest e Prompt (se público).</p>
  `,e.appendChild(o);const n=document.createElement("div");n.className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",t.agents.forEach(l=>{const d=document.createElement("button");d.type="button",d.className=`
      text-left rounded-lg border border-gray-200 bg-white p-4 hover:border-blue-300 hover:shadow-md
      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
    `,d.innerHTML=`
      <div class="flex items-center justify-between mb-3">
        <h3 class="font-medium text-gray-900">${l.name||l.code}</h3>
        ${D(l.status)}
      </div>
      <div class="text-xs space-y-2">
        <div><span class="text-gray-500 font-medium">Role:</span> <span class="text-gray-700">${l.role||"-"}</span></div>
        <div><span class="text-gray-500 font-medium">Maturity:</span> <span class="text-gray-700">${l.maturity}</span></div>
        <div><span class="text-gray-500 font-medium">Public:</span> <span class="text-gray-700">${l.public?"Sim":"Não"}</span></div>
        ${l.capabilities?`<div><span class="text-gray-500 font-medium">Capabilities:</span> <span class="text-gray-700">${l.capabilities.slice(0,2).join(", ")}</span></div>`:""}
      </div>
    `,d.addEventListener("click",()=>a(l)),n.appendChild(d)}),e.appendChild(n);const s=document.createElement("div");s.id="agent-details",e.appendChild(s);function a(l){s.innerHTML="",s.appendChild(T(l))}return e}function D(t){const e=t?.toLowerCase()||"unknown";return`<span class="text-[10px] px-2 py-1 rounded-full ${{active:"bg-green-100 text-green-700 border border-green-200",ready:"bg-blue-100 text-blue-700 border border-blue-200",planned:"bg-amber-100 text-amber-700 border border-amber-200",concept:"bg-gray-100 text-gray-700 border border-gray-200"}[e]||"bg-gray-100 text-gray-600 border border-gray-200"} uppercase tracking-wide font-medium">${t||"Unknown"}</span>`}function H(t){const e=document.createElement("div");e.className="p-6 space-y-6 bg-white";const o=document.createElement("div");o.innerHTML=`
    <h2 class="text-lg font-semibold mb-2 text-gray-900">Pipeline Simulator</h2>
    <p class="text-sm text-gray-600">Simule pipelines de processamento com os agentes disponíveis.</p>
  `,e.appendChild(o);const n=document.createElement("div");n.className="flex flex-wrap gap-4",n.innerHTML=`
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
  `,e.appendChild(n);const s=document.createElement("div");s.id="pipeline-status",s.className="hidden p-4 bg-blue-50 rounded-lg border border-blue-200",e.appendChild(s);const a=document.createElement("div");a.id="pipeline-results",a.className="space-y-4",e.appendChild(a);const l=n.querySelector("#run-pipeline"),d=n.querySelector("#agent-select"),x=n.querySelector("#input-data");l.addEventListener("click",()=>{const i=d.value,c=x.value.trim();if(!i){g("Selecione um agente");return}if(!c){g("Digite um input de exemplo");return}v(i,c)});function g(i){s.className="p-4 bg-red-50 border border-red-200 rounded-lg",s.innerHTML=`<p class="text-red-700 text-sm">${i}</p>`,setTimeout(()=>s.classList.add("hidden"),3e3)}function v(i,c){const m=t.agents.find(r=>r.code===i);m&&(s.classList.remove("hidden"),s.className="p-4 bg-blue-50 border border-blue-200 rounded-lg",s.innerHTML='<p class="text-blue-700 text-sm">Executando pipeline...</p>',setTimeout(()=>{const r=t.pipelineSimulator.simulate(m,c);y(r),s.classList.add("hidden")},1500))}function y(i){const c=document.createElement("div");for(c.className="bg-white border border-gray-200 rounded-lg p-4 space-y-4 shadow-sm",c.innerHTML=`
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
    `,a.insertBefore(c,a.firstChild);a.children.length>5;)a.removeChild(a.lastChild)}return e}function P(t){const e=document.createElement("div");e.className="p-6 space-y-6";const o=document.createElement("div");o.className="flex items-center justify-between",o.innerHTML=`
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
  `,e.appendChild(o);const n=document.createElement("div");n.className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4",n.innerHTML=`
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
  `,e.appendChild(n);const s=document.createElement("div");s.className="flex flex-wrap gap-2",s.innerHTML=`
    <span class="text-xs text-slate-400 self-center">Filtros:</span>
    ${["all","info","warning","error","debug"].map(r=>`
      <button 
        type="button"
        class="filter-btn px-3 py-1 text-xs rounded border transition ${r==="all"?"bg-emerald-600 border-emerald-600 text-white":"bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"}" 
        data-level="${r}"
      >
        ${r.toUpperCase()}
      </button>
    `).join("")}
  `,e.appendChild(s);const a=document.createElement("div");a.id="telemetry-logs",a.className="bg-slate-950 border border-slate-800 rounded h-96 overflow-y-auto font-mono text-xs",e.appendChild(a);let l="all",d=!0;const x=o.querySelector("#clear-logs"),g=o.querySelector("#toggle-auto-scroll"),v=s.querySelectorAll(".filter-btn");x.addEventListener("click",()=>{t.telemetry.clearEvents(),c()}),g.addEventListener("click",()=>{d=!d,g.textContent=`Auto-scroll: ${d?"ON":"OFF"}`,g.dataset.auto=d.toString()}),v.forEach(r=>{r.addEventListener("click",()=>{v.forEach(u=>{u.className=u.className.replace(/bg-emerald-\w+ border-emerald-\w+ text-white/,"bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700")}),r.className=r.className.replace(/bg-slate-\w+ border-slate-\w+ text-slate-\w+ hover:bg-slate-\w+/,"bg-emerald-600 border-emerald-600 text-white"),l=r.dataset.level,c()})});const y=setInterval(c,1e3),i=new MutationObserver(r=>{r.forEach(u=>{u.type==="childList"&&u.removedNodes.forEach(b=>{b===e&&(clearInterval(y),i.disconnect())})})});i.observe(document.body,{childList:!0,subtree:!0});function c(){const r=t.telemetry.getEvents(),u=l==="all"?r:r.filter(p=>p.level===l),b=n.querySelector("#total-events"),w=n.querySelector("#last-event"),S=n.querySelector("#active-agents"),L=n.querySelector("#event-rate");b.textContent=r.length,w.textContent=r.length>0?new Date(r[r.length-1].timestamp).toLocaleTimeString():"-",S.textContent=t.agents.filter(p=>p.status==="active").length;const $=Date.now()-6e4,C=r.filter(p=>p.timestamp>$);L.textContent=`${C.length}/min`,a.innerHTML=u.map(p=>m(p)).join(""),d&&(a.scrollTop=a.scrollHeight)}function m(r){const u={info:"text-blue-400",warning:"text-yellow-400",error:"text-red-400",debug:"text-slate-500"},b=new Date(r.timestamp).toLocaleTimeString(),w=u[r.level]||"text-slate-300";return`
      <div class="p-2 border-b border-slate-800/50 hover:bg-slate-900/30">
        <div class="flex items-center gap-3 mb-1">
          <span class="text-slate-500">${b}</span>
          <span class="${w} uppercase font-medium">[${r.level}]</span>
          ${r.source?`<span class="text-slate-400">${r.source}</span>`:""}
        </div>
        <div class="text-slate-200 pl-4">${r.message}</div>
        ${r.data?`
          <div class="pl-4 mt-1">
            <pre class="text-slate-400 text-[11px]">${JSON.stringify(r.data,null,2)}</pre>
          </div>
        `:""}
      </div>
    `}return c(),e}class j{#e=[];#t=1e3;emit(e,o={}){const n={type:e,data:o,ts:Date.now()};return this.#e.push(n),this.#e.length>this.#t&&this.#e.shift(),n}events(){return[...this.#e]}clear(){this.#e=[]}}const f=new j;let h={agents:[],selectedAgent:null};async function q(){await B(),I(),E("agents")}async function B(){f.emit("app:init",{message:"Inicializando interface"});try{h.agents=await N(),f.emit("agents:loaded",{count:h.agents.length})}catch(t){console.error(t),f.emit("error",{scope:"bootstrap",error:t.message})}}function I(){document.querySelectorAll(".nav-btn").forEach(t=>{t.addEventListener("click",()=>{E(t.dataset.view)})})}function E(t){const e=document.getElementById("view-root");e.innerHTML="",t==="agents"?e.appendChild(A(h)):t==="pipeline"?e.appendChild(H(h.agents)):t==="telemetry"&&e.appendChild(P()),f.emit("ui:view",{view:t})}document.addEventListener("DOMContentLoaded",()=>{q()});class R{constructor(){this.routes={"/":()=>this.showHomepage(),"/os":()=>this.redirectToOS(),"/os/":()=>this.redirectToOS(),"/syntaris":()=>this.showSyntaris(),"/docs":()=>this.showDocs(),"/blog":()=>this.showBlog()},this.init()}init(){this.handleRoute(),window.addEventListener("popstate",()=>this.handleRoute()),document.addEventListener("click",e=>{const o=e.target.closest('a[href^="/"]');if(o&&!o.hasAttribute("target")){e.preventDefault();const n=o.getAttribute("href");this.navigateTo(n)}})}handleRoute(){const e=window.location.pathname,o=this.routes[e];o?o():e.startsWith("/os")?this.redirectToOS():e.startsWith("/docs")?this.showDocs():this.show404()}navigateTo(e){window.history.pushState({},"",e),this.handleRoute()}showHomepage(){console.log("Homepage loaded")}redirectToOS(){window.location.href="/os/index.html"}showSyntaris(){this.showComingSoon("Syntaris Agent","Interface dedicada do Syntaris em desenvolvimento...")}showDocs(){window.location.href="/03-documentacao-base/"}showBlog(){this.showComingSoon("Blog Lichtara","Blog em desenvolvimento com insights sobre tecnologia consciente...")}showComingSoon(e,o){const n=document.createElement("div");n.innerHTML=`
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255, 255, 255, 0.95); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
                <div style="background: white; padding: 3rem; border-radius: 12px; text-align: center; max-width: 500px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;">
                    <h2 style="color: #1a1a1a; margin-bottom: 1rem; font-size: 1.75rem; font-weight: 500;">${e}</h2>
                    <p style="color: #6b7280; margin-bottom: 2rem; line-height: 1.6;">${o}</p>
                    <button id="closeOverlay" style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                        Voltar para Home
                    </button>
                </div>
            </div>
        `,document.body.appendChild(n),document.getElementById("closeOverlay").addEventListener("click",()=>{document.body.removeChild(n),this.navigateTo("/")})}show404(){this.showComingSoon("Página não encontrada","Esta página ainda não está disponível.")}}document.addEventListener("DOMContentLoaded",()=>{new R});

class Telemetry {
  #buffer = [];
  #max = 1000;
  
  emit(type, data = {}) {
    const ev = { type, data, ts: Date.now() };
    this.#buffer.push(ev);
    if (this.#buffer.length > this.#max) this.#buffer.shift();
    // Hook para futura persistência ou envio remoto
    return ev;
  }
  
  events() {
    return [...this.#buffer];
  }
  
  clear() {
    this.#buffer = [];
  }
}

export const telemetry = new Telemetry();

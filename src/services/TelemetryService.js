class TelemetryService {
  constructor() {
    this.events = [];
    this.maxEvents = 1000; // Limite de eventos em memória
  }

  track(event, data = null) {
    const eventEntry = {
      timestamp: new Date().toISOString(),
      event: event,
      data: data
    };

    this.events.push(eventEntry);

    // Limitar o número de eventos em memória
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log no console em desenvolvimento
    console.log(`[Telemetry] ${event}`, data || '');
  }

  getEvents() {
    return [...this.events]; // Retorna uma cópia
  }

  clear() {
    this.events = [];
    console.log('[Telemetry] Events cleared');
  }

  getEventsSince(timestamp) {
    return this.events.filter(event => new Date(event.timestamp) > new Date(timestamp));
  }

  getEventsByType(eventType) {
    return this.events.filter(event => event.event.startsWith(eventType));
  }

  getStats() {
    const stats = {
      totalEvents: this.events.length,
      eventTypes: {},
      recentEvents: this.events.slice(-10)
    };

    this.events.forEach(event => {
      const type = event.event.split('.')[0];
      stats.eventTypes[type] = (stats.eventTypes[type] || 0) + 1;
    });

    return stats;
  }
}

// Exportar instância singleton
export const TelemetryService = new TelemetryService();

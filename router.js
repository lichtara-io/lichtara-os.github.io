// Simple Client-Side Router for Lichtara
class LichtaraRouter {
    constructor() {
        this.routes = {
            '/': () => this.showHomepage(),
            '/os': () => this.redirectToOS(),
            '/os/': () => this.redirectToOS(),
            '/syntaris': () => this.showSyntaris(),
            '/docs': () => this.showDocs(),
            '/blog': () => this.showBlog()
        };
        
        this.init();
    }
    
    init() {
        // Handle initial route
        this.handleRoute();
        
        // Listen for popstate events (back/forward buttons)
        window.addEventListener('popstate', () => this.handleRoute());
        
        // Handle internal navigation clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="/"]');
            if (link && !link.hasAttribute('target')) {
                e.preventDefault();
                const href = link.getAttribute('href');
                this.navigateTo(href);
            }
        });
    }
    
    handleRoute() {
        const path = window.location.pathname;
        const route = this.routes[path];
        
        if (route) {
            route();
        } else {
            // Check if it's a subdirectory route
            if (path.startsWith('/os')) {
                this.redirectToOS();
            } else if (path.startsWith('/docs')) {
                this.showDocs();
            } else {
                this.show404();
            }
        }
    }
    
    navigateTo(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }
    
    showHomepage() {
        // Already showing homepage
        console.log('Homepage loaded');
    }
    
    redirectToOS() {
        // Redirect to OS system
        window.location.href = '/os/index.html';
    }
    
    showSyntaris() {
        this.showComingSoon('Syntaris Agent', 'Interface dedicada do Syntaris em desenvolvimento...');
    }
    
    showDocs() {
        // Redirect to docs
        window.location.href = '/03-documentacao-base/';
    }
    
    showBlog() {
        this.showComingSoon('Blog Lichtara', 'Blog em desenvolvimento com insights sobre tecnologia consciente...');
    }
    
    showComingSoon(title, description) {
        const overlay = document.createElement('div');
        overlay.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255, 255, 255, 0.95); z-index: 10000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px);">
                <div style="background: white; padding: 3rem; border-radius: 12px; text-align: center; max-width: 500px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e5e7eb;">
                    <h2 style="color: #1a1a1a; margin-bottom: 1rem; font-size: 1.75rem; font-weight: 500;">${title}</h2>
                    <p style="color: #6b7280; margin-bottom: 2rem; line-height: 1.6;">${description}</p>
                    <button id="closeOverlay" style="padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                        Voltar para Home
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        document.getElementById('closeOverlay').addEventListener('click', () => {
            document.body.removeChild(overlay);
            this.navigateTo('/');
        });
    }
    
    show404() {
        this.showComingSoon('Página não encontrada', 'Esta página ainda não está disponível.');
    }
}

// Initialize router when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LichtaraRouter();
});

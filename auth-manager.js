/**
 * Auth Manager - Handle authentication UI and state
 */

class AuthManager {
    constructor(apiClient, app) {
        this.api = apiClient;
        this.app = app;
        
        this.initializeElements();
        this.attachEventListeners();
        this.updateUI();
    }

    initializeElements() {
        // Modal
        this.authModal = document.getElementById('authModal');
        this.closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
        
        // Forms
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        
        // Login
        this.loginUsername = document.getElementById('loginUsername');
        this.loginPassword = document.getElementById('loginPassword');
        this.loginSubmitBtn = document.getElementById('loginSubmitBtn');
        this.switchToRegisterBtn = document.getElementById('switchToRegisterBtn');
        
        // Register
        this.registerUsername = document.getElementById('registerUsername');
        this.registerEmail = document.getElementById('registerEmail');
        this.registerPassword = document.getElementById('registerPassword');
        this.registerPasswordConfirm = document.getElementById('registerPasswordConfirm');
        this.registerSubmitBtn = document.getElementById('registerSubmitBtn');
        this.switchToLoginBtn = document.getElementById('switchToLoginBtn');
        
        // User menu
        this.userMenu = document.getElementById('userMenu');
        this.loginMenuBtn = document.getElementById('loginMenuBtn');
        this.userMenuUsername = document.getElementById('userMenuUsername');
        this.logoutBtn = document.getElementById('logoutBtn');
        this.syncBtn = document.getElementById('syncBtn');
        
        // Sync status
        this.syncStatus = document.getElementById('syncStatus');
        this.syncMessage = document.getElementById('syncMessage');
    }

    attachEventListeners() {
        // Modal
        this.closeAuthModalBtn.addEventListener('click', () => this.closeModal());
        this.loginMenuBtn.addEventListener('click', () => this.openLoginModal());
        
        // Switch forms
        this.switchToRegisterBtn.addEventListener('click', () => this.showRegisterForm());
        this.switchToLoginBtn.addEventListener('click', () => this.showLoginForm());
        
        // Submit
        this.loginSubmitBtn.addEventListener('click', () => this.handleLogin());
        this.registerSubmitBtn.addEventListener('click', () => this.handleRegister());
        
        // User menu
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        this.syncBtn.addEventListener('click', () => this.handleSync());
        
        // Enter key
        this.loginPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleLogin();
        });
        
        this.registerPasswordConfirm.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleRegister();
        });
    }

    openLoginModal() {
        this.showLoginForm();
        this.authModal.classList.add('active');
    }

    closeModal() {
        this.authModal.classList.remove('active');
        this.clearForms();
    }

    showLoginForm() {
        this.loginForm.style.display = 'block';
        this.registerForm.style.display = 'none';
        document.getElementById('authModalTitle').textContent = 'Login';
    }

    showRegisterForm() {
        this.loginForm.style.display = 'none';
        this.registerForm.style.display = 'block';
        document.getElementById('authModalTitle').textContent = 'Registrati';
    }

    clearForms() {
        this.loginUsername.value = '';
        this.loginPassword.value = '';
        this.registerUsername.value = '';
        this.registerEmail.value = '';
        this.registerPassword.value = '';
        this.registerPasswordConfirm.value = '';
        this.syncStatus.style.display = 'none';
    }

    async handleLogin() {
        const username = this.loginUsername.value.trim();
        const password = this.loginPassword.value;

        if (!username || !password) {
            this.showSyncMessage('⚠️ Compila tutti i campi', 'error');
            return;
        }

        this.loginSubmitBtn.disabled = true;
        this.loginSubmitBtn.textContent = 'Login...';

        try {
            const result = await this.api.login(username, password);
            
            this.showSyncMessage('✅ Login effettuato!', 'success');
            
            setTimeout(() => {
                this.closeModal();
                this.updateUI();
                this.app.showToast(`Benvenuto ${result.user.username}!`);
                
                // Auto-sync after login
                this.handleSync();
            }, 1000);

        } catch (error) {
            this.showSyncMessage(`❌ ${error.message}`, 'error');
        } finally {
            this.loginSubmitBtn.disabled = false;
            this.loginSubmitBtn.textContent = 'Login';
        }
    }

    async handleRegister() {
        const username = this.registerUsername.value.trim();
        const email = this.registerEmail.value.trim();
        const password = this.registerPassword.value;
        const passwordConfirm = this.registerPasswordConfirm.value;

        if (!username || !email || !password || !passwordConfirm) {
            this.showSyncMessage('⚠️ Compila tutti i campi', 'error');
            return;
        }

        if (password !== passwordConfirm) {
            this.showSyncMessage('⚠️ Le password non corrispondono', 'error');
            return;
        }

        if (password.length < 6) {
            this.showSyncMessage('⚠️ Password troppo corta (min 6 caratteri)', 'error');
            return;
        }

        this.registerSubmitBtn.disabled = true;
        this.registerSubmitBtn.textContent = 'Registrazione...';

        try {
            await this.api.register(username, email, password);
            
            this.showSyncMessage('✅ Registrazione completata! Effettua il login.', 'success');
            
            setTimeout(() => {
                this.showLoginForm();
                this.loginUsername.value = username;
            }, 1500);

        } catch (error) {
            this.showSyncMessage(`❌ ${error.message}`, 'error');
        } finally {
            this.registerSubmitBtn.disabled = false;
            this.registerSubmitBtn.textContent = 'Registrati';
        }
    }

    handleLogout() {
        if (!confirm('Sei sicuro di voler uscire?')) return;
        
        this.api.logout();
        this.updateUI();
        this.app.showToast('Logout effettuato');
    }

    async handleSync() {
        if (!this.api.isAuthenticated()) {
            this.app.showToast('⚠️ Effettua il login per sincronizzare');
            this.openLoginModal();
            return;
        }

        this.syncBtn.disabled = true;
        this.syncBtn.textContent = '🔄 Sync...';

        try {
            await this.api.fullSync();
            
            // Reload charts and playlists
            this.app.charts = this.app.loadCharts();
            this.app.renderLibrary();
            
            if (this.app.renderPlaylists) {
                this.app.renderPlaylists();
            }
            
            this.app.showToast('✅ Sincronizzazione completata!');

        } catch (error) {
            this.app.showToast(`❌ Errore sync: ${error.message}`);
        } finally {
            this.syncBtn.disabled = false;
            this.syncBtn.textContent = '🔄 Sync';
        }
    }

    updateUI() {
        if (this.api.isAuthenticated()) {
            this.userMenu.style.display = 'flex';
            this.loginMenuBtn.style.display = 'none';
            this.userMenuUsername.textContent = this.api.user.username;
        } else {
            this.userMenu.style.display = 'none';
            this.loginMenuBtn.style.display = 'inline-flex';
        }
    }

    showSyncMessage(message, type = 'info') {
        this.syncStatus.style.display = 'block';
        this.syncMessage.textContent = message;
        
        // Color based on type
        if (type === 'error') {
            this.syncStatus.style.background = 'rgba(220, 38, 38, 0.2)';
        } else if (type === 'success') {
            this.syncStatus.style.background = 'rgba(22, 163, 74, 0.2)';
        } else {
            this.syncStatus.style.background = 'var(--bg-input)';
        }
    }
}

// Export for use in app
window.AuthManager = AuthManager;


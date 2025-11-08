/**
 * API Client - Communication with PHP Backend
 */

class APIClient {
    constructor() {
        // API Configuration - CHANGE THIS to your API URL
        this.baseURL = '/api'; // or 'http://localhost/chordchart/api'
        this.token = localStorage.getItem('auth_token');
        this.user = JSON.parse(localStorage.getItem('auth_user') || 'null');
    }

    /**
     * Make HTTP request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        // Add auth token if available
        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        // Add body if present
        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // ==================== AUTH ====================

    async register(username, email, password) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: { username, email, password }
        });

        return response.data;
    }

    async login(username, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: { username, password }
        });

        // Save token and user
        this.token = response.data.token;
        this.user = response.data.user;
        
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('auth_user', JSON.stringify(this.user));

        return response.data;
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    }

    async getCurrentUser() {
        const response = await this.request('/auth/me');
        return response.data;
    }

    isAuthenticated() {
        return !!this.token;
    }

    // ==================== CHARTS ====================

    async getCharts() {
        const response = await this.request('/charts');
        return response.data;
    }

    async getChart(id) {
        const response = await this.request(`/charts/${id}`);
        return response.data;
    }

    async createChart(chartData) {
        const response = await this.request('/charts', {
            method: 'POST',
            body: {
                title: chartData.chart.title,
                artist: chartData.chart.artist,
                tempo: chartData.chart.tempo,
                time_signature: chartData.chart.timeSignature,
                key_signature: chartData.chart.key,
                content: chartData.text,
                chart_data: chartData.chart
            }
        });

        return response.data;
    }

    async updateChart(id, chartData) {
        const response = await this.request(`/charts/${id}`, {
            method: 'PUT',
            body: {
                title: chartData.chart?.title,
                artist: chartData.chart?.artist,
                tempo: chartData.chart?.tempo,
                time_signature: chartData.chart?.timeSignature,
                key_signature: chartData.chart?.key,
                content: chartData.text,
                chart_data: chartData.chart
            }
        });

        return response.data;
    }

    async deleteChart(id) {
        const response = await this.request(`/charts/${id}`, {
            method: 'DELETE'
        });

        return response.data;
    }

    // ==================== PLAYLISTS ====================

    async getPlaylists() {
        const response = await this.request('/playlists');
        return response.data;
    }

    async getPlaylist(id) {
        const response = await this.request(`/playlists/${id}`);
        return response.data;
    }

    async createPlaylist(name, description) {
        const response = await this.request('/playlists', {
            method: 'POST',
            body: { name, description }
        });

        return response.data;
    }

    async updatePlaylist(id, name, description) {
        const response = await this.request(`/playlists/${id}`, {
            method: 'PUT',
            body: { name, description }
        });

        return response.data;
    }

    async deletePlaylist(id) {
        const response = await this.request(`/playlists/${id}`, {
            method: 'DELETE'
        });

        return response.data;
    }

    async addSongToPlaylist(playlistId, chartId) {
        const response = await this.request(`/playlists/${playlistId}/songs`, {
            method: 'POST',
            body: { chart_id: chartId }
        });

        return response.data;
    }

    async removeSongFromPlaylist(playlistId, chartId) {
        const response = await this.request(`/playlists/${playlistId}/songs/${chartId}`, {
            method: 'DELETE'
        });

        return response.data;
    }

    async reorderPlaylist(playlistId, songIds) {
        const response = await this.request(`/playlists/${playlistId}/reorder`, {
            method: 'PUT',
            body: { song_ids: songIds }
        });

        return response.data;
    }

    // ==================== SYNC HELPERS ====================

    /**
     * Sync local charts to server
     */
    async syncChartsToServer() {
        const localCharts = JSON.parse(localStorage.getItem('chordcharts') || '[]');
        const syncedCharts = [];

        for (const chart of localCharts) {
            try {
                // Check if chart has server_id (already synced)
                if (chart.server_id) {
                    // Update on server
                    await this.updateChart(chart.server_id, chart);
                } else {
                    // Create on server
                    const serverChart = await this.createChart(chart);
                    chart.server_id = serverChart.id;
                }
                syncedCharts.push(chart);
            } catch (error) {
                console.error('Failed to sync chart:', chart.chart.title, error);
            }
        }

        // Save updated local data with server IDs
        localStorage.setItem('chordcharts', JSON.stringify(syncedCharts));
        
        return syncedCharts;
    }

    /**
     * Sync server charts to local
     */
    async syncChartsFromServer() {
        try {
            const serverCharts = await this.getCharts();
            const localCharts = [];

            for (const serverChart of serverCharts) {
                localCharts.push({
                    id: Date.now() + Math.random(), // local ID
                    server_id: serverChart.id,
                    text: serverChart.content,
                    chart: serverChart.chart_data,
                    createdAt: new Date(serverChart.created_at).getTime(),
                    updatedAt: new Date(serverChart.updated_at).getTime()
                });
            }

            localStorage.setItem('chordcharts', JSON.stringify(localCharts));
            
            return localCharts;
        } catch (error) {
            console.error('Failed to sync from server:', error);
            throw error;
        }
    }

    /**
     * Full bidirectional sync
     */
    async fullSync() {
        if (!this.isAuthenticated()) {
            throw new Error('Authentication required for sync');
        }

        // First, get from server
        const serverCharts = await this.syncChartsFromServer();
        
        // Then sync any local-only changes
        await this.syncChartsToServer();

        return serverCharts;
    }
}

// Export for use in app
window.APIClient = APIClient;


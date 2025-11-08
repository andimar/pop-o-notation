// ChordChart Player - Performance Mode

class ChordChartPlayer {
    constructor() {
        this.audioPlayer = new ChordPlayer();
        this.currentChart = null;
        this.playlist = null;
        this.currentIndex = 0;
        this.totalBars = 0;
        this.currentBarNumber = 0;
        this.autoscrollEnabled = true;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadChartFromURL();
    }
    
    initializeElements() {
        // Header
        this.backBtn = document.getElementById('backBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.playerTitle = document.getElementById('playerTitle');
        this.playerMeta = document.getElementById('playerMeta');
        
        // Chart
        this.playerChart = document.getElementById('playerChart');
        
        // Controls
        this.prevSongBtn = document.getElementById('prevSongBtn');
        this.nextSongBtn = document.getElementById('nextSongBtn');
        this.playBtn = document.getElementById('playBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.metronomeToggle = document.getElementById('metronomeToggle');
        this.autoscrollToggle = document.getElementById('autoscrollToggle');
        
        // Progress
        this.progressFill = document.getElementById('progressFill');
        this.currentBarSpan = document.getElementById('currentBar');
        this.totalBarsSpan = document.getElementById('totalBars');
    }
    
    attachEventListeners() {
        // Navigation
        this.backBtn.addEventListener('click', () => this.goBack());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.prevSongBtn.addEventListener('click', () => this.previousSong());
        this.nextSongBtn.addEventListener('click', () => this.nextSong());
        
        // Playback
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.stopBtn.addEventListener('click', () => this.stop());
        
        // Settings
        this.metronomeToggle.addEventListener('change', (e) => {
            this.audioPlayer.setMetronome(e.target.checked);
        });
        
        this.autoscrollToggle.addEventListener('change', (e) => {
            this.autoscrollEnabled = e.target.checked;
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Intercept audio player bar highlight for progress
        const originalHighlight = this.audioPlayer.highlightBar.bind(this.audioPlayer);
        this.audioPlayer.highlightBar = (barNumber) => {
            originalHighlight(barNumber);
            this.updateProgress(barNumber);
        };
    }
    
    loadChartFromURL() {
        const params = new URLSearchParams(window.location.search);
        const chartId = params.get('chart');
        const playlistId = params.get('playlist');
        
        if (chartId) {
            this.loadChart(chartId);
        } else if (playlistId) {
            this.loadPlaylist(playlistId);
        } else {
            this.showError('Nessuna chart specificata');
        }
    }
    
    loadChart(chartId) {
        // Load from localStorage
        const charts = JSON.parse(localStorage.getItem('chordcharts') || '[]');
        const chartData = charts.find(c => c.id == chartId);
        
        if (!chartData) {
            this.showError('Chart non trovata');
            return;
        }
        
        this.currentChart = chartData.chart;
        this.renderChart();
        this.updateMetadata();
        this.calculateTotalBars();
    }
    
    loadPlaylist(playlistId) {
        // Load playlist from localStorage
        const playlists = JSON.parse(localStorage.getItem('chordcharts_playlists') || '[]');
        const playlist = playlists.find(p => p.id == playlistId);
        
        if (!playlist || !playlist.songs || playlist.songs.length === 0) {
            this.showError('Playlist non trovata o vuota');
            return;
        }
        
        this.playlist = playlist;
        this.currentIndex = 0;
        
        // Load charts
        const charts = JSON.parse(localStorage.getItem('chordcharts') || '[]');
        this.playlistCharts = playlist.songs.map(songId => {
            const chartData = charts.find(c => c.id === songId);
            return chartData ? chartData.chart : null;
        }).filter(c => c);
        
        if (this.playlistCharts.length === 0) {
            this.showError('Nessuna chart valida nella playlist');
            return;
        }
        
        // Load first song
        this.currentChart = this.playlistCharts[0];
        this.renderChart();
        this.updateMetadata();
        this.calculateTotalBars();
        this.updatePlaylistButtons();
    }
    
    renderChart() {
        if (!this.currentChart) return;
        
        const html = this.generateChartHTML(this.currentChart);
        this.playerChart.innerHTML = html;
    }
    
    generateChartHTML(chart) {
        let html = '<div class="chart-render biab-style">';
        
        // Header
        html += '<div class="chart-header">';
        html += `<div class="chart-title">${this.escapeHtml(chart.title)}</div>`;
        
        html += '<div class="chart-meta-row">';
        if (chart.artist) html += `<span class="meta-item"><strong>Artist:</strong> ${this.escapeHtml(chart.artist)}</span>`;
        if (chart.tempo) html += `<span class="meta-item"><strong>Tempo:</strong> ${chart.tempo} BPM</span>`;
        html += `<span class="meta-item"><strong>Time:</strong> ${chart.timeSignature}</span>`;
        if (chart.key) html += `<span class="meta-item"><strong>Key:</strong> ${chart.key}</span>`;
        html += '</div>';
        html += '</div>';
        
        // Chart grid
        html += '<div class="chart-grid">';
        
        for (const section of chart.sections) {
            if (section.name) {
                html += `<div class="section-header">${this.escapeHtml(section.name)}</div>`;
            }
            
            html += '<div class="bars-grid">';
            
            for (let i = 0; i < section.bars.length; i++) {
                const bar = section.bars[i];
                
                if (i % 4 === 0 && i !== 0) {
                    html += '</div><div class="bars-grid">';
                }
                
                html += '<div class="bar-cell">';
                html += `<div class="bar-number">${bar.number}</div>`;
                html += '<div class="bar-content">';
                
                for (const chord of bar.chords) {
                    html += `<span class="chord-symbol">${this.escapeHtml(chord)}</span>`;
                }
                
                html += '</div>';
                html += '</div>';
            }
            
            html += '</div>';
        }
        
        html += '</div>';
        html += '</div>';
        
        return html;
    }
    
    updateMetadata() {
        if (!this.currentChart) return;
        
        this.playerTitle.textContent = this.currentChart.title;
        
        let meta = [];
        if (this.currentChart.artist) meta.push(this.currentChart.artist);
        if (this.currentChart.tempo) meta.push(`${this.currentChart.tempo} BPM`);
        meta.push(this.currentChart.timeSignature || '4/4');
        
        this.playerMeta.textContent = meta.join(' • ');
    }
    
    calculateTotalBars() {
        if (!this.currentChart || !this.currentChart.sections) {
            this.totalBars = 0;
            return;
        }
        
        this.totalBars = this.currentChart.sections.reduce((sum, section) => {
            return sum + (section.bars ? section.bars.length : 0);
        }, 0);
        
        this.totalBarsSpan.textContent = `/ ${this.totalBars}`;
    }
    
    togglePlay() {
        if (this.audioPlayer.isPlaying) {
            this.stop();
        } else {
            this.play();
        }
    }
    
    play() {
        if (!this.currentChart) return;
        
        this.audioPlayer.playChart(this.currentChart);
        this.playBtn.textContent = '⏸ Pausa';
        this.playBtn.classList.add('playing');
        this.stopBtn.disabled = false;
    }
    
    stop() {
        this.audioPlayer.stop();
        this.playBtn.textContent = '▶️ Play';
        this.playBtn.classList.remove('playing');
        this.stopBtn.disabled = true;
        this.progressFill.style.width = '0%';
        this.currentBarSpan.textContent = 'Battuta: 0';
    }
    
    updateProgress(barNumber) {
        this.currentBarNumber = barNumber;
        const progress = (barNumber / this.totalBars) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.currentBarSpan.textContent = `Battuta: ${barNumber}`;
    }
    
    previousSong() {
        if (!this.playlist || this.currentIndex <= 0) return;
        
        this.stop();
        this.currentIndex--;
        this.currentChart = this.playlistCharts[this.currentIndex];
        this.renderChart();
        this.updateMetadata();
        this.calculateTotalBars();
        this.updatePlaylistButtons();
    }
    
    nextSong() {
        if (!this.playlist || this.currentIndex >= this.playlistCharts.length - 1) return;
        
        this.stop();
        this.currentIndex++;
        this.currentChart = this.playlistCharts[this.currentIndex];
        this.renderChart();
        this.updateMetadata();
        this.calculateTotalBars();
        this.updatePlaylistButtons();
    }
    
    updatePlaylistButtons() {
        if (!this.playlist) {
            this.prevSongBtn.disabled = true;
            this.nextSongBtn.disabled = true;
            return;
        }
        
        this.prevSongBtn.disabled = this.currentIndex <= 0;
        this.nextSongBtn.disabled = this.currentIndex >= this.playlistCharts.length - 1;
    }
    
    toggleFullscreen() {
        const container = document.querySelector('.player-container');
        
        if (!document.fullscreenElement) {
            container.requestFullscreen().catch(err => {
                console.error('Fullscreen error:', err);
            });
            this.fullscreenBtn.textContent = '✕ Exit';
        } else {
            document.exitFullscreen();
            this.fullscreenBtn.textContent = '⛶ Fullscreen';
        }
    }
    
    handleKeyboard(e) {
        switch(e.key) {
            case ' ':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'Escape':
                this.stop();
                break;
            case 'ArrowLeft':
                this.previousSong();
                break;
            case 'ArrowRight':
                this.nextSong();
                break;
            case 'f':
            case 'F':
                this.toggleFullscreen();
                break;
        }
    }
    
    goBack() {
        window.history.back();
    }
    
    showError(message) {
        this.playerChart.innerHTML = `
            <div class="loading-state">
                <p>❌ ${message}</p>
                <button class="control-btn" onclick="history.back()">← Torna Indietro</button>
            </div>
        `;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize player
document.addEventListener('DOMContentLoaded', () => {
    window.player = new ChordChartPlayer();
});


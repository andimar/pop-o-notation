// ChordChart App - Main Application Logic

class ChordChartApp {
    constructor() {
        this.currentView = 'editor';
        this.charts = this.loadCharts();
        this.currentChart = null;
        this.currentEditingId = null;
        this.audioPlayer = new ChordPlayer();
        
        // Initialize API client first
        this.apiClient = new APIClient();
        
        // Initialize playlist manager with API client
        this.playlistManager = new PlaylistManager(this.apiClient);
        this.currentPlaylistId = null;
        this.currentEditingPlaylistId = null;
        this.currentChartForPlaylist = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.renderLibrary();
        this.renderPlaylists();
        
        // Initialize auth manager (after DOM is ready)
        this.authManager = new AuthManager(this.apiClient, this);
    }

    initializeElements() {
        // Views
        this.editorView = document.getElementById('editorView');
        this.libraryView = document.getElementById('libraryView');
        this.playlistView = document.getElementById('playlistView');
        this.viewChartModal = document.getElementById('viewChartModal');
        
        // Editor
        this.chartInput = document.getElementById('chartInput');
        this.chartPreview = document.getElementById('chartPreview');
        this.saveBtn = document.getElementById('saveBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.playBtn = document.getElementById('playBtn');
        this.metronomeToggle = document.getElementById('metronomeToggle');
        this.metronomeCheckbox = document.getElementById('metronomeCheckbox');
        
        // Library
        this.chartsList = document.getElementById('chartsList');
        this.importBtn = document.getElementById('importBtn');
        this.exportAllBtn = document.getElementById('exportAllBtn');
        this.importFileInput = document.getElementById('importFileInput');
        
        // Modal
        this.modalTitle = document.getElementById('modalTitle');
        this.modalChartContent = document.getElementById('modalChartContent');
        this.editChartBtn = document.getElementById('editChartBtn');
        this.deleteChartBtn = document.getElementById('deleteChartBtn');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        
        // Header
        this.toggleViewBtn = document.getElementById('toggleViewBtn');
        this.togglePlaylistBtn = document.getElementById('togglePlaylistBtn');
        this.viewIcon = document.getElementById('viewIcon');
        this.viewText = document.getElementById('viewText');
        
        // Playlist
        this.playlistsList = document.getElementById('playlistsList');
        this.createPlaylistBtn = document.getElementById('createPlaylistBtn');
        this.importPlaylistBtn = document.getElementById('importPlaylistBtn');
        this.importPlaylistInput = document.getElementById('importPlaylistInput');
        
        // Playlist Modal
        this.playlistModal = document.getElementById('playlistModal');
        this.playlistModalTitle = document.getElementById('playlistModalTitle');
        this.playlistNameInput = document.getElementById('playlistNameInput');
        this.playlistDescInput = document.getElementById('playlistDescInput');
        this.savePlaylistBtn = document.getElementById('savePlaylistBtn');
        this.cancelPlaylistBtn = document.getElementById('cancelPlaylistBtn');
        this.closePlaylistModalBtn = document.getElementById('closePlaylistModalBtn');
        
        // Playlist Detail Modal
        this.viewPlaylistModal = document.getElementById('viewPlaylistModal');
        this.playlistDetailTitle = document.getElementById('playlistDetailTitle');
        this.playlistDetailContent = document.getElementById('playlistDetailContent');
        this.playPlaylistBtn = document.getElementById('playPlaylistBtn');
        this.exportPlaylistBtn = document.getElementById('exportPlaylistBtn');
        this.editPlaylistBtn = document.getElementById('editPlaylistBtn');
        this.deletePlaylistBtn = document.getElementById('deletePlaylistBtn');
        this.closePlaylistDetailBtn = document.getElementById('closePlaylistDetailBtn');
        
        // Add to Playlist Modal
        this.addToPlaylistModal = document.getElementById('addToPlaylistModal');
        this.addToPlaylistBtn = document.getElementById('addToPlaylistBtn');
        this.closeAddToPlaylistBtn = document.getElementById('closeAddToPlaylistBtn');
        this.playlistSelectionList = document.getElementById('playlistSelectionList');
        
        // Modal additions
        this.playModalBtn = document.getElementById('playModalBtn');
        
        // Toast
        this.toast = document.getElementById('toast');
    }

    attachEventListeners() {
        // Editor
        this.chartInput.addEventListener('input', () => this.updatePreview());
        this.saveBtn.addEventListener('click', () => this.saveChart());
        this.clearBtn.addEventListener('click', () => this.clearEditor());
        this.playBtn.addEventListener('click', () => this.togglePlay());
        
        // Duration Helper Buttons
        document.querySelectorAll('.duration-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const duration = btn.getAttribute('data-duration');
                this.insertDuration(duration);
            });
        });
        
        // Symbol buttons
        document.querySelectorAll('.symbol-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const symbol = btn.getAttribute('data-symbol');
                this.insertSymbol(symbol);
            });
        });
        this.metronomeCheckbox.addEventListener('change', (e) => {
            this.audioPlayer.setMetronome(e.target.checked);
        });
        
        // Library
        this.importBtn.addEventListener('click', () => this.importCharts());
        this.exportAllBtn.addEventListener('click', () => this.exportAllCharts());
        this.importFileInput.addEventListener('change', (e) => this.handleImportFile(e));
        
        // Modal
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.editChartBtn.addEventListener('click', () => this.editCurrentChart());
        this.deleteChartBtn.addEventListener('click', () => this.deleteCurrentChart());
        this.playModalBtn.addEventListener('click', () => this.openPlayerMode());
        
        // View toggle
        this.toggleViewBtn.addEventListener('click', () => this.toggleView());
        
        // Playlist listeners (extended in app-playlist.js)
        if (typeof this.attachPlaylistListeners === 'function') {
            this.attachPlaylistListeners();
        }
        
        // Initial preview
        this.updatePreview();
    }

    // Parser - Converte testo in struttura dati (Band-in-a-Box style)
    parseChart(text) {
        const lines = text.trim().split('\n');
        if (lines.length === 0) return null;
        
        const chart = {
            title: 'Untitled',
            artist: '',
            tempo: '120',
            timeSignature: '4/4',
            key: 'C',
            sections: []
        };
        
        // Parse prima riga (metadati)
        const firstLine = lines[0];
        const metaParts = firstLine.split('-').map(s => s.trim());
        
        if (metaParts.length >= 1) chart.title = metaParts[0];
        if (metaParts.length >= 2) chart.artist = metaParts[1];
        if (metaParts.length >= 3) {
            const tempoMatch = metaParts[2].match(/(\d+)\s*bpm/i);
            if (tempoMatch) chart.tempo = tempoMatch[1];
            
            // Check for time signature
            const timeMatch = metaParts[2].match(/(\d+\/\d+)/);
            if (timeMatch) chart.timeSignature = timeMatch[1];
        }
        if (metaParts.length >= 4) {
            const timeMatch = metaParts[3].match(/(\d+\/\d+)/);
            if (timeMatch) chart.timeSignature = timeMatch[1];
        }
        
        let currentSection = null;
        let barNumber = 1;
        
        // Parse righe di accordi
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Check se è un'etichetta di sezione
            const sectionMatch = line.match(/^\[(.*?)\]$/);
            if (sectionMatch) {
                // Nuova sezione
                currentSection = {
                    name: sectionMatch[1],
                    bars: []
                };
                chart.sections.push(currentSection);
                continue;
            }
            
            // Se non c'è una sezione corrente, creane una di default
            if (!currentSection) {
                currentSection = {
                    name: '',
                    bars: []
                };
                chart.sections.push(currentSection);
            }
            
            const parsedLine = this.parseChordLine(line, barNumber);
            if (parsedLine && parsedLine.bars.length > 0) {
                currentSection.bars.push(...parsedLine.bars);
                barNumber += parsedLine.bars.length;
            }
        }
        
        return chart;
    }

    parseChordLine(line, startBarNumber) {
        const result = {
            bars: []
        };
        
        let workingLine = line;
        let currentBarNumber = startBarNumber;
        
        // Rimuovi simboli di ripetizione per ora (li gestiremo dopo)
        workingLine = workingLine.replace(/^\|\|?:?\s*/, '');
        workingLine = workingLine.replace(/:?\|\|?\s*(?:x\d+)?$/, '');
        
        // Split by bar lines
        const barParts = workingLine.split('|').map(s => s.trim()).filter(s => s);
        
        for (const barPart of barParts) {
            // Split chords within a bar (by spaces)
            const chordStrings = barPart.split(/\s+/).filter(s => s);
            
            // Parse ogni accordo con eventuale durata
            const chords = chordStrings.map(chordStr => this.parseChordWithDuration(chordStr));
            
            if (chords.length > 0) {
                result.bars.push({
                    number: currentBarNumber++,
                    chords: chords
                });
            }
        }
        
        return result;
    }
    
    /**
     * Parse un singolo accordo con durata
     * Esempi: Cmaj7h, Dm7q, -h, rq
     * Ritorna: { chord: "Cmaj7", duration: "h", isRest: false, beats: 2 }
     */
    parseChordWithDuration(chordStr) {
        // Valori delle note in beats (per 4/4)
        const durations = {
            'w': 4,    // whole (semibreve)
            'h': 2,    // half (minima)
            'q': 1,    // quarter (semiminima)
            'e': 0.5,  // eighth (croma)
            's': 0.25  // sixteenth (semicroma)
        };
        
        // Check se è una pausa
        const restMatch = chordStr.match(/^(-|r)([whqes]\.?)$/);
        if (restMatch) {
            const durSymbol = restMatch[2].replace('.', '');
            const hasDot = restMatch[2].includes('.');
            let beats = durations[durSymbol] || 1;
            if (hasDot) beats *= 1.5; // nota puntata
            
            return {
                chord: '-',
                duration: restMatch[2],
                isRest: true,
                beats: beats
            };
        }
        
        // Match accordo con durata: es. Cmaj7h, Dm7q.
        const chordMatch = chordStr.match(/^(.+?)([whqes]\.?)$/);
        if (chordMatch) {
            const chordName = chordMatch[1];
            const durSymbol = chordMatch[2].replace('.', '');
            const hasDot = chordMatch[2].includes('.');
            let beats = durations[durSymbol] || 1;
            if (hasDot) beats *= 1.5; // nota puntata
            
            return {
                chord: chordName,
                duration: chordMatch[2],
                isRest: false,
                beats: beats
            };
        }
        
        // Nessuna durata specificata - retrocompatibilità
        return {
            chord: chordStr,
            duration: null,
            isRest: chordStr === '-' || chordStr === 'r',
            beats: null // verrà calcolato dopo
        };
    }

    /**
     * Converte simbolo durata in simbolo musicale Unicode
     */
    getDurationSymbol(duration) {
        if (!duration) return '';
        
        const symbols = {
            'w': '𝅝',   // whole note
            'w.': '𝅝.',  // dotted whole note
            'h': '𝅗𝅥',   // half note
            'h.': '𝅗𝅥.', // dotted half note
            'q': '♩',   // quarter note
            'q.': '♩.', // dotted quarter note
            'e': '♪',   // eighth note
            'e.': '♪.', // dotted eighth note
            's': '𝅘𝅥𝅯',   // sixteenth note
            's.': '𝅘𝅥𝅯.'  // dotted sixteenth note
        };
        
        return symbols[duration] || duration;
    }

    // Renderer - Visualizza la chart (Band-in-a-Box style)
    renderChart(chart) {
        if (!chart || !chart.sections || chart.sections.length === 0) {
            return '<div class="empty-state"><p>👆 Inizia a scrivere per vedere l\'anteprima</p></div>';
        }
        
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
            // Section header
            if (section.name) {
                html += `<div class="section-header">${this.escapeHtml(section.name)}</div>`;
            }
            
            // Bars grid (4 battute per riga, stile Band-in-a-Box)
            html += '<div class="bars-grid">';
            
            for (let i = 0; i < section.bars.length; i++) {
                const bar = section.bars[i];
                
                // Ogni 4 battute, crea una nuova riga
                if (i % 4 === 0 && i !== 0) {
                    html += '</div><div class="bars-grid">';
                }
                
                html += '<div class="bar-cell">';
                html += `<div class="bar-number">${bar.number}</div>`;
                html += '<div class="bar-content">';
                
                for (const chordObj of bar.chords) {
                    // Se è un oggetto con durata, mostralo; altrimenti retrocompatibilità
                    if (typeof chordObj === 'object' && chordObj.chord !== undefined) {
                        const chordDisplay = chordObj.isRest ? '𝄽' : this.escapeHtml(chordObj.chord);
                        const durationSymbol = this.getDurationSymbol(chordObj.duration);
                        const chordClass = chordObj.isRest ? 'chord-symbol chord-rest' : 'chord-symbol';
                        
                        html += `<span class="${chordClass}">`;
                        html += chordDisplay;
                        if (chordObj.duration) {
                            html += `<span class="duration-indicator">${durationSymbol}</span>`;
                        }
                        html += '</span>';
                    } else {
                        // Retrocompatibilità: stringa semplice
                        const chordStr = typeof chordObj === 'string' ? chordObj : chordObj.chord || '';
                        html += `<span class="chord-symbol">${this.escapeHtml(chordStr)}</span>`;
                    }
                }
                
                html += '</div>';
                html += '</div>';
            }
            
            html += '</div>'; // close bars-grid
        }
        
        html += '</div>'; // close chart-grid
        html += '</div>'; // close chart-render
        
        return html;
    }

    updatePreview() {
        const text = this.chartInput.value;
        const chart = this.parseChart(text);
        this.currentChart = chart;
        this.chartPreview.innerHTML = this.renderChart(chart);
        
        // Show/hide play controls based on chart validity
        if (chart && chart.sections && chart.sections.length > 0) {
            this.playBtn.style.display = 'inline-flex';
            this.metronomeToggle.style.display = 'flex';
        } else {
            this.playBtn.style.display = 'none';
            this.metronomeToggle.style.display = 'none';
        }
        
        // Reset play button state
        this.updatePlayButton(false);
        
        // Aggiungi click listeners alle battute per farle partire da lì
        this.addBarClickListeners();
    }
    
    addBarClickListeners() {
        const barCells = this.chartPreview.querySelectorAll('.bar-cell');
        barCells.forEach(barCell => {
            barCell.addEventListener('click', (e) => {
                const barNumberEl = barCell.querySelector('.bar-number');
                if (barNumberEl && this.currentChart) {
                    const barNumber = parseInt(barNumberEl.textContent);
                    
                    // Ferma riproduzione corrente se in corso
                    if (this.audioPlayer.isPlaying) {
                        this.audioPlayer.stop();
                    }
                    
                    // Riproduci da questa battuta
                    this.audioPlayer.playChart(this.currentChart, barNumber);
                    this.updatePlayButton(true);
                }
            });
        });
    }

    togglePlay() {
        if (!this.currentChart) return;
        
        if (this.audioPlayer.isPlaying) {
            this.audioPlayer.stop();
            this.updatePlayButton(false);
        } else {
            this.audioPlayer.playChart(this.currentChart);
            this.updatePlayButton(true);
        }
    }

    updatePlayButton(isPlaying) {
        if (isPlaying) {
            this.playBtn.textContent = '⏸️ Stop';
            this.playBtn.classList.add('btn-primary');
            this.playBtn.classList.remove('btn-secondary');
        } else {
            this.playBtn.textContent = '▶️ Play';
            this.playBtn.classList.remove('btn-primary');
            this.playBtn.classList.add('btn-secondary');
        }
    }

    // Storage Management
    loadCharts() {
        const stored = localStorage.getItem('chordcharts');
        return stored ? JSON.parse(stored) : [];
    }

    saveCharts() {
        localStorage.setItem('chordcharts', JSON.stringify(this.charts));
    }

    async saveChart() {
        const text = this.chartInput.value.trim();
        if (!text) {
            this.showToast('⚠️ Inserisci del testo prima di salvare!');
            return;
        }
        
        const chart = this.parseChart(text);
        if (!chart || !chart.sections || chart.sections.length === 0) {
            this.showToast('⚠️ La chart non contiene accordi validi!');
            return;
        }
        
        // Check if at least one section has bars
        const hasBars = chart.sections.some(section => section.bars && section.bars.length > 0);
        if (!hasBars) {
            this.showToast('⚠️ La chart non contiene accordi validi!');
            return;
        }
        
        const chartData = {
            id: this.currentEditingId || Date.now(),
            text: text,
            chart: chart,
            createdAt: this.currentEditingId ? 
                (this.charts.find(c => c.id === this.currentEditingId)?.createdAt || Date.now()) : 
                Date.now(),
            updatedAt: Date.now()
        };
        
        // Save to localStorage first (offline-first approach)
        if (this.currentEditingId) {
            // Update existing
            const index = this.charts.findIndex(c => c.id === this.currentEditingId);
            if (index !== -1) {
                this.charts[index] = chartData;
            }
        } else {
            // Save new
            this.charts.unshift(chartData);
        }
        
        this.saveCharts();
        this.renderLibrary();
        
        // Try to sync to server if logged in
        if (this.apiClient.isAuthenticated()) {
            try {
                if (this.currentEditingId && chartData.server_id) {
                    // Update on server
                    await this.apiClient.updateChart(chartData.server_id, chartData);
                    this.showToast('✅ Chart aggiornata e sincronizzata!');
                } else {
                    // Create on server
                    const serverChart = await this.apiClient.createChart(chartData);
                    // Save server ID
                    chartData.server_id = serverChart.id;
                    this.saveCharts();
                    this.showToast('✅ Chart salvata e sincronizzata!');
                }
            } catch (error) {
                console.log('Failed to sync to server:', error);
                this.showToast('✅ Chart salvata localmente (sync fallito)');
            }
        } else {
            this.showToast('✅ Chart salvata!');
        }
        
        this.currentEditingId = null;
        this.clearEditor();
        
        // Switch to library view
        setTimeout(() => this.switchView('library'), 500);
    }

    clearEditor() {
        this.chartInput.value = '';
        this.currentEditingId = null;
        this.updatePreview();
    }
    
    /**
     * Inserisce un simbolo di durata nella posizione del cursore
     */
    insertDuration(duration) {
        const textarea = this.chartInput;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        
        // Inserisci il simbolo di durata
        const before = text.substring(0, start);
        const after = text.substring(end);
        textarea.value = before + duration + after;
        
        // Ripristina la posizione del cursore
        const newPos = start + duration.length;
        textarea.setSelectionRange(newPos, newPos);
        textarea.focus();

        // Aggiorna preview
        this.updatePreview();
    }
    
    insertSymbol(symbol) {
        const textarea = this.chartInput;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        
        // Inserisci il simbolo
        const before = text.substring(0, start);
        const after = text.substring(end);
        textarea.value = before + symbol + after;
        
        // Ripristina la posizione del cursore
        const newPos = start + symbol.length;
        textarea.setSelectionRange(newPos, newPos);
        textarea.focus();

        // Aggiorna preview
        this.updatePreview();
    }

    async deleteChart(id) {
        if (!confirm('Sei sicuro di voler eliminare questa chart?')) return;
        
        const chart = this.charts.find(c => c.id === id);
        
        // Delete from localStorage
        this.charts = this.charts.filter(c => c.id !== id);
        this.saveCharts();
        this.renderLibrary();
        this.closeModal();
        
        // Try to delete from server if logged in and has server_id
        if (this.apiClient.isAuthenticated() && chart?.server_id) {
            try {
                await this.apiClient.deleteChart(chart.server_id);
                this.showToast('🗑️ Chart eliminata e sincronizzata!');
            } catch (error) {
                console.log('Failed to delete from server:', error);
                this.showToast('🗑️ Chart eliminata localmente');
            }
        } else {
            this.showToast('🗑️ Chart eliminata');
        }
    }

    editChart(id) {
        const chart = this.charts.find(c => c.id === id);
        if (!chart) return;
        
        this.currentEditingId = id;
        this.chartInput.value = chart.text;
        this.updatePreview();
        this.switchView('editor');
        this.closeModal();
        this.showToast('✏️ Modifica la chart e salva');
    }

    // Library View
    renderLibrary() {
        if (this.charts.length === 0) {
            this.chartsList.innerHTML = `
                <div class="empty-state">
                    <p>📂 Nessuna chart salvata ancora</p>
                    <p class="empty-state-hint">Crea la tua prima chart dall'editor!</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        for (const chartData of this.charts) {
            const preview = chartData.text.split('\n').slice(0, 4).join('\n');
            const date = new Date(chartData.updatedAt).toLocaleDateString('it-IT');
            
            html += `
                <div class="chart-card" data-id="${chartData.id}">
                    <div class="chart-card-title">${this.escapeHtml(chartData.chart.title)}</div>
                    <div class="chart-card-meta">
                        ${chartData.chart.artist ? this.escapeHtml(chartData.chart.artist) + ' • ' : ''}
                        ${chartData.chart.tempo ? chartData.chart.tempo + ' bpm • ' : ''}
                        ${date}
                    </div>
                    <div class="chart-card-preview">${this.escapeHtml(preview)}</div>
                </div>
            `;
        }
        
        this.chartsList.innerHTML = html;
        
        // Attach click listeners
        this.chartsList.querySelectorAll('.chart-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                this.viewChart(id);
            });
        });
    }

    viewChart(id) {
        const chartData = this.charts.find(c => c.id === id);
        if (!chartData) return;
        
        this.currentViewingId = id;
        this.modalTitle.textContent = chartData.chart.title;
        this.modalChartContent.innerHTML = this.renderChart(chartData.chart);
        this.playModalBtn.style.display = 'inline-flex';
        this.viewChartModal.classList.add('active');
    }

    closeModal() {
        this.viewChartModal.classList.remove('active');
        this.playModalBtn.style.display = 'none';
        this.currentViewingId = null;
    }

    openPlayerMode() {
        if (this.currentViewingId) {
            window.open(`player.html?chart=${this.currentViewingId}`, '_blank');
        }
    }

    editCurrentChart() {
        if (this.currentViewingId) {
            this.editChart(this.currentViewingId);
        }
    }

    deleteCurrentChart() {
        if (this.currentViewingId) {
            this.deleteChart(this.currentViewingId);
        }
    }

    // View Management
    toggleView() {
        this.switchView(this.currentView === 'editor' ? 'library' : 'editor');
    }

    switchView(view) {
        // Use extended version if available (from app-playlist.js)
        if (typeof this.switchViewExtended === 'function') {
            this.switchViewExtended(view);
            return;
        }
        
        // Fallback to original
        this.currentView = view;
        
        if (view === 'editor') {
            this.editorView.classList.add('active');
            this.libraryView.classList.remove('active');
            this.viewIcon.textContent = '📚';
            this.viewText.textContent = 'Libreria';
        } else {
            this.editorView.classList.remove('active');
            this.libraryView.classList.add('active');
            this.viewIcon.textContent = '📝';
            this.viewText.textContent = 'Editor';
            this.renderLibrary();
        }
    }

    // Import/Export
    exportAllCharts() {
        if (this.charts.length === 0) {
            this.showToast('⚠️ Nessuna chart da esportare!');
            return;
        }
        
        const data = JSON.stringify(this.charts, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chordcharts-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('📤 Charts esportate!');
    }

    importCharts() {
        this.importFileInput.click();
    }

    handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                if (!Array.isArray(imported)) {
                    throw new Error('Formato non valido');
                }
                
                // Merge with existing charts
                for (const chart of imported) {
                    if (!this.charts.find(c => c.id === chart.id)) {
                        this.charts.push(chart);
                    }
                }
                
                this.saveCharts();
                this.renderLibrary();
                this.showToast(`📥 Importate ${imported.length} charts!`);
            } catch (error) {
                this.showToast('❌ Errore nell\'importazione!');
                console.error(error);
            }
        };
        reader.readAsText(file);
        
        // Reset input
        event.target.value = '';
    }

    // Utilities
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message) {
        this.toast.textContent = message;
        this.toast.classList.add('show');
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chordChartApp = new ChordChartApp();
});


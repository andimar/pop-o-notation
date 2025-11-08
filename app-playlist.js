// ChordChart App - Playlist Functions Extension

// Extend ChordChartApp with playlist functionality
Object.assign(ChordChartApp.prototype, {
    
    // Attach playlist event listeners
    attachPlaylistListeners() {
        // Playlist view navigation
        this.togglePlaylistBtn.addEventListener('click', () => this.switchView('playlist'));
        
        // Create playlist
        this.createPlaylistBtn.addEventListener('click', () => this.openPlaylistModal());
        this.savePlaylistBtn.addEventListener('click', () => this.savePlaylist());
        this.cancelPlaylistBtn.addEventListener('click', () => this.closePlaylistModal());
        this.closePlaylistModalBtn.addEventListener('click', () => this.closePlaylistModal());
        
        // Playlist detail
        this.closePlaylistDetailBtn.addEventListener('click', () => this.closePlaylistDetailModal());
        this.playPlaylistBtn.addEventListener('click', () => this.playPlaylistAll());
        this.exportPlaylistBtn.addEventListener('click', () => this.exportCurrentPlaylist());
        this.editPlaylistBtn.addEventListener('click', () => this.editCurrentPlaylist());
        this.deletePlaylistBtn.addEventListener('click', () => this.deleteCurrentPlaylist());
        
        // Add to playlist
        this.addToPlaylistBtn.addEventListener('click', () => this.openAddToPlaylistModal());
        this.closeAddToPlaylistBtn.addEventListener('click', () => this.closeAddToPlaylistModal());
        
        // Import playlist
        this.importPlaylistBtn.addEventListener('click', () => this.importPlaylistInput.click());
        this.importPlaylistInput.addEventListener('change', (e) => this.handleImportPlaylist(e));
    },

    // Open playlist modal (create or edit)
    openPlaylistModal(playlistId = null) {
        this.currentEditingPlaylistId = playlistId;
        
        if (playlistId) {
            const playlist = this.playlistManager.getPlaylist(playlistId);
            if (playlist) {
                this.playlistModalTitle.textContent = 'Modifica Playlist';
                this.playlistNameInput.value = playlist.name;
                this.playlistDescInput.value = playlist.description || '';
            }
        } else {
            this.playlistModalTitle.textContent = 'Nuova Playlist';
            this.playlistNameInput.value = '';
            this.playlistDescInput.value = '';
        }
        
        this.playlistModal.classList.add('active');
        this.playlistNameInput.focus();
    },

    closePlaylistModal() {
        this.playlistModal.classList.remove('active');
        this.currentEditingPlaylistId = null;
    },

    // Save playlist (create or update)
    savePlaylist() {
        const name = this.playlistNameInput.value.trim();
        if (!name) {
            this.showToast('⚠️ Inserisci un nome per la playlist!');
            return;
        }
        
        const description = this.playlistDescInput.value.trim();
        
        if (this.currentEditingPlaylistId) {
            // Update existing
            this.playlistManager.updatePlaylist(this.currentEditingPlaylistId, { name, description });
            this.showToast('✅ Playlist aggiornata!');
        } else {
            // Create new
            this.playlistManager.createPlaylist(name, description);
            this.showToast('✅ Playlist creata!');
        }
        
        this.closePlaylistModal();
        this.renderPlaylists();
    },

    // Render playlists list
    renderPlaylists() {
        const playlists = this.playlistManager.playlists;
        
        if (playlists.length === 0) {
            this.playlistsList.innerHTML = `
                <div class="empty-state">
                    <p>📋 Nessuna playlist creata</p>
                    <p class="empty-state-hint">Crea una playlist per organizzare le tue canzoni!</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        for (const playlist of playlists) {
            const songCount = playlist.songs.length;
            const date = new Date(playlist.updatedAt).toLocaleDateString('it-IT');
            
            html += `
                <div class="playlist-card" data-id="${playlist.id}">
                    <div class="playlist-card-title">${this.escapeHtml(playlist.name)}</div>
                    ${playlist.description ? `<div class="playlist-card-desc">${this.escapeHtml(playlist.description)}</div>` : ''}
                    <div class="playlist-card-stats">
                        ${songCount} ${songCount === 1 ? 'canzone' : 'canzoni'} • ${date}
                    </div>
                </div>
            `;
        }
        
        this.playlistsList.innerHTML = html;
        
        // Attach click listeners
        this.playlistsList.querySelectorAll('.playlist-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                this.viewPlaylist(id);
            });
        });
    },

    // View playlist details
    viewPlaylist(playlistId) {
        this.currentPlaylistId = playlistId;
        const playlist = this.playlistManager.getPlaylist(playlistId);
        if (!playlist) return;
        
        this.playlistDetailTitle.textContent = playlist.name;
        
        const songs = this.playlistManager.getPlaylistSongs(playlistId, this.charts);
        
        let html = '<div class="playlist-songs-list">';
        
        if (songs.length === 0) {
            html += `<div class="empty-state"><p>Nessuna canzone in questa playlist</p></div>`;
        } else {
            songs.forEach((chartData, index) => {
                if (!chartData) return;
                
                html += `
                    <div class="playlist-song-item" data-chart-id="${chartData.id}">
                        <div class="playlist-song-info">
                            <div class="playlist-song-title">${index + 1}. ${this.escapeHtml(chartData.chart.title)}</div>
                            <div class="playlist-song-meta">
                                ${chartData.chart.artist ? this.escapeHtml(chartData.chart.artist) + ' • ' : ''}
                                ${chartData.chart.tempo ? chartData.chart.tempo + ' bpm • ' : ''}
                                ${chartData.chart.timeSignature || '4/4'}
                            </div>
                        </div>
                        <div class="playlist-song-actions">
                            <button class="btn btn-secondary btn-play-song">▶️</button>
                            <button class="btn btn-danger btn-remove-song">✕</button>
                        </div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        this.playlistDetailContent.innerHTML = html;
        
        // Attach song listeners
        this.playlistDetailContent.querySelectorAll('.playlist-song-item').forEach(item => {
            const chartId = parseInt(item.dataset.chartId);
            const chartData = this.charts.find(c => c.id === chartId);
            
            item.querySelector('.btn-play-song').addEventListener('click', (e) => {
                e.stopPropagation();
                this.playChartFromPlaylist(chartData);
            });
            
            item.querySelector('.btn-remove-song').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeSongFromPlaylist(playlistId, chartId);
            });
            
            item.addEventListener('click', () => {
                this.viewChart(chartId);
                this.closePlaylistDetailModal();
            });
        });
        
        this.viewPlaylistModal.classList.add('active');
    },

    closePlaylistDetailModal() {
        this.viewPlaylistModal.classList.remove('active');
        this.currentPlaylistId = null;
    },

    // Play entire playlist
    playPlaylistAll() {
        if (!this.currentPlaylistId) return;
        
        const songs = this.playlistManager.getPlaylistSongs(this.currentPlaylistId, this.charts);
        if (songs.length === 0) {
            this.showToast('⚠️ Playlist vuota!');
            return;
        }
        
        // Open in Player Mode
        window.open(`player.html?playlist=${this.currentPlaylistId}`, '_blank');
    },

    playChartFromPlaylist(chartData) {
        if (!chartData) return;
        
        this.currentChart = chartData.chart;
        
        // Stop current playback
        if (this.audioPlayer.isPlaying) {
            this.audioPlayer.stop();
        }
        
        // Start playing
        this.audioPlayer.playChart(this.currentChart);
        this.showToast(`▶️ ${chartData.chart.title}`);
        
        // TODO: Auto-play next song when finished
    },

    // Edit current playlist
    editCurrentPlaylist() {
        if (this.currentPlaylistId) {
            this.closePlaylistDetailModal();
            this.openPlaylistModal(this.currentPlaylistId);
        }
    },

    // Delete current playlist
    deleteCurrentPlaylist() {
        if (!this.currentPlaylistId) return;
        
        const playlist = this.playlistManager.getPlaylist(this.currentPlaylistId);
        if (!confirm(`Sei sicuro di voler eliminare "${playlist.name}"?`)) return;
        
        this.playlistManager.deletePlaylist(this.currentPlaylistId);
        this.closePlaylistDetailModal();
        this.renderPlaylists();
        this.showToast('🗑️ Playlist eliminata');
    },

    // Export playlist
    exportCurrentPlaylist() {
        if (!this.currentPlaylistId) return;
        
        const playlistData = this.playlistManager.exportPlaylist(this.currentPlaylistId, this.charts);
        if (!playlistData) return;
        
        const data = JSON.stringify(playlistData, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `playlist-${playlistData.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showToast('📤 Playlist esportata!');
    },

    // Import playlist
    handleImportPlaylist(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const playlistData = JSON.parse(e.target.result);
                this.playlistManager.importPlaylist(playlistData, this.charts);
                this.renderPlaylists();
                this.showToast(`📥 Playlist "${playlistData.name}" importata!`);
            } catch (error) {
                this.showToast('❌ Errore nell\'importazione!');
                console.error(error);
            }
        };
        reader.readAsText(file);
        
        event.target.value = '';
    },

    // Remove song from playlist
    removeSongFromPlaylist(playlistId, chartId) {
        this.playlistManager.removeSongFromPlaylist(playlistId, chartId);
        this.viewPlaylist(playlistId);
        this.showToast('✕ Canzone rimossa dalla playlist');
    },

    // Open add to playlist modal
    openAddToPlaylistModal() {
        if (!this.currentViewingId) return;
        
        this.currentChartForPlaylist = this.currentViewingId;
        const playlists = this.playlistManager.playlists;
        
        if (playlists.length === 0) {
            this.showToast('⚠️ Crea prima una playlist!');
            return;
        }
        
        let html = '';
        for (const playlist of playlists) {
            const hasChart = playlist.songs.includes(this.currentViewingId);
            
            html += `
                <div class="playlist-selection-item ${hasChart ? 'selected' : ''}" data-playlist-id="${playlist.id}">
                    <div class="playlist-card-title">${this.escapeHtml(playlist.name)}</div>
                    <div class="playlist-card-stats">${playlist.songs.length} canzoni</div>
                </div>
            `;
        }
        
        this.playlistSelectionList.innerHTML = html;
        
        // Attach click listeners
        this.playlistSelectionList.querySelectorAll('.playlist-selection-item').forEach(item => {
            const playlistId = parseInt(item.dataset.playlistId);
            
            item.addEventListener('click', () => {
                if (item.classList.contains('selected')) {
                    this.playlistManager.removeSongFromPlaylist(playlistId, this.currentChartForPlaylist);
                    item.classList.remove('selected');
                    this.showToast('✕ Rimosso dalla playlist');
                } else {
                    this.playlistManager.addSongToPlaylist(playlistId, this.currentChartForPlaylist);
                    item.classList.add('selected');
                    this.showToast('✅ Aggiunto alla playlist');
                }
            });
        });
        
        this.addToPlaylistModal.classList.add('active');
    },

    closeAddToPlaylistModal() {
        this.addToPlaylistModal.classList.remove('active');
        this.currentChartForPlaylist = null;
    },

    // Update switch view to include playlist
    switchViewExtended(view) {
        this.currentView = view;
        
        // Hide all views
        this.editorView.classList.remove('active');
        this.libraryView.classList.remove('active');
        this.playlistView.classList.remove('active');
        
        if (view === 'editor') {
            this.editorView.classList.add('active');
            this.viewIcon.textContent = '📚';
            this.viewText.textContent = 'Libreria';
        } else if (view === 'library') {
            this.libraryView.classList.add('active');
            this.viewIcon.textContent = '📝';
            this.viewText.textContent = 'Editor';
            this.renderLibrary();
        } else if (view === 'playlist') {
            this.playlistView.classList.add('active');
            this.renderPlaylists();
        }
    }
});


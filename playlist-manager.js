// Playlist Manager - Gestione playlist e organizzazione canzoni

class PlaylistManager {
    constructor(apiClient = null) {
        this.apiClient = apiClient;
        this.playlists = this.loadPlaylists();
        this.currentPlaylist = null;
        this.currentSongIndex = -1;
    }

    // Load playlists from storage
    loadPlaylists() {
        const stored = localStorage.getItem('chordcharts_playlists');
        return stored ? JSON.parse(stored) : [];
    }

    // Save playlists to storage
    savePlaylists() {
        localStorage.setItem('chordcharts_playlists', JSON.stringify(this.playlists));
    }

    // Create new playlist
    async createPlaylist(name, description = '') {
        const playlist = {
            id: Date.now(),
            name: name,
            description: description,
            songs: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        
        this.playlists.push(playlist);
        this.savePlaylists();
        
        // Try to sync to server if API available
        if (this.apiClient?.isAuthenticated()) {
            try {
                const serverPlaylist = await this.apiClient.createPlaylist(name, description);
                playlist.server_id = serverPlaylist.id;
                this.savePlaylists();
            } catch (error) {
                console.log('Failed to sync playlist to server:', error);
            }
        }
        
        return playlist;
    }

    // Get playlist by ID
    getPlaylist(playlistId) {
        return this.playlists.find(p => p.id === playlistId);
    }

    // Update playlist
    async updatePlaylist(playlistId, updates) {
        const playlist = this.getPlaylist(playlistId);
        if (playlist) {
            Object.assign(playlist, updates);
            playlist.updatedAt = Date.now();
            this.savePlaylists();
            
            // Try to sync to server
            if (this.apiClient?.isAuthenticated() && playlist.server_id) {
                try {
                    await this.apiClient.updatePlaylist(playlist.server_id, playlist.name, playlist.description);
                } catch (error) {
                    console.log('Failed to sync playlist update to server:', error);
                }
            }
        }
        return playlist;
    }

    // Delete playlist
    async deletePlaylist(playlistId) {
        const playlist = this.getPlaylist(playlistId);
        
        this.playlists = this.playlists.filter(p => p.id !== playlistId);
        this.savePlaylists();
        
        // Try to delete from server
        if (this.apiClient?.isAuthenticated() && playlist?.server_id) {
            try {
                await this.apiClient.deletePlaylist(playlist.server_id);
            } catch (error) {
                console.log('Failed to delete playlist from server:', error);
            }
        }
    }

    // Add song to playlist
    async addSongToPlaylist(playlistId, chartId) {
        const playlist = this.getPlaylist(playlistId);
        if (playlist && !playlist.songs.includes(chartId)) {
            playlist.songs.push(chartId);
            playlist.updatedAt = Date.now();
            this.savePlaylists();
            
            // Try to sync to server
            if (this.apiClient?.isAuthenticated() && playlist.server_id) {
                try {
                    await this.apiClient.addSongToPlaylist(playlist.server_id, chartId);
                } catch (error) {
                    console.log('Failed to add song to playlist on server:', error);
                }
            }
            return true;
        }
        return false;
    }

    // Remove song from playlist
    async removeSongFromPlaylist(playlistId, chartId) {
        const playlist = this.getPlaylist(playlistId);
        if (playlist) {
            playlist.songs = playlist.songs.filter(id => id !== chartId);
            playlist.updatedAt = Date.now();
            this.savePlaylists();
            
            // Try to sync to server
            if (this.apiClient?.isAuthenticated() && playlist.server_id) {
                try {
                    await this.apiClient.removeSongFromPlaylist(playlist.server_id, chartId);
                } catch (error) {
                    console.log('Failed to remove song from playlist on server:', error);
                }
            }
            return true;
        }
        return false;
    }

    // Reorder songs in playlist
    reorderSongs(playlistId, oldIndex, newIndex) {
        const playlist = this.getPlaylist(playlistId);
        if (playlist) {
            const [removed] = playlist.songs.splice(oldIndex, 1);
            playlist.songs.splice(newIndex, 0, removed);
            playlist.updatedAt = Date.now();
            this.savePlaylists();
        }
    }

    // Get songs in playlist (with full chart data)
    getPlaylistSongs(playlistId, charts) {
        const playlist = this.getPlaylist(playlistId);
        if (!playlist) return [];
        
        return playlist.songs.map(chartId => {
            return charts.find(c => c.id === chartId);
        }).filter(c => c); // Remove nulls if chart was deleted
    }

    // Playback control
    setCurrentPlaylist(playlistId) {
        this.currentPlaylist = playlistId;
        this.currentSongIndex = 0;
    }

    getCurrentSong(charts) {
        if (!this.currentPlaylist || this.currentSongIndex < 0) return null;
        const songs = this.getPlaylistSongs(this.currentPlaylist, charts);
        return songs[this.currentSongIndex];
    }

    nextSong(charts) {
        if (!this.currentPlaylist) return null;
        const songs = this.getPlaylistSongs(this.currentPlaylist, charts);
        
        if (this.currentSongIndex < songs.length - 1) {
            this.currentSongIndex++;
            return songs[this.currentSongIndex];
        }
        return null; // End of playlist
    }

    previousSong(charts) {
        if (!this.currentPlaylist) return null;
        const songs = this.getPlaylistSongs(this.currentPlaylist, charts);
        
        if (this.currentSongIndex > 0) {
            this.currentSongIndex--;
            return songs[this.currentSongIndex];
        }
        return null; // Start of playlist
    }

    hasNext() {
        if (!this.currentPlaylist) return false;
        const playlist = this.getPlaylist(this.currentPlaylist);
        return playlist && this.currentSongIndex < playlist.songs.length - 1;
    }

    hasPrevious() {
        return this.currentPlaylist && this.currentSongIndex > 0;
    }

    // Export playlist (for sharing or backup)
    exportPlaylist(playlistId, charts) {
        const playlist = this.getPlaylist(playlistId);
        if (!playlist) return null;
        
        const songs = this.getPlaylistSongs(playlistId, charts);
        
        return {
            name: playlist.name,
            description: playlist.description,
            songs: songs,
            exportedAt: Date.now()
        };
    }

    // Import playlist
    importPlaylist(playlistData, existingCharts) {
        const playlist = this.createPlaylist(playlistData.name, playlistData.description);
        
        // Match songs by title and artist
        playlistData.songs.forEach(song => {
            const existingChart = existingCharts.find(c => 
                c.chart.title === song.chart.title && 
                c.chart.artist === song.chart.artist
            );
            
            if (existingChart) {
                this.addSongToPlaylist(playlist.id, existingChart.id);
            }
        });
        
        return playlist;
    }
}

// Export for use in main app
window.PlaylistManager = PlaylistManager;


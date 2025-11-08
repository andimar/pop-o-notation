// Audio Player - Band-in-a-Box Style Chord Playback

class ChordPlayer {
    constructor() {
        this.audioContext = null;
        this.isPlaying = false;
        this.currentTimeout = null;
        this.chordFrequencies = this.buildChordDatabase();
        this.metronomeEnabled = true;
        this.scheduledEvents = [];
        this.activeNodes = [];
    }

    // Initialize Audio Context
    init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    }

    // Chord database con frequenze
    buildChordDatabase() {
        // Note base frequencies (A4 = 440Hz)
        const notes = {
            'C': 261.63, 'C#': 277.18, 'Db': 277.18,
            'D': 293.66, 'D#': 311.13, 'Eb': 311.13,
            'E': 329.63,
            'F': 349.23, 'F#': 369.99, 'Gb': 369.99,
            'G': 392.00, 'G#': 415.30, 'Ab': 415.30,
            'A': 440.00, 'A#': 466.16, 'Bb': 466.16,
            'B': 493.88
        };

        // Intervalli per tipi di accordi (semitoni dalla radice)
        const chordTypes = {
            'maj': [0, 4, 7],           // Maggiore
            'm': [0, 3, 7],             // Minore
            '7': [0, 4, 7, 10],         // Settima dominante
            'maj7': [0, 4, 7, 11],      // Settima maggiore
            'Δ': [0, 4, 7, 11],         // Settima maggiore (simbolo)
            '△': [0, 4, 7, 11],         // Settima maggiore (simbolo alternativo)
            'm7': [0, 3, 7, 10],        // Minore settima
            'm7b5': [0, 3, 6, 10],      // Semidiminuito
            'dim': [0, 3, 6],           // Diminuito
            'aug': [0, 4, 8],           // Aumentato
            'sus4': [0, 5, 7],          // Sospeso 4
            'sus2': [0, 2, 7],          // Sospeso 2
            '6': [0, 4, 7, 9],          // Sesta
            'm6': [0, 3, 7, 9],         // Minore sesta
            '9': [0, 4, 7, 10, 14],     // Nona
        };

        return { notes, chordTypes };
    }

    // Parse chord symbol
    parseChord(chordSymbol) {
        chordSymbol = chordSymbol.trim();
        
        // Extract root note
        let root = chordSymbol[0].toUpperCase();
        let index = 1;
        
        // Check for sharp/flat
        if (index < chordSymbol.length && (chordSymbol[index] === '#' || chordSymbol[index] === 'b')) {
            root += chordSymbol[index];
            index++;
        }
        
        // Get chord type
        let type = chordSymbol.substring(index);
        
        // Default to major if no type specified
        if (!type || type === '') {
            type = 'maj';
        }
        
        // Handle various notations
        if (type.startsWith('maj7')) type = 'maj7';
        else if (type.startsWith('m7b5')) type = 'm7b5';
        else if (type.startsWith('m7')) type = 'm7';
        else if (type.startsWith('m6')) type = 'm6';
        else if (type.startsWith('m')) type = 'm';
        else if (type.startsWith('7')) type = '7';
        else if (type.startsWith('6')) type = '6';
        else if (type === 'Δ' || type === '△' || type.includes('△') || type.includes('Δ')) type = 'Δ';
        else if (type.includes('dim')) type = 'dim';
        else if (type.includes('aug')) type = 'aug';
        else if (type.includes('sus4')) type = 'sus4';
        else if (type.includes('sus2')) type = 'sus2';
        
        return { root, type };
    }

    // Get frequencies for a chord
    getChordFrequencies(chordSymbol) {
        const { root, type } = this.parseChord(chordSymbol);
        const { notes, chordTypes } = this.chordFrequencies;
        
        const rootFreq = notes[root];
        if (!rootFreq) {
            console.warn(`Unknown root note: ${root}`);
            return [];
        }
        
        const intervals = chordTypes[type] || chordTypes['maj'];
        
        return intervals.map(interval => {
            return rootFreq * Math.pow(2, interval / 12);
        });
    }

    // Play metronome click
    playClick(isAccent = false, when = 0) {
        if (!this.audioContext || !this.metronomeEnabled) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        // Click forte (accento) vs debole
        const frequency = isAccent ? 1200 : 800;
        const volume = isAccent ? 0.3 : 0.15;
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        // Envelope molto corto per il click
        const startTime = when || this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(volume, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.03);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.03);
        
        // Track node for cleanup
        this.activeNodes.push({ oscillator, gainNode, stopTime: startTime + 0.03 });
    }

    // Play a single chord
    playChord(chordSymbol, duration = 0.5, when = 0) {
        if (!this.audioContext) {
            this.init();
        }
        
        const frequencies = this.getChordFrequencies(chordSymbol);
        const startTime = when || this.audioContext.currentTime;
        
        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(freq, startTime);
            
            // Envelope ADSR
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.1 / frequencies.length, startTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(0.07 / frequencies.length, startTime + 0.1);
            gainNode.gain.linearRampToValueAtTime(0.07 / frequencies.length, startTime + duration - 0.1);
            gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
            
            // Track node for cleanup
            this.activeNodes.push({ oscillator, gainNode, stopTime: startTime + duration });
        });
    }

    // Parse time signature
    parseTimeSignature(timeSignature) {
        const match = timeSignature.match(/(\d+)\/(\d+)/);
        if (match) {
            return {
                beatsPerBar: parseInt(match[1]),
                beatValue: parseInt(match[2])
            };
        }
        return { beatsPerBar: 4, beatValue: 4 }; // default 4/4
    }

    // Play entire chart with metronome
    playChart(chart) {
        if (this.isPlaying) {
            this.stop();
            return;
        }
        
        this.init();
        this.isPlaying = true;
        this.scheduledEvents = [];
        
        const bpm = parseInt(chart.tempo) || 120;
        const timeSignature = this.parseTimeSignature(chart.timeSignature || '4/4');
        const beatsPerBar = timeSignature.beatsPerBar;
        
        const beatDuration = 60 / bpm; // secondi per beat
        const barDuration = beatDuration * beatsPerBar; // secondi per battuta
        
        const audioStartTime = this.audioContext.currentTime + 0.1; // piccolo offset
        let currentTime = 0;
        let globalBeatCount = 0;
        
        for (const section of chart.sections) {
            for (const bar of section.bars) {
                // Schedule metronome clicks for this bar
                for (let beat = 0; beat < beatsPerBar; beat++) {
                    const beatTime = audioStartTime + currentTime + (beat * beatDuration);
                    const isAccent = (beat === 0); // Primo beat è accentato
                    
                    // Schedule the click
                    this.playClick(isAccent, beatTime);
                }
                
                // Schedule chord playback
                const chordDuration = barDuration / bar.chords.length;
                
                bar.chords.forEach((chord, index) => {
                    const playTime = audioStartTime + currentTime + (index * chordDuration);
                    this.playChord(chord, chordDuration, playTime);
                });
                
                // Schedule bar highlighting
                const highlightDelay = (currentTime * 1000) + 100;
                const timeoutId = setTimeout(() => {
                    if (this.isPlaying) {
                        this.highlightBar(bar.number);
                    }
                }, highlightDelay);
                this.scheduledEvents.push(timeoutId);
                
                currentTime += barDuration;
                globalBeatCount += beatsPerBar;
            }
        }
        
        // Stop at the end and update UI
        const stopTimeout = setTimeout(() => {
            if (this.isPlaying) {
                this.stop();
                // Notify app to update play button
                if (window.chordChartApp) {
                    window.chordChartApp.updatePlayButton(false);
                }
            }
        }, (currentTime * 1000) + 500);
        this.scheduledEvents.push(stopTimeout);
    }

    // Toggle metronome
    toggleMetronome() {
        this.metronomeEnabled = !this.metronomeEnabled;
        return this.metronomeEnabled;
    }

    // Set metronome state
    setMetronome(enabled) {
        this.metronomeEnabled = enabled;
    }

    // Stop playback
    stop() {
        this.isPlaying = false;
        
        // Clear all scheduled events
        this.scheduledEvents.forEach(timeoutId => {
            clearTimeout(timeoutId);
        });
        this.scheduledEvents = [];
        
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
        
        // Stop all active audio nodes immediately
        const now = this.audioContext ? this.audioContext.currentTime : 0;
        this.activeNodes.forEach(({ oscillator, gainNode, stopTime }) => {
            try {
                // Fade out quickly to avoid clicks
                if (now < stopTime) {
                    gainNode.gain.cancelScheduledValues(now);
                    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
                    gainNode.gain.linearRampToValueAtTime(0, now + 0.05);
                    oscillator.stop(now + 0.05);
                }
            } catch (e) {
                // Node might already be stopped
            }
        });
        this.activeNodes = [];
        
        this.removeAllHighlights();
    }

    // Highlight current bar (UI feedback)
    highlightBar(barNumber) {
        this.removeAllHighlights();
        const barCells = document.querySelectorAll('.bar-cell');
        let currentCell = null;
        
        barCells.forEach(cell => {
            const numberElement = cell.querySelector('.bar-number');
            if (numberElement && parseInt(numberElement.textContent) === barNumber) {
                cell.classList.add('playing');
                currentCell = cell;
            }
        });
        
        // Autoscroll to keep current bar visible
        if (currentCell) {
            this.scrollToBar(currentCell);
        }
    }

    removeAllHighlights() {
        const barCells = document.querySelectorAll('.bar-cell');
        barCells.forEach(cell => cell.classList.remove('playing'));
    }

    // Smooth scroll to keep current bar in view
    scrollToBar(barCell) {
        // Try to find the container (works in app, modal, and player mode)
        const chartPreview = document.getElementById('chartPreview');
        const modalContent = document.getElementById('modalChartContent');
        const playerChart = document.getElementById('playerChart');
        
        // Determine which container has the bar
        let container = null;
        if (modalContent?.contains(barCell)) {
            container = modalContent;
        } else if (playerChart?.contains(barCell)) {
            container = playerChart;
        } else if (chartPreview?.contains(barCell)) {
            container = chartPreview;
        }
        
        if (!container || !barCell) return;
        
        // Calculate position to center the bar in view
        const containerRect = container.getBoundingClientRect();
        const barRect = barCell.getBoundingClientRect();
        
        // Calculate scroll position to center the bar
        const relativeTop = barRect.top - containerRect.top;
        const centerOffset = (containerRect.height / 2) - (barRect.height / 2);
        const targetScroll = container.scrollTop + relativeTop - centerOffset;
        
        // Smooth scroll
        container.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
        });
    }
}

// Export for use in main app
window.ChordPlayer = ChordPlayer;


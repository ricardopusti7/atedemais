class ComicViewer {
    constructor() {
        this.currentComic = JSON.parse(localStorage.getItem('currentComic'));
        this.currentPageIndex = 0;
        this.isPlaying = false;
        this.isFirstPage = true;
        this.isTransitioning = false;
        
        // Elementos do DOM
        this.videoPlayer = document.getElementById('video-player');
        this.preloadPlayer = document.getElementById('preload-player');
        this.prevButton = document.getElementById('prev-page');
        this.nextButton = document.getElementById('next-page');
        this.playPauseButton = document.getElementById('play-pause');
        this.currentPageSpan = document.getElementById('current-page');
        this.totalPagesSpan = document.getElementById('total-pages');
    // Background music and audio prompt
    this.bgMusic = document.getElementById('bg-music');
    this.audioPrompt = document.getElementById('audio-prompt');
    this.hasAudioPermission = false; // set true after user gesture allows audio
        
        // Event listeners para o vídeo
        this.videoPlayer.addEventListener('error', (e) => {
            console.error('Erro no vídeo:', e.target.error);
        });
        
        this.videoPlayer.addEventListener('loadeddata', async () => {
            console.log('Vídeo carregado com sucesso');
            this.updatePlayPauseButton();

            // Tentar reproduzir automaticamente sempre (incluindo o primeiro frame).
            // Browsers podem bloquear autoplay com áudio; capturamos a possível exceção.
            try {
                await this.videoPlayer.play();
                console.log('Autoplay iniciado');
            } catch (err) {
                console.warn('Autoplay bloqueado pelo navegador ou falhou:', err);
            }
        });

        this.videoPlayer.addEventListener('ended', () => {
            console.log('Vídeo terminou');
            this.isPlaying = false;
            this.updatePlayPauseButton();
            
            // Manter o último frame
            if (this.videoPlayer.duration > 0) {
                this.videoPlayer.currentTime = this.videoPlayer.duration;
            }

            // Forçar opacidade total
            this.videoPlayer.style.opacity = '1';
            this.videoPlayer.style.filter = 'none';
            this.videoPlayer.style.webkitFilter = 'none';
        });
        
        this.videoPlayer.addEventListener('play', () => {
            this.isPlaying = true;
            this.updatePlayPauseButton();
        });
        
        this.videoPlayer.addEventListener('pause', () => {
            this.isPlaying = false;
            this.updatePlayPauseButton();
        });
        
        this.initializeViewer();
    }
    
    initializeViewer() {
        if (!this.currentComic) {
            window.location.href = 'index.html';
            return;
        }
        
        // Configurar contadores de página
        this.totalPagesSpan.textContent = this.currentComic.pages.length;
        this.updateCurrentPage();
        
        // Configurar event listeners (attach once in constructor to avoid re-attachment)
        if (this.prevButton) this.prevButton.addEventListener('click', (e) => { e.preventDefault(); console.log('prev click current index', this.currentPageIndex); this.previousPage(); });
        if (this.nextButton) this.nextButton.addEventListener('click', (e) => { e.preventDefault(); console.log('next click current index', this.currentPageIndex); this.nextPage(); });
        if (this.playPauseButton) this.playPauseButton.addEventListener('click', (e) => { e.preventDefault(); console.log('repeat click current index', this.currentPageIndex); this.repeatCurrentVideo(); });
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousPage();
            if (e.key === 'ArrowRight') this.nextPage();
            if (e.key === ' ') {
                e.preventDefault();
                this.repeatCurrentVideo();
            }
        });
        
    // Carregar primeira página
    this.loadCurrentPage();
    this.preloadNextVideo();
    }
    
    async loadCurrentPage() {
        const videoPath = this.currentComic.pages[this.currentPageIndex];
        console.log('Carregando vídeo:', videoPath);
        
        // Se estiver em transição, use o player de pré-carregamento
        // Always set the current video's src explicitly. Removing the swap logic
        // avoids showing the wrong preloaded video when navigating back/forward.
        this.videoPlayer.src = videoPath;
        this.videoPlayer.currentTime = 0;
        // Tentativa de autoplay (pode ser bloqueado pelo navegador)
        try {
            await this.videoPlayer.play();
        } catch (err) {
            // Não fatal — apenas log
            console.warn('Falha ao tentar autoplay ao carregar página:', err);
        }

        // Also attempt to start background music and handle autoplay restrictions
        try {
            await this.tryPlayAll();
        } catch (err) {
            console.warn('Erro ao tentar tocar áudio:', err);
        }
        
        // Update UI
        this.updateCurrentPage();
        this.updateControls();
        
        // Começar a pré-carregar o próximo vídeo
        this.preloadNextVideo();
        
        // Add event listeners for debugging
        this.videoPlayer.addEventListener('loadedmetadata', () => {
            console.log('Metadados do vídeo carregados:', {
                duration: this.videoPlayer.duration,
                width: this.videoPlayer.videoWidth,
                height: this.videoPlayer.videoHeight
            });
        });

        this.videoPlayer.addEventListener('playing', () => {
            console.log('Vídeo começou a reproduzir');
        });
        
        // Update button states
        this.prevButton.disabled = this.currentPageIndex === 0;
        this.nextButton.disabled = this.currentPageIndex === this.currentComic.pages.length - 1;
    }
    
    preloadNextVideo() {
        if (this.currentPageIndex < this.currentComic.pages.length - 1) {
            const nextVideoPath = this.currentComic.pages[this.currentPageIndex + 1];
            this.preloadPlayer.src = nextVideoPath;
            // load() pode ser opcional; definimos currentTime e deixamos o browser gerir
            try { this.preloadPlayer.load(); } catch (e) { /* ignore */ }
            this.preloadPlayer.currentTime = 0;
            // isTransitioning não é mais usado para o swap; mantemos falso
            this.isTransitioning = false;
        } else {
            this.isTransitioning = false;
        }
    }

    async tryPlayAll() {
        // Try to play bg music unmuted first; if blocked, try muted so the element becomes allowed by the browser.
        if (this.bgMusic) {
            try {
                this.bgMusic.loop = true;
                this.bgMusic.preload = 'auto';
                await this.bgMusic.play();
                this.hasAudioPermission = true;
                this.hideAudioPrompt();
            } catch (err) {
                console.warn('Autoplay bgMusic bloqueado, tentando tocar em muted...', err);
                try {
                    this.bgMusic.muted = true;
                    await this.bgMusic.play();
                    // bgMusic is playing but muted; wait for user gesture to unmute
                    this.showAudioPrompt();
                } catch (err2) {
                    console.warn('Falha ao tocar bgMusic mesmo em muted:', err2);
                    this.showAudioPrompt();
                }
            }
        }

        // Try to play current video (may be blocked if it has audio)
        try {
            await this.videoPlayer.play();
            // If video plays unmuted, we can consider audio allowed
            if (!this.videoPlayer.muted) {
                this.hasAudioPermission = true;
                this.hideAudioPrompt();
            }
        } catch (err) {
            console.warn('Autoplay do vídeo bloqueado:', err);
            // Leave prompt displayed for user gesture
            this.showAudioPrompt();
        }
    }

    showAudioPrompt() {
        if (!this.audioPrompt) return;
        this.audioPrompt.style.display = 'block';
        // Add a one-time document listener to capture first user interaction
        const onceHandler = () => {
            this.userInteracted();
            document.removeEventListener('click', onceHandler);
            document.removeEventListener('touchstart', onceHandler);
        };
        document.addEventListener('click', onceHandler);
        document.addEventListener('touchstart', onceHandler);
    }

    hideAudioPrompt() {
        if (!this.audioPrompt) return;
        this.audioPrompt.style.display = 'none';
    }

    userInteracted() {
        // Called when the user taps/clicks to allow audio. Unmute and play both bgMusic and video.
        try {
            if (this.bgMusic) {
                this.bgMusic.muted = false;
                this.bgMusic.play().catch(err => console.warn('bgMusic play after interaction failed:', err));
            }
            if (this.videoPlayer) {
                this.videoPlayer.muted = false;
                this.videoPlayer.play().catch(err => console.warn('video play after interaction failed:', err));
            }
            this.hasAudioPermission = true;
            this.hideAudioPrompt();
        } catch (err) {
            console.error('Erro durante userInteracted:', err);
        }
    }
    
    // Repeater: reinicia o vídeo atual e tenta reproduzir.
    repeatCurrentVideo() {
        try {
            this.videoPlayer.currentTime = 0;
            this.videoPlayer.play().catch(err => console.warn('Não foi possível reproduzir ao repetir:', err));
        } catch (err) {
            console.error('Erro ao repetir vídeo:', err);
        }
    }

    updatePlayPauseButton() {
        // O botão agora é sempre 'Repetir'
        this.playPauseButton.textContent = 'Repetir';
    }
    
    updateCurrentPage() {
        if (this.currentPageSpan) this.currentPageSpan.textContent = this.currentPageIndex + 1;
        if (this.totalPagesSpan && this.currentComic && Array.isArray(this.currentComic.pages)) {
            this.totalPagesSpan.textContent = this.currentComic.pages.length;
        }
    }
    
    updateControls() {
        this.prevButton.disabled = this.currentPageIndex === 0;
        this.nextButton.disabled = this.currentPageIndex === this.currentComic.pages.length - 1;
    }
    
    previousPage() {
        if (this.currentPageIndex > 0) {
            this.currentPageIndex--;
            this.isFirstPage = (this.currentPageIndex === 0);
            this.updateCurrentPage();
            this.loadCurrentPage();
            this.preloadNextVideo();
        }
    }
    
    nextPage() {
        if (this.currentPageIndex < this.currentComic.pages.length - 1) {
            this.currentPageIndex++;
            this.isFirstPage = false;
            this.updateCurrentPage();
            this.loadCurrentPage();
            this.preloadNextVideo();
        }
    }
    
}

// Initialize the viewer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ComicViewer();
});
// music-player.js
function initMusicPlayer() {
    console.log("Initializing music player...");
    
    const audio = document.getElementById('background-music');
    const playBtn = document.getElementById('play-music');
    const pauseBtn = document.getElementById('pause-music');
    const muteBtn = document.getElementById('mute-music');
    const volumeSlider = document.getElementById('volume-slider');
    
    if (!audio) {
        console.log("No music player found on this page");
        return;
    }
    
    // Set initial volume (30%)
    audio.volume = 0.3;
    volumeSlider.value = 0.3;
    
    // Save volume preference in localStorage
    const savedVolume = localStorage.getItem('musicVolume');
    if (savedVolume) {
        audio.volume = parseFloat(savedVolume);
        volumeSlider.value = savedVolume;
    }
    
    const savedMuted = localStorage.getItem('musicMuted');
    if (savedMuted === 'true') {
        audio.muted = true;
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
    
    playBtn.addEventListener('click', function() {
        audio.play().then(() => {
            console.log("Music playing");
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-block';
            localStorage.setItem('musicPlaying', 'true');
        }).catch(error => {
            console.log("Playback failed:", error);
        });
    });
    
    // Pause button
    pauseBtn.addEventListener('click', function() {
        audio.pause();
        playBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
        localStorage.setItem('musicPlaying', 'false');
    });
    
    // Mute toggle
    muteBtn.addEventListener('click', function() {
        audio.muted = !audio.muted;
        if (audio.muted) {
            this.innerHTML = '<i class="fas fa-volume-mute"></i>';
            localStorage.setItem('musicMuted', 'true');
        } else {
            this.innerHTML = '<i class="fas fa-volume-up"></i>';
            localStorage.setItem('musicMuted', 'false');
        }
    });
    
    // Volume slider
    volumeSlider.addEventListener('input', function() {
        audio.volume = this.value;
        localStorage.setItem('musicVolume', this.value);
        
        // Auto-unmute if volume > 0
        if (this.value > 0 && audio.muted) {
            audio.muted = false;
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    });
    
    // Auto-play if user previously had it playing
    if (localStorage.getItem('musicPlaying') === 'true') {
        // Wait for user interaction first
        document.body.addEventListener('click', function startMusicOnce() {
            audio.play().catch(e => console.log("Auto-play blocked"));
            document.body.removeEventListener('click', startMusicOnce);
        }, { once: true });
    }
    
    // Save playback position when leaving page
    window.addEventListener('beforeunload', function() {
        localStorage.setItem('musicTime', audio.currentTime);
    });
    
    // Resume from saved position
    const savedTime = localStorage.getItem('musicTime');
    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }
    
    // Update UI when audio ends (should loop, but just in case)
    audio.addEventListener('ended', function() {
        playBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
    });
    
    // Update UI on play/pause
    audio.addEventListener('play', function() {
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'inline-block';
    });
    
    audio.addEventListener('pause', function() {
        playBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
    });
    
    console.log("✓ Music player ready");
}
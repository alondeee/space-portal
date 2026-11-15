function initMusicPlayer() {
  console.log("Initializing music player...");

  const audio = document.getElementById("background-music");
  const playBtn = document.getElementById("play-music");
  const pauseBtn = document.getElementById("pause-music");
  const muteBtn = document.getElementById("mute-music");
  const volumeSlider = document.getElementById("volume-slider");

  if (!audio) return;

  const playlist = [
    "/assets/Space_Music/Daydream.mp3",
    "/assets/Space_Music/Floating-Through-the-Cosmos.mp3",
    "/assets/Space_Music/Into-the-Void.mp3",
    "/assets/Space_Music/Journey-to-the-Stars.mp3",
    "/assets/Space_Music/Napping-in-Neptune's-Orbit.mp3",
    "/assets/Space_Music/Space-Ambience.mp3",
    "/assets/Space_Music/The-Dawn-of-Creation.mp3",
    "/assets/Space_Music/Unknown-Worlds.mp3",
  ];
  let currentTrackIndex =
    parseInt(localStorage.getItem("musicTrackIndex")) || 0;

  audio.src = playlist[currentTrackIndex];

  let savedVolume = parseFloat(localStorage.getItem("musicVolume"));
  if (isNaN(savedVolume) || savedVolume < 0 || savedVolume > 1) {
    savedVolume = 0.5;
  }

  audio.volume = savedVolume;
  if (volumeSlider) {
    volumeSlider.value = volumeSlider.max > 1 ? savedVolume * 100 : savedVolume;
  }

  const savedMuted = localStorage.getItem("musicMuted");
  if (savedMuted === "true") {
    audio.muted = true;
    if (muteBtn) muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
  }

  if (playBtn) {
    playBtn.addEventListener("click", function () {
      audio
        .play()
        .then(() => {
          console.log("Music playing");
          playBtn.style.display = "none";
          if (pauseBtn) pauseBtn.style.display = "inline-block";
          localStorage.setItem("musicPlaying", "true");
        })
        .catch((error) => console.log("Playback failed:", error));
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener("click", function () {
      audio.pause();
      if (playBtn) playBtn.style.display = "inline-block";
      pauseBtn.style.display = "none";
      localStorage.setItem("musicPlaying", "false");
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", function () {
      audio.muted = !audio.muted;
      this.innerHTML = audio.muted
        ? '<i class="fas fa-volume-mute"></i>'
        : '<i class="fas fa-volume-up"></i>';
      localStorage.setItem("musicMuted", audio.muted.toString());
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener("input", function () {
      const maxVal = parseFloat(this.max) || 1;
      const parsedVal = parseFloat(this.value);

      const normalizedVolume = maxVal > 1 ? parsedVal / 100 : parsedVal;

      audio.volume = normalizedVolume;
      localStorage.setItem("musicVolume", normalizedVolume);

      if (normalizedVolume > 0 && audio.muted) {
        audio.muted = false;
        if (muteBtn) muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      }
    });
  }
  //Old Code (Auto-play on user interaction)
  // if (localStorage.getItem("musicPlaying") === "true") {
  //   document.body.addEventListener(
  //     "click",
  //     function startMusicOnce() {
  //       audio.play().catch(() => console.log("Auto-play blocked"));
  //     },
  //     { once: true },
  //   );
  // }

  audio.addEventListener("ended", function () {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    localStorage.setItem("musicTrackIndex", currentTrackIndex);
    audio.src = playlist[currentTrackIndex];
    
    audio.play()
      .then(() => console.log("Now playing:", playlist[currentTrackIndex]))
      .catch((err) => console.log("Track advance failed:", err));
  });

  if (localStorage.getItem("musicPlaying") === "true") {
    document.body.addEventListener(
      "click",
      function startMusicOnce() {
        audio.play().catch(() => console.log("Auto-play blocked"));
      },
      { once: true },
    );
  }

  // window.addEventListener("beforeunload", function () {
  //   localStorage.setItem("musicTime", audio.currentTime);
  // });

  console.log("✓ Music player ready");
}

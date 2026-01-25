function initDownloadButtons() {
  document.querySelectorAll(".download-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const imageUrl = this.getAttribute("data-image");

      const fileName = imageUrl.split("/").pop();

      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = fileName || "space-image.jpg";
      link.target = "_blank";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const originalHTML = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i>';
      this.style.background = "rgba(0, 200, 0, 0.7)";

      setTimeout(() => {
        this.innerHTML = originalHTML;
        this.style.background = "";
      }, 1000);
    });
  });
}

function initScrollIndicator() {
  const scrollIndicator = document.querySelector(".scroll-indicator");

  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", function () {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    });

    window.addEventListener("scroll", function () {
      if (window.scrollY > 100) {
        scrollIndicator.style.opacity = "0";
      } else {
        scrollIndicator.style.opacity = "1";
      }
    });
  }
}

function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".animate-on-scroll").forEach((el) => {
    observer.observe(el);
  });
}

function initInteractiveElements() {
  const buttons = document.querySelectorAll(".interactive-btn");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  });
  const tooltips = document.querySelectorAll("[data-tooltip]");

  tooltips.forEach((element) => {
    element.addEventListener("mouseenter", function () {
      const tooltipText = this.getAttribute("data-tooltip");
      showTooltip(this, tooltipText);
    });

    element.addEventListener("mouseleave", hideTooltip);
  });
}

function initQuiz() {
  console.log("Initializing quiz...");
  const quizQuestions = document.querySelectorAll(".quiz-question");
  const quizOptions = document.querySelectorAll(".quiz-option");

  if (quizQuestions.length > 0) {
    quizOptions.forEach((option) => {
      option.addEventListener("click", function () {
        const isCorrect = this.dataset.correct === "true";

        if (isCorrect) {
          this.classList.add("correct");
        } else {
          this.classList.add("incorrect");
        }
      });
    });
  }
}

function initLazyLoading() {
  if ("IntersectionObserver" in window) {
    const lazyImages = document.querySelectorAll(".lazy-image");

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => imageObserver.observe(img));
  } else {
    const lazyImages = document.querySelectorAll(".lazy-image");

    const lazyLoad = () => {
      lazyImages.forEach((img) => {
        if (img.getBoundingClientRect().top < window.innerHeight + 100) {
          img.src = img.dataset.src;
          img.classList.add("loaded");
        }
      });
    };
    lazyLoad();
    window.addEventListener("scroll", lazyLoad);
    window.addEventListener("resize", lazyLoad);
  }
}

function initGallery() {
  console.log("Initializing gallery...");
  initLazyLoading();
  initSimpleSidePanel();
  initDownloadButtons();
}

function initSimpleSidePanel() {
  const sidePanel = document.getElementById("sidePanel");
  const panelImage = document.getElementById("panelImage");
  const closeBtn = document.getElementById("closePanel");
  const panelOverlay = document.getElementById("panelOverlay");

  if (!sidePanel) {
    console.log("Side panel not found in HTML");
    return;
  }

  document.querySelectorAll(".gallery-item img").forEach((img) => {
    img.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent event bubbling

      const imageSrc = this.dataset.src || this.src;
      panelImage.src = imageSrc;
      panelImage.alt = this.alt;
      sidePanel.classList.add("active");
      if (panelOverlay) panelOverlay.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent scrolling
    });
  });
  if (closeBtn) {
    closeBtn.addEventListener("click", closePanel);
  }

  if (panelOverlay) {
    panelOverlay.addEventListener("click", closePanel);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidePanel.classList.contains("active")) {
      closePanel();
    }
  });

  function closePanel() {
    sidePanel.classList.remove("active");
    if (panelOverlay) panelOverlay.classList.remove("active");
    document.body.style.overflow = ""; // Re-enable scrolling
  }
  sidePanel.addEventListener("click", function (e) {
    if (e.target === sidePanel || e.target.classList.contains("side-panel")) {
      closePanel();
    }
  });
}

function initSlideshow() {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let currentSlide = 0;
  let slideInterval;
  const prevArrow = document.querySelector(".prev-arrow");
  const nextArrow = document.querySelector(".next-arrow");

  if (slides.length === 0) {
    console.log("No slides found for slideshow");
    return;
  }

  function showSlide(n) {
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    if (n >= slides.length) currentSlide = 0;
    if (n < 0) currentSlide = slides.length - 1;

    slides[currentSlide].classList.add("active");
    if (dots[currentSlide]) dots[currentSlide].classList.add("active");
  }

  function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
  }

  function stopSlideshow() {
    clearInterval(slideInterval);
  }

  function nextSlide() {
    currentSlide++;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide--;
    showSlide(currentSlide);
  }

  showSlide(currentSlide);
  startSlideshow();

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;
      showSlide(currentSlide);
      stopSlideshow();
      startSlideshow();
    });
  });

  if (prevArrow) {
    prevArrow.addEventListener("click", () => {
      prevSlide();
      stopSlideshow();
      startSlideshow();
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener("click", () => {
      nextSlide();
      stopSlideshow();
      startSlideshow();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
      stopSlideshow();
      startSlideshow();
    }
    if (e.key === "ArrowRight") {
      nextSlide();
      stopSlideshow();
      startSlideshow();
    }
  });

  const slideshowContainer = document.querySelector(".slideshow");
  if (slideshowContainer) {
    slideshowContainer.addEventListener("mouseenter", stopSlideshow);
    slideshowContainer.addEventListener("mouseleave", startSlideshow);
  }
}

function initContactForm() {
  console.log("Initializing contact form...");

  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      if (name && email && message) {
        alert("Thank you for your message! (This is a demo)");
        contactForm.reset();
      } else {
        alert("Please fill in all fields.");
      }
    });
  }
}

function initThemeToggle() {
  // If theme was already initialized by navigation loader, skip duplicate setup
  if (window.__themeInitialized) {
    return;
  }
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.querySelector(".fa-sun");
  const moonIcon = document.querySelector(".fa-moon");

  if (!themeToggle) {
    console.log("Theme toggle button not found");
    return;
  }

  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light" || (!savedTheme && prefersDarkScheme.matches)) {
    document.documentElement.setAttribute("data-theme", "light");
    if (sunIcon) sunIcon.style.display = "block";
    if (moonIcon) moonIcon.style.display = "none";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    if (sunIcon) sunIcon.style.display = "none";
    if (moonIcon) moonIcon.style.display = "block";
  }

  themeToggle.addEventListener("click", function () {
    const currentTheme = document.documentElement.getAttribute("data-theme");

    if (currentTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      if (sunIcon) sunIcon.style.display = "block";
      if (moonIcon) moonIcon.style.display = "none";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      if (sunIcon) sunIcon.style.display = "none";
      if (moonIcon) moonIcon.style.display = "block";
    }

    this.style.transform = "scale(1.2) rotate(180deg)";
    setTimeout(() => {
      this.style.transform = "";
    }, 300);
  });

  prefersDarkScheme.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      if (e.matches) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
    }
  });
}

function initSearch() {
  const searchInput = document.getElementById("site-search");
  const searchButton = document.getElementById("search-button");
  const searchResults = document.getElementById("search-results");
  const searchContainer = document.querySelector(".search-container");

  if (!searchInput) return;

  function performSearch(query) {
    if (!query.trim()) {
      searchResults.style.display = "none";
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = searchIndex.filter((item) => {
      return (
        item.title.toLowerCase().includes(lowerQuery) ||
        item.content.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
      );
    });

    displayResults(results);
  }

  function displayResults(results) {
    searchResults.innerHTML = "";

    if (results.length === 0) {
      searchResults.innerHTML =
        '<div class="no-results">No results found</div>';
      searchResults.style.display = "block";
      return;
    }

    results.forEach((result) => {
      const item = document.createElement("div");
      item.className = "search-result-item";
      item.innerHTML = `
        <div class="search-result-title">${result.title}</div>
        <div class="search-result-preview">${result.content.substring(0, 100)}...</div>
        <span class="search-result-category">${result.category}</span>
      `;

      item.addEventListener("click", () => {
        window.location.href = result.url;
      });

      searchResults.appendChild(item);
    });

    searchResults.style.display = "block";
  }
  searchInput.addEventListener("input", (e) => {
    performSearch(e.target.value);
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch(e.target.value);
    }
  });

  searchButton.addEventListener("click", () => {
    performSearch(searchInput.value);
  });

  document.addEventListener("click", (e) => {
    if (!searchContainer.contains(e.target)) {
      searchResults.style.display = "none";
    }
  });
  function highlightText(text, query) {
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }

  const style = document.createElement("style");
  style.textContent = `
    mark {
      background-color: rgba(255, 215, 0, 0.3);
      color: inherit;
      padding: 1px 3px;
      border-radius: 3px;
    }
  `;
  document.head.appendChild(style);
}

const searchHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");

document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing APOD...');
  const config = {
    apiKey: 'npUBF5bibezNbFeCI4LdcOrYdgrZ6qRrqXswmMus',
    baseUrl: 'https://api.nasa.gov/planetary/apod',
    useCache: true,
    cacheDuration: 3600000 
  };
  let currentAPOD = null;
  let isFullscreen = false;
  const elements = {
    container: document.getElementById('apod-section'),
    loading: document.querySelector('.apod-loading'),
    error: document.querySelector('.apod-error'),
    content: document.querySelector('.apod-content'),
    image: document.getElementById('apod-image'),
    videoWrapper: document.querySelector('.apod-video-wrapper'),
    videoContainer: document.getElementById('video-container'),
    mediaBadge: document.getElementById('media-badge'),
    title: document.getElementById('apod-title'),
    date: document.getElementById('apod-date'),
    explanation: document.getElementById('apod-explanation'),
    copyright: document.getElementById('apod-copyright'),
    mediaType: document.getElementById('apod-media-type'),
    hdStatus: document.getElementById('apod-hd-status'),
    downloadBtn: document.getElementById('download-apod'),
    randomBtn: document.getElementById('random-apod'),
    shareBtn: document.getElementById('share-apod'),
    fullscreenBtn: document.getElementById('fullscreen-apod'),
    retryBtn: document.getElementById('retry-apod'),
    demoBtn: document.getElementById('use-demo-apod'),
    toggleExplanation: document.getElementById('toggle-explanation')
  };
  if (!elements.container) {
    console.log('APOD section not found on this page');
    return;
  }
  initAPOD();
  
  function initAPOD() {
    setupEventListeners();
    fetchTodaysAPOD();
  }
  
  function setupEventListeners() {
    if (elements.downloadBtn) {
      elements.downloadBtn.addEventListener('click', handleDownload);
    }
    if (elements.randomBtn) {
      elements.randomBtn.addEventListener('click', fetchRandomAPOD);
    }
    if (elements.shareBtn) {
      elements.shareBtn.addEventListener('click', handleShare);
    }
    if (elements.fullscreenBtn) {
      elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    if (elements.retryBtn) {
      elements.retryBtn.addEventListener('click', fetchTodaysAPOD);
    }
    if (elements.demoBtn) {
      elements.demoBtn.addEventListener('click', showDemoAPOD);
    }
    if (elements.toggleExplanation) {
      elements.toggleExplanation.addEventListener('click', toggleExplanation);
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        closeFullscreen();
      }
    });
  }
  
  async function fetchTodaysAPOD() {
    showLoading();
    
    try {
      const cached = getCachedAPOD('today');
      if (cached && config.useCache) {
        displayAPOD(cached);
        return;
      }
      const url = `${config.baseUrl}?api_key=${config.apiKey}&thumbs=true`;
      console.log('Fetching APOD from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }
      const data = await response.json();
      console.log('APOD data received:', data);
      cacheAPOD('today', data);
      displayAPOD(data);
      
    } catch (error) {
      console.error('Error fetching APOD:', error);
      showError();
    }
  }
  
  async function fetchRandomAPOD() {
    showLoading();
    
    try {
      const startDate = new Date('1995-06-16');
      const endDate = new Date();
      const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
      const randomDate = new Date(randomTime);
      const dateString = randomDate.toISOString().split('T')[0];
      
      console.log('Fetching random APOD for date:', dateString);
      
      const url = `${config.baseUrl}?api_key=${config.apiKey}&date=${dateString}&thumbs=true`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`NASA API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      cacheAPOD(dateString, data);
      displayAPOD(data);
    } catch (error) {
      console.error('Error fetching random APOD:', error);
      showError();
    }
  }
  
  function displayAPOD(data) {
    if (!data) return;
    
    currentAPOD = data;
    elements.title.textContent = data.title || 'Astronomy Picture of the Day';
    elements.date.textContent = formatDate(data.date);
    elements.explanation.textContent = data.explanation || 'No explanation available.';
    if (data.copyright) {
      elements.copyright.textContent = `Credit: ${data.copyright}`;
    } else {
      elements.copyright.textContent = 'Credit: NASA';
    }
    elements.mediaType.textContent = data.media_type === 'video' ? 'Video' : 'Image';
    if (data.hdurl) {
      elements.hdStatus.textContent = 'HD Available';
      elements.downloadBtn.disabled = false;
    } else {
      elements.hdStatus.textContent = 'Standard Quality';
      elements.downloadBtn.disabled = false;
    }
    if (data.media_type === 'video') {
      displayVideo(data);
    } else {
      displayImage(data);
    }
    
    hideLoading();
    elements.content.style.display = 'grid';
    elements.error.style.display = 'none';
    
    if (elements.downloadBtn) {
      const downloadUrl = data.hdurl || data.url || data.thumbnail_url;
      elements.downloadBtn.dataset.url = downloadUrl;
      elements.downloadBtn.dataset.title = data.title;
    }
  }
  
  function displayImage(data) {
    elements.image.style.display = 'block';
    elements.videoWrapper.style.display = 'none';
    
    const imageUrl = data.url || data.thumbnail_url;
    elements.image.src = imageUrl;
    elements.image.alt = data.title || 'NASA Astronomy Picture of the Day';
    
    elements.mediaBadge.innerHTML = '<i class="fas fa-image"></i> Image';
  }
  
  function displayVideo(data) {
    elements.image.style.display = 'none';
    elements.videoWrapper.style.display = 'block';
    
    elements.videoContainer.innerHTML = '';
    
    const url = data.url || '';
    let embedHtml = '';
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = extractYouTubeId(url);
      embedHtml = `
        <iframe 
          src="https://www.youtube.com/embed/${videoId}" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `;
    } else {
      // Generic video embed
      embedHtml = `
        <iframe 
          src="${url}" 
          frameborder="0" 
          allowfullscreen>
        </iframe>
      `;
    }
    
    elements.videoContainer.innerHTML = embedHtml;
    
    // Update badge
    elements.mediaBadge.innerHTML = '<i class="fas fa-video"></i> Video';
  }
  
  function extractYouTubeId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  }
  
  function handleDownload() {
    if (!currentAPOD) return;
    
    const url = currentAPOD.hdurl || currentAPOD.url || currentAPOD.thumbnail_url;
    const title = currentAPOD.title || 'nasa-apod';
    
    if (!url) {
      alert('Download URL not available');
      return;
    }
    
    // Create filename
    const date = currentAPOD.date || new Date().toISOString().split('T')[0];
    const filename = `APOD-${date}-${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.${url.split('.').pop()}`;
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Visual feedback
    const originalText = elements.downloadBtn.innerHTML;
    elements.downloadBtn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
    elements.downloadBtn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    
    setTimeout(() => {
      elements.downloadBtn.innerHTML = originalText;
      elements.downloadBtn.style.background = '';
    }, 2000);
  }
  
  function handleShare() {
    if (!currentAPOD) return;
    
    const shareData = {
      title: `NASA APOD: ${currentAPOD.title}`,
      text: currentAPOD.explanation?.substring(0, 200) + '...',
      url: currentAPOD.url || 'https://apod.nasa.gov/apod/astropix.html'
    };
    
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Shared successfully'))
        .catch(error => console.log('Share cancelled:', error));
    } else {
      const textToCopy = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
      
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          alert('APOD information copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy:', err);
          window.open(shareData.url, '_blank');
        });
    }
  }
  
  function toggleFullscreen() {
    if (isFullscreen) {
      closeFullscreen();
    } else {
      openFullscreen();
    }
  }
  
  function openFullscreen() {
    if (!currentAPOD) return;
    
    const fullscreenDiv = document.createElement('div');
    fullscreenDiv.className = 'apod-fullscreen';
    
    if (currentAPOD.media_type === 'image') {
      const img = document.createElement('img');
      img.src = currentAPOD.hdurl || currentAPOD.url;
      img.alt = currentAPOD.title;
      fullscreenDiv.appendChild(img);
    } else {
      const videoClone = elements.videoContainer.cloneNode(true);
      fullscreenDiv.appendChild(videoClone);
    }
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-fullscreen';
    closeBtn.innerHTML = '×';
    closeBtn.addEventListener('click', closeFullscreen);
    fullscreenDiv.appendChild(closeBtn);
    
    document.body.appendChild(fullscreenDiv);
    document.body.style.overflow = 'hidden';
    isFullscreen = true;
  }
  
  function closeFullscreen() {
    const fullscreenDiv = document.querySelector('.apod-fullscreen');
    if (fullscreenDiv) {
      fullscreenDiv.remove();
    }
    document.body.style.overflow = '';
    isFullscreen = false;
  }
  
  function toggleExplanation() {
    const explanation = elements.explanation;
    const button = elements.toggleExplanation;
    
    if (explanation.style.maxHeight && explanation.style.maxHeight !== 'none') {
      explanation.style.maxHeight = 'none';
      button.innerHTML = '<i class="fas fa-book"></i> Show Less';
    } else {
      explanation.style.maxHeight = '300px';
      button.innerHTML = '<i class="fas fa-book"></i> Show More';
    }
  }
  
  function showDemoAPOD() {
    const demoData = {
      date: new Date().toISOString().split('T')[0],
      title: "The Andromeda Galaxy in Ultraviolet",
      explanation: "What does the Andromeda galaxy look like in ultraviolet light? Young blue stars circle the galactic center in this image from NASA's Swift satellite. The Andromeda Galaxy, also known as M31, is the closest major galaxy to our own Milky Way.",
      url: "https://apod.nasa.gov/apod/image/2401/M31_UV_Swift_960.jpg",
      hdurl: "https://apod.nasa.gov/apod/image/2401/M31_UV_Swift_2048.jpg",
      media_type: "image",
      copyright: "NASA/Swift/Stefan Immler"
    };
    
    displayAPOD(demoData);
    hideLoading();
  }
  
  // Utility Functions
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  function cacheAPOD(key, data) {
    if (!config.useCache) return;
    
    const cacheItem = {
      data: data,
      timestamp: Date.now()
    };
    
    localStorage.setItem(`apod_${key}`, JSON.stringify(cacheItem));
  }
  
  function getCachedAPOD(key) {
    if (!config.useCache) return null;
    
    const cached = localStorage.getItem(`apod_${key}`);
    if (!cached) return null;
    
    const cacheItem = JSON.parse(cached);
    const age = Date.now() - cacheItem.timestamp;
    
    if (age < config.cacheDuration) {
      return cacheItem.data;
    }
    localStorage.removeItem(`apod_${key}`);
    return null;
  }
  
  function showLoading() {
    elements.loading.style.display = 'block';
    elements.content.style.display = 'none';
    elements.error.style.display = 'none';
  }
  
  function hideLoading() {
    elements.loading.style.display = 'none';
  }
  
  function showError() {
    elements.loading.style.display = 'none';
    elements.content.style.display = 'none';
    elements.error.style.display = 'block';
  }
  
  window.APOD = {
    fetchTodaysAPOD,
    fetchRandomAPOD,
    showDemoAPOD,
    currentAPOD: () => currentAPOD
  };
  
});

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    initScrollIndicator();
    initScrollAnimations();
    initInteractiveElements();
    initSlideshow();
    initThemeToggle();
    initSearch(); // ADD THIS LINE
    

    if (window.location.pathname.includes("quiz")) {
      initQuiz();
    }

    if (window.location.pathname.includes("gallery")) {
      initGallery();
    }

    if (window.location.pathname.includes("contact")) {
      initContactForm();
    }

    console.log("✓ Page-specific scripts loaded");
  }, 300);
});
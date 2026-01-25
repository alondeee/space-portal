document.addEventListener("DOMContentLoaded", function () {
  loadNavigation();
});

// async function loadNavigation() {
//   try {
//     const response = await fetch("navigation.html");
//     const html = await response.text();

//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = html;

//     const headerContent = tempDiv.querySelector(
//       "header, .menu-overlay, .menu-panel",
//     );
//     const footerContent = tempDiv.querySelector("footer");

//     if (headerContent) {
//       document.body.insertAdjacentHTML("afterbegin", headerContent.outerHTML);
//     }

//     // Insert footer at end
//     if (footerContent) {
//       document.body.insertAdjacentHTML("beforeend", footerContent.outerHTML);
//     }

//     console.log("✓ Navigation HTML loaded");

//     initMenu();
//     initDropdowns();
//     highlightCurrentPage();
//   } catch (error) {
//     console.error("Navigation loading error:", error);

//     document.body.insertAdjacentHTML(
//       "afterbegin",
//       '<header style="padding: 1rem; background: #0a0e17;">' +
//         "<h1>Space Educational Portal</h1>" +
//         "<p>Navigation failed to load</p>" +
//         "</header>",
//     );
//   }
// }

async function loadNavigation() {
  try {
    const navResponse = await fetch("navigation.html");
    const navHtml = await navResponse.text();
    document.body.insertAdjacentHTML("afterbegin", navHtml);

    const footerResponse = await fetch("footer.html");
    const footerHtml = await footerResponse.text();
    document.body.insertAdjacentHTML("beforeend", footerHtml);

    await loadMusicPlayer();
    initMenu();
    initDropdowns();
    // Setup theme toggle if present in navigation
    try {
      setupThemeToggle();
    } catch (e) {}
    highlightCurrentPage();
  } catch (error) {
    console.error("Navigation loading error:", error);
  }
}

function initMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const menuPanel = document.getElementById("menuPanel");
  const menuOverlay = document.getElementById("menuOverlay");
  const closeMenu = document.getElementById("closeMenu");

  if (!menuToggle || !menuPanel || !menuOverlay) {
    return;
  }

  menuToggle.addEventListener("click", function () {
    console.log("Menu button clicked - opening menu");
    menuPanel.classList.add("active");
    menuOverlay.style.display = "block";
    document.body.style.overflow = "hidden";
  });

  function closeMenuFunc() {
    if (e && e.target.closest(".dropdown-content")) {
      return;
    }
    menuPanel.classList.remove("active");
    if (menuOverlay) menuOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (closeMenu) {
    closeMenu.addEventListener("click", closeMenuFunc);
  }

  if (menuOverlay) {
    menuOverlay.addEventListener("click", closeMenuFunc);
  }

  menuOverlay.addEventListener("click", closeMenuFunc);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && menuPanel.classList.contains("active")) {
      closeMenuFunc();
    }
  });

  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.addEventListener("click", function () {
      setTimeout(closeMenuFunc, 100);
    });
  });
}

function initDropdowns() {
  const dropdowns = document.querySelectorAll(".nav-item.dropdown");

  if (dropdowns.length === 0) {
    return;
  }

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const content = dropdown.querySelector(".dropdown-content");

    if (!toggle || !content) {
      console.warn("Dropdown missing toggle or content", dropdown);
      return;
    }

    dropdown.addEventListener("mouseenter", function () {
      if (window.innerWidth > 768) {
        this.classList.add("active");
        content.style.opacity = "1";
        content.style.visibility = "visible";
        content.style.transform = "translateY(0)";
      }
    });

    dropdown.addEventListener("mouseleave", function () {
      if (window.innerWidth > 768) {
        this.classList.remove("active");
        content.style.opacity = "0";
        content.style.visibility = "hidden";
        content.style.transform = "translateY(10px)";
      }
    });

    toggle.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        const isActive = dropdown.classList.contains("active");

        document.querySelectorAll(".nav-item.dropdown").forEach((item) => {
          if (item !== dropdown) {
            item.classList.remove("active");
            const otherContent = item.querySelector(".dropdown-content");
            if (otherContent) {
              otherContent.style.opacity = "0";
              otherContent.style.visibility = "hidden";
            }
          }
        });
        if (!isActive) {
          dropdown.classList.add("active");
          content.style.opacity = "1";
          content.style.visibility = "visible";
          content.style.transform = "translateY(0)";
        } else {
          dropdown.classList.remove("active");
          content.style.display = "none";
          content.style.opacity = "0";
          content.style.visibility = "hidden";
        }
        return false;
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (window.innerWidth <= 768 && !e.target.closest(".nav-item.dropdown")) {
      document.querySelectorAll(".nav-item.dropdown").forEach((dropdown) => {
        dropdown.classList.remove("active");
        const content = dropdown.querySelector(".dropdown-content");
        if (content) {
          content.style.opacity = "0";
          content.style.visibility = "hidden";
        }
      });
    }
  });
}

function highlightCurrentPage() {
  const currentPage = window.location.pathname.split("/").pop();

  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.classList.remove("active");
  });

  document.querySelectorAll(".site-nav a").forEach((link) => {
    const linkHref = link.getAttribute("href");

    if (
      (currentPage === "" || currentPage === "index.html") &&
      (linkHref === "index.html" || linkHref === "./")
    ) {
      link.classList.add("active");
    } else if (linkHref === currentPage) {
      link.classList.add("active");
    }
  });
}

// async function loadNavigation() {
//   try {
//     // 1. Load navigation
//     const navResponse = await fetch("navigation.html");
//     const navHtml = await navResponse.text();
//     document.body.insertAdjacentHTML("afterbegin", navHtml);

//     // 2. Load music player
//     await loadMusicPlayer();

//     // 3. Initialize everything
//     initMenu();
//     initDropdowns();
//     highlightCurrentPage();
//   } catch (error) {
//     console.error("Loading error:", error);
//   }
// }

async function loadMusicPlayer() {
  try {
    const response = await fetch("music-player.html");
    if (!response.ok) {
      return;
    }

    const html = await response.text();
    document.body.insertAdjacentHTML("beforeend", html);

    await loadAndInitMusicPlayer();
  } catch (error) {
    console.log("Music player not loaded:", error);
  }
}

async function loadAndInitMusicPlayer() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "music-player.js";
    script.onload = () => {
      setTimeout(() => {
        if (typeof initMusicPlayer === "function") {
          initMusicPlayer();
        }
        resolve();
      }, 100);
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// // Theme toggle helper - applies saved theme and wires up #theme-toggle button
// function setupThemeToggle() {
//   try {
//     const saved = localStorage.getItem("theme");
//     if (saved) {
//       document.documentElement.setAttribute("data-theme", saved);
//     }
//   } catch (e) {
//     // ignore
//   }

//   function setIcons(btn) {
//     if (!btn) return;
//     const sun = btn.querySelector(".fa-sun");
//     const moon = btn.querySelector(".fa-moon");
//     const current = document.documentElement.getAttribute("data-theme");
//     if (current === "light") {
//       if (sun) sun.style.display = "block";
//       if (moon) moon.style.display = "none";
//     } else {
//       if (sun) sun.style.display = "none";
//       if (moon) moon.style.display = "block";
//     }
//   }

//   function setup(btn) {
//     if (!btn) return;
//     setIcons(btn);
//     btn.addEventListener("click", function () {
//       const current =
//         document.documentElement.getAttribute("data-theme") || "dark";
//       const next = current === "dark" ? "light" : "dark";
//       document.documentElement.setAttribute("data-theme", next);
//       try {
//         localStorage.setItem("theme", next);
//       } catch (e) {}
//       setIcons(btn);
//       this.style.transform = "scale(1.2) rotate(180deg)";
//       setTimeout(() => {
//         this.style.transform = "";
//       }, 300);
//     });
//   }

//   const existing = document.getElementById("theme-toggle");
//   if (existing) {
//     setup(existing);
//     return;
//   }

//   const mo = new MutationObserver((mutations, observer) => {
//     const btn = document.getElementById("theme-toggle");
//     if (btn) {
//       observer.disconnect();
//       setup(btn);
//     }
//   });
//   mo.observe(document.body, { childList: true, subtree: true });
//   setTimeout(() => {
//     const btn = document.getElementById("theme-toggle");
//     if (btn) setup(btn);
//     mo.disconnect();
//   }, 2000);
//   // mark global flag so other scripts know theme was initialized
//   try {
//     window.__themeInitialized = true;
//   } catch (e) {}
// }

async function loadMusicPlayer() {
  try {
    const response = await fetch("music-player.html");
    if (!response.ok) {
      console.log("Music player HTML not found (optional)");
      return;
    }

    const html = await response.text();
    document.body.insertAdjacentHTML("beforeend", html);

    console.log("✓ Music player HTML loaded");

    await loadAndInitMusicPlayer();
  } catch (error) {
    console.log("Music player not loaded:", error);
  }
}

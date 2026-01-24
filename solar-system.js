document.addEventListener("DOMContentLoaded", function () {
  console.log("Initializing Textured Solar System...");

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000011); // Dark blue space background

  const container = document.querySelector(".model-container");
  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    2000,
  );
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("solar-system-canvas"),
    antialias: true,
    alpha: true,
  });

  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const textureLoader = new THREE.TextureLoader();

  const loadingManager = new THREE.LoadingManager();
  let texturesLoaded = 0;
  const totalTextures = 9; // Sun + 8 planets

  loadingManager.onProgress = (url, loaded, total) => {
    texturesLoaded = loaded;
    const percent = Math.round((loaded / total) * 100);
    console.log(`Loading textures: ${percent}%`);

    const loadingText = document.querySelector("#loading-screen p");
    if (loadingText) {
      loadingText.textContent = `Loading textures... ${percent}%`;
    }
  };

  loadingManager.onLoad = () => {
    console.log("All textures loaded!");
    setTimeout(() => {
      document.getElementById("loading-screen").style.display = "none";
    }, 500);
  };

  const loader = new THREE.TextureLoader(loadingManager);

  const planetsData = [
    {
      name: "sun",
      radius: 10,
      distance: 0,
      texture: "Solar system texture/2k_sun.jpg",
      materialProps: {
        emissive: 0xffff00,
        emissiveIntensity: 0.5,
      },
      rotationSpeed: 0.002,
    },
    {
      name: "mercury",
      radius: 0.4,
      distance: 28,
      texture: "Solar system texture/2k_mercury.jpg",
      rotationSpeed: 0.004,
    },
    {
      name: "venus",
      radius: 0.9,
      distance: 44,
      texture: "Solar system texture/2k_venus_surface.jpg",
      rotationSpeed: -0.002,
    },
    {
      name: "earth",
      radius: 1,
      distance: 62,
      texture: "Solar system texture/2k_earth_daymap.jpg",
      rotationSpeed: 0.01,
    },
    {
      name: "mars",
      radius: 0.5,
      distance: 78,
      texture: "Solar system texture/2k_mars.jpg",
      rotationSpeed: 0.008,
    },
    {
      name: "jupiter",
      radius: 3,
      distance: 100,
      texture: "Solar system texture/2k_jupiter.jpg",
      rotationSpeed: 0.02,
    },
    {
      name: "saturn",
      radius: 2.5,
      distance: 130,
      texture: "Solar system texture/2k_saturn.jpg",
      rotationSpeed: 0.015,
    },
    {
      name: "uranus",
      radius: 1.5,
      distance: 160,
      texture: "Solar system texture/2k_uranus.jpg",
      rotationSpeed: 0.012,
    },
    {
      name: "neptune",
      radius: 1.4,
      distance: 180,
      texture: "Solar system texture/2k_neptune.jpg",
      rotationSpeed: 0.01,
    },
  ];

  const planets = {};

  function createPlanets() {
    planetsData.forEach((data) => {
      const texture = loader.load(data.texture);
      const materialProps = {
        map: texture,
        roughness: 0.8,
        metalness: 0.2,
        ...data.materialProps,
      };

      const material = new THREE.MeshStandardMaterial(materialProps);

      const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
      const planet = new THREE.Mesh(geometry, material);
      planet.position.x = data.distance;
      planet.userData = {
        name: data.name,
        radius: data.radius,
        distance: data.distance,
        rotationSpeed: data.rotationSpeed,
        angle: Math.random() * Math.PI * 2, // Random starting position
      };

      scene.add(planet);
      planets[data.name] = planet;

      if (data.name !== "sun") {
        createOrbitRing(data.distance);
      }
    });
  }

  function createOrbitRing(radius) {
    const ringGeometry = new THREE.RingGeometry(radius - 0.1, radius + 0.1, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
  }

  function createSaturnRings() {
    if (!planets.saturn) return;

    const ringTexture = loader.load(
      "Solar system texture/2k_saturn_ring_alpha.png",
    ); // You'll need a ring texture
    const ringGeometry = new THREE.RingGeometry(3, 6, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: ringTexture,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });

    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = Math.PI / 2;
    rings.position.x = planets.saturn.position.x * 1.5;
    scene.add(rings);

    planets.saturnRings = rings;
  }

  function createStars() {
    const starCount = 8000;
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 970 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const idx = i * 3;
      starPositions[idx] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[idx + 2] = radius * Math.cos(phi);

      starSizes[i] = 0.05 + Math.random() * 0.25;

      const temperature = Math.random();
      const colorIdx = i * 3;

      if (temperature < 0.3) {
        starColors[colorIdx] = 0.7 + Math.random() * 0.3;
        starColors[colorIdx + 1] = 0.8 + Math.random() * 0.2;
        starColors[colorIdx + 2] = 1.0;
      } else if (temperature < 0.7) {
        const brightness = 0.8 + Math.random() * 0.2;
        starColors[colorIdx] = brightness;
        starColors[colorIdx + 1] = brightness;
        starColors[colorIdx + 2] = brightness * 0.9;
      } else {
        starColors[colorIdx] = 1.0;
        starColors[colorIdx + 1] = 0.6 + Math.random() * 0.3;
        starColors[colorIdx + 2] = 0.4 + Math.random() * 0.2;
      }
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(starPositions, 3),
    );
    starGeometry.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));
    starGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(starColors, 3),
    );

    const starMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
  }

  function setupLighting() {
    const sunLight = new THREE.PointLight(0xffffff, 2, 300);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
  }

  // Camera controls
  let controls;
  function setupControls() {
    if (typeof THREE.OrbitControls !== "undefined") {
      controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance = 20;
      controls.maxDistance = 500;
      controls.maxPolarAngle = Math.PI;
    }
  }


  function init() {
    createStars();
    setupLighting();
    createPlanets();
    createSaturnRings(); // Optional
    setupControls();
    camera.position.set(0, 50, 150);
    camera.lookAt(0, 0, 0);
    animate();
  }

  function animate() {
    requestAnimationFrame(animate);
    updatePlanets();
    if (controls) {
      controls.update();
    }

    renderer.render(scene, camera);
  }

  function updatePlanets() {
    const time = Date.now() * 0.0001; // For smooth animation

    Object.values(planets).forEach((planet) => {
      if (planet.userData && planet.userData.name !== "sun") {
        planet.rotation.y += planet.userData.rotationSpeed;

        // Orbital motion (simplified circular orbits)
        const orbitSpeed = 0.002 / Math.sqrt(planet.userData.distance);
        planet.userData.angle += orbitSpeed;

        planet.position.x =
          Math.cos(planet.userData.angle) * planet.userData.distance;
        planet.position.z =
          Math.sin(planet.userData.angle) * planet.userData.distance;

        // Update Saturn's rings position
        if (planet.userData.name === "saturn" && planets.saturnRings) {
          planets.saturnRings.position.copy(planet.position);
          planets.saturnRings.rotation.y += 0.005;
        }
      } else if (planet.userData && planet.userData.name === "sun") {
        // Sun rotation
        planet.rotation.y += planet.userData.rotationSpeed;
      }
    });
  }

  // Handle window resize
  window.addEventListener("resize", function () {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  // Start initialization
  init();

  function setupPlanetSelection() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function handlePointer(clientX, clientY) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(Object.values(planets));
      if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;
        console.log("Selected planet:", clickedPlanet.userData.name);

        if (controls) {
          controls.target.copy(clickedPlanet.position);
          // move camera closer to the planet smoothly
          camera.position.sub(controls.target);
          camera.position.multiplyScalar(0.03);
          camera.position.add(controls.target);
          controls.update();
        }

        updatePlanetInfo(clickedPlanet.userData.name);
      }
    }

    // Mouse click (desktop)
    renderer.domElement.addEventListener("click", (event) => {
      handlePointer(event.clientX, event.clientY);
    });

    // Touch support (mobile): treat a short tap with minimal movement as a selection
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    renderer.domElement.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches && e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          touchStartTime = Date.now();
        }
      },
      { passive: true },
    );

    renderer.domElement.addEventListener(
      "touchend",
      (e) => {
        const touch = e.changedTouches && e.changedTouches[0];
        if (!touch) return;
        const dx = Math.abs(touch.clientX - touchStartX);
        const dy = Math.abs(touch.clientY - touchStartY);
        const dt = Date.now() - touchStartTime;
        // small movement and quick tap
        if (dx < 12 && dy < 12 && dt < 400) {
          handlePointer(touch.clientX, touch.clientY);
        }
      },
      { passive: true },
    );
  }
  function updatePlanetInfo(planetName) {
    const planetInfo = {
      sun: {
        name: "Sun",
        type: "G2V Yellow Dwarf Star",
        diameter: "1,391,000 km",
        mass: "1.989 × 10³⁰ kg",
        gravity: "274 m/s²",
        distance: "Center of Solar System",
        orbitalPeriod: "N/A",
        rotationPeriod: "25.05 days (equator)",
        surfaceTemp: "5,500°C",
        coreTemp: "15,000,000°C",
        moons: "0",
        ringSystem: "No",
        composition: "Hydrogen (74%), Helium (24%), Other (2%)",
        discovery: "Ancient",
        funFact: "The Sun contains 99.86% of all mass in the Solar System.",
      },
      mercury: {
        name: "Mercury",
        type: "Terrestrial Planet",
        diameter: "4,879 km",
        mass: "3.30 × 10²³ kg",
        gravity: "3.7 m/s²",
        distance: "57.9 million km from Sun",
        orbitalPeriod: "88 Earth days",
        rotationPeriod: "58.6 Earth days",
        surfaceTemp: "-173°C to 427°C",
        avgTemp: "167°C",
        moons: "0",
        ringSystem: "No",
        composition: "Iron core, silicate mantle",
        discovery: "Ancient",
        funFact: "A day on Mercury (sunrise to sunrise) lasts 176 Earth days.",
      },
      venus: {
        name: "Venus",
        type: "Terrestrial Planet",
        diameter: "12,104 km",
        mass: "4.87 × 10²⁴ kg",
        gravity: "8.87 m/s²",
        distance: "108.2 million km from Sun",
        orbitalPeriod: "224.7 Earth days",
        rotationPeriod: "243 Earth days (retrograde)",
        surfaceTemp: "462°C (average)",
        pressure: "92 bar (92× Earth)",
        moons: "0",
        ringSystem: "No",
        composition: "Rocky with thick CO₂ atmosphere",
        discovery: "Ancient",
        funFact: "Venus rotates backwards compared to other planets.",
      },
      earth: {
        name: "Earth",
        type: "Terrestrial Planet",
        diameter: "12,742 km",
        mass: "5.97 × 10²⁴ kg",
        gravity: "9.81 m/s²",
        distance: "149.6 million km from Sun",
        orbitalPeriod: "365.25 days",
        rotationPeriod: "23h 56m 4s",
        surfaceTemp: "-88°C to 58°C",
        avgTemp: "15°C",
        moons: "1 (The Moon)",
        ringSystem: "No",
        composition: "Iron core, silicate mantle, liquid water oceans",
        discovery: "Our home planet",
        funFact:
          "Earth is the only known planet with liquid water on its surface.",
      },
      mars: {
        name: "Mars",
        type: "Terrestrial Planet",
        diameter: "6,779 km",
        mass: "6.42 × 10²³ kg",
        gravity: "3.71 m/s²",
        distance: "227.9 million km from Sun",
        orbitalPeriod: "687 Earth days",
        rotationPeriod: "24h 37m 22s",
        surfaceTemp: "-143°C to 35°C",
        avgTemp: "-63°C",
        moons: "2 (Phobos & Deimos)",
        ringSystem: "No",
        composition: "Iron oxide surface, thin CO₂ atmosphere",
        discovery: "Ancient",
        funFact:
          "Mars has the largest volcano in the Solar System (Olympus Mons).",
      },
      jupiter: {
        name: "Jupiter",
        type: "Gas Giant",
        diameter: "139,820 km",
        mass: "1.90 × 10²⁷ kg",
        gravity: "24.79 m/s²",
        distance: "778.5 million km from Sun",
        orbitalPeriod: "4,333 Earth days (~12 years)",
        rotationPeriod: "9h 55m 30s",
        surfaceTemp: "-108°C",
        composition: "Hydrogen (89%), Helium (10%)",
        moons: "79 (Galilean moons: Io, Europa, Ganymede, Callisto)",
        ringSystem: "Yes (faint)",
        discovery: "Ancient",
        funFact:
          "Jupiter's Great Red Spot is a storm larger than Earth that has lasted 400+ years.",
      },
      saturn: {
        name: "Saturn",
        type: "Gas Giant",
        diameter: "116,460 km",
        mass: "5.68 × 10²⁶ kg",
        gravity: "10.44 m/s²",
        distance: "1.43 billion km from Sun",
        orbitalPeriod: "10,759 Earth days (~29.5 years)",
        rotationPeriod: "10h 39m",
        surfaceTemp: "-139°C",
        composition: "Hydrogen (96%), Helium (3%)",
        moons: "82 (Titan is largest)",
        ringSystem: "Yes (extensive)",
        ringComposition: "Ice particles, rock debris, dust",
        discovery: "Ancient",
        funFact:
          "Saturn is the only planet less dense than water—it would float!",
      },
      uranus: {
        name: "Uranus",
        type: "Ice Giant",
        diameter: "50,724 km",
        mass: "8.68 × 10²⁵ kg",
        gravity: "8.69 m/s²",
        distance: "2.87 billion km from Sun",
        orbitalPeriod: "30,687 Earth days (~84 years)",
        rotationPeriod: "17h 14m (retrograde)",
        surfaceTemp: "-197°C",
        composition: "Hydrogen (83%), Helium (15%), Methane (2%)",
        moons: "27",
        ringSystem: "Yes (faint)",
        axialTilt: "97.77° (on its side)",
        discovery: "1781 by William Herschel",
        funFact:
          "Uranus rotates on its side—its poles are where other planets' equators are.",
      },
      neptune: {
        name: "Neptune",
        type: "Ice Giant",
        diameter: "49,244 km",
        mass: "1.02 × 10²⁶ kg",
        gravity: "11.15 m/s²",
        distance: "4.50 billion km from Sun",
        orbitalPeriod: "60,190 Earth days (~165 years)",
        rotationPeriod: "16h 6m",
        surfaceTemp: "-201°C",
        windSpeed: "2,100 km/h (supersonic)",
        composition: "Hydrogen (80%), Helium (19%), Methane (1%)",
        moons: "14 (Triton is largest)",
        ringSystem: "Yes (faint)",
        discovery: "1846 (predicted mathematically)",
        funFact:
          "Neptune was the first planet located through mathematical predictions.",
      },
    };
    const info = planetInfo[planetName] || planetInfo.earth;

    document.getElementById("selected-planet").textContent = info.name;
    document.getElementById("planet-type").textContent = info.type;
    document.getElementById("planet-diameter").textContent = info.diameter;
    document.getElementById("planet-mass").textContent = info.mass;
    document.getElementById("planet-gravity").textContent = info.gravity;
    document.getElementById("planet-distance").textContent = info.distance;
    document.getElementById("planet-orbit").textContent = info.orbitalPeriod;
    document.getElementById("planet-rotation").textContent =
      info.rotationPeriod;
    document.getElementById("planet-cloudtemperature").textContent =
      info.surfaceTemp;
    document.getElementById("planet-windspeed").textContent = info.windSpeed;
    document.getElementById("planet-composition").textContent =
      info.composition;
    document.getElementById("planet-moons").textContent = info.moons;
    document.getElementById("planet-rings").textContent = info.ringSystem;
    document.getElementById("planet-discovery").textContent = info.discovery;
    document.getElementById("planet-Fun").textContent = info.funFact;
  }

  setTimeout(setupPlanetSelection, 1000);

  window.solarSystemScene = scene;
});
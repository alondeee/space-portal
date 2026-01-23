
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000,
//   );
//   const renderer = new THREE.WebGLRenderer({
//     canvas: document.getElementById("solar-system-canvas"),
//     antialias: true,
//   });

//   const sphereGeometry = new THREE.SphereGeometry(1100, 32, 32); // A large sphere
//   const sphereMaterial = new THREE.MeshBasicMaterial({
//     color: 0x000000,
//     side: THREE.BackSide,
//   });

//   const skySphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
//   scene.add(skySphere);
//   renderer.setSize(
//     document.querySelector(".model-container").offsetWidth,
//     document.querySelector(".model-container").offsetHeight,
//   );
//   renderer.setPixelRatio(window.devicePixelRatio);

//   const controls = new THREE.OrbitControls(camera, renderer.domElement);
//   controls.enableDamping = true;
//   controls.dampingFactor = 0.05;

//   function addStars() {
//     const starGeometry = new THREE.BufferGeometry();
//     const starCount = 5000;
//     const positions = new Float32Array(starCount * 3);

//     for (let i = 0; i < starCount * 3; i += 3) {
//       positions[i] = (Math.random() - 0.5) * 2000;
//       positions[i + 1] = (Math.random() - 0.5) * 2000;
//       positions[i + 2] = (Math.random() - 0.5) * 2000;
//     }

//     starGeometry.setAttribute(
//       "position",
//       new THREE.BufferAttribute(positions, 3),
//     );
//     const starMaterial = new THREE.PointsMaterial({
//       color: 0xffffff,
//       size: 0.7,
//     });
//     const stars = new THREE.Points(starGeometry, starMaterial);
//     scene.add(stars);
//   }

//   function createPlanet(size, color, distance) {
//     const geometry = new THREE.SphereGeometry(size, 32, 32);
//     const material = new THREE.MeshPhongMaterial({ color: color });
//     const planet = new THREE.Mesh(geometry, material);

//     planet.position.x = distance;

//     const orbitGeometry = new THREE.RingGeometry(
//       distance - 0.1,
//       distance + 0.1,
//       64,
//     );
//     const orbitMaterial = new THREE.MeshBasicMaterial({
//       color: 0xffffff,
//       side: THREE.DoubleSide,
//       transparent: true,
//       opacity: 0.3,
//     });
//     const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
//     orbit.rotation.x = Math.PI / 2;
//     scene.add(orbit);

//     scene.add(planet);
//     return planet;
//   }

//   function createSun() {
//     const geometry = new THREE.SphereGeometry(5, 32, 32);
//     const material = new THREE.MeshBasicMaterial({ color: 0xfdb813 });
//     const sun = new THREE.Mesh(geometry, material);

//     const sunLight = new THREE.PointLight(0xffffff, 5, 100);
//     scene.add(sunLight);

//     scene.add(sun);
//     return sun;
//   }

//   addStars();
//   const sun = createSun();

//   const planets = {
//     mercury: createPlanet(0.6, 0x8c7853, 18),
//     venus: createPlanet(0.9, 0xffc649, 26),
//     earth: createPlanet(1, 0x6b93d6, 35),
//     mars: createPlanet(0.8, 0xff0000, 46),
//     jupiter: createPlanet(2.5, 0xD8CA9D, 65),
//     saturn: createPlanet(2.3, 0xFAD5A5, 77),
//     uranus: createPlanet(2.0, 0x4FD0E7, 85),
//     neptune: createPlanet(2.1, 0x2E5CB8, 96),
//   };

// //     const planets = [
// //     {
// //       name: "Mercury",
// //       size: 0.6,
// //       texture: "Solar system texture/2k_mercury.jpg", // relative URL to your image
// //       color: 0x888888,
// //       distance: 18,
// //       rotationSpeed: 0.0004,
// //       axialTilt: 0.03,
// //     },
// //     {
// //       name: "Venus",
// //       radius: 0.9,
// //       texture: "Solar system texture/2k_venus_surface.jpg", // relative URL to your image
// //       color: 0xffc649,
// //       distance: 26,
// //       rotationSpeed: -0.0002,
// //       axialTilt: 177.4,
// //     },
// //     {
// //       name: "Earth",
// //       radius: 1.0,
// //       texture: "Solar system texture/2k_earth_daymap.jpg", // relative URL to your image
// //       color: 0x6b93d6,
// //       distance: 35,
// //       rotationSpeed: 0.001,
// //       axialTilt: 23.5,
// //     },
// //     {
// //       name: "Mars",
// //       radius: 0.8,
// //       texture: "Solar system texture/2k_mars.jpg", // relative URL to your image
// //       color: 0xff0000,
// //       distance: 46,
// //       rotationSpeed: 0.001,
// //       axialTilt: 25.2,
// //     },
// //     {
// //       name: "Jupiter",
// //       radius: 2.5,
// //       texture: "Solar system texture/2k_jupiter.jpg", // relative URL to your image
// //       color: 0xffa500,
// //       distance: 65,
// //       rotationSpeed: 0.0024,
// //       axialTilt: 3.1,
// //       ringInnerRadius: 0.1,
// //       ringOuterRadius: 0.2,
// //       ringParticleCount: 50,
// //     },
// //     {
// //       name: "Saturn",
// //       radius: 2.3,
// //       texture: "Solar system texture/2k_saturn.jpg", // relative URL to your image
// //       color: 0xfad5a5,
// //       distance: 77,
// //       hasrings: true,
// //       ringInnerRadius: 2.5,
// //       ringOuterRadius: 3.5,
// //       ringParticleCount: 5000,
// //       rotationSpeed: 0.0022,
// //       axialTilt: 26.7,
// //     },
// //     {
// //       name: "Uranus",
// //       radius: 2.0,
// //       texture: "Solar system texture/2k_uranus.jpg",
// //       color: 0x4fd0e7,
// //       distance: 95,
// //       rotationSpeed: 0.0015,
// //       axialTilt: 97.8,
// //       ringInnerRadius: 0.1,
// //       ringOuterRadius: 0.2,
// //       ringParticleCount: 50,
// //     },
// //     {
// //       name: "Neptune",
// //       radius: 2.1,
// //       texture: "Solar system texture/2k_neptune.jpg", // relative URL to your image
// //       color: 0x4b70dd,
// //       distance: 106,
// //       rotationSpeed: 0.0014,
// //       axialTilt: 28.3,
// //       ringInnerRadius: 1,
// //       ringOuterRadius: 2,
// //       ringParticleCount: 500,
// //     },
// //   ];

//   const ambientLight = new THREE.AmbientLight(0x333333);
//   scene.add(ambientLight);

//   camera.position.z = 50;

//   setTimeout(() => {
//     document.getElementById("loading-screen").style.display = "none";
//   }, 1500);

//   function animate() {
//     requestAnimationFrame(animate);

//     controls.update();

//     Object.values(planets).forEach((planet) => {
//       planet.rotation.y += 0.01;
//     });

//     // Rotate sun
//     sun.rotation.y += 0.005;

//     renderer.render(scene, camera);
//   }

//   animate();

//   window.addEventListener("resize", function () {
//     const container = document.querySelector(".model-container");
//     camera.aspect = container.offsetWidth / container.offsetHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize(container.offsetWidth, container.offsetHeight);
//   });
// });

// solar-system.js - Complete textured version
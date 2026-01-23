// search-index.js
const searchIndex = [
  {
    id: "home",
    title: "Home",
    content: "Understanding the Cosmos - Educational space portal",
    url: "1.0-index.html",
    category: "Home",
  },

  {
    id: "galaxy-types",
    title: "Types of Galaxies",
    content:
      "Elliptical Galaxies, Spiral Galaxies, Barred Spirals, Lenticular Galaxies, Irregular Galaxies, Active Galaxies, Interacting Galaxies, Peculiar Galaxies",
    url: "1.0-index.html#section1",
    category: "Galaxies",
  },
  {
    id: "elliptical",
    title: "Elliptical Galaxies",
    content: "E0, E1, E2-E7, Dwarf Ellipticals, Brightest Cluster Galaxies",
    url: "1.0-index.html#section1",
    category: "Galaxies",
  },
  {
    id: "spiral",
    title: "Spiral Galaxies",
    content: "Sa, Sb, Sc types including Andromeda, Whirlpool, Triangulum",
    url: "1.0-index.html#section1",
    category: "Galaxies",
  },
  {
    id: "milky-way",
    title: "Milky Way",
    content: "Our home galaxy, barred spiral galaxy",
    url: "1.0-index.html#section1",
    category: "Galaxies",
  },

  {
    id: "space-objects",
    title: "Types of Objects in Space",
    content:
      "Stars, Planets, Nebulae, Galaxies, Active Objects, Cosmological structures",
    url: "1.0-index.html#section1",
    category: "Astronomy",
  },
  {
    id: "stars",
    title: "Stars",
    content:
      "O, B, A, F, G, K, M types, Protostars, Giants, White Dwarfs, Neutron Stars, Black holes",
    url: "1.0-index.html#section1",
    category: "Stars",
  },
  {
    id: "nebulae",
    title: "Nebulae",
    content:
      "Emission Nebulae, Reflection, Dark Nebulae, Planetary Nebulas, Supernova Remnants",
    url: "1.0-index.html#section1",
    category: "Nebulae",
  },

  {
    id: "star-catalog",
    title: "HYG Star Catalog",
    content: "Hipparcos, Yale Bright Star, and Gliese catalogs merged dataset",
    url: "1.0-index.html#section1",
    category: "Data",
  },

  {
    id: "andromeda",
    title: "Andromeda Galaxy",
    content: "M31, nearest spiral galaxy to Milky Way",
    url: "1.2-gallery.html",
    category: "Gallery",
  },
  {
    id: "pillars",
    title: "Pillars of Creation",
    content: "Eagle Nebula M16, iconic star-forming region",
    url: "1.2-gallery.html",
    category: "Gallery",
  },
  {
    id: "crab-nebula",
    title: "Crab Nebula",
    content: "Messier 1, supernova remnant",
    url: "1.2-gallery.html",
    category: "Gallery",
  },
  {
    id: "Sombrero-galaxy",
    title: "Sombrero Galaxy",
    content: "M104, edge-on spiral galaxy",
    url: "1.2-gallery.html",
    category: "Gallery",
  },
  {
    id: "Lunar-Eclipse",
    title: "Solar Eclipse",
    content: "Lunar Eclipse, A event in the solar system",
    url: "1.42-lunar-eclipse.html",
    category: "Gallery",
  },
  {
    id: "Solar-Eclipse",
    title: "Solar Eclipse",
    content: "Solar Eclipse, A event in the solar system",
    url: "1.41-solar-eclipse.html",
    category: "Solar Eclipse",
  },
];

if (typeof module !== "undefined" && module.exports) {
  module.exports = { searchIndex };
}

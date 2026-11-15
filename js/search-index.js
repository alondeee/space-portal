let universeData = [];

fetch('/data/NGC-IC-M-essentials.json')
  .then(response => response.json())
  .then(data => {
    universeData = data;
  })
  .catch(err => console.error("Could not load database:", err));

function initSearch() {
  const searchInput = document.getElementById('site-search');
  const resultsContainer = document.getElementById('search-results');

  if (!searchInput || !resultsContainer) {
    // If navigation.html hasn't finished loading yet, try again in 100ms
    setTimeout(initSearch, 100);
    return;
  }

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    resultsContainer.innerHTML = '';

    if (query.length < 2) {
      resultsContainer.style.display = 'none';
      return;
    }

    const matches = universeData.filter(item => {
      const idMatch = item.id && item.id.toLowerCase().includes(query);
      const nameMatch = item.name && item.name.toLowerCase().includes(query);
      return idMatch || nameMatch;
    }).slice(0, 10);

    if (matches.length > 0) {
      resultsContainer.style.display = 'block';
      matches.forEach(item => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        const label = item.name ? `${item.id}: ${item.name}` : item.id;
        
        div.innerHTML = `<a href="../components/details.html?id=${encodeURIComponent(item.id)}">${label} <span>(${item.type || 'Object'})</span></a>`;
        resultsContainer.appendChild(div);
      });
    } else {
      resultsContainer.style.display = 'none';
    }
  });
}

document.addEventListener('DOMContentLoaded', initSearch);
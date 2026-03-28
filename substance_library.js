/**
 * PharmaCompas Pro — Substance Library Module
 * Module: substance_library.js
 */

let currentFilter = "all";
let currentSearch = "";
let selectedSubstanceId = null;

function renderSubstanceLibrary() {
  return `
    <div class="library-layout">
      <!-- Search & Filter Panel -->
      <div class="library-sidebar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="substance-search" placeholder="Search substances…" oninput="filterSubstances()">
        </div>
        <div class="category-filters">
          <button class="cat-filter active" data-cat="all" onclick="setCatFilter('all', this)">
            All <span class="cat-count">${SUBSTANCES.length}</span>
          </button>
          ${Object.entries(CATEGORIES).map(([key, cat]) => `
            <button class="cat-filter" data-cat="${key}" onclick="setCatFilter('${key}', this)" style="--cat-color:${cat.color}">
              ${cat.icon} ${cat.label}
              <span class="cat-count">${SUBSTANCES.filter(s => s.category === key).length}</span>
            </button>
          `).join("")}
        </div>
      </div>

      <!-- Substance Grid -->
      <div class="library-main">
        <div class="substance-grid" id="substance-grid">
          ${renderSubstanceCards()}
        </div>
      </div>
    </div>

    <!-- Detail Modal Overlay -->
    <div class="modal-overlay" id="substance-modal" onclick="closeSubstanceModal(event)">
      <div class="modal-content" id="modal-body"></div>
    </div>
  `;
}

function renderSubstanceCards() {
  const filtered = SUBSTANCES.filter(s => {
    const matchCat = currentFilter === "all" || s.category === currentFilter;
    const q = currentSearch.toLowerCase();
    const matchSearch = !q ||
      s.name.toLowerCase().includes(q) ||
      s.genericName.toLowerCase().includes(q) ||
      (s.tags || []).some(t => t.includes(q));
    return matchCat && matchSearch;
  });

  if (!filtered.length) {
    return `<div class="no-results">No substances found matching your search.</div>`;
  }

  return filtered.map(s => {
    const cat = CATEGORIES[s.category];
    return `
      <div class="substance-card" onclick="openSubstanceDetail('${s.id}')" style="--accent:${cat.color}">
        <div class="substance-card-header">
          <span class="cat-badge" style="background:${cat.color}20;color:${cat.color}">${cat.icon} ${cat.label}</span>
          <span class="regulatory-badge ${getRegulatoryClass(s.regulatory)}">${getRegulatoryShort(s.regulatory)}</span>
        </div>
        <h3 class="substance-name">${s.name}</h3>
        <p class="substance-generic">${s.genericName}</p>
        <div class="risk-indicators">
          ${riskBar("Liver", s.liverTox)}
          ${riskBar("Cardio", s.cardiovascular)}
          ${riskBar("Endocrine", s.endocrine)}
        </div>
        <div class="substance-tags">
          ${(s.tags || []).map(t => `<span class="tag">${t}</span>`).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function riskBar(label, level) {
  const colors = ["", "#7ecba1", "#e09d3a", "#e05d5d"];
  const labels = ["", "Low", "Moderate", "High"];
  return `
    <div class="risk-row">
      <span class="risk-label">${label}</span>
      <div class="risk-dots">
        ${[1,2,3].map(i => `<span class="risk-dot ${i <= level ? 'active' : ''}" style="${i<=level?`background:${colors[level]}`:''}"></span>`).join("")}
      </div>
      <span class="risk-text" style="color:${colors[level]}">${labels[level]}</span>
    </div>
  `;
}

function getRegulatoryClass(reg) {
  if (reg.includes("FDA Approved")) return "reg-approved";
  if (reg.includes("Research")) return "reg-research";
  if (reg.includes("Schedule")) return "reg-controlled";
  if (reg.includes("Veterinary")) return "reg-vet";
  return "reg-other";
}

function getRegulatoryShort(reg) {
  if (reg.includes("FDA Approved")) return "✓ FDA Rx";
  if (reg.includes("Research Chemical")) return "⚗ Research";
  if (reg.includes("Schedule III")) return "⚠ Sched. III";
  if (reg.includes("Veterinary")) return "🐾 Vet Only";
  if (reg.includes("OTC")) return "OTC";
  return "Non-Approved";
}

function openSubstanceDetail(id) {
  const s = SUBSTANCES.find(x => x.id === id);
  if (!s) return;
  const cat = CATEGORIES[s.category];
  const modal = document.getElementById("substance-modal");
  const body = document.getElementById("modal-body");

  body.innerHTML = `
    <button class="modal-close" onclick="document.getElementById('substance-modal').classList.remove('active')">✕</button>
    <div class="modal-header" style="border-color:${cat.color}">
      <span class="cat-badge large" style="background:${cat.color}20;color:${cat.color}">${cat.icon} ${cat.label}</span>
      <h2>${s.name}</h2>
      <p class="modal-generic">${s.genericName}</p>
      <span class="regulatory-badge large ${getRegulatoryClass(s.regulatory)}">${s.regulatory}</span>
    </div>

    <div class="modal-grid">
      <div class="modal-section">
        <h4>Type & Administration</h4>
        <p>${s.type}</p>
      </div>
      <div class="modal-section">
        <h4>Half-Life</h4>
        <p>${s.halfLife}</p>
      </div>
    </div>

    <div class="modal-section full">
      <h4>Mechanism of Action</h4>
      <p>${s.mechanism}</p>
    </div>

    <div class="modal-section full">
      <h4>Known Medical Uses</h4>
      <p>${s.medicalUses}</p>
    </div>

    <div class="modal-section full risk-section">
      <h4>Risks & Side Effects</h4>
      <p>${s.risks}</p>
    </div>

    <div class="modal-risk-dashboard">
      <h4>Risk Profile</h4>
      <div class="risk-gauges">
        ${riskGauge("Hepatotoxicity", s.liverTox, "🫁")}
        ${riskGauge("Cardiovascular", s.cardiovascular, "❤️")}
        ${riskGauge("Endocrine Disruption", s.endocrine, "🔬")}
      </div>
    </div>

    <div class="modal-tags">
      ${(s.tags || []).map(t => `<span class="tag large">${t}</span>`).join("")}
    </div>
  `;

  modal.classList.add("active");
}

function riskGauge(label, level, icon) {
  const colors = ["", "#7ecba1", "#e09d3a", "#e05d5d"];
  const descs = ["", "Low Risk", "Moderate Risk", "High Risk"];
  return `
    <div class="risk-gauge">
      <div class="gauge-icon">${icon}</div>
      <div class="gauge-label">${label}</div>
      <div class="gauge-bar">
        <div class="gauge-fill" style="width:${level/3*100}%;background:${colors[level]}"></div>
      </div>
      <div class="gauge-value" style="color:${colors[level]}">${descs[level]}</div>
    </div>
  `;
}

function closeSubstanceModal(event) {
  const modal = document.getElementById("substance-modal");
  if (event.target === modal) modal.classList.remove("active");
}

function filterSubstances() {
  currentSearch = document.getElementById("substance-search").value;
  document.getElementById("substance-grid").innerHTML = renderSubstanceCards();
}

function setCatFilter(cat, btn) {
  currentFilter = cat;
  document.querySelectorAll(".cat-filter").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("substance-grid").innerHTML = renderSubstanceCards();
}

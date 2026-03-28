/**
 * PharmaCompas Pro — Main Application Controller
 * Module: main.js
 */

// ─── APP STATE ───────────────────────────────────────────────────────────────
const App = {
  currentSection: "dashboard",
  sidebarOpen: false,
};

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
function navigate(section) {
  App.currentSection = section;
  document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
  const navEl = document.querySelector(`[data-section="${section}"]`);
  if (navEl) navEl.classList.add("active");

  const content = document.getElementById("main-content");
  content.style.opacity = "0";
  content.style.transform = "translateY(8px)";

  setTimeout(() => {
    renderSection(section);
    content.style.opacity = "1";
    content.style.transform = "translateY(0)";
  }, 160);

  // Close mobile sidebar
  document.getElementById("app-sidebar").classList.remove("open");
}

function renderSection(section) {
  const content = document.getElementById("main-content");
  switch (section) {
    case "dashboard":
      content.innerHTML = renderDashboard();
      break;
    case "library":
      content.innerHTML = renderSubstanceLibrary();
      break;
    case "pk":
      content.innerHTML = `
        <div class="section-header">
          <h2>Pharmacokinetics Calculators</h2>
          <p>Calculate elimination kinetics, clearance, and model drug concentration curves.</p>
        </div>
        ${renderPKCalculators()}
      `;
      setTimeout(() => updatePKGraph(), 100);
      break;
    case "dose":
      content.innerHTML = `
        <div class="section-header">
          <h2>Dose Calculators</h2>
          <p>Weight-based, BSA-based, loading and maintenance dose tools.</p>
        </div>
        ${renderDoseCalculators()}
      `;
      break;
    case "clinical":
      content.innerHTML = `
        <div class="section-header">
          <h2>Clinical Medicine Tools</h2>
          <p>BMI, creatinine clearance, BSA, corrected calcium, and body weight calculators.</p>
        </div>
        ${renderClinicalTools()}
      `;
      break;
  }
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function renderDashboard() {
  const totalSubstances = SUBSTANCES.length;
  const aasCount = SUBSTANCES.filter(s => s.category === "aas").length;
  const peptideCount = SUBSTANCES.filter(s => s.category === "peptide").length;
  const highRisk = SUBSTANCES.filter(s => s.liverTox === 3 || s.cardiovascular === 3 || s.endocrine === 3).length;

  return `
    <div class="dashboard">
      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card" onclick="navigate('library')">
          <div class="stat-icon">💊</div>
          <div class="stat-info">
            <div class="stat-number">${totalSubstances}</div>
            <div class="stat-label">Substances</div>
          </div>
        </div>
        <div class="stat-card" onclick="navigate('library')">
          <div class="stat-icon">💉</div>
          <div class="stat-info">
            <div class="stat-number">${aasCount}</div>
            <div class="stat-label">AAS Compounds</div>
          </div>
        </div>
        <div class="stat-card" onclick="navigate('library')">
          <div class="stat-icon">🧬</div>
          <div class="stat-info">
            <div class="stat-number">${peptideCount}</div>
            <div class="stat-label">Peptides / Hormones</div>
          </div>
        </div>
        <div class="stat-card warning" onclick="navigate('library')">
          <div class="stat-icon">⚠️</div>
          <div class="stat-info">
            <div class="stat-number">${highRisk}</div>
            <div class="stat-label">High-Risk Compounds</div>
          </div>
        </div>
      </div>

      <!-- Quick Access -->
      <div class="dashboard-grid">
        <div class="dash-section">
          <h3>Quick Access — Calculators</h3>
          <div class="quick-cards">
            <div class="quick-card" onclick="navigate('pk')">
              <span class="qc-icon">⏱</span>
              <div>
                <strong>Half-Life</strong>
                <p>Elimination kinetics</p>
              </div>
            </div>
            <div class="quick-card" onclick="navigate('pk')">
              <span class="qc-icon">📊</span>
              <div>
                <strong>Concentration–Time</strong>
                <p>Interactive PK graph</p>
              </div>
            </div>
            <div class="quick-card" onclick="navigate('dose')">
              <span class="qc-icon">🎯</span>
              <div>
                <strong>Loading Dose</strong>
                <p>Target concentration</p>
              </div>
            </div>
            <div class="quick-card" onclick="navigate('clinical')">
              <span class="qc-icon">🫀</span>
              <div>
                <strong>CrCl (Cockcroft-Gault)</strong>
                <p>Renal function</p>
              </div>
            </div>
            <div class="quick-card" onclick="navigate('clinical')">
              <span class="qc-icon">🏥</span>
              <div>
                <strong>BMI</strong>
                <p>Body mass index</p>
              </div>
            </div>
            <div class="quick-card" onclick="navigate('dose')">
              <span class="qc-icon">💧</span>
              <div>
                <strong>Infusion Rate</strong>
                <p>IV dosing</p>
              </div>
            </div>
          </div>
        </div>

        <div class="dash-section">
          <h3>Risk Overview by Category</h3>
          <div class="risk-overview">
            ${Object.entries(CATEGORIES).map(([key, cat]) => {
              const subs = SUBSTANCES.filter(s => s.category === key);
              const avgLiver = subs.reduce((a,b) => a + b.liverTox, 0) / subs.length;
              const avgCardio = subs.reduce((a,b) => a + b.cardiovascular, 0) / subs.length;
              const avgEndo = subs.reduce((a,b) => a + b.endocrine, 0) / subs.length;
              return `
                <div class="risk-overview-row" onclick="navigate('library')">
                  <span class="ro-label">${cat.icon} ${cat.label}</span>
                  <div class="ro-bars">
                    <div class="ro-bar-wrap"><span>Liver</span><div class="ro-bar"><div style="width:${avgLiver/3*100}%;background:#e05d5d"></div></div></div>
                    <div class="ro-bar-wrap"><span>Cardio</span><div class="ro-bar"><div style="width:${avgCardio/3*100}%;background:#e09d3a"></div></div></div>
                    <div class="ro-bar-wrap"><span>Endocrine</span><div class="ro-bar"><div style="width:${avgEndo/3*100}%;background:#9b7fcc"></div></div></div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </div>

        <!-- Recent Substances -->
        <div class="dash-section full-width">
          <h3>Substance Spotlight</h3>
          <div class="spotlight-grid">
            ${SUBSTANCES.slice(0, 6).map(s => {
              const cat = CATEGORIES[s.category];
              return `
                <div class="spotlight-card" onclick="navigate('library')" style="--accent:${cat.color}">
                  <div class="sc-cat" style="color:${cat.color}">${cat.icon} ${cat.label}</div>
                  <div class="sc-name">${s.name}</div>
                  <div class="sc-type">${s.type}</div>
                  <div class="sc-reg ${getRegulatoryClass(s.regulatory)}">${getRegulatoryShort(s.regulatory)}</div>
                </div>
              `;
            }).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ─── SIDEBAR TOGGLE ───────────────────────────────────────────────────────────
function toggleSidebar() {
  const sidebar = document.getElementById("app-sidebar");
  sidebar.classList.toggle("open");
}

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  navigate("dashboard");

  // Dismiss disclaimer
  document.getElementById("dismiss-disclaimer").addEventListener("click", () => {
    document.getElementById("disclaimer-bar").style.display = "none";
  });
});

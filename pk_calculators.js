/**
 * PharmaCompas Pro — Pharmacokinetics Calculators
 * Module: pk_calculators.js
 */

// ─── PK CALCULATOR ENGINE ────────────────────────────────────────────────────

const PKCalc = {
  /**
   * Elimination rate constant k from half-life
   * k = ln(2) / t½
   */
  eliminationConstant(halfLife) {
    return Math.LN2 / halfLife;
  },

  /**
   * Drug concentration at time t after single dose
   * C(t) = (Dose / Vd) * e^(-k*t)
   */
  concentration(dose, vd, k, t) {
    const C0 = dose / vd;
    return C0 * Math.exp(-k * t);
  },

  /**
   * Peak concentration (C_max) after single IV bolus
   */
  cmax(dose, vd) {
    return dose / vd;
  },

  /**
   * Clearance: CL = k * Vd
   */
  clearance(k, vd) {
    return k * vd;
  },

  /**
   * Steady-state concentration
   * Css = (F * Dose) / (CL * tau)
   * F = bioavailability, tau = dosing interval
   */
  steadyState(dose, clearance, tau, bioavailability = 1) {
    return (bioavailability * dose) / (clearance * tau);
  },

  /**
   * Time to reach a given fraction of steady state
   * (as multiples of half-lives)
   * fraction: 0.5 = 50%, 0.9 = 90%, 0.99 = 99%
   */
  timeToSteadyState(halfLife, fraction = 0.9) {
    return (-Math.log(1 - fraction) / Math.LN2) * halfLife;
  },

  /**
   * AUC (area under curve) for single dose
   * AUC = C0 / k = Dose / (Vd * k) = Dose / CL
   */
  auc(dose, clearance) {
    return dose / clearance;
  },

  /**
   * Generate C vs t data points for graphing
   */
  generateCurve(dose, vd, halfLife, duration, points = 100) {
    const k = this.eliminationConstant(halfLife);
    const C0 = dose / vd;
    const dt = duration / points;
    const data = [];
    for (let i = 0; i <= points; i++) {
      const t = i * dt;
      data.push({ x: t, y: C0 * Math.exp(-k * t) });
    }
    return data;
  },

  /**
   * Multiple dose accumulation curve
   * C(t) = C0 * [1 - e^(-n*k*tau)] / [1 - e^(-k*tau)] * e^(-k * (t mod tau))
   * Simplified: sum of individual doses
   */
  generateMultiDoseCurve(dose, vd, halfLife, tau, numDoses, pointsPerInterval = 50) {
    const k = this.eliminationConstant(halfLife);
    const C0 = dose / vd;
    const dt = tau / pointsPerInterval;
    const totalPoints = numDoses * pointsPerInterval;
    const data = [];

    for (let i = 0; i <= totalPoints; i++) {
      const t = i * dt;
      let concentration = 0;
      // Sum contributions from all past doses
      for (let d = 0; d <= numDoses; d++) {
        const doseTime = d * tau;
        if (t >= doseTime) {
          concentration += C0 * Math.exp(-k * (t - doseTime));
        }
      }
      data.push({ x: t, y: concentration });
    }
    return data;
  },
};

// ─── PK UI RENDERER ─────────────────────────────────────────────────────────

let pkChart = null;

function renderPKCalculators() {
  return `
    <div class="calc-grid">
      <!-- Half-life / Elimination -->
      <div class="calc-card">
        <div class="calc-card-header">
          <span class="calc-icon">⏱</span>
          <h3>Half-Life & Elimination</h3>
        </div>
        <div class="calc-body">
          <div class="form-row">
            <label>Half-life (t½) <span class="unit">hours</span></label>
            <input type="number" id="pk-halflife" value="24" min="0.01" step="0.1">
          </div>
          <div class="form-row">
            <label>Initial Dose <span class="unit">mg</span></label>
            <input type="number" id="pk-dose" value="100" min="0.1">
          </div>
          <div class="form-row">
            <label>Volume of Distribution <span class="unit">L</span></label>
            <input type="number" id="pk-vd" value="50" min="0.1">
          </div>
          <button class="btn-calc" onclick="calcHalfLife()">Calculate</button>
          <div class="result-box" id="pk-hl-result"></div>
        </div>
      </div>

      <!-- Steady State -->
      <div class="calc-card">
        <div class="calc-card-header">
          <span class="calc-icon">📊</span>
          <h3>Steady-State Concentration</h3>
        </div>
        <div class="calc-body">
          <div class="form-row">
            <label>Dose per interval <span class="unit">mg</span></label>
            <input type="number" id="pk-ss-dose" value="100" min="0.1">
          </div>
          <div class="form-row">
            <label>Dosing Interval (τ) <span class="unit">hours</span></label>
            <input type="number" id="pk-ss-tau" value="24" min="0.1">
          </div>
          <div class="form-row">
            <label>Clearance <span class="unit">L/hr</span></label>
            <input type="number" id="pk-ss-cl" value="5" min="0.01" step="0.1">
          </div>
          <div class="form-row">
            <label>Bioavailability (F) <span class="unit">0–1</span></label>
            <input type="number" id="pk-ss-f" value="1" min="0.01" max="1" step="0.01">
          </div>
          <button class="btn-calc" onclick="calcSteadyState()">Calculate</button>
          <div class="result-box" id="pk-ss-result"></div>
        </div>
      </div>

      <!-- Clearance Calculator -->
      <div class="calc-card">
        <div class="calc-card-header">
          <span class="calc-icon">🔄</span>
          <h3>Clearance Calculator</h3>
        </div>
        <div class="calc-body">
          <div class="form-row">
            <label>Half-life (t½) <span class="unit">hours</span></label>
            <input type="number" id="pk-cl-hl" value="24" min="0.01" step="0.1">
          </div>
          <div class="form-row">
            <label>Volume of Distribution <span class="unit">L</span></label>
            <input type="number" id="pk-cl-vd" value="50" min="0.1">
          </div>
          <button class="btn-calc" onclick="calcClearance()">Calculate</button>
          <div class="result-box" id="pk-cl-result"></div>
        </div>
      </div>
    </div>

    <!-- Concentration–Time Graph -->
    <div class="graph-section">
      <div class="graph-header">
        <h3>Concentration–Time Profile</h3>
        <div class="graph-controls">
          <div class="form-row inline">
            <label>Dose <span class="unit">mg</span></label>
            <input type="number" id="graph-dose" value="100" min="1">
          </div>
          <div class="form-row inline">
            <label>Vd <span class="unit">L</span></label>
            <input type="number" id="graph-vd" value="50" min="0.1">
          </div>
          <div class="form-row inline">
            <label>t½ <span class="unit">hr</span></label>
            <input type="number" id="graph-hl" value="24" min="0.1">
          </div>
          <div class="form-row inline">
            <label>Duration <span class="unit">hr</span></label>
            <input type="number" id="graph-duration" value="120" min="1">
          </div>
          <div class="form-row inline">
            <label>Doses (multidose)</label>
            <input type="number" id="graph-doses" value="1" min="1" max="10">
          </div>
          <div class="form-row inline">
            <label>Interval (τ) <span class="unit">hr</span></label>
            <input type="number" id="graph-tau" value="24" min="1">
          </div>
          <button class="btn-calc" onclick="updatePKGraph()">Plot Graph</button>
        </div>
      </div>
      <div class="chart-container">
        <canvas id="pk-chart"></canvas>
      </div>
    </div>
  `;
}

function calcHalfLife() {
  const t12 = parseFloat(document.getElementById("pk-halflife").value);
  const dose = parseFloat(document.getElementById("pk-dose").value);
  const vd = parseFloat(document.getElementById("pk-vd").value);

  if (!t12 || !dose || !vd) return;

  const k = PKCalc.eliminationConstant(t12);
  const C0 = PKCalc.cmax(dose, vd);
  const CL = PKCalc.clearance(k, vd);
  const t90ss = PKCalc.timeToSteadyState(t12);

  document.getElementById("pk-hl-result").innerHTML = `
    <div class="result-row"><span>Elimination Rate Constant (k)</span><strong>${k.toFixed(4)} hr⁻¹</strong></div>
    <div class="result-row"><span>Initial Concentration (C₀)</span><strong>${C0.toFixed(3)} mg/L</strong></div>
    <div class="result-row"><span>Clearance (CL = k × Vd)</span><strong>${CL.toFixed(3)} L/hr</strong></div>
    <div class="result-row"><span>90% Steady-State Time</span><strong>${t90ss.toFixed(1)} hr (${(t90ss/24).toFixed(1)} days)</strong></div>
    <div class="formula-note">k = ln(2) / t½ &nbsp;|&nbsp; C₀ = Dose / Vd</div>
  `;
}

function calcSteadyState() {
  const dose = parseFloat(document.getElementById("pk-ss-dose").value);
  const tau = parseFloat(document.getElementById("pk-ss-tau").value);
  const cl = parseFloat(document.getElementById("pk-ss-cl").value);
  const f = parseFloat(document.getElementById("pk-ss-f").value);

  if (!dose || !tau || !cl) return;

  const css = PKCalc.steadyState(dose, cl, tau, f);
  const auc = PKCalc.auc(dose * f, cl);

  document.getElementById("pk-ss-result").innerHTML = `
    <div class="result-row"><span>Average Steady-State (Css,avg)</span><strong>${css.toFixed(3)} mg/L</strong></div>
    <div class="result-row"><span>AUC per Interval</span><strong>${auc.toFixed(3)} mg·hr/L</strong></div>
    <div class="formula-note">Css = (F × Dose) / (CL × τ)</div>
  `;
}

function calcClearance() {
  const t12 = parseFloat(document.getElementById("pk-cl-hl").value);
  const vd = parseFloat(document.getElementById("pk-cl-vd").value);

  if (!t12 || !vd) return;

  const k = PKCalc.eliminationConstant(t12);
  const CL = PKCalc.clearance(k, vd);

  document.getElementById("pk-cl-result").innerHTML = `
    <div class="result-row"><span>Elimination Constant (k)</span><strong>${k.toFixed(4)} hr⁻¹</strong></div>
    <div class="result-row"><span>Clearance (CL)</span><strong>${CL.toFixed(3)} L/hr</strong></div>
    <div class="result-row"><span>Daily Clearance</span><strong>${(CL * 24).toFixed(2)} L/day</strong></div>
    <div class="formula-note">CL = k × Vd &nbsp;|&nbsp; k = 0.693 / t½</div>
  `;
}

function updatePKGraph() {
  const dose = parseFloat(document.getElementById("graph-dose").value) || 100;
  const vd = parseFloat(document.getElementById("graph-vd").value) || 50;
  const t12 = parseFloat(document.getElementById("graph-hl").value) || 24;
  const duration = parseFloat(document.getElementById("graph-duration").value) || 120;
  const numDoses = parseInt(document.getElementById("graph-doses").value) || 1;
  const tau = parseFloat(document.getElementById("graph-tau").value) || 24;

  let curveData;
  if (numDoses <= 1) {
    curveData = PKCalc.generateCurve(dose, vd, t12, duration);
  } else {
    curveData = PKCalc.generateMultiDoseCurve(dose, vd, t12, tau, numDoses - 1);
  }

  const canvas = document.getElementById("pk-chart");
  if (!canvas) return;

  if (pkChart) pkChart.destroy();

  const ctx = canvas.getContext("2d");
  pkChart = new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Drug Concentration (mg/L)",
          data: curveData,
          borderColor: "#4a9ede",
          backgroundColor: "rgba(74,158,222,0.12)",
          borderWidth: 2.5,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          labels: { color: "#c8d0e0", font: { family: "'IBM Plex Mono', monospace", size: 12 } },
        },
        tooltip: {
          backgroundColor: "#1a2234",
          titleColor: "#8ab4d8",
          bodyColor: "#c8d0e0",
          callbacks: {
            label: (ctx) => ` ${ctx.parsed.y.toFixed(4)} mg/L`,
            title: (ctx) => `Time: ${ctx[0].parsed.x.toFixed(1)} hr`,
          },
        },
      },
      scales: {
        x: {
          type: "linear",
          title: { display: true, text: "Time (hours)", color: "#8ab4d8" },
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#8ab4d8" },
        },
        y: {
          title: { display: true, text: "Concentration (mg/L)", color: "#8ab4d8" },
          grid: { color: "rgba(255,255,255,0.06)" },
          ticks: { color: "#8ab4d8" },
          min: 0,
        },
      },
    },
  });
}

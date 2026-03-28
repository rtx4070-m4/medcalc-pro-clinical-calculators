/**
 * PharmaCompas Pro — Dose Calculators
 * Module: dose_calculators.js
 */

const DoseCalc = {
  /**
   * mg/kg dose
   */
  mgKg(dosePerKg, weight) {
    return dosePerKg * weight;
  },

  /**
   * BSA-based dose (Mosteller BSA used)
   */
  bsaDose(dosePerM2, bsa) {
    return dosePerM2 * bsa;
  },

  /**
   * Loading dose
   * LD = (Target Cp × Vd) / F
   */
  loadingDose(targetCp, vd, bioavailability = 1) {
    return (targetCp * vd) / bioavailability;
  },

  /**
   * Maintenance dose
   * MD = CL × Target Cp × tau
   */
  maintenanceDose(clearance, targetCp, tau) {
    return clearance * targetCp * tau;
  },

  /**
   * IV infusion rate
   * Rate = CL × Target Cp
   */
  infusionRate(clearance, targetCp) {
    return clearance * targetCp;
  },

  /**
   * Mosteller BSA formula
   * BSA (m²) = sqrt((height_cm × weight_kg) / 3600)
   */
  bsa(heightCm, weightKg) {
    return Math.sqrt((heightCm * weightKg) / 3600);
  },
};

function renderDoseCalculators() {
  return `
    <div class="calc-grid">
      <!-- mg/kg Calculator -->
      <div class="calc-card">
        <div class="calc-card-header">
          <span class="calc-icon">⚖️</span>
          <h3>mg/kg Dose Calculator</h3>
        </div>
        <div class="calc-body">
          <div class="form-row">
            <label>Dose per kg <span class="unit">mg/kg</span></label>
            <input type="number" id="dose-mgkg-rate" value="0.5" min="0.001" step="0.001">
          </div>
          <div class="form-row">
            <label>Patient Weight <span class="unit">kg</span></label>
            <input type="number" id="dose-mgkg-wt" value="70" min="1">
          </div>
          <button class="btn-calc" onclick="calcMgKg()">Calculate</button>
          <div class="result-box" id="dose-mgkg-result"></div>
        </div>
      </div>

      <!-- BSA Dose -->
      <div class="calc-card">
        <div class="calc-card-header">
          <span class="calc-icon">📐</span>
          <h3>BSA-Based Dose</h3>
        </div>
        <div class="calc-body">
          <div class="form-row">
            <label>Dose per m² <span class="unit">mg/m²</span></label>
            <input type="number" id="dose-bsa-rate" value="50" min="0.01">
          </div>
          <div class="form-row">
            <label>Height <span class="unit">cm</span></label>
            <input type="number" id="dose-bsa-height" value="170" min="50">
          </div>
          <div class="form-row">
            <label>Weight <span class="unit">kg</span></label>
            <input type="number" id="dose-bsa-weight" value="70" min="5">
          </div>
          <button class="btn-calc" onclick="calcBsaDose()">Calculate</button>
          <div class="result-box" id="dose-bsa-result"></div>
        </div>
      </div>

      <!-- Loading Dose -->
      <div class="calc-card">
        <div class="calc-card-header">
          <span class="calc-icon">🎯</span>
          <h3>Loading Dose</h3>
        </div>
        <div class="calc-body">
          <div class="form-row">
            <label>Target Cp <span class="unit">mg/L</span></label>
            <input type="number" id="ld-cp" value="10" min="0.001" step="0.1">
          </div>
          <div class="form-row">
            <label>Volume of Distribution <span class="unit">L</span></label>
            <input type="number" id="ld-vd" value="50" min="0.1">
          </div>
          <div class="form-row">
            <label>Bioavailability (F) <span class="unit">0–1</span></label>
            <input type="number" id="ld-f" value="1" min="0.01" max="1" step="0.01">
          </div>
          <button class="btn-calc" onclick="calcLoadingDose()">Calculate</button>
          <div class="result-box" id="ld-result"></div>
        </div>
      </div>

      <!-- Maintenance Dose -->
      <div class="calc-card">
        <div class="calc-card-header">
          <span class="calc-icon">🔁</span>
          <h3>Maintenance Dose</h3>
        </div>
        <div class="calc-body">
          <div class="form-row">
            <label>Clearance <span class="unit">L/hr</span></label>
            <input type="number" id="md-cl" value="5" min="0.01" step="0.1">
          </div>
          <div class="form-row">
            <label>Target Cp <span class="unit">mg/L</span></label>
            <input type="number" id="md-cp" value="10" min="0.001" step="0.1">
          </div>
          <div class="form-row">
            <label>Dosing Interval (τ) <span class="unit">hr</span></label>
            <input type="number" id="md-tau" value="24" min="0.1">
          </div>
          <button class="btn-calc" onclick="calcMaintenanceDose()">Calculate</button>
          <div class="result-box" id="md-result"></div>
        </div>
      </div>

      <!-- Infusion Rate -->
      <div class="calc-card">
        <div class="calc-card-header">
          <span class="calc-icon">💧</span>
          <h3>IV Infusion Rate</h3>
        </div>
        <div class="calc-body">
          <div class="form-row">
            <label>Clearance <span class="unit">L/hr</span></label>
            <input type="number" id="ir-cl" value="5" min="0.01" step="0.1">
          </div>
          <div class="form-row">
            <label>Target Css <span class="unit">mg/L</span></label>
            <input type="number" id="ir-css" value="10" min="0.001" step="0.1">
          </div>
          <button class="btn-calc" onclick="calcInfusionRate()">Calculate</button>
          <div class="result-box" id="ir-result"></div>
        </div>
      </div>
    </div>
  `;
}

function calcMgKg() {
  const rate = parseFloat(document.getElementById("dose-mgkg-rate").value);
  const wt = parseFloat(document.getElementById("dose-mgkg-wt").value);
  const total = DoseCalc.mgKg(rate, wt);
  document.getElementById("dose-mgkg-result").innerHTML = `
    <div class="result-row"><span>Total Dose</span><strong>${total.toFixed(2)} mg</strong></div>
    <div class="formula-note">Total = Dose/kg × Weight</div>
  `;
}

function calcBsaDose() {
  const rate = parseFloat(document.getElementById("dose-bsa-rate").value);
  const h = parseFloat(document.getElementById("dose-bsa-height").value);
  const w = parseFloat(document.getElementById("dose-bsa-weight").value);
  const bsa = DoseCalc.bsa(h, w);
  const total = DoseCalc.bsaDose(rate, bsa);
  document.getElementById("dose-bsa-result").innerHTML = `
    <div class="result-row"><span>BSA (Mosteller)</span><strong>${bsa.toFixed(3)} m²</strong></div>
    <div class="result-row"><span>Total Dose</span><strong>${total.toFixed(2)} mg</strong></div>
    <div class="formula-note">BSA = √(H × W / 3600)</div>
  `;
}

function calcLoadingDose() {
  const cp = parseFloat(document.getElementById("ld-cp").value);
  const vd = parseFloat(document.getElementById("ld-vd").value);
  const f = parseFloat(document.getElementById("ld-f").value);
  const ld = DoseCalc.loadingDose(cp, vd, f);
  document.getElementById("ld-result").innerHTML = `
    <div class="result-row"><span>Loading Dose</span><strong>${ld.toFixed(2)} mg</strong></div>
    <div class="formula-note">LD = (Target Cp × Vd) / F</div>
  `;
}

function calcMaintenanceDose() {
  const cl = parseFloat(document.getElementById("md-cl").value);
  const cp = parseFloat(document.getElementById("md-cp").value);
  const tau = parseFloat(document.getElementById("md-tau").value);
  const md = DoseCalc.maintenanceDose(cl, cp, tau);
  document.getElementById("md-result").innerHTML = `
    <div class="result-row"><span>Maintenance Dose</span><strong>${md.toFixed(2)} mg every ${tau}hr</strong></div>
    <div class="formula-note">MD = CL × Target Cp × τ</div>
  `;
}

function calcInfusionRate() {
  const cl = parseFloat(document.getElementById("ir-cl").value);
  const css = parseFloat(document.getElementById("ir-css").value);
  const rate = DoseCalc.infusionRate(cl, css);
  document.getElementById("ir-result").innerHTML = `
    <div class="result-row"><span>Infusion Rate (R₀)</span><strong>${rate.toFixed(3)} mg/hr</strong></div>
    <div class="result-row"><span>Per minute</span><strong>${(rate/60).toFixed(4)} mg/min</strong></div>
    <div class="formula-note">R₀ = CL × Css</div>
  `;
}

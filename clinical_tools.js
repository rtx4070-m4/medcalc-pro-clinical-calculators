/**
 * PharmaCompas Pro — Clinical Medicine Calculators
 * Module: clinical_tools.js
 */

const ClinicalCalc = {
  /**
   * BMI
   * BMI = weight(kg) / height(m)²
   */
  bmi(weightKg, heightM) {
    return weightKg / (heightM * heightM);
  },

  bmiCategory(bmi) {
    if (bmi < 18.5) return { label: "Underweight", color: "#4a9ede" };
    if (bmi < 25) return { label: "Normal weight", color: "#7ecba1" };
    if (bmi < 30) return { label: "Overweight", color: "#e09d3a" };
    if (bmi < 35) return { label: "Obese Class I", color: "#e05d5d" };
    if (bmi < 40) return { label: "Obese Class II", color: "#c0392b" };
    return { label: "Obese Class III", color: "#8e0000" };
  },

  /**
   * Creatinine Clearance — Cockcroft-Gault
   * CrCl = ((140 - age) × weight) / (72 × serum Cr)
   * × 0.85 for females
   */
  creatinineClearance(age, weightKg, serumCr, isFemale) {
    const base = ((140 - age) * weightKg) / (72 * serumCr);
    return isFemale ? base * 0.85 : base;
  },

  ckdStage(crcl) {
    if (crcl >= 90) return { stage: "G1 (Normal / High)", color: "#7ecba1" };
    if (crcl >= 60) return { stage: "G2 (Mildly decreased)", color: "#a8d8a8" };
    if (crcl >= 45) return { stage: "G3a (Mildly-mod decreased)", color: "#e09d3a" };
    if (crcl >= 30) return { stage: "G3b (Mod-severely decreased)", color: "#e05d5d" };
    if (crcl >= 15) return { stage: "G4 (Severely decreased)", color: "#c0392b" };
    return { stage: "G5 (Kidney failure)", color: "#8e0000" };
  },

  /**
   * BSA — Mosteller formula
   * BSA = sqrt((height_cm × weight_kg) / 3600)
   */
  bsa(heightCm, weightKg) {
    return Math.sqrt((heightCm * weightKg) / 3600);
  },

  /**
   * Corrected calcium for albumin
   * Corrected Ca = Measured Ca + 0.8 × (4 - Albumin)
   * (mg/dL units)
   */
  correctedCalcium(measuredCa, albumin) {
    return measuredCa + 0.8 * (4.0 - albumin);
  },

  calciumStatus(correctedCa) {
    if (correctedCa < 8.5) return { label: "Hypocalcaemia", color: "#4a9ede" };
    if (correctedCa <= 10.5) return { label: "Normal", color: "#7ecba1" };
    return { label: "Hypercalcaemia", color: "#e05d5d" };
  },

  /**
   * Ideal Body Weight — Devine formula
   * Male: IBW = 50 + 2.3 × (height_in - 60)
   * Female: IBW = 45.5 + 2.3 × (height_in - 60)
   */
  idealBodyWeight(heightCm, isFemale) {
    const heightIn = heightCm / 2.54;
    const base = isFemale ? 45.5 : 50;
    return Math.max(base + 2.3 * (heightIn - 60), base);
  },

  /**
   * Adjusted Body Weight (for obese patients)
   * ABW = IBW + 0.4 × (actual - IBW)
   */
  adjustedBodyWeight(actualWeight, ibw) {
    return ibw + 0.4 * (actualWeight - ibw);
  },
};

function renderClinicalTools() {
  return `
    <div class="calc-grid">
      <!-- BMI Calculator -->
      <div class="calc-card">
        <div class="calc-card-header">
          <span class="calc-icon">🏥</span>
          <h3>BMI Calculator</h3>
        </div>
        <div class="calc-body">
          <div class="form-row">
            <label>Weight <span class="unit">kg</span></label>
            <input type="number" id="bmi-wt" value="70" min="1">
          </div>
          <div class="form-row">
            <label>Height <span class="unit">cm</span></label>
            <input type="number" id="bmi-ht" value="170" min="50">
          </div>
          <button class="btn-calc" onclick="calcBMI()">Calculate</button>
          <div class="result-box" id="bmi-result"></div>
        </div>
      </div>

      <!-- Creatinine Clearance -->
      <div class="calc-card">
        <div class="calc-card-header">
          <span class="calc-icon">🫀</span>
          <h3>Creatinine Clearance</h3>
          <span class="calc-subtitle">Cockcroft-Gault</span>
        </div>
        <div class="calc-body">
          <div class="form-row">
            <label>Age <span class="unit">years</span></label>
            <input type="number" id="crcl-age" value="50" min="1" max="120">
          </div>
          <div class="form-row">
            <label>Weight <span class="unit">kg</span></label>
            <input type="number" id="crcl-wt" value="70" min="1">
          </div>
          <div class="form-row">
            <label>Serum Creatinine <span class="unit">mg/dL</span></label>
            <input type="number" id="crcl-cr" value="1.0" min="0.1" step="0.1">
          </div>
          <div class="form-row">
            <label>Sex</label>
            <select id="crcl-sex">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <button class="btn-calc" onclick="calcCrCl()">Calculate</button>
          <div class="result-box" id="crcl-result"></div>
        </div>
      </div>

      <!-- BSA Calculator -->
      <div class="calc-card">
        <div class="calc-card-header">
          <span class="calc-icon">📏</span>
          <h3>Body Surface Area</h3>
          <span class="calc-subtitle">Mosteller</span>
        </div>
        <div class="calc-body">
          <div class="form-row">
            <label>Height <span class="unit">cm</span></label>
            <input type="number" id="bsa-ht" value="170" min="50">
          </div>
          <div class="form-row">
            <label>Weight <span class="unit">kg</span></label>
            <input type="number" id="bsa-wt" value="70" min="1">
          </div>
          <button class="btn-calc" onclick="calcBSA()">Calculate</button>
          <div class="result-box" id="bsa-result"></div>
        </div>
      </div>

      <!-- Corrected Calcium -->
      <div class="calc-card">
        <div class="calc-card-header">
          <span class="calc-icon">🧪</span>
          <h3>Corrected Calcium</h3>
          <span class="calc-subtitle">Albumin-adjusted</span>
        </div>
        <div class="calc-body">
          <div class="form-row">
            <label>Measured Ca²⁺ <span class="unit">mg/dL</span></label>
            <input type="number" id="ca-measured" value="8.5" min="1" step="0.1">
          </div>
          <div class="form-row">
            <label>Serum Albumin <span class="unit">g/dL</span></label>
            <input type="number" id="ca-albumin" value="3.5" min="0.1" step="0.1">
          </div>
          <button class="btn-calc" onclick="calcCorrCa()">Calculate</button>
          <div class="result-box" id="ca-result"></div>
        </div>
      </div>

      <!-- Ideal Body Weight -->
      <div class="calc-card">
        <div class="calc-card-header">
          <span class="calc-icon">🎯</span>
          <h3>Ideal Body Weight</h3>
          <span class="calc-subtitle">Devine + Adjusted</span>
        </div>
        <div class="calc-body">
          <div class="form-row">
            <label>Height <span class="unit">cm</span></label>
            <input type="number" id="ibw-ht" value="170" min="100">
          </div>
          <div class="form-row">
            <label>Actual Weight <span class="unit">kg</span></label>
            <input type="number" id="ibw-wt" value="70" min="1">
          </div>
          <div class="form-row">
            <label>Sex</label>
            <select id="ibw-sex">
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <button class="btn-calc" onclick="calcIBW()">Calculate</button>
          <div class="result-box" id="ibw-result"></div>
        </div>
      </div>
    </div>
  `;
}

function calcBMI() {
  const wt = parseFloat(document.getElementById("bmi-wt").value);
  const ht = parseFloat(document.getElementById("bmi-ht").value) / 100;
  const bmi = ClinicalCalc.bmi(wt, ht);
  const cat = ClinicalCalc.bmiCategory(bmi);
  document.getElementById("bmi-result").innerHTML = `
    <div class="result-row"><span>BMI</span><strong>${bmi.toFixed(1)} kg/m²</strong></div>
    <div class="result-row"><span>Category</span><strong style="color:${cat.color}">${cat.label}</strong></div>
    <div class="formula-note">BMI = weight / height²</div>
  `;
}

function calcCrCl() {
  const age = parseFloat(document.getElementById("crcl-age").value);
  const wt = parseFloat(document.getElementById("crcl-wt").value);
  const cr = parseFloat(document.getElementById("crcl-cr").value);
  const female = document.getElementById("crcl-sex").value === "female";
  const crcl = ClinicalCalc.creatinineClearance(age, wt, cr, female);
  const ckd = ClinicalCalc.ckdStage(crcl);
  document.getElementById("crcl-result").innerHTML = `
    <div class="result-row"><span>CrCl (eGFR approx.)</span><strong>${crcl.toFixed(1)} mL/min</strong></div>
    <div class="result-row"><span>CKD Stage</span><strong style="color:${ckd.color}">${ckd.stage}</strong></div>
    <div class="formula-note">CrCl = ((140−age) × Wt) / (72 × SCr) ${female ? "× 0.85" : ""}</div>
  `;
}

function calcBSA() {
  const ht = parseFloat(document.getElementById("bsa-ht").value);
  const wt = parseFloat(document.getElementById("bsa-wt").value);
  const bsa = ClinicalCalc.bsa(ht, wt);
  document.getElementById("bsa-result").innerHTML = `
    <div class="result-row"><span>BSA (Mosteller)</span><strong>${bsa.toFixed(3)} m²</strong></div>
    <div class="formula-note">BSA = √(H × W / 3600)</div>
  `;
}

function calcCorrCa() {
  const ca = parseFloat(document.getElementById("ca-measured").value);
  const alb = parseFloat(document.getElementById("ca-albumin").value);
  const corrCa = ClinicalCalc.correctedCalcium(ca, alb);
  const status = ClinicalCalc.calciumStatus(corrCa);
  document.getElementById("ca-result").innerHTML = `
    <div class="result-row"><span>Corrected Ca²⁺</span><strong>${corrCa.toFixed(2)} mg/dL</strong></div>
    <div class="result-row"><span>Interpretation</span><strong style="color:${status.color}">${status.label}</strong></div>
    <div class="formula-note">Corrected Ca = Measured Ca + 0.8 × (4 − Albumin)</div>
  `;
}

function calcIBW() {
  const ht = parseFloat(document.getElementById("ibw-ht").value);
  const wt = parseFloat(document.getElementById("ibw-wt").value);
  const female = document.getElementById("ibw-sex").value === "female";
  const ibw = ClinicalCalc.idealBodyWeight(ht, female);
  const abw = wt > ibw ? ClinicalCalc.adjustedBodyWeight(wt, ibw) : null;
  document.getElementById("ibw-result").innerHTML = `
    <div class="result-row"><span>Ideal Body Weight (IBW)</span><strong>${ibw.toFixed(1)} kg</strong></div>
    ${abw ? `<div class="result-row"><span>Adjusted BW (obese)</span><strong>${abw.toFixed(1)} kg</strong></div>` : ""}
    <div class="result-row"><span>BMI</span><strong>${ClinicalCalc.bmi(wt, ht/100).toFixed(1)} kg/m²</strong></div>
    <div class="formula-note">Devine: ${female?"45.5":"50"} + 2.3 × (ht_in − 60)</div>
  `;
}

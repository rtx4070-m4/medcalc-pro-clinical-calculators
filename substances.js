/**
 * PharmaCompas Pro — Substance Database
 * Educational reference only. Not medical advice.
 */

const SUBSTANCES = [
  // ─── ANABOLIC-ANDROGENIC STEROIDS ───────────────────────────────────────────
  {
    id: "testosterone",
    name: "Testosterone",
    genericName: "Testosterone (various esters)",
    category: "aas",
    type: "Injectable / Transdermal / Oral",
    halfLife: "Varies by ester: Propionate ~2d, Enanthate ~4-5d, Cypionate ~5-6d",
    mechanism:
      "Binds androgen receptors (AR), promotes nitrogen retention, protein synthesis, and IGF-1 release. Aromatises to oestradiol via CYP19A1.",
    medicalUses:
      "Hypogonadism (TRT), delayed puberty, gender-affirming hormone therapy, some anaemias.",
    risks:
      "Suppression of HPG axis, erythrocytosis, dyslipidaemia, acne, androgenic alopecia, cardiovascular strain (LVH), hepatotoxicity (oral 17-α alkylated forms only).",
    regulatory: "FDA Approved (Rx)",
    liverTox: 1,
    cardiovascular: 2,
    endocrine: 3,
    tags: ["androgen", "aromatises"],
  },
  {
    id: "nandrolone",
    name: "Nandrolone Decanoate",
    genericName: "19-Nortestosterone Decanoate",
    category: "aas",
    type: "Injectable",
    halfLife: "~6-12 days",
    mechanism:
      "Partial AR agonist; low androgenic ratio relative to anabolic. Does not aromatise significantly; converts to NOR-DHT (weaker than DHT).",
    medicalUses:
      "Anaemia of renal failure, osteoporosis (limited), HIV wasting (historical).",
    risks:
      "Progestogenic activity (gynecomastia via progesterone receptor), severe HPG suppression, sexual dysfunction, mild hepatotoxicity.",
    regulatory: "FDA Approved (Rx) — limited indications",
    liverTox: 1,
    cardiovascular: 2,
    endocrine: 3,
    tags: ["19-nor", "progestogenic"],
  },
  {
    id: "trenbolone",
    name: "Trenbolone",
    genericName: "Trenbolone Acetate / Enanthate / Hexahydrobenzylcarbonate",
    category: "aas",
    type: "Injectable",
    halfLife: "Acetate ~1-3d, Enanthate ~5-7d",
    mechanism:
      "Potent AR agonist (5× testosterone); binds glucocorticoid receptors. Does not aromatise. Increases IGF-1 significantly.",
    medicalUses: "Veterinary use only (cattle). No approved human use.",
    risks:
      "Severe cardiovascular strain, aggression, androgenic side effects, insomnia, night sweats, progestogenic effects, nephrotoxicity (colour change in urine).",
    regulatory: "Not FDA Approved for humans — Research Chemical / Veterinary",
    liverTox: 2,
    cardiovascular: 3,
    endocrine: 3,
    tags: ["19-nor", "potent", "veterinary"],
  },
  {
    id: "methandrostenolone",
    name: "Methandrostenolone",
    genericName: "Metandienone (Dianabol)",
    category: "aas",
    type: "Oral (17α-alkylated)",
    halfLife: "~3-6 hours",
    mechanism:
      "17α-alkylated oral AAS; AR agonist with significant aromatisation. Rapid onset of anabolic effects.",
    medicalUses: "Historically used for osteoporosis; now discontinued in most countries.",
    risks:
      "Significant hepatotoxicity (peliosis hepatis, cholestasis), severe dyslipidaemia, aromatisation to methylestradiol, rapid HPG suppression.",
    regulatory: "Not FDA Approved — Controlled Substance Schedule III (US)",
    liverTox: 3,
    cardiovascular: 3,
    endocrine: 3,
    tags: ["oral", "17aa", "aromatises"],
  },
  {
    id: "oxandrolone",
    name: "Oxandrolone",
    genericName: "Oxandrolone (Anavar)",
    category: "aas",
    type: "Oral (17α-alkylated)",
    halfLife: "~9-10 hours",
    mechanism:
      "Mild AR agonist. Minimal aromatisation. Favourable anabolic:androgenic ratio. Some AR-independent anabolic effects via IGF-1.",
    medicalUses:
      "Burn recovery, Turner syndrome, HIV wasting, hypogonadism, severe weight loss conditions.",
    risks:
      "Hepatotoxicity (mild-moderate), HDL reduction, HPG suppression, virilisation in females.",
    regulatory: "FDA Approved (Rx) — Schedule III",
    liverTox: 2,
    cardiovascular: 2,
    endocrine: 2,
    tags: ["oral", "17aa", "mild"],
  },
  {
    id: "stanozolol",
    name: "Stanozolol",
    genericName: "Stanozolol (Winstrol)",
    category: "aas",
    type: "Oral / Injectable",
    halfLife: "Oral ~9h, Injectable ~24h",
    mechanism:
      "17α-alkylated AR agonist; does not aromatise. Lowers SHBG. Mild anabolic, moderate androgenic.",
    medicalUses: "Hereditary angioedema (approved), aplastic anaemia (historical).",
    risks:
      "Significant hepatotoxicity, severe HDL reduction, tendon damage risk, androgenic effects.",
    regulatory: "FDA Approved (Rx) — Schedule III; limited use",
    liverTox: 3,
    cardiovascular: 3,
    endocrine: 2,
    tags: ["oral", "17aa", "no-aromatise"],
  },
  {
    id: "methenolone",
    name: "Methenolone",
    genericName: "Methenolone Enanthate / Acetate (Primobolan)",
    category: "aas",
    type: "Injectable / Oral",
    halfLife: "Enanthate ~10-14d, Acetate ~2-3d",
    mechanism:
      "Mild AR agonist; not 17α-alkylated (injectable form). Minimal aromatisation, low androgenic index.",
    medicalUses: "Anaemia, muscle wasting (limited historic use).",
    risks:
      "Mild hepatotoxicity (oral acetate), mild HPG suppression, mild androgenic effects.",
    regulatory: "Not FDA Approved — Schedule III Controlled Substance",
    liverTox: 1,
    cardiovascular: 1,
    endocrine: 2,
    tags: ["mild", "injectable"],
  },
  {
    id: "oxymetholone",
    name: "Oxymetholone",
    genericName: "Oxymetholone (Anadrol)",
    category: "aas",
    type: "Oral (17α-alkylated)",
    halfLife: "~8-9 hours",
    mechanism:
      "Potent 17α-alkylated AAS; unique—does not bind AR strongly but exerts effects possibly via ER. Aromatises. Stimulates erythropoiesis.",
    medicalUses: "Aplastic anaemia, HIV wasting, osteoporosis (historical).",
    risks:
      "Severe hepatotoxicity (liver tumours reported), severe dyslipidaemia, oedema, gynecomastia, rapid HPG suppression.",
    regulatory: "FDA Approved (Rx) — Schedule III; limited indications",
    liverTox: 3,
    cardiovascular: 3,
    endocrine: 3,
    tags: ["oral", "17aa", "potent"],
  },
  {
    id: "boldenone",
    name: "Boldenone",
    genericName: "Boldenone Undecylenate (Equipoise)",
    category: "aas",
    type: "Injectable",
    halfLife: "~14-21 days",
    mechanism:
      "Testosterone analogue with reduced androgenic activity. Moderate aromatisation. Stimulates EPO production significantly.",
    medicalUses: "Veterinary use (horses). No approved human use.",
    risks:
      "Erythrocytosis (elevated haematocrit), cardiovascular strain, androgenic effects, HPG suppression.",
    regulatory: "Not FDA Approved for humans — Veterinary",
    liverTox: 1,
    cardiovascular: 2,
    endocrine: 2,
    tags: ["veterinary", "aromatises"],
  },
  {
    id: "drostanolone",
    name: "Drostanolone",
    genericName: "Drostanolone Propionate / Enanthate (Masteron)",
    category: "aas",
    type: "Injectable",
    halfLife: "Propionate ~2-3d, Enanthate ~7-10d",
    mechanism:
      "DHT-derivative AR agonist; acts as mild aromatase inhibitor. No aromatisation. Potent androgenic effect.",
    medicalUses: "Historically used in breast cancer treatment (withdrawn).",
    risks:
      "Androgenic alopecia, virilisation (females), mild HPG suppression, cardiovascular effects.",
    regulatory: "Not FDA Approved — Schedule III",
    liverTox: 1,
    cardiovascular: 2,
    endocrine: 2,
    tags: ["dht-derivative", "anti-oestrogenic"],
  },

  // ─── PROHORMONES ─────────────────────────────────────────────────────────────
  {
    id: "androstenedione",
    name: "Androstenedione",
    genericName: "4-Androstenedione",
    category: "prohormone",
    type: "Oral",
    halfLife: "~15-30 minutes (enzymatic conversion)",
    mechanism:
      "Precursor to testosterone and oestrone via 17β-HSD and aromatase. Endogenous steroid produced by adrenal glands and gonads.",
    medicalUses: "None approved. Research use only.",
    risks:
      "Oestrogenic effects (aromatisation), variable testosterone elevation, potential cardiovascular effects.",
    regulatory: "Banned in US sports; Schedule III in some jurisdictions",
    liverTox: 1,
    cardiovascular: 1,
    endocrine: 2,
    tags: ["endogenous", "precursor"],
  },
  {
    id: "androstenediol",
    name: "Androstenediol",
    genericName: "5-Androstenediol",
    category: "prohormone",
    type: "Oral",
    halfLife: "~hours",
    mechanism:
      "Testosterone precursor; also a direct ligand of androgen and oestrogen receptors. Modulates immune function.",
    medicalUses: "Research use in radiation exposure (investigational).",
    risks: "Variable; androgenic and oestrogenic effects depending on conversion.",
    regulatory: "Not FDA Approved",
    liverTox: 1,
    cardiovascular: 1,
    endocrine: 2,
    tags: ["endogenous", "precursor", "immune"],
  },
  {
    id: "dhea",
    name: "DHEA",
    genericName: "Dehydroepiandrosterone",
    category: "prohormone",
    type: "Oral",
    halfLife: "~10-20 hours (as DHEA-S: days)",
    mechanism:
      "Endogenous adrenal prohormone. Converts to androgens and oestrogens. Declines markedly with age. Neurosteroid activity.",
    medicalUses: "Adrenal insufficiency (adjunct), Addison's disease, investigational in ageing.",
    risks:
      "Acne, hair loss (androgenic), oestrogenic effects; hormone-sensitive cancer concern.",
    regulatory: "OTC supplement (US DSHEA); prescription in EU",
    liverTox: 1,
    cardiovascular: 1,
    endocrine: 2,
    tags: ["endogenous", "supplement"],
  },

  // ─── PEPTIDES & HORMONES ─────────────────────────────────────────────────────
  {
    id: "growth-hormone",
    name: "Growth Hormone",
    genericName: "Somatropin (recombinant human GH)",
    category: "peptide",
    type: "Injectable (subcutaneous/IM)",
    halfLife: "~3-4 hours",
    mechanism:
      "Binds GHR; activates JAK2/STAT5 signalling. Stimulates IGF-1 production in liver. Promotes lipolysis, protein synthesis, and longitudinal growth.",
    medicalUses:
      "GH deficiency (adults and children), Turner syndrome, Prader-Willi, renal insufficiency, HIV-associated wasting, short bowel syndrome.",
    risks:
      "Insulin resistance/diabetes, oedema, carpal tunnel, arthralgia, potential IGF-1 driven malignancy risk.",
    regulatory: "FDA Approved (Rx)",
    liverTox: 1,
    cardiovascular: 1,
    endocrine: 2,
    tags: ["peptide", "hormone", "igf-1"],
  },
  {
    id: "ipamorelin",
    name: "Ipamorelin",
    genericName: "Ipamorelin (GHRP pentapeptide)",
    category: "peptide",
    type: "Injectable (subcutaneous)",
    halfLife: "~2 hours",
    mechanism:
      "Selective GHS-R1a agonist (ghrelin receptor). Stimulates pulsatile GH release without significant cortisol or prolactin elevation.",
    medicalUses: "Investigational — no approved human use currently.",
    risks: "Limited data; theoretical GH/IGF-1 risks. Injection site reactions.",
    regulatory: "Research Chemical — Not FDA Approved",
    liverTox: 1,
    cardiovascular: 1,
    endocrine: 1,
    tags: ["ghrp", "research", "selective"],
  },
  {
    id: "sermorelin",
    name: "Sermorelin",
    genericName: "Sermorelin Acetate (GHRH 1-29)",
    category: "peptide",
    type: "Injectable (subcutaneous)",
    halfLife: "~11-12 minutes",
    mechanism:
      "Synthetic analogue of GHRH (first 29 amino acids). Stimulates pituitary to release GH. Physiological pulsatile pattern preserved.",
    medicalUses:
      "GH deficiency diagnosis, paediatric short stature (was FDA approved, now discontinued for manufacturing reasons).",
    risks: "Headache, flushing, somnolence, dizziness. Theoretical GH risks long-term.",
    regulatory: "Compounded Rx (US) — original brand discontinued",
    liverTox: 1,
    cardiovascular: 1,
    endocrine: 1,
    tags: ["ghrh", "pituitary"],
  },
  {
    id: "cjc1295",
    name: "CJC-1295",
    genericName: "CJC-1295 (with or without DAC)",
    category: "peptide",
    type: "Injectable (subcutaneous)",
    halfLife: "Without DAC: ~30 min; With DAC: ~8-10 days",
    mechanism:
      "Modified GHRH analogue. DAC (Drug Affinity Complex) extends half-life by binding serum albumin. Sustained GH release.",
    medicalUses: "No approved human use. Research only.",
    risks:
      "Water retention, injection site reactions, potential for continuous (non-pulsatile) GH elevation.",
    regulatory: "Research Chemical — Not FDA Approved",
    liverTox: 1,
    cardiovascular: 1,
    endocrine: 2,
    tags: ["ghrh", "research"],
  },
  {
    id: "bpc157",
    name: "BPC-157",
    genericName: "Body Protection Compound-157 (pentadecapeptide)",
    category: "peptide",
    type: "Injectable / Oral (investigational)",
    halfLife: "Unknown in humans",
    mechanism:
      "Derived from gastric juice protein. Proposed: promotes angiogenesis, upregulates GH receptors, modulates NO synthesis, cytoprotective effects in GI tract.",
    medicalUses:
      "No approved human use. Extensive animal data for wound healing, tendon repair, GI protection.",
    risks:
      "Very limited human safety data. Theoretical concerns with angiogenesis and tumour promotion.",
    regulatory: "Research Chemical — Not FDA Approved",
    liverTox: 1,
    cardiovascular: 1,
    endocrine: 1,
    tags: ["healing", "research", "gastroprotective"],
  },
  {
    id: "insulin",
    name: "Insulin",
    genericName: "Insulin (various analogues)",
    category: "peptide",
    type: "Injectable (subcutaneous/IV)",
    halfLife: "Rapid: 30-90 min; Long-acting: 18-24+ hours",
    mechanism:
      "Binds insulin receptor (IR); activates PI3K/Akt and MAPK pathways. Promotes glucose uptake, protein synthesis, lipogenesis, inhibits gluconeogenesis.",
    medicalUses: "Type 1 and Type 2 diabetes mellitus; critical care hyperglycaemia.",
    risks:
      "HYPOGLYCAEMIA (life-threatening), hypokalaemia, lipodystrophy. Extreme risk without medical supervision.",
    regulatory: "FDA Approved (Rx) — OTC available in some US states",
    liverTox: 1,
    cardiovascular: 1,
    endocrine: 3,
    tags: ["hormone", "high-risk", "hypoglycaemia"],
  },

  // ─── SARMs ───────────────────────────────────────────────────────────────────
  {
    id: "ostarine",
    name: "Ostarine",
    genericName: "Ostarine / Enobosarm (MK-2866)",
    category: "sarm",
    type: "Oral",
    halfLife: "~24 hours",
    mechanism:
      "Selective non-steroidal AR agonist with tissue-selective activity (preferential for muscle and bone over prostate/skin).",
    medicalUses: "Phase III trials for cancer-related muscle wasting (inconclusive). Not approved.",
    risks:
      "Partial HPG suppression, elevated liver enzymes reported, cardiovascular effects (LDL increase).",
    regulatory: "Research Chemical — Not FDA Approved; banned in sports (WADA)",
    liverTox: 1,
    cardiovascular: 1,
    endocrine: 2,
    tags: ["sarm", "research"],
  },
  {
    id: "andarine",
    name: "Andarine",
    genericName: "Andarine (S4, GTx-007)",
    category: "sarm",
    type: "Oral",
    halfLife: "~3-6 hours",
    mechanism:
      "Partial AR agonist; higher tissue-selective ratio than full agonists. Binds AR in muscle, bone, and partially in prostate.",
    medicalUses: "No approved use. Research compound for benign prostatic hyperplasia.",
    risks:
      "Yellow vision / visual disturbances (AR expression in eyes), HPG suppression, hepatotoxicity.",
    regulatory: "Research Chemical — Not FDA Approved; banned in sports (WADA)",
    liverTox: 2,
    cardiovascular: 1,
    endocrine: 2,
    tags: ["sarm", "vision-effects", "research"],
  },

  // ─── RELATED COMPOUNDS ───────────────────────────────────────────────────────
  {
    id: "clenbuterol",
    name: "Clenbuterol",
    genericName: "Clenbuterol Hydrochloride",
    category: "other",
    type: "Oral / Injectable",
    halfLife: "~36-48 hours",
    mechanism:
      "β2-adrenergic receptor agonist. Activates cAMP/PKA pathway → lipolysis, thermogenesis, bronchodilation. Mild anabolic effect in animals.",
    medicalUses: "Asthma/COPD bronchodilator (approved in some countries, NOT US for humans). Veterinary use.",
    risks:
      "Cardiac hypertrophy, arrhythmia, tachycardia, hypokalaemia, tremors, insomnia. Long half-life complicates management.",
    regulatory: "Not FDA Approved for humans — banned in sports; veterinary Rx",
    liverTox: 1,
    cardiovascular: 3,
    endocrine: 1,
    tags: ["beta2", "thermogenic", "banned"],
  },
  {
    id: "tamoxifen",
    name: "Tamoxifen",
    genericName: "Tamoxifen Citrate (Nolvadex)",
    category: "other",
    type: "Oral",
    halfLife: "~5-7 days (active metabolites up to 14 days)",
    mechanism:
      "Selective Oestrogen Receptor Modulator (SERM). Antagonist in breast tissue; agonist in endometrium and bone. Blocks oestrogen-driven gene expression in breast.",
    medicalUses:
      "Breast cancer (ER+), gynecomastia, infertility (ovulation induction), DCIS prevention.",
    risks:
      "Thromboembolic events (DVT/PE), endometrial cancer risk, hot flushes, mood changes, cataracts.",
    regulatory: "FDA Approved (Rx)",
    liverTox: 1,
    cardiovascular: 2,
    endocrine: 2,
    tags: ["serm", "anti-oestrogen"],
  },
  {
    id: "anastrozole",
    name: "Anastrozole",
    genericName: "Anastrozole (Arimidex)",
    category: "other",
    type: "Oral",
    halfLife: "~40-50 hours",
    mechanism:
      "Non-steroidal competitive aromatase (CYP19A1) inhibitor. Reduces peripheral and tumour oestrogen synthesis by >80%.",
    medicalUses:
      "Breast cancer (post-menopausal ER+ adjuvant and advanced), pubertal gynaecomastia (off-label).",
    risks:
      "Bone density loss (osteoporosis), arthralgia, myalgia, hot flushes, cardiovascular effects, dyslipidaemia.",
    regulatory: "FDA Approved (Rx)",
    liverTox: 1,
    cardiovascular: 2,
    endocrine: 3,
    tags: ["ai", "anti-oestrogen", "aromatase-inhibitor"],
  },
];

// Category metadata
const CATEGORIES = {
  aas: { label: "Anabolic-Androgenic Steroids", icon: "💉", color: "#e05d5d" },
  prohormone: { label: "Prohormones", icon: "🔬", color: "#e09d3a" },
  peptide: { label: "Peptides & Hormones", icon: "🧬", color: "#4a9ede" },
  sarm: { label: "SARMs", icon: "⚗️", color: "#7ecba1" },
  other: { label: "Related Compounds", icon: "💊", color: "#9b7fcc" },
};

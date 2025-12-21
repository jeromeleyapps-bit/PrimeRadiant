/**
 * THE PRIME RADIANT - DICTIONNAIRE MULTI-VECTEURS ÉTENDU (200+ Capable)
 * ======================================================================
 * Inclut désormais :
 * - Identité de Genre & Transitions
 * - Santé Mentale & Psychiatrique
 * - Handicap & Accessibilité
 * - Facteurs Environnementaux Rares
 */

const PARAM_DICTIONARY = {
    // --- 1. TEMPLE BIOLOGIQUE (Contrôlable) - L3 ---
    "bmi": { label: "IMC Optimal (22)", type: "L3", impact_S: 0.15 },
    "sugar": { label: "Sucre Ajouté", type: "L3", impact_S: 0.20 },
    "sleep_rem": { label: "Sommeil REM", type: "L3", impact_S: -0.25 },
    "alcohol_vol": { label: "Volume Alcool", type: "L3", impact_S: 0.18 },
    "smoke_act": { label: "Tabagisme Actif", type: "L3", impact_S: 0.40 },
    "hydration": { label: "Hydratation", type: "L3", impact_S: -0.05 },
    "vo2_max": { label: "VO2 Max", type: "L3", impact_S: -0.15 },
    "muscle_mass": { label: "Masse Musculaire", type: "L3", impact_S: -0.10 },
    "checkup": { label: "Prévention Médicale", type: "L3", impact_S: -0.05 },
    "vit_d": { label: "Vitamine D / Soleil", type: "L3", impact_S: -0.05 },

    // --- 2. VECTEUR PRO (L3) ---
    "cortisol_perc": { label: "Stress Perçu", type: "L3", impact_S: 0.30 },
    "sedentary_job": { label: "Sédentarité Travail", type: "L3", impact_S: 0.20 },
    "ikigai": { label: "Sens / Ikigai", type: "L3", impact_S: -0.20 },
    "toxic_expo": { label: "Toxiques Pro", type: "L3", impact_S: 0.15 },
    "shift_work": { label: "Travail Décalé", type: "L3", impact_S: 0.25 },

    // --- 3. EXPANSIF : IDENTITÉ & GENRE (L4/L5) ---
    // Facteurs spécifiques liés aux traitements hormonaux ou au stress des minorités
    "hormone_therapy": { label: "THS (Hormonothérapie)", type: "L4", impact_S: 0.05 }, // Léger risque vasculaire mais gain psy
    "minority_stress": { label: "Stress Minorité/Genre", type: "L4", impact_S: 0.15 }, // Impact cortisol chronique
    "transition_support": { label: "Soutien Transition", type: "L4", impact_S: -0.10 }, // Facteur protecteur suicide/depression
    "gender_dysphoria": { label: "Dysphorie Active", type: "L4", impact_S: 0.20 }, // Risque santé mentale

    // --- 4. SANTÉ MENTALE & PSYCHIATRIQUE (L4) ---
    "neurodivergence": { label: "Neurodivergence (TDAH/ASD)", type: "L4", impact_S: 0.05 }, // Stress adaptation
    "bipolar_history": { label: "Trouble Bipolaire", type: "L4", impact_S: 0.15 }, // Risque comportemental
    "ptsd_complex": { label: "C-PTSD / Trauma", type: "L4", impact_S: 0.20 }, // Usure systémique
    "medication_psych": { label: "Traitement Psychotrope", type: "L4", impact_S: 0.05 }, // Effets secondaires métaboliques
    "therapy_active": { label: "Suivi Thérapeutique", type: "L4", impact_S: -0.10 }, // Réduction risques

    // --- 5. HANDICAP & ACCESSIBILITÉ (L4) ---
    "mobility_limit": { label: "Mobilité Réduite", type: "L4", impact_S: 0.10 }, // Impact cardio
    "chronic_pain": { label: "Douleur Chronique", type: "L4", impact_S: 0.25 }, // Usure nerveuse
    "care_access": { label: "Accessibilité Soins", type: "L4", impact_S: -0.15 }, // Facteur clé survie
    "adaptive_tech": { label: "Aides Techniques", type: "L4", impact_S: -0.05 }, // Compensation

    // --- 6. MICRO-BIOLOGIE (L4) ---
    "hrv_coherence": { label: "Cohérence Cardiaque", type: "L4", impact_S: -0.15 },
    "gut_diversity": { label: "Diversité Microbiote", type: "L4", impact_S: -0.20 },
    "telomere_len": { label: "Long. Télomères", type: "L4", impact_S: -0.10 },
    "inflammation_hs": { label: "Inflammation hs-CRP", type: "L4", impact_S: 0.25 },
    "heavy_metals": { label: "Métaux Lourds", type: "L4", impact_S: 0.15 },
    "blue_light": { label: "Lumière Bleue", type: "L4", impact_S: 0.10 },
    "noise_pollution": { label: "Pollution Sonore", type: "L4", impact_S: 0.12 },
    "air_quality_pm25": { label: "Particules Fines PM2.5", type: "L4", impact_S: 0.18 },

    // --- INPUT GÉOGRAPHIQUE & CLIMATIQUE (L4) ---
    "geo_origin": { label: "Zone Origine Privilégiée", type: "L4", impact_S: -0.15 }, // Bonus de départ

    // --- HISTOIRE PERSONNELLE (New v7.9) ---
    "childhood_quality": { label: "Enfance (Qualité 0-18)", type: "L4", impact_S: -0.30 }, // Impact majeur sur le capital de départ

    "geo_climate_risk": { label: "Risques Climatiques", type: "L4", impact_S: 0.25 }, // Stress catastrophe
    "geo_density": { label: "Densité / Surpop.", type: "L4", impact_S: 0.10 }, // Stress viral/psychique
    "geo_water_access": { label: "Accès Eau Potable", type: "L4", impact_S: -0.20 }, // Vital
    "geo_health_edu": { label: "Éducation à la Santé", type: "L4", impact_S: -0.15 }, // Comportemental
    "geo_food_security": { label: "Sécurité Alimentaire", type: "L4", impact_S: -0.10 },

    // --- 8. DÉTERMINANTS ENVIRONNEMENTAUX INVISIBLES (v8.6 - Data INSEE/OMS) ---
    "radon_exposure": { label: "Exposition Radon (Gaz)", type: "L4", impact_S: 0.15 }, // 2e cause cancer poumon
    "endocrine_disruptors": { label: "Perturbateurs Endocriniens", type: "L4", impact_S: 0.12 }, // Impact hormonal/fertilité
    "microplastics_load": { label: "Charge Microplastiques", type: "L4", impact_S: 0.08 }, // Risque vasculaire émergent
    "indoor_voc": { label: "Pollution Intérieure (COV)", type: "L4", impact_S: 0.10 }, // Peintures/Produits ménagers
    "light_pollution_night": { label: "Pollution Lumineuse (Nuit)", type: "L4", impact_S: 0.07 }, // Blocage mélatonine

    // --- 9. NOUVEAUX RISQUES NUTRITIONNELS & SYSTÉMIQUES ---
    "ultra_processed_food": { label: "Aliments Ultra-Transformés", type: "L4", impact_S: 0.22 }, // Risque métabolique majeur
    "processed_meat_index": { label: "Index Viande Transformée", type: "L4", impact_S: 0.15 }, // Risque colorectal (CIRC/OMS)
    "artificial_sweeteners": { label: "Édulcorants de Synthèse", type: "L4", impact_S: 0.10 }, // Risque cardio (NutriNet)
    "omega_ratio": { label: "Déséquilibre Oméga 6/3", type: "L4", impact_S: 0.12 }, // Pro-inflammatoire
    "antibiotic_resistance": { label: "Antibiorésistance Acquise", type: "L4", impact_S: 0.18 }, // Fragilité infectieuse systémique

    // --- 10. MARQUEURS BIOLOGIQUES & COGNITIFS NÉGLIGÉS ---
    "periodontal_health": { label: "Santé Parodontale", type: "L4", impact_S: -0.15 }, // Lien Cœur/Cerveau (Protecteur si 10)
    "sleep_apnea_index": { label: "Indice Apnée du Sommeil", type: "L4", impact_S: 0.25 }, // Hypoxie nocturne (Lourd)
    "advanced_glycation": { label: "Glycation Protéique (AGEs)", type: "L4", impact_S: 0.10 }, // Vieillissement tissulaire
    "cognitive_reserve": { label: "Réserve Cognitive", type: "L4", impact_S: -0.20 }, // Études/Curiosité (Neuro-protecteur)

    // --- 11. DÉTERMINANTS SOCIO-SYSTÉMIQUES ---
    "financial_precariousness": { label: "Précarité Financière", type: "L4", impact_S: 0.30 }, // Stress de survie (Mortalité prématurée)
    "social_isolation_idx": { label: "Isolement Social (Solitude)", type: "L4", impact_S: 0.25 }, // Risque équivalent tabac
    "medical_deserts": { label: "Proximité Déserts Médicaux", type: "L4", impact_S: 0.12 }, // Retard de soin
    "screening_access": { label: "Accès au Dépistage", type: "L4", impact_S: -0.15 }, // Diagnostic précoce (Protecteur)

    // --- 12. LIFESTYLE & TRAVAIL SPÉCIFIQUE ---
    "effort_reward_imbalance": { label: "Déséquilibre Effort/Gain", type: "L4", impact_S: 0.20 }, // Burnout / Stress moral
    "sedentary_leisure": { label: "Sédentarité de Loisir", type: "L4", impact_S: 0.15 }, // Temps écran (hors travail)
};

window.PARAM_DICTIONARY = PARAM_DICTIONARY;

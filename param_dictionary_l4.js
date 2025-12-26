/**
 * THE PRIME RADIANT - DICTIONNAIRE MULTI-VECTEURS ÉTENDU (~100 Paramètres L4)
 * =============================================================================
 * Version optimisée pour accessibilité utilisateur lambda :
 * - Labels simplifiés (termes techniques → langage accessible)
 * - Paramètres nécessitant tests médicaux supprimés
 * - Descriptions/tooltips pour tous les paramètres
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

    // --- 3. EXPANSIF : IDENTITÉ & GENRE (L4) ---
    // CATEGORY: identite_genre
    "hormone_therapy": { 
        label: "THS (Hormonothérapie)", 
        type: "L4", 
        impact_S: 0.05,
        help: "Traitement hormonal substitutif (risque vasculaire léger mais bénéfice psychologique)"
    },
    "minority_stress": { 
        label: "Stress Minorité/Genre", 
        type: "L4", 
        impact_S: 0.15,
        help: "Stress chronique lié à l'appartenance à une minorité (impact sur cortisol)"
    },
    "transition_support": { 
        label: "Soutien Transition", 
        type: "L4", 
        impact_S: -0.0500,
        help: "Soutien social et médical pendant une transition de genre (facteur protecteur)"
    },
    "gender_dysphoria": { 
        label: "Dysphorie Active", 
        type: "L4", 
        impact_S: 0.20,
        help: "Détresse liée à l'inadéquation entre identité de genre et corps (risque santé mentale)"
    },

    // --- 4. SANTÉ MENTALE & PSYCHIATRIQUE (L4) ---
    "neurodivergence": { 
        label: "Neurodivergence (TDAH/ASD)", 
        type: "L4", 
        impact_S: 0.05,
        help: "Trouble du déficit de l'attention, autisme (stress d'adaptation)"
    },
    "bipolar_history": { 
        label: "Trouble Bipolaire", 
        type: "L4", 
        impact_S: 0.15,
        help: "Trouble de l'humeur avec phases maniaques et dépressives (risque comportemental)"
    },
    "ptsd_complex": { 
        label: "C-PTSD / Trauma", 
        type: "L4", 
        impact_S: 0.20,
        help: "Syndrome de stress post-traumatique complexe (usure systémique)"
    },
    "medication_psych": { 
        label: "Traitement Psychotrope", 
        type: "L4", 
        impact_S: 0.05,
        help: "Médicaments psychiatriques (effets secondaires métaboliques possibles)"
    },
    "therapy_active": { 
        label: "Suivi Thérapeutique", 
        type: "L4", 
        impact_S: -0.0500,
        help: "Suivi psychologique ou psychiatrique régulier (réduction des risques)"
    },

    // --- 5. HANDICAP & ACCESSIBILITÉ (L4) ---
    "mobility_limit": { 
        label: "Mobilité Réduite", 
        type: "L4", 
        impact_S: 0.10,
        help: "Limitations physiques affectant la mobilité (impact cardiovasculaire)"
    },
    "chronic_pain": { 
        label: "Douleur Chronique", 
        type: "L4", 
        impact_S: 0.25,
        help: "Douleurs persistantes (usure nerveuse, impact qualité de vie)"
    },
    "adaptive_tech": { 
        label: "Aides Techniques", 
        type: "L4", 
        impact_S: -0.030,
        help: "Utilisation d'aides techniques pour compenser un handicap (facteur protecteur)"
    },

    // --- 6. MICRO-BIOLOGIE (L4) - SIMPLIFIÉ ---
    "hrv_coherence": { 
        label: "Variabilité Rythme Cardiaque", 
        type: "L4", 
        impact_S: -0.060,
        help: "Régularité de votre rythme cardiaque (mesurable avec certaines montres connectées)"
    },
    "gut_diversity": { 
        label: "Diversité Bactéries Intestinales", 
        type: "L4", 
        impact_S: -0.0700,
        help: "Variété de bonnes bactéries dans vos intestins (améliorée par aliments fermentés, fibres)"
    },
    "heavy_metals": { 
        label: "Exposition Métaux Lourds", 
        type: "L4", 
        impact_S: 0.15,
        help: "Exposition au plomb, mercure, cadmium (eau, poissons, environnement)"
    },
    "blue_light": { 
        label: "Exposition Lumière Bleue", 
        type: "L4", 
        impact_S: 0.10,
        help: "Temps passé devant écrans (peut perturber le sommeil)"
    },
    "air_quality_pm25": { 
        label: "Pollution Air (Particules Fines)", 
        type: "L4", 
        impact_S: 0.18,
        help: "Exposition aux particules fines PM2.5 (trafic, industrie, chauffage)"
    },

    // --- INPUT GÉOGRAPHIQUE & CLIMATIQUE (L4) ---
    "geo_origin": { 
        label: "Zone Origine Privilégiée", 
        type: "L4", 
        impact_S: -0.060,
        help: "Origine géographique avec avantages santé (Blue Zones, montagne, campagne)"
    },
    "childhood_quality": { 
        label: "Enfance (Qualité 0-18)", 
        type: "L4", 
        impact_S: -0.1050,
        help: "Qualité de l'enfance (nutrition, soins, environnement) - Impact majeur sur capital de départ"
    },
    "geo_climate_risk": { 
        label: "Risques Climatiques", 
        type: "L4", 
        impact_S: 0.25,
        help: "Exposition aux catastrophes climatiques (stress, déplacements)"
    },
    "geo_density": { 
        label: "Densité Population", 
        type: "L4", 
        impact_S: 0.10,
        help: "Surpopulation, densité urbaine (stress viral, psychique)"
    },
    "geo_water_access": { 
        label: "Accès Eau Potable", 
        type: "L4", 
        impact_S: -0.0700,
        help: "Accès à une eau potable de qualité (facteur vital)"
    },
    "geo_health_edu": { 
        label: "Éducation à la Santé", 
        type: "L4", 
        impact_S: -0.060,
        help: "Accès à l'éducation et information sur la santé (comportements protecteurs)"
    },
    "geo_food_security": { 
        label: "Sécurité Alimentaire", 
        type: "L4", 
        impact_S: -0.0500,
        help: "Accès régulier à une alimentation suffisante et de qualité"
    },

    // --- 8. DÉTERMINANTS ENVIRONNEMENTAUX INVISIBLES (L4) - SIMPLIFIÉ ---
    "radon_exposure": { 
        label: "Exposition Radon (Gaz Radioactif)", 
        type: "L4", 
        impact_S: 0.15,
        help: "Exposition au radon (2e cause cancer poumon, présent dans certaines régions)"
    },
    "endocrine_disruptors": { 
        label: "Perturbateurs Hormonaux", 
        type: "L4", 
        impact_S: 0.12,
        help: "Exposition aux perturbateurs endocriniens (BPA, phtalates, pesticides)"
    },
    "microplastics_load": { 
        label: "Exposition Microplastiques", 
        type: "L4", 
        impact_S: 0.08,
        help: "Exposition aux microplastiques (eau, aliments, air) - Risque vasculaire émergent"
    },
    "indoor_voc": { 
        label: "Pollution Air Intérieur", 
        type: "L4", 
        impact_S: 0.10,
        help: "Pollution intérieure par composés organiques volatils (peintures, produits ménagers)"
    },
    "light_pollution_night": { 
        label: "Pollution Lumineuse (Nuit)", 
        type: "L4", 
        impact_S: 0.07,
        help: "Exposition à la lumière artificielle la nuit (bloque la mélatonine, perturbe sommeil)"
    },

    // --- 9. NOUVEAUX RISQUES NUTRITIONNELS & SYSTÉMIQUES ---
    "ultra_processed_food": { 
        label: "Aliments Ultra-Transformés", 
        type: "L4", 
        impact_S: 0.22,
        help: "Consommation d'aliments ultra-transformés (plats préparés, snacks) - Risque métabolique majeur"
    },
    "processed_meat_index": { 
        label: "Consommation Viande Transformée", 
        type: "L4", 
        impact_S: 0.15,
        help: "Consommation de charcuterie, saucisses (risque colorectal selon CIRC/OMS)"
    },
    "artificial_sweeteners": { 
        label: "Édulcorants Artificiels", 
        type: "L4", 
        impact_S: 0.10,
        help: "Consommation d'édulcorants de synthèse (aspartame, sucralose) - Risque cardio"
    },
    "omega_ratio": { 
        label: "Déséquilibre Acides Gras Oméga", 
        type: "L4", 
        impact_S: 0.12,
        help: "Déséquilibre oméga-6/oméga-3 (trop d'oméga-6, pas assez d'oméga-3) - Pro-inflammatoire"
    },
    "antibiotic_resistance": { 
        label: "Résistance Antibiotiques", 
        type: "L4", 
        impact_S: 0.18,
        help: "Résistance aux antibiotiques due à des traitements répétés (fragilité infectieuse)"
    },

    // --- 10. MARQUEURS BIOLOGIQUES & COGNITIFS NÉGLIGÉS - SIMPLIFIÉ ---
    "periodontal_health": { 
        label: "Santé Gencives/Dents", 
        type: "L4", 
        impact_S: -0.060,
        help: "Santé parodontale (gencives) - Lien avec santé cardiaque et cérébrale"
    },
    "sleep_apnea_index": { 
        label: "Apnée du Sommeil", 
        type: "L4", 
        impact_S: 0.25,
        help: "Apnée du sommeil (ronflements, arrêts de respiration) - Hypoxie nocturne, impact majeur"
    },
    "cognitive_reserve": { 
        label: "Réserve Cognitive", 
        type: "L4", 
        impact_S: -0.0700,
        help: "Réserve cognitive (études, curiosité, activités intellectuelles) - Neuro-protecteur"
    },

    // --- 11. DÉTERMINANTS SOCIO-SYSTÉMIQUES ---
    "financial_precariousness": { 
        label: "Précarité Financière", 
        type: "L4", 
        impact_S: 0.30,
        help: "Situation financière précaire (stress de survie, mortalité prématurée)"
    },
    "medical_deserts": { 
        label: "Proximité Déserts Médicaux", 
        type: "L4", 
        impact_S: 0.12,
        help: "Éloignement des services médicaux (retard de soin)"
    },
    "screening_access": { 
        label: "Accès au Dépistage", 
        type: "L4", 
        impact_S: -0.060,
        help: "Accès régulier aux dépistages médicaux (cancer, maladies) - Diagnostic précoce"
    },

    // --- 12. LIFESTYLE & TRAVAIL SPÉCIFIQUE ---
    "effort_reward_imbalance": { 
        label: "Déséquilibre Effort/Gain", 
        type: "L4", 
        impact_S: 0.20,
        help: "Déséquilibre entre effort fourni et récompense (burnout, stress moral)"
    },
    "sedentary_leisure": { 
        label: "Sédentarité de Loisir", 
        type: "L4", 
        impact_S: 0.15,
        help: "Temps passé assis pendant les loisirs (écrans, lecture) - Hors travail"
    },

    // --- 13. PRATIQUES DE LONGEVITÉ (Blue Zones & Recherches) ---
    "intermittent_fasting": { 
        label: "Jeûne Intermittent", 
        type: "L4", 
        impact_S: -0.063,
        help: "Pratique du jeûne intermittent (autophagie, réduction inflammation)"
    },
    "cold_exposure": { 
        label: "Exposition au Froid", 
        type: "L4", 
        impact_S: -0.060,
        help: "Exposition régulière au froid (douche froide, bain froid) - Thermogenèse, immunité"
    },
    "sauna_regular": { 
        label: "Sauna Régulier", 
        type: "L4", 
        impact_S: -0.060,
        help: "Pratique régulière du sauna (4-7x/semaine) - Réduction mortalité cardiovasculaire"
    },
    "nature_exposure": { 
        label: "Exposition Nature/Forêt", 
        type: "L4", 
        impact_S: -0.060,
        help: "Temps passé dans la nature (shinrin-yoku) - Réduction cortisol, bien-être"
    },
    "gratitude_practice": { 
        label: "Pratique Gratitude", 
        type: "L4", 
        impact_S: -0.0500,
        help: "Pratique régulière de la gratitude (journal, méditation) - Bien-être psychologique"
    },
    "plant_based_ratio": { 
        label: "Ratio Végétal/Alimentaire", 
        type: "L4", 
        impact_S: -0.0700,
        help: "Proportion d'aliments végétaux dans l'alimentation (Blue Zones, réduction inflammation)"
    },
    "fermented_foods": { 
        label: "Aliments Fermentés", 
        type: "L4", 
        impact_S: -0.060,
        help: "Consommation d'aliments fermentés (yaourt, kéfir, choucroute) - Microbiote, immunité"
    },
    "caloric_restriction": { 
        label: "Restriction Calorique Modérée", 
        type: "L4", 
        impact_S: -0.063,
        help: "Réduction modérée des calories (longévité cellulaire, études CRON)"
    },
    "time_restricted_eating": { 
        label: "Alimentation Restreinte Temporellement", 
        type: "L4", 
        impact_S: -0.060,
        help: "Manger dans une fenêtre de temps limitée (ex: 8h/16h) - Rythme circadien"
    },

    // --- 14. FACTEURS BIOLOGIQUES AVANCÉS - SIMPLIFIÉ (Tests médicaux supprimés) ---
    "autophagy_induction": { 
        label: "Nettoyage Cellulaire", 
        type: "L4", 
        impact_S: -0.063,
        help: "Autophagie (nettoyage cellulaire) - Induit par jeûne, exercice"
    },
    "glycemic_variability": { 
        label: "Variations Taux Sucre", 
        type: "L4", 
        impact_S: 0.15,
        help: "Variations importantes du taux de sucre dans le sang (pics glycémiques) - Inflammation"
    },

    // --- 15. CONNEXIONS SOCIALES & RELATIONNELLES ---
    "family_cohesion": { 
        label: "Cohésion Familiale", 
        type: "L4", 
        impact_S: -0.060,
        help: "Cohésion et soutien familial (Blue Zones) - Différent de 'Relations Famille' (L3)"
    },
    "community_integration": { 
        label: "Intégration Communautaire", 
        type: "L4", 
        impact_S: -0.063,
        help: "Intégration dans une communauté (sens d'appartenance, Blue Zones)"
    },
    "intergenerational_contact": { 
        label: "Contact Intergénérationnel", 
        type: "L4", 
        impact_S: -0.060,
        help: "Contacts réguliers avec différentes générations (transmission, sens, activité cognitive)"
    },

    // --- 16. ACTIVITÉS PHYSIQUES SPÉCIFIQUES ---
    // CORRECTION V3.8: Impacts réduits pour réalisme scientifique
    // L'activité physique augmente l'espérance de vie de 2-5 ans, pas de 20-30 ans
    "strength_training": { 
        label: "Entraînement Musculaire", 
        type: "L4", 
        impact_S: -0.030,  // Réduit de -0.15 à -0.05 (67% de réduction)
        help: "Musculation, entraînement en résistance (masse musculaire, métabolisme)"
    },
    "flexibility_mobility": { 
        label: "Flexibilité/Mobilité", 
        type: "L4", 
        impact_S: -0.021,  // Réduit de -0.10 à -0.03 (70% de réduction)
        help: "Exercices de flexibilité et mobilité (prévention chutes, autonomie)"
    },
    "balance_training": { 
        label: "Entraînement Équilibre", 
        type: "L4", 
        impact_S: -0.028,  // Réduit de -0.12 à -0.04 (67% de réduction)
        help: "Exercices d'équilibre (critique après 60 ans, prévention fractures)"
    },
    "outdoor_activities": { 
        label: "Activités Extérieures", 
        type: "L4", 
        impact_S: -0.028,  // Réduit de -0.12 à -0.04 (67% de réduction)
        help: "Activités physiques en extérieur (vitamine D, nature, activité)"
    },
    "active_transport": { 
        label: "Transport Actif (Vélo/Marche)", 
        type: "L4", 
        impact_S: -0.030,  // Réduit de -0.15 à -0.05 (67% de réduction)
        help: "Utilisation du vélo ou marche pour se déplacer (activité quotidienne intégrée)"
    },

    // --- 17. SOMMEIL & RYTHMES CIRCADIENS ---
    "sleep_consistency": { 
        label: "Régularité Horaires Sommeil", 
        type: "L4", 
        impact_S: -0.060,
        help: "Régularité des horaires de coucher et lever (rythme circadien)"
    },
    "deep_sleep_quality": { 
        label: "Qualité Sommeil Profond", 
        type: "L4", 
        impact_S: -0.063,
        help: "Qualité du sommeil profond (réparation, mémoire, santé cognitive)"
    },
    "circadian_alignment": { 
        label: "Alignement Rythme Circadien", 
        type: "L4", 
        impact_S: -0.060,
        help: "Alignement avec le rythme jour/nuit (exposition lumière, horloge biologique)"
    },

    // --- 18. NUTRITION & MICRONUTRIMENTS - SIMPLIFIÉ ---
    "polyphenol_intake": { 
        label: "Antioxydants (Thé, Baies)", 
        type: "L4", 
        impact_S: -0.060,
        help: "Apport en polyphénols (thé vert, baies, chocolat noir) - Antioxydants"
    },
    "fiber_intake": { 
        label: "Apport Fibres", 
        type: "L4", 
        impact_S: -0.060,
        help: "Consommation de fibres (légumes, fruits, céréales complètes) - Microbiote, santé digestive"
    },
    "omega3_intake": { 
        label: "Acides Gras Oméga-3", 
        type: "L4", 
        impact_S: -0.060,
        help: "Apport en oméga-3 (poissons gras, noix, graines) - Anti-inflammatoire, cerveau"
    },
    "vitamin_k2": { 
        label: "Vitamine K2", 
        type: "L4", 
        impact_S: -0.0500,
        help: "Apport en vitamine K2 (aliments fermentés, fromages, natto) - Santé osseuse, cardiovasculaire"
    },
    "magnesium_levels": { 
        label: "Niveaux Magnésium", 
        type: "L4", 
        impact_S: -0.060,
        help: "Niveaux de magnésium (légumes verts, noix, céréales) - Stress, sommeil, métabolisme"
    },
    "zinc_levels": { 
        label: "Niveaux Zinc", 
        type: "L4", 
        impact_S: -0.0500,
        help: "Niveaux de zinc (viande, fruits de mer, légumineuses) - Immunité, réparation ADN"
    },
    "iron_overload": { 
        label: "Surcharge Fer", 
        type: "L4", 
        impact_S: 0.12,
        help: "Excès de fer (viande rouge excessive, suppléments) - Stress oxydatif, vieillissement"
    },

    // --- 19. ENVIRONNEMENT & EXPOSITIONS ---
    "electromagnetic_exposure": { 
        label: "Exposition Électromagnétique", 
        type: "L4", 
        impact_S: 0.08,
        help: "Exposition aux champs électromagnétiques (WiFi, téléphones) - Controversé, potentiel stress"
    },
    "soil_quality_food": { 
        label: "Qualité Sols (Aliments)", 
        type: "L4", 
        impact_S: -0.0500,
        help: "Qualité des sols où poussent vos aliments (minéraux, nutriments)"
    },
    "seasonal_variation": { 
        label: "Variation Saisonnière", 
        type: "L4", 
        impact_S: -0.048,
        help: "Exposition aux variations saisonnières (vitamine D, rythme circadien)"
    },

    // --- 20. FACTEURS PSYCHOLOGIQUES & COMPORTEMENTAUX ---
    "locus_control_internal": { 
        label: "Sentiment de Contrôle", 
        type: "L4", 
        impact_S: -0.060,
        help: "Sentiment de contrôle sur sa vie (locus de contrôle interne) - Résilience"
    },
    "creativity_expression": { 
        label: "Expression Créative", 
        type: "L4", 
        impact_S: -0.0500,
        help: "Pratique d'activités créatives (art, musique, écriture) - Bien-être, sens"
    },
    "humor_laughter": { 
        label: "Humour/Rire", 
        type: "L4", 
        impact_S: -0.060,
        help: "Pratique régulière du rire et de l'humour - Réduction stress, immunité"
    },
    "forgiveness_practice": { 
        label: "Pratique Pardon", 
        type: "L4", 
        impact_S: -0.0500,
        help: "Pratique du pardon (lâcher-prise) - Réduction stress chronique"
    },
    "mindfulness_daily": { 
        label: "Pleine Conscience Quotidienne", 
        type: "L4", 
        impact_S: -0.060,
        help: "Pratique quotidienne de la pleine conscience (méditation, attention) - Réduction stress"
    },

    // --- 21. FACTEURS GÉNÉTIQUES & FAMILIAUX - SIMPLIFIÉ (Tests génétiques supprimés) ---
    "genetic_risk_factors": { 
        label: "Risques Génétiques Connus", 
        type: "L4", 
        impact_S: 0.15,
        help: "Prédispositions génétiques connues aux maladies (famille, tests) - Estimation subjective"
    },

    // --- 22. ACCÈS & QUALITÉ DES SOINS ---
    "health_literacy": { 
        label: "Littératie en Santé", 
        type: "L4", 
        impact_S: -0.060,
        help: "Capacité à comprendre et utiliser les informations de santé - Compréhension, compliance"
    },
    "medication_adherence": { 
        label: "Observance Médicamenteuse", 
        type: "L4", 
        impact_S: -0.060,
        help: "Respect des prescriptions médicales (compliance traitement)"
    },
    "alternative_medicine_access": { 
        label: "Accès Médecine Alternative", 
        type: "L4", 
        impact_S: -0.048,
        help: "Accès à des médecines complémentaires (acupuncture, ostéopathie) - Complémentarité soins"
    },
    "dental_care_regularity": { 
        label: "Régularité Soins Dentaires", 
        type: "L4", 
        impact_S: -0.060,
        help: "Visites régulières chez le dentiste - Santé parodontale, santé systémique"
    },

    // --- 23. FACTEURS SOCIO-ÉCONOMIQUES ---
    "education_level": { 
        label: "Niveau Éducation", 
        type: "L4", 
        impact_S: -0.060,
        help: "Niveau d'éducation atteint - Littératie santé, revenus, accès soins"
    },
    "occupation_satisfaction": { 
        label: "Satisfaction Professionnelle", 
        type: "L4", 
        impact_S: -0.060,
        help: "Satisfaction au travail (stress, sens, bien-être)"
    },
    "neighborhood_safety": { 
        label: "Sécurité Quartier", 
        type: "L4", 
        impact_S: -0.0500,
        help: "Sécurité du quartier de résidence - Stress chronique, activité physique"
    },
    "access_green_spaces": { 
        label: "Accès Espaces Verts", 
        type: "L4", 
        impact_S: -0.060,
        help: "Accès facile à des espaces verts (parcs, forêts) - Nature, activité, bien-être"
    }
};

window.PARAM_DICTIONARY = PARAM_DICTIONARY;

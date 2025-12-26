/**
 * VALEURS PAR DÉFAUT REPRÉSENTATIVES DE LA MAJORITÉ DES FRANÇAIS
 * ==============================================================
 * Ces valeurs doivent être neutres et ne pas influencer les résultats
 * si l'utilisateur ne les modifie pas.
 * 
 * Logique :
 * - Paramètres binaires : -1 (Non) si majorité non concernée, +1 (Oui) si majorité concernée
 * - Paramètres de niveau : 0 (Moyen) si majorité moyenne, -1 (Faible) ou +1 (Fort) selon la majorité
 */

const DEFAULT_VALUES_FRANCE = {
    // === IDENTITÉ & GENRE ===
    "hormone_therapy": -1,          // Majorité non concernée (THS = minorité)
    "minority_stress": -1,          // Majorité non concernée (minorités = ~10-15%)
    "transition_support": -1,       // Majorité non concernée
    "gender_dysphoria": -1,         // Majorité non concernée
    
    // === SANTÉ MENTALE & PSYCHIATRIQUE ===
    "neurodivergence": -1,          // Majorité non concernée (TDAH/ASD = ~5-10%)
    "bipolar_history": -1,          // Majorité non concernée (trouble bipolaire = ~2-3%)
    "ptsd_complex": -1,             // Majorité non concernée (C-PTSD = minorité)
    "medication_psych": -1,         // Majorité non concernée (traitement psychotrope = ~10-15%)
    "therapy_active": -1,           // Majorité non concernée (suivi thérapeutique = ~15-20%)
    
    // === HANDICAP & ACCESSIBILITÉ ===
    "mobility_limit": -1,           // Majorité non concernée (handicap mobilité = ~5-7%)
    "chronic_pain": 0,              // Majorité ont des douleurs modérées occasionnelles
    "adaptive_tech": -1,            // Majorité non concernée
    
    // === MICRO-BIOLOGIE ===
    "hrv_coherence": 0,             // Majorité ont une variabilité moyenne
    "gut_diversity": 0,             // Majorité ont une diversité moyenne (alimentation occidentale)
    "heavy_metals": 0,              // Majorité ont une exposition modérée (eau, alimentation)
    "blue_light": 0,                // Majorité ont une exposition modérée (écrans quotidiens)
    "air_quality_pm25": 0,          // Majorité vivent dans zones pollution modérée (urbain/suburbain)
    
    // === GÉOGRAPHIE & CLIMAT ===
    "geo_origin": 0,                // Majorité n'ont pas d'origine privilégiée particulière
    "childhood_quality": 0,         // Majorité ont eu une enfance moyenne (France développée)
    "geo_climate_risk": 0,          // Majorité ont un risque climatique modéré
    "geo_density": 0,               // Majorité vivent en zones densité moyenne (urbain/suburbain)
    "geo_water_access": 1,          // Majorité ont accès eau potable (France = 100% accès)
    "geo_health_edu": 0,            // Majorité ont un niveau éducation santé moyen
    "geo_food_security": 1,         // Majorité ont sécurité alimentaire (France développée)
    
    // === ENVIRONNEMENT & EXPOSITIONS ===
    "radon_exposure": 0,            // Majorité ont exposition modérée (selon région)
    "endocrine_disruptors": 0,      // Majorité ont exposition modérée (alimentation, produits)
    "microplastics_load": 0,        // Majorité ont exposition modérée (omniprésent)
    "indoor_voc": 0,                // Majorité ont pollution intérieure modérée
    "light_pollution_night": 0,     // Majorité vivent zones pollution lumineuse modérée
    
    // === NUTRITION & RISQUES ===
    "ultra_processed_food": 0,      // Majorité consomment modérément (alimentation occidentale)
    "processed_meat_index": 0,      // Majorité consomment modérément (charcuterie occasionnelle)
    "artificial_sweeteners": 0,     // Majorité consomment modérément
    "omega_ratio": 0,               // Majorité ont déséquilibre modéré (alimentation occidentale)
    "antibiotic_resistance": 0,      // Majorité ont résistance modérée (traitements occasionnels)
    
    // === MARQUEURS BIOLOGIQUES ===
    "periodontal_health": 0,        // Majorité ont santé dentaire moyenne
    "sleep_apnea_index": -1,       // Majorité non concernées (apnée = ~5-10%)
    "cognitive_reserve": 0,         // Majorité ont réserve cognitive moyenne
    
    // === SOCIO-ÉCONOMIQUE ===
    "financial_precariousness": -1, // Majorité non en précarité (14.4% pauvreté = minorité)
    "medical_deserts": -1,          // Majorité non concernées (déserts médicaux = zones rurales)
    "screening_access": 0,          // Majorité ont accès modéré (selon région)
    
    // === LIFESTYLE & TRAVAIL ===
    "effort_reward_imbalance": 0,   // Majorité ont équilibre modéré
    "sedentary_leisure": 0,         // Majorité ont sédentarité loisir modérée
    
    // === PRATIQUES DE LONGEVITÉ ===
    "intermittent_fasting": -1,     // Majorité ne pratiquent pas
    "cold_exposure": -1,           // Majorité ne pratiquent pas
    "sauna_regular": -1,           // Majorité ne pratiquent pas
    "nature_exposure": 0,           // Majorité ont exposition modérée (parcs, week-ends)
    "gratitude_practice": -1,       // Majorité ne pratiquent pas régulièrement
    "plant_based_ratio": 0,        // Majorité ont ratio modéré (alimentation mixte)
    "fermented_foods": 0,          // Majorité consomment modérément (yaourt, fromage)
    "caloric_restriction": -1,      // Majorité ne pratiquent pas
    "time_restricted_eating": -1,   // Majorité ne pratiquent pas
    
    // === BIOLOGIE AVANCÉE ===
    "autophagy_induction": 0,       // Majorité ont induction modérée (jeûne nocturne naturel)
    "glycemic_variability": 0,     // Majorité ont variations modérées
    
    // === CONNEXIONS SOCIALES ===
    "family_cohesion": 0,          // Majorité ont cohésion moyenne
    "community_integration": 0,    // Majorité ont intégration modérée
    "intergenerational_contact": 0, // Majorité ont contacts modérés
    
    // === ACTIVITÉ PHYSIQUE ===
    "strength_training": -1,      // Majorité ne pratiquent pas régulièrement
    "flexibility_mobility": 0,     // Majorité ont flexibilité modérée
    "balance_training": -1,        // Majorité ne pratiquent pas spécifiquement
    "outdoor_activities": 0,      // Majorité ont activités extérieures modérées
    "active_transport": 0,        // Majorité utilisent modérément (selon zone)
    
    // === SOMMEIL & RYTHMES ===
    "sleep_consistency": 0,        // Majorité ont régularité modérée
    "deep_sleep_quality": 0,       // Majorité ont qualité modérée
    "circadian_alignment": 0,      // Majorité ont alignement modéré
    
    // === NUTRITION & MICRONUTRIMENTS ===
    "polyphenol_intake": 0,        // Majorité ont apport modéré (thé, fruits)
    "fiber_intake": 0,            // Majorité ont apport modéré
    "omega3_intake": 0,            // Majorité ont apport modéré
    "vitamin_k2": 0,              // Majorité ont apport modéré (fromages)
    "magnesium_levels": 0,        // Majorité ont niveaux modérés
    "zinc_levels": 0,             // Majorité ont niveaux modérés
    "iron_overload": -1,          // Majorité non concernées (surcharge = rare)
    
    // === ENVIRONNEMENT ===
    "electromagnetic_exposure": 0, // Majorité ont exposition modérée (WiFi, téléphones)
    "soil_quality_food": 0,      // Majorité consomment aliments qualité modérée
    "seasonal_variation": 0,      // Majorité exposées variations saisonnières modérées
    
    // === PSYCHOLOGIE & COMPORTEMENT ===
    "locus_control_internal": 0,   // Majorité ont sentiment contrôle modéré
    "creativity_expression": 0,    // Majorité ont expression créative modérée
    "humor_laughter": 0,          // Majorité pratiquent modérément
    "forgiveness_practice": 0,    // Majorité pratiquent modérément
    "mindfulness_daily": -1,      // Majorité ne pratiquent pas quotidiennement
    
    // === GÉNÉTIQUE & FAMILIAL ===
    "genetic_risk_factors": 0,     // Majorité ont risques modérés (famille moyenne)
    
    // === ACCÈS & QUALITÉ SOINS ===
    "health_literacy": 0,         // Majorité ont littératie modérée
    "medication_adherence": 0,     // Majorité ont observance modérée
    "alternative_medicine_access": 0, // Majorité ont accès modéré
    "dental_care_regularity": 0,   // Majorité ont soins modérés
    
    // === SOCIO-ÉCONOMIQUE ===
    "education_level": 0,         // Majorité ont niveau moyen (bac+2 à bac+5)
    "occupation_satisfaction": 0,  // Majorité ont satisfaction modérée
    "neighborhood_safety": 0,       // Majorité vivent zones relativement sûres
    "access_green_spaces": 0      // Majorité ont accès modéré (selon zone urbaine/rurale)
};

// Export pour utilisation dans index_test.html
if (typeof window !== 'undefined') {
    window.DEFAULT_VALUES_FRANCE = DEFAULT_VALUES_FRANCE;
}


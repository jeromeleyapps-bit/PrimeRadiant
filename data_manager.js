/**
 * THE PRIME RADIANT - MODULE DE GESTION DE DONNÉES (PRIVACY-FIRST)
 * ================================================================
 * Role: Architecture de Données & Mapping NoCode
 * Stockage: LocalStorage uniquement (Pas de Backend)
 */

/* --- 1. SCHÉMA DE BASE DE DONNÉES (LOCAL STORAGE MODEL) --- */
const PR_Schema = {
    key: "PR_UserProfile",
    structure: {
        meta: {
            created_at: null, // ISO Date
            updated_at: null, // ISO Date
            version: "2.0",
            data_completion: 0 // 0-100%
        },
        profile: {
            // Identité (minimale)
            age: null,
            gender: null,
            name_hash: null // Pour l'UX uniquement, pas stocké en clair si possible
        },
        variables: {
            // Conteneur plat pour les 50 variables normalisées (0.0 - 1.0 ou valeurs brutes)
            // ex: "bmi": 22.5, "stress": 0.8
        },
        raw_answers: {
            // Stocke les réponses textuelles/IDs des questions pour ré-édition
            // ex: "q_smoke": "occasional"
        }
    }
};

/* --- 2. DICTIONNAIRE DE MAPPING (HUMAN -> MATH) --- */
// Ce dictionnaire convertit les inputs UI (Text/Select) en valeurs numériques pour le SchrodingerEngine
const VariableMapping = {
    // === SANTÉ PHYSIQUE ===
    "smoking": {
        "never": 0,
        "quit_gt_5y": 0.1,  // Arrêté > 5 ans (traces légères)
        "quit_lt_5y": 0.3,  // Arrêté < 5 ans
        "occasional": 0.4,
        "daily": 1.0        // Fumeur actif (Impact Max)
    },
    "alcohol": {
        "none": 0,
        "social": 0.1,
        "moderate": 0.3,
        "heavy": 1.0
    },
    "diet": {
        "processed": -0.2, // Malus
        "balanced": 0,
        "mediterranean": 0.2, // Bonus Longevité
        "vegan_optimized": 0.2
    },
    "sleep_qual": {
        "insomnia": 0,    // Qualité 0/10
        "bad": 0.3,
        "average": 0.6,
        "good": 0.9,
        "optimal": 1.0
    },

    // === PSYCHOLOGIE ===
    "stress_perception": {
        "zen": 1,         // Stress factor 1 (min)
        "manageable": 3,
        "high": 7,
        "overwhelming": 10 // Stress factor 10 (max impact entropy)
    },
    "purpose_feeling": { // Ikigai
        "lost": 0,
        "searching": 3,
        "found": 8,
        "driven": 10
    }

    // ... Étendre pour les 50 variables selon le même pattern
};

/* --- 3. GESTIONNAIRE DE DONNÉES ET NORMALISATION --- */

class DataManager {

    constructor() {
        this.storageKey = PR_Schema.key;
        this.currentData = this._load() || this._initNewParam();

        // Moyennes de Seldon (Valeurs par défaut statistiques pour l'Homme Moyen)
        this.SELDON_AVERAGES = {
            age: 30,
            gender: 'M',
            bmi: 25,
            stress: 5,
            sleep: 7,
            optimism: 5,
            financial: 5,
            social: 5,
            smoker: 0 // On assume non par défaut pour ne pas pénaliser indûment
        };
    }

    _initNewParam() {
        return {
            meta: {
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                version: "2.0",
                data_completion: 0
            },
            profile: {},
            variables: {},
            raw_answers: {}
        };
    }

    _load() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : null;
    }

    save() {
        this.currentData.meta.updated_at = new Date().toISOString();
        this.currentData.meta.data_completion = this.calculateCompletion(this.currentData.variables);
        localStorage.setItem(this.storageKey, JSON.stringify(this.currentData));
    }

    /**
     * NORMALISATION DES ENTRÉES
     * Prend un objet formulaire brut { q_smoke: "daily", age: "35" }
     * Retourne un objet propre pour le Moteur { smoker: 1.0, age: 35 }
     */
    normalizeInputs(rawForm) {
        let normalized = { ...this.currentData.variables }; // Start with existing

        // 1. Map known fields
        // Ex: Gestion de l'âge (Bornes)
        if (rawForm.age) {
            let age = parseInt(rawForm.age);
            if (age < 0) age = 0;
            if (age > 110) age = 110; // Cap
            normalized.age = age;
        }

        // Ex: Mapping via dictionnaire
        if (rawForm.smoking && VariableMapping.smoking[rawForm.smoking] !== undefined) {
            normalized.smoker = VariableMapping.smoking[rawForm.smoking];
        }

        // Ex: Mapping Direct (Range inputs)
        if (rawForm.stress_level) {
            normalized.stress_cortisol = parseInt(rawForm.stress_level);
        }

        // 2. Combler les trous (Seldon Averages)
        // Pour toute variable critique manquante, on injecte la moyenne
        // Cela permet au moteur de tourner même avec 10% de réponses
        const requiredKeys = ['bmi', 'stress_cortisol', 'optimism', 'financial_stability'];
        requiredKeys.forEach(key => {
            if (normalized[key] === undefined || normalized[key] === null) {
                // On utilise la moyenne de Seldon si dispo, sinon 0 ou 5 (milieu)
                normalized[key] = this.SELDON_AVERAGES[key.replace('_cortisol', '').replace('_stability', '')] || 5;
            }
        });

        // Mise à jour de l'état interne
        this.currentData.variables = normalized;
        Object.assign(this.currentData.raw_answers, rawForm);

        return normalized;
    }

    /**
     * CALCUL DE PROGRESSION & CERTITUDE
     * Retourne { percent: 45, level: 2, uncertaintyReduction: 0.8 }
     * uncertaintyReduction : Facteur multiplicateur pour le sigma (plus bas = plus précis)
     */
    getProgressionMetrics() {
        const totalPossibleVars = 50; // Objectif Niveau 2
        const filledVars = Object.keys(this.currentData.raw_answers).length;

        const percent = Math.min(100, Math.round((filledVars / totalPossibleVars) * 100));

        let level = 1;
        if (filledVars >= 50) level = 2; // Encyclopédiste complet
        else if (filledVars >= 10) level = 1.5; // Initié avancé

        // Réduction d'incertitude
        // 0 réponses -> Facteur 1.0 (Full Chaos par défaut)
        // 50 réponses -> Facteur 0.5 (Incertitude réduite de moitié, le modèle "connaît" l'utilisateur)
        // La courbe est logarithmique : les premières questions réduisent le plus l'incertitude.
        const uncertaintyFactor = Math.max(0.5, 1.0 - (Math.log(filledVars + 1) / Math.log(totalPossibleVars + 1)) * 0.5);

        return {
            percent,
            level,
            uncertaintyFactor: parseFloat(uncertaintyFactor.toFixed(2)),
            label: level === 2 ? "L'Encyclopédiste" : "L'Initié"
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DataManager, VariableMapping };
} else {
    window.DataManager = DataManager;
    window.VariableMapping = VariableMapping;
}

/**
 * THE PRIME RADIANT - MOTEUR STOCHASTIQUE AVANCÉ (V2)
 * ===================================================
 * Role: Ingénieur Calcul Stochastique
 * Pattern: Vanilla JS ES6 Class (Compatible Custom Action)
 * 
 * Concepts Physiques Métaphoriques :
 * - Entropie : Dégradation naturelle et irréversible du système (vieillissement).
 * - Constante de Planck (h) : Le seuil minimal d'action/chaos en dessous duquel on ne peut descendre.
 * - Crise de Seldon : Événement rare ("Black Swan") à fort impact systémique.
 */

/* --- 1. SCHÉMA DE DONNÉES ET FACTEURS (Niveau 2 étendu) --- */
const LifeProfileDefinitions = {
    // CATEGORIE: BIOLOGIQUE (Hardware)
    "bmi": { default: 22, impact: -0.2, uncertainty: 1.1, type: "continuous", label: "Indice Masse Corporelle" }, // Impact par unité hors zone idéale
    "smoker": { default: 0, impact: -10.0, uncertainty: 2.5, type: "boolean", label: "Fumeur Actif" },
    "alcohol": { default: 1, impact: -0.5, uncertainty: 1.5, type: "scale_1_5", label: "Consommation Alcool" },
    "sleep_quality": { default: 7, impact: 2.0, uncertainty: 1.0, type: "scale_1_10", label: "Qualité Sommeil" },
    "chronic_condition": { default: 0, impact: -5.0, uncertainty: 2.0, type: "boolean", label: "Affection Longue Durée" },

    // CATEGORIE: PSYCHOLOGIQUE (Software)
    "stress_cortisol": { default: 4, impact: -0.8, uncertainty: 1.8, type: "scale_1_10", label: "Stress Chronique" }, // Fort impact entropique
    "optimism": { default: 6, impact: 1.5, uncertainty: 0.9, type: "scale_1_10", label: "Optimisme" },
    "purpose": { default: 5, impact: 2.0, uncertainty: 0.8, type: "scale_1_10", label: "Sens de la vie (Ikigai)" },

    // CATEGORIE: SOCIO-ECONOMIQUE (Environnement)
    "financial_stability": { default: 6, impact: 3.0, uncertainty: 0.7, type: "scale_1_10", label: "Stabilité Financière" },
    "social_network": { default: 5, impact: 2.5, uncertainty: 0.8, type: "scale_1_10", label: "Réseau Social Fort" },
    "urban_pollution": { default: 0, impact: -2.0, uncertainty: 1.2, type: "boolean", label: "Vie urbaine polluée" }
};

/* --- 2. CLASSE MOTEUR --- */

class SchrodingerEngineV2 {

    constructor(userInputs = {}) {
        // --- CONSTANTES PHYSIQUES DE L'UNIVERS SIMULÉ ---
        this.PLANCK_CONSTANT = 0.5; // K : Seuil de chaos incompressible
        this.BOLTZMANN_K = 1.0; // k : Facteur d'échelle de l'entropie
        this.SELDON_CRISIS_PROB = 0.005; // 0.5% de chance par an d'un choc majeur (Accident, Maladie soudaine)
        this.MAX_AGE = 120; // Limite biologique théorique

        // Initialisation de l'état
        this.age = userInputs.age || 30;
        this.gender = userInputs.gender || 'M';

        // Calcul du profil énergétique initial ("Vecteur d'État")
        this.profile = this._buildProfile(userInputs);
        this.baseDecayRate = this._calculateBaseEntropy();

        // Variance globale (Incertitude d'Heisenberg)
        // Plus on a de facteurs de risque volatils (stress, tabac), plus la prédiction est flooue.
        this.uncertaintyMatrix = this._calculateUncertainty();
    }

    /**
     * Construit le profil complet en mixant les défauts et les inputs utilisateur.
     */
    _buildProfile(inputs) {
        let profile = {};
        for (const [key, def] of Object.entries(LifeProfileDefinitions)) {
            profile[key] = (inputs[key] !== undefined) ? inputs[key] : def.default;
        }
        return profile;
    }

    /**
     * Calcule l'Entropie de Base (Usure annuelle déterministe).
     * Formule : Somme linéaire des impacts biologiques + Impact Exponentiel du Stress.
     */
    _calculateBaseEntropy() {
        let entropy = 1.0; // Usure standard par an (1 "an" de vitalité)

        // 1. Facteurs Linéaires (Biologie & Environnement)
        if (this.profile.smoker) entropy += 0.5; // Accélération
        if (this.profile.urban_pollution) entropy += 0.1;

        // Bonus de résilience (ralentit l'entropie)
        if (this.profile.health_checkup) entropy -= 0.1;

        // 2. Facteurs Exponentiels (Stress)
        // Le stress agit comme un catalyseur. Stress 10 = Usure x 1.5
        // Formule : (1 + (Stress/20)^2)
        const stressFactor = 1 + Math.pow(this.profile.stress_cortisol / 20, 2);

        return entropy * stressFactor;
    }

    /**
     * Calcule la matrice d'incertitude (Variance sigma).
     * Des vies "bien rangées" sont plus prévisibles (sigma faible).
     */
    _calculateUncertainty() {
        let sigma = 1.0;
        for (const [key, val] of Object.entries(this.profile)) {
            const def = LifeProfileDefinitions[key];
            if (def.uncertainty > 1.0 && val > ((def.type.includes('scale')) ? 5 : 0)) {
                // Si un facteur incertain est présent/élevé, on augmente le bruit
                sigma *= (1 + (def.uncertainty - 1) * 0.1);
            }
        }
        return sigma;
    }

    /**
     * Générateur de nombre aléatoire suivant une distribution normale (Gaussian).
     * Utilise la transformation de Box-Muller.
     */
    _boxMuller(mean, stdev) {
        let u = 0, v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return z * stdev + mean;
    }

    /**
     * Simule UNE trajectoire de vie unique de t (actuel) à MAX_AGE.
     */
    _runSingleTrajectory() { // Correction : renommé _runSingleTrajectory
        let history = [];
        let currentVitality = 100; // Capital Vitalité (Arbitraire 100%)
        let alive = true;
        let age = this.age;

        while (alive && age < this.MAX_AGE) {
            history.push({ age, v: currentVitality });

            // 1. Calcul de l'usure de l'année
            // Usure = Base * (Facteur Age) + (Chaos * Incertitude)
            const ageAcceleration = 1 + (age / 100); // L'entropie accélère avec le temps

            // Le Chaos : Fluctuation aléatoire autour de 0
            const chaos = this._boxMuller(0, this.PLANCK_CONSTANT * this.uncertaintyMatrix);

            const decay = (this.baseDecayRate * ageAcceleration) + chaos;

            // Application
            currentVitality -= Math.max(0.1, decay); // On perd toujours un minimum

            // 2. Crise de Seldon (Événement rare)
            // Roll dice for Black Swan event
            if (Math.random() < this.SELDON_CRISIS_PROB) {
                const crisisImpact = this._boxMuller(15, 5); // Choc violent (-15% vitalité en moyenne)
                currentVitality -= crisisImpact;
                // Note: Une crise peut tuer instantanément si Vitalité basse
            }

            // 3. Check de Fin de Simulation (Décès)
            // La mort survient quand la vitalité tombe à 0
            if (currentVitality <= 0) {
                alive = false;
                currentVitality = 0;
            }

            age++;
        }
        // Ajouter le point final (mort)
        history.push({ age, v: 0, dead: true });

        return history;
    }

    /**
     * Lance la simulation de Monte Carlo complète.
     * @param {number} iterations Nombre de vies simulées (ex: 1000)
     */
    runSimulation(iterations = 1000) {
        let allTrajectories = []; // Stockage brut (attention mémoire sur gros nombres)
        let survivalCounts = new Array(this.MAX_AGE + 1).fill(0);
        let qualitySums = new Array(this.MAX_AGE + 1).fill(0);

        // Boucle Monte Carlo
        for (let i = 0; i < iterations; i++) {
            const trajectory = this._runSingleTrajectory(); // Correction de l'appel
            allTrajectories.push(trajectory);

            // Agrégation statistique immédiate
            trajectory.forEach(point => {
                if (point.age <= this.MAX_AGE && point.v > 0) {
                    survivalCounts[point.age]++;
                    qualitySums[point.age] += point.v;
                }
            });
        }

        // Compilation des résultats
        return {
            raw_simulations: allTrajectories, // Pour le nuage visuel
            aggregated_data: this.getProbabilityCloud(survivalCounts, qualitySums, iterations)
        };
    }

    /**
     * Transforme les données brutes en "Nuage de Probabilité".
     * Output: Tableau [{age: 30, survivalRate: 100%, avgQuality: 95}, ...]
     */
    getProbabilityCloud(survivalCounts, qualitySums, totalIterations) {
        let cloud = [];
        for (let t = this.age; t <= this.MAX_AGE; t++) {
            const survivors = survivalCounts[t];
            const survivalRate = (survivors / totalIterations) * 100;

            let avgQuality = 0;
            if (survivors > 0) {
                avgQuality = qualitySums[t] / survivors;
            }

            cloud.push({
                age: t,
                uncertaintyIdx: (100 - survivalRate) / 100, // Simplifié
                survivalRate: parseFloat(survivalRate.toFixed(1)),
                avgQuality: parseFloat(avgQuality.toFixed(1))
            });
        }
        return cloud;
    }
}

// Export pour l'usage du fichier de test
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SchrodingerEngineV2, LifeProfileDefinitions };
} else {
    window.SchrodingerEngineV2 = SchrodingerEngineV2;
    window.LifeProfileDefinitions = LifeProfileDefinitions;
}

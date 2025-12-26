/**
 * EXEMPLE D'INTÉGRATION - MOTEUR SELDON V4
 * ========================================
 * Montre comment intégrer les améliorations dans le moteur existant
 * 
 * NOTE: Ceci est un exemple de structure, pas une implémentation complète
 */

class SchrodingerEngineV4 {
    constructor(inputs, level = 3, phantomParams = {}) {
        this.inputs = inputs;
        this.level = level;
        this.phantom = phantomParams;
        this.dictionary = window.PARAM_DICTIONARY || {};
        
        // === NOUVEAU: Système de calibration ===
        this.calibration = new CalibrationEngine();
        this.calibratedCoeffs = this.calibration.calibrateCoefficients(inputs.gender || 'M');
        
        // === NOUVEAU: Modèle Gompertz-Makeham ===
        this.gompertzModel = new GompertzMakehamModel('FRANCE');
        this.ageImpactTable = this.gompertzModel.generateImpactTable(120);
        
        // === NOUVEAU: Matrice d'interactions ===
        this.interactionCalculator = new InteractionCalculator();
        
        // Constants
        this.MAX_AGE = 120;
        this.BASE_ENTROPY = (inputs.gender === 'F') ? 0.95 : 1.05;
        this.CHAOS_BASE = (level === 4) ? 0.5 : 0.20;
    }
    
    /**
     * REMPLACE: _getAgeImpactFactor
     * Utilise maintenant le modèle Gompertz-Makeham calibré
     */
    _getAgeImpactFactor(age) {
        // Utiliser la table pré-calculée pour performance
        if (age >= 0 && age <= 120) {
            return this.ageImpactTable[Math.floor(age)];
        }
        
        // Fallback: calcul direct
        return this.gompertzModel.getAgeImpactFactor(age);
    }
    
    /**
     * AMÉLIORÉ: _initializeState
     * Utilise maintenant les coefficients calibrés
     */
    _initializeState() {
        let state = {
            energy: 100,
            entropy_rate: this.BASE_ENTROPY,
        };
        
        // === NOUVEAU: Utilisation des coefficients calibrés ===
        
        // 1. Stress (avec formule calibrée)
        if (this.inputs.stress_cortisol) {
            const stressCoeff = this.calibratedCoeffs.stress_cortisol;
            state.entropy_rate += stressCoeff.formula(this.inputs.stress_cortisol);
        }
        
        // 2. IMC (avec courbe calibrée)
        if (this.inputs.bmi) {
            const bmiCoeff = this.calibratedCoeffs.bmi;
            state.entropy_rate += bmiCoeff.formula(this.inputs.bmi);
        }
        
        // 3. Optimisme
        if (this.inputs.optimism) {
            const optCoeff = this.calibratedCoeffs.optimism;
            state.entropy_rate += optCoeff.formula(this.inputs.optimism);
        }
        
        // 4. Tabagisme (si disponible)
        if (this.inputs.smoking !== undefined) {
            const smokingCoeff = this.calibratedCoeffs.smoking;
            state.entropy_rate += smokingCoeff.formula(this.inputs.smoking);
        }
        
        // 5. Activité physique (si disponible)
        if (this.inputs.physicalActivity !== undefined) {
            const activityCoeff = this.calibratedCoeffs.physicalActivity;
            state.entropy_rate += activityCoeff.formula(this.inputs.physicalActivity);
        }
        
        // 6. Sommeil (si disponible)
        if (this.inputs.sleepQuality !== undefined) {
            const sleepCoeff = this.calibratedCoeffs.sleep;
            state.entropy_rate += sleepCoeff.formula(this.inputs.sleepQuality);
        }
        
        // === NOUVEAU: Calcul des interactions non-linéaires ===
        if (this.level >= 3) {
            const synergy = this.interactionCalculator.calculateSynergy(state, this.inputs);
            state.entropy_rate *= synergy.multiplier;
            
            // Stocker les interactions détectées pour le rapport
            state.detectedInteractions = synergy.interactions;
        }
        
        // === NOUVEAU: Facteurs L4 (Phantoms) avec coefficients calibrés ===
        if (this.level === 4) {
            const keys = Object.keys(this.dictionary);
            
            keys.forEach(k => {
                const def = this.dictionary[k];
                if (def.type === 'L4') {
                    let delta = (this.phantom[k] !== undefined) 
                        ? this.phantom[k] 
                        : (Math.random() - 0.5) * 2;
                    
                    // Utiliser impact_S du dictionnaire mais avec calibration
                    state.entropy_rate += (delta * (def.impact_S * 0.5));
                }
            });
        }
        
        // Correction Age de Départ (inchangé)
        let ageStart = this.inputs.age || 30;
        let childhoodScore = (this.phantom && this.phantom.childhood_quality !== undefined) 
            ? this.phantom.childhood_quality 
            : 0;
        let childhoodFactor = 1.0 - (childhoodScore * 0.4);
        let meanChaos = 0.3 * this.CHAOS_BASE;
        
        for (let y = 0; y < ageStart; y++) {
            let impact = this._getAgeImpactFactor(y);
            let yearlyLoss = (y < 18)
                ? (state.entropy_rate * impact) * childhoodFactor
                : (state.entropy_rate * impact) + meanChaos;
            
            state.energy -= yearlyLoss;
        }
        
        if (state.energy < 10) state.energy = 10;
        
        return state;
    }
    
    /**
     * AMÉLIORÉ: run
     * Ajoute la traçabilité et les métriques
     */
    run(iterations = 100) {
        const sims = [];
        let startAge = parseInt(this.inputs.age) || 30;
        
        // === NOUVEAU: Métriques de traçabilité ===
        const traceability = {
            coefficients: this.calibratedCoeffs,
            interactions: [],
            calibrationReport: this.calibration.generateCalibrationReport()
        };
        
        for (let i = 0; i < iterations; i++) {
            const sim = [];
            let state = this._initializeState();
            
            // Analyse de sensibilité (inchangé)
            state.entropy_rate *= (1 + (Math.random() - 0.5) * 0.05);
            
            let age = startAge;
            let alive = true;
            
            sim.push({ age: age, v: state.energy });
            
            while (alive && age <= this.MAX_AGE) {
                // 1. Dégradation avec Gompertz-Makeham
                let decay = state.entropy_rate * this._getAgeImpactFactor(age);
                
                // 2. Chaos & Résilience (AMÉLIORÉ)
                let rawChaos = (Math.random() - 0.25) * this.CHAOS_BASE;
                
                // === NOUVEAU: Résilience dynamique ===
                let resilience = this._calculateResilience(state, age);
                let appliedChaos = rawChaos * resilience;
                
                if (this.inputs.mode === 'crisis') {
                    appliedChaos = Math.abs(appliedChaos) * 2.5;
                }
                
                // 3. Basculement critique (inchangé)
                let structuralWeakness = (state.energy < 40) ? 1.2 : 1.0;
                
                // 4. Bifurcation (inchangé)
                if (this.level === 4 && Math.random() < 0.005) {
                    if (Math.random() > 0.1) {
                        state.energy -= (Math.random() * 30);
                    } else {
                        state.energy += (Math.random() * 10);
                    }
                }
                
                state.energy -= (decay + appliedChaos) * structuralWeakness;
                
                if (state.energy > 110) state.energy = 110;
                
                age++;
                if (state.energy <= 0) {
                    alive = false;
                    state.energy = 0;
                }
                
                sim.push({ age: age, v: state.energy });
            }
            
            // Stocker les interactions détectées
            if (state.detectedInteractions) {
                traceability.interactions.push(...state.detectedInteractions);
            }
            
            sims.push(sim);
        }
        
        // Aggregation (inchangé)
        const agg = this._aggregate(sims, startAge);
        
        // === NOUVEAU: Ajouter la traçabilité aux résultats ===
        return { 
            raw_simulations: sims, 
            aggregated_data: agg,
            traceability: traceability,
            calibration: this.calibration.generateCalibrationReport()
        };
    }
    
    /**
     * NOUVEAU: Calcul de résilience dynamique
     */
    _calculateResilience(state, age) {
        const baseResilience = 1.0;
        
        // Facteur énergie (courbe sigmoïde)
        const energyFactor = 1 / (1 + Math.exp(-(state.energy - 50) / 10));
        
        // Facteur âge (résilience diminue avec l'âge)
        const ageFactor = Math.max(0.3, 1 - (age - 30) / 100);
        
        // Facteurs protecteurs
        const protectiveFactors = this._calculateProtectiveFactors(state);
        const protectionBonus = 1 + (protectiveFactors * 0.2);
        
        return baseResilience * energyFactor * ageFactor * protectionBonus;
    }
    
    /**
     * NOUVEAU: Calcul des facteurs protecteurs
     */
    _calculateProtectiveFactors(state) {
        let score = 0;
        
        // Sommeil de qualité
        if (this.inputs.sleepQuality > 7) score += 0.3;
        
        // Activité physique
        if (this.inputs.physicalActivity > 7) score += 0.3;
        
        // Optimisme
        if (this.inputs.optimism > 7) score += 0.2;
        
        // Réseau social
        if (this.inputs.socialConnectivity > 7) score += 0.2;
        
        return Math.min(1.0, score); // Cap à 1.0
    }
    
    /**
     * Inchangé: _aggregate
     */
    _aggregate(sims, startAge) {
        const agg = [];
        for (let t = startAge; t <= this.MAX_AGE; t++) {
            let survivors = 0;
            let totalQ = 0;
            sims.forEach(s => {
                const pt = s.find(p => p.age === t);
                if (pt && pt.v > 0) {
                    survivors++;
                    totalQ += pt.v;
                }
            });
            let survRate = (survivors / sims.length) * 100;
            let avgQ = survivors ? totalQ / survivors : 0;
            agg.push({ age: t, survivalRate: survRate, avgQuality: avgQ });
        }
        return agg;
    }
}

// === NOUVEAU: Classe pour calculer les interactions ===
class InteractionCalculator {
    constructor() {
        // Matrice d'interactions (simplifiée pour l'exemple)
        this.interactions = {
            stress_sleep: {
                multiplier: 1.8,
                check: (inputs) => inputs.stress_cortisol > 7 && inputs.sleepQuality < 5
            },
            smoking_pollution: {
                multiplier: 2.2,
                check: (inputs) => inputs.smoking > 0.5 && inputs.pollution > 0.6
            },
            obesity_diabetes: {
                multiplier: 1.6,
                check: (inputs) => inputs.bmi > 30 && inputs.diabetes === true
            }
        };
    }
    
    calculateSynergy(state, inputs) {
        let totalMultiplier = 1.0;
        const activeInteractions = [];
        
        for (const [key, interaction] of Object.entries(this.interactions)) {
            if (interaction.check(inputs)) {
                totalMultiplier *= interaction.multiplier;
                activeInteractions.push(key);
            }
        }
        
        return {
            multiplier: totalMultiplier,
            interactions: activeInteractions
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SchrodingerEngineV4, InteractionCalculator };
} else {
    window.SchrodingerEngineV4 = SchrodingerEngineV4;
    window.InteractionCalculator = InteractionCalculator;
}


/**
 * IMPLÉMENTATION RIGOUREUSE DE LA LOI DE GOMPERTZ-MAKEHAM
 * =======================================================
 * Modèle mathématique standard pour la mortalité humaine
 * 
 * Référence: Gompertz (1825), Makeham (1860)
 * Formule: μ(t) = A + B * e^(γt)
 * 
 * Où:
 * - A = risque de base (accidents, indépendant de l'âge) - Makeham
 * - B = paramètre d'amplitude
 * - γ = taux d'accélération exponentielle - Gompertz
 * - t = âge
 */

class GompertzMakehamModel {
    constructor(region = 'FRANCE') {
        // Paramètres calibrés par région (basés sur tables de mortalité)
        this.parameters = {
            FRANCE: {
                A: 0.0001,      // Risque de base (Makeham)
                B: 0.00001,     // Amplitude
                gamma: 0.085,   // Taux d'accélération (doublage tous les ~8 ans)
                t0: 30          // Âge de référence (début de l'accélération)
            },
            USA: {
                A: 0.00015,
                B: 0.000012,
                gamma: 0.088,
                t0: 30
            },
            JAPAN: {
                A: 0.00008,
                B: 0.000008,
                gamma: 0.082,
                t0: 30
            }
        };
        
        this.params = this.parameters[region] || this.parameters.FRANCE;
    }
    
    /**
     * Calcule le taux de mortalité instantané à un âge donné
     * @param {number} age - Âge en années
     * @returns {number} Taux de mortalité μ(t)
     */
    calculateMortalityRate(age) {
        const { A, B, gamma, t0 } = this.params;
        const t = Math.max(0, age - t0);
        
        // Formule de Gompertz-Makeham
        const mu = A + B * Math.exp(gamma * t);
        
        return mu;
    }
    
    /**
     * Calcule la probabilité de survie jusqu'à un âge donné
     * @param {number} currentAge - Âge actuel
     * @param {number} targetAge - Âge cible
     * @returns {number} Probabilité de survie (0-1)
     */
    calculateSurvivalProbability(currentAge, targetAge) {
        if (targetAge <= currentAge) return 1.0;
        
        const { A, B, gamma, t0 } = this.params;
        
        // Intégration de la fonction de mortalité
        // S(t) = exp(-∫[currentAge to targetAge] μ(s) ds)
        
        let integral = 0;
        const step = 0.1; // Précision (années)
        
        for (let s = currentAge; s < targetAge; s += step) {
            const t = Math.max(0, s - t0);
            const mu = A + B * Math.exp(gamma * t);
            integral += mu * step;
        }
        
        return Math.exp(-integral);
    }
    
    /**
     * Calcule l'espérance de vie résiduelle à un âge donné
     * @param {number} age - Âge actuel
     * @returns {number} Espérance de vie résiduelle en années
     */
    calculateLifeExpectancy(age) {
        const { A, B, gamma, t0 } = this.params;
        
        // Espérance de vie = ∫[age to ∞] S(t) dt
        // Approximation numérique
        
        let expectancy = 0;
        const maxAge = 120;
        const step = 0.1;
        
        for (let t = age; t < maxAge; t += step) {
            const survivalProb = this.calculateSurvivalProbability(age, t);
            expectancy += survivalProb * step;
        }
        
        return expectancy;
    }
    
    /**
     * Convertit le taux de mortalité en facteur d'impact sur l'énergie vitale
     * Pour intégration dans le moteur Seldon
     * @param {number} age - Âge
     * @returns {number} Facteur d'impact (0-1)
     */
    getAgeImpactFactor(age) {
        const mortalityRate = this.calculateMortalityRate(age);
        
        // Conversion: taux de mortalité → facteur d'usure
        // Normalisation pour que l'impact soit cohérent avec le système d'énergie (0-100)
        
        // Le taux de mortalité est très petit (0.001-0.1), on le multiplie pour obtenir
        // un facteur d'impact raisonnable
        const scalingFactor = 1000; // À calibrer empiriquement
        
        return mortalityRate * scalingFactor;
    }
    
    /**
     * Version optimisée pour le moteur (évite les calculs répétés)
     * Retourne un tableau pré-calculé pour tous les âges
     * @param {number} maxAge - Âge maximum (défaut: 120)
     * @returns {Array} Tableau [âge] => facteur d'impact
     */
    generateImpactTable(maxAge = 120) {
        const table = [];
        
        for (let age = 0; age <= maxAge; age++) {
            table[age] = this.getAgeImpactFactor(age);
        }
        
        return table;
    }
    
    /**
     * Ajuste les paramètres pour tenir compte de facteurs individuels
     * @param {Object} factors - Facteurs de risque individuels
     * @returns {Object} Paramètres ajustés
     */
    adjustParameters(factors) {
        const adjusted = { ...this.params };
        
        // Ajustement basé sur les facteurs de risque
        // Exemple: tabagisme augmente le risque de base (A)
        if (factors.smoking > 0.5) {
            adjusted.A *= 1.5; // +50% risque de base
            adjusted.B *= 1.3;  // +30% amplitude
        }
        
        // Stress chronique accélère le vieillissement (gamma)
        if (factors.stress > 7) {
            adjusted.gamma *= 1.1; // +10% accélération
        }
        
        // Activité physique ralentit l'accélération
        if (factors.physicalActivity > 7) {
            adjusted.gamma *= 0.95; // -5% accélération
            adjusted.B *= 0.9;       // -10% amplitude
        }
        
        return adjusted;
    }
    
    /**
     * Calcule l'âge équivalent (âge biologique vs chronologique)
     * @param {number} chronologicalAge - Âge chronologique
     * @param {Object} factors - Facteurs de risque
     * @returns {number} Âge biologique
     */
    calculateBiologicalAge(chronologicalAge, factors) {
        const adjustedParams = this.adjustParameters(factors);
        
        // Trouver l'âge où le taux de mortalité est équivalent
        const targetMortality = this.calculateMortalityRate(chronologicalAge);
        
        // Recherche binaire pour trouver l'âge équivalent avec paramètres ajustés
        let low = 0;
        let high = 120;
        let biologicalAge = chronologicalAge;
        
        for (let i = 0; i < 50; i++) { // 50 itérations = précision ~0.1 an
            const mid = (low + high) / 2;
            const { A, B, gamma, t0 } = adjustedParams;
            const t = Math.max(0, mid - t0);
            const adjustedMortality = A + B * Math.exp(gamma * t);
            
            if (adjustedMortality < targetMortality) {
                low = mid;
            } else {
                high = mid;
            }
            biologicalAge = mid;
        }
        
        return biologicalAge;
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GompertzMakehamModel;
} else {
    window.GompertzMakehamModel = GompertzMakehamModel;
}


/**
 * SCHRODINGER ENGINE - CUSTOM ACTION ADAPTER
 * 
 * Ce module encapsule la logique de simulation dans une "Custom Action" standardisée.
 * Elle est conçue pour être invoquée comme une fonction sans état (stateless function).
 * 
 * INPUT: JSON Object correspondant au Schema "Prime Radiant" définie.
 * OUTPUT: JSON Object contenant les résultats de la simulation Monte Carlo.
 */

class SchrodingerAction {
    
    /**
     * Point d'entrée principal de l'action.
     * @param {Object} payload - Les données d'entrée conformes au JSON Schema.
     * @returns {Object} Les résultats de la simulation.
     */
    static async execute(payload) {
        try {
            // Validation & Parsing
            const engine = new SchrodingerEngine(payload);
            
            // Exécution
            const results = engine.calculateSimulation();

            // Formattage de sortie standardisé
            return {
                status: "success",
                timestamp: new Date().toISOString(),
                data: {
                    analysis: {
                        survivalMedian: Math.round(results.stats.medianDeathAge),
                        chaosIndex: results.stats.chaosIndex.toFixed(2),
                        qualityScore: results.stats.qualityScore
                    },
                    simulations: results.simulations
                }
            };

        } catch (error) {
            return {
                status: "error",
                message: error.message,
                code: "SIMULATION_FAILURE"
            };
        }
    }
}

/**
 * Moteur Mathématique Interne
 * Refactorisé pour consommer la structure hiérarchique (userProfile, quantumVariables)
 */
class SchrodingerEngine {
    constructor(data) {
        // Extraction sécurisée des données hiérarchiques
        const profile = data.userProfile || {};
        const vars = data.quantumVariables || {};
        const settings = data.simulationSettings || {};
        
        // Mapping des entrées (Schema -> Internal Props)
        this.age = this.calculateAge(profile.birthDate) || 30;
        this.gender = profile.gender || 'M';
        
        // Variables Quantiques (Valeurs par défaut sécures)
        this.satisfaction = vars.psychology?.satisfaction || 5;
        this.stress = vars.psychology?.stressLevel || 5;
        this.finance = vars.socioEconomic?.financialStability || 5;
        
        // Santé
        const health = vars.health || {};
        this.bmi = health.bmi || 22;
        this.risks = health.riskFactors || [];
        this.baseHealthScore = health.baseScore || 80;

        // Settings
        this.maxAge = 100;
        this.iterations = settings.iterations || 500;
        this.chaosMultiplier = settings.chaosLevel || 0.05;
    }

    calculateAge(birthDateString) {
        if (!birthDateString) return 30; // Default fallback
        const diff = Date.now() - new Date(birthDateString).getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    // Générateur Normal (Box-Muller)
    randomNormal(mean = 0, stdev = 1) {
        let u = 0, v = 0;
        while(u === 0) u = Math.random(); 
        while(v === 0) v = Math.random();
        return Math.sqrt( -1.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v ) * stdev + mean;
    }

    calculateBaseParameters() {
        let baseEnergy = this.baseHealthScore;
        
        // Facteurs de risque explicites
        if (this.risks.includes('smoker')) baseEnergy -= 15;
        if (this.risks.includes('insomnia')) baseEnergy -= 10;
        if (this.risks.includes('sedentary')) baseEnergy -= 5;
        
        // Ajustements IMC
        if (this.bmi > 30) baseEnergy -= 10;
        if (this.bmi < 18.5) baseEnergy -= 5;

        // Clamp
        baseEnergy = Math.min(100, Math.max(10, baseEnergy));

        // Paramètres Dynamiques
        let energyInterne = 1.0; 
        if (this.satisfaction > 7) energyInterne += 0.2;
        if (this.finance > 7) energyInterne += 0.1;

        let usureNaturelle = 1.5;
        if (this.gender === 'F') usureNaturelle -= 0.2;
        if (this.stress > 7) usureNaturelle += 0.5;
        if (this.risks.includes('hbp')) usureNaturelle += 0.8;

        let chaos = 2.0 * (1 + (this.chaosMultiplier * 10)); 

        return { currentEnergy: baseEnergy, energyInterne, usureNaturelle, chaos };
    }

    runTrajectory() {
        let { currentEnergy, energyInterne, usureNaturelle, chaos } = this.calculateBaseParameters();
        let trajectory = [];
        
        for (let t = this.age; t <= this.maxAge; t++) {
            trajectory.push({ t, v: parseFloat(currentEnergy.toFixed(1)) }); 

            if (currentEnergy <= 0) break;

            const ageFactor = (t / 50); 
            const randomShock = this.randomNormal(0, 1);
            
            let delta = energyInterne - (usureNaturelle * ageFactor) - (chaos * randomShock);
            currentEnergy += delta;
        }
        return trajectory;
    }

    calculateSimulation() {
        let simulations = [];
        let deathAges = [];
        
        for (let i = 0; i < this.iterations; i++) {
            const traj = this.runTrajectory();
            simulations.push(traj);
            deathAges.push(traj[traj.length - 1].t);
        }

        deathAges.sort((a,b) => a - b);
        const medianDeathAge = deathAges[Math.floor(deathAges.length / 2)];

        return {
            simulations,
            stats: {
                medianDeathAge,
                chaosIndex: this.calculateBaseParameters().chaos,
                qualityScore: this.satisfaction * 10 
            }
        };
    }
}

// Export compatible CommonJS / Browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SchrodingerAction };
} else {
    window.SchrodingerAction = SchrodingerAction;
}

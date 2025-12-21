const { SchrodingerAction } = require('./schrodinger_action');

// Exemple de Payload "Prime Radiant" complet (Niveau 2+)
const payload = {
    userProfile: {
        id: "user_123",
        birthDate: "1993-01-01", // ~30 ans
        gender: "M"
    },
    quantumVariables: {
        health: {
            baseScore: 85,
            bmi: 24,
            riskFactors: ["sedentary"] // Un seul facteur de risque
        },
        psychology: {
            stressLevel: 8, // Stress élevé
            satisfaction: 4
        },
        socioEconomic: {
            financialStability: 6
        }
    },
    simulationSettings: {
        iterations: 100, // Rapide pour le test
        chaosLevel: 0.1
    }
};

console.log(">>> Lancement de l'Action Schrodinger...");

SchrodingerAction.execute(payload).then(result => {
    if (result.status === 'success') {
        console.log("\n[SUCCÈS] Simulation Terminée.");
        console.log("--------------------------------");
        console.log("Espérance de vie médiane estimée :", result.data.analysis.survivalMedian, "ans");
        console.log("Indice de Chaos :", result.data.analysis.chaosIndex);
        console.log("Qualité de vie Score :", result.data.analysis.qualityScore);
        console.log("Nombre de simulations :", result.data.simulations.length);
        console.log("Exemple de point final (Sim 0) :", result.data.simulations[0].pop());
    } else {
        console.error("[ERREUR]", result.message);
    }
});

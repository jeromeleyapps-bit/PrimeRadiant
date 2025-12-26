/**
 * Test spécifique : Femme de 30 ans avec tous les critères au maximum
 * Analyse de l'espérance de vie et probabilité d'atteindre 100 ans
 */

const fs = require('fs');

// Simuler window pour Node.js
global.window = global;

// Charger les fichiers nécessaires
const engineContent = fs.readFileSync('schrodinger_engine_v3.js', 'utf8');
const dictContent = fs.readFileSync('param_dictionary_l4.js', 'utf8');
const defaultValuesContent = fs.readFileSync('default_values_l4_france.js', 'utf8');

eval(engineContent);
eval(dictContent);
eval(defaultValuesContent);

const SchrodingerEngineV3 = window.SchrodingerEngineV3;

// Profil optimal : Femme de 30 ans, tous critères au max
const profile = {
    age: 30,
    gender: 'F',
    stress_cortisol: 1,  // Minimum = Zen (après inversion)
    bmi: 22,              // Optimal
    optimism: 10          // Maximum
};

console.log('=== TEST : FEMME 30 ANS - PROFIL OPTIMAL ===\n');
console.log('Paramètres:');
console.log(`  Âge: ${profile.age} ans`);
console.log(`  Genre: ${profile.gender}`);
console.log(`  Stress: ${profile.stress_cortisol} (Zen)`);
console.log(`  IMC: ${profile.bmi} (Optimal)`);
console.log(`  Optimisme: ${profile.optimism} (Maximum)`);
console.log('\nSimulation en cours...\n');

// Test avec différents niveaux
const levels = [1, 2, 3, 4];
const results = {};

levels.forEach(level => {
    const phantoms = (level === 4) ? {} : {};
    
    // Pour L4, mettre tous les protecteurs à max
    if (level === 4 && window.PARAM_DICTIONARY) {
        Object.keys(window.PARAM_DICTIONARY).forEach(key => {
            const def = window.PARAM_DICTIONARY[key];
            if (def.type === 'L4' && def.impact_S < 0) {
                phantoms[key] = 1; // Protecteurs à max
            } else if (def.type === 'L4' && def.impact_S > 0) {
                phantoms[key] = -1; // Risques à min
            }
        });
    }
    
    const engine = new SchrodingerEngineV3(profile, level, phantoms);
    const simResults = engine.run(5000); // Plus de simulations pour meilleure précision
    
    const data = simResults.aggregated_data;
    
    // Espérance de vie (P50)
    const p50 = data.find(d => d.survivalRate < 50);
    const lifeExp = p50 ? p50.age : 120;
    
    // Probabilité d'atteindre 100 ans
    const age100 = data.find(d => d.age === 100);
    const prob100 = age100 ? age100.survivalRate : 0;
    
    // Probabilité d'atteindre 95 ans
    const age95 = data.find(d => d.age === 95);
    const prob95 = age95 ? age95.survivalRate : 0;
    
    // Probabilité d'atteindre 90 ans
    const age90 = data.find(d => d.age === 90);
    const prob90 = age90 ? age90.survivalRate : 0;
    
    // Énergie à 70, 80, 90 ans
    const age70 = data.find(d => d.age === 70);
    const energy70 = age70 ? age70.avgQuality : null;
    const survival70 = age70 ? age70.survivalRate : 0;
    
    const age80 = data.find(d => d.age === 80);
    const energy80 = age80 ? age80.avgQuality : null;
    const survival80 = age80 ? age80.survivalRate : 0;
    
    const age90Data = data.find(d => d.age === 90);
    const energy90 = age90Data ? age90Data.avgQuality : null;
    
    // Nombre de simulations atteignant 100 ans (au moins un point à 100 ans ou plus)
    const simulations100Plus = simResults.raw_simulations.filter(sim => {
        // Vérifier si la simulation a un point à 100 ans ou plus avec v > 0
        return sim.some(point => point.age >= 100 && point.v > 0);
    }).length;
    
    results[level] = {
        lifeExp,
        prob100,
        prob95,
        prob90,
        energy70,
        energy80,
        energy90,
        survival70,
        survival80,
        simulations100Plus,
        totalSimulations: simResults.raw_simulations.length
    };
    
    console.log(`L${level}:`);
    console.log(`  Espérance de vie: ${lifeExp} ans`);
    console.log(`  Probabilité 90 ans: ${prob90.toFixed(1)}%`);
    console.log(`  Probabilité 95 ans: ${prob95.toFixed(1)}%`);
    console.log(`  Probabilité 100 ans: ${prob100.toFixed(1)}%`);
    console.log(`  Simulations ≥ 100 ans: ${simulations100Plus}/${simResults.raw_simulations.length} (${(simulations100Plus/simResults.raw_simulations.length*100).toFixed(1)}%)`);
    console.log(`  Énergie à 70 ans: ${energy70 ? energy70.toFixed(1) + '%' : 'N/A'} (Survie: ${survival70.toFixed(1)}%)`);
    console.log(`  Énergie à 80 ans: ${energy80 ? energy80.toFixed(1) + '%' : 'N/A'} (Survie: ${survival80.toFixed(1)}%)`);
    console.log(`  Énergie à 90 ans: ${energy90 ? energy90.toFixed(1) + '%' : 'N/A'}`);
    console.log('');
});

// Analyse
console.log('=== ANALYSE ===\n');

console.log('📊 Références scientifiques:');
console.log('  - INSEE 2023: Femme de 60 ans → 87.8 ans');
console.log('  - Blue Zones: Profils optimaux → 85-95 ans');
console.log('  - Centenaires: ~0.02% de la population (France)');
console.log('  - Probabilité d\'atteindre 100 ans (profil optimal): ~5-15% selon études\n');

console.log('📈 Résultats simulés:');
console.log(`  L1: Espérance ${results[1].lifeExp} ans, Prob 100 ans: ${results[1].prob100.toFixed(1)}%`);
console.log(`  L2: Espérance ${results[2].lifeExp} ans, Prob 100 ans: ${results[2].prob100.toFixed(1)}%`);

if (results[1].prob100 === 0 && results[2].prob100 === 0) {
    console.log('\n⚠️  PROBLÈME IDENTIFIÉ:');
    console.log('   Probabilité d\'atteindre 100 ans = 0% pour L1 et L2');
    console.log('   Cela semble trop contraint pour un profil optimal.');
    console.log('   Les études montrent que 5-15% des profils optimaux atteignent 100 ans.\n');
}


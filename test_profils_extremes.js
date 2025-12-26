/**
 * Test des profils extrêmes pour vérifier la cohérence et le réalisme
 * Teste : Min, Médian, Max pour chaque niveau L1, L2, L3, L4
 */

const fs = require('fs');

// Simuler window pour Node.js
global.window = global;

// Charger les fichiers nécessaires
const engineContent = fs.readFileSync('schrodinger_engine_v3.js', 'utf8');
const dictContent = fs.readFileSync('param_dictionary_l4.js', 'utf8');
const defaultValuesContent = fs.readFileSync('default_values_l4_france.js', 'utf8');

// Évaluer les fichiers
eval(engineContent);
eval(dictContent);
eval(defaultValuesContent);

// Utiliser la classe du moteur directement
const SchrodingerEngineV3 = window.SchrodingerEngineV3;

// Fonction pour créer un profil
function createProfile(name, level, age, gender, inputs, phantoms) {
    return {
        name,
        level,
        age,
        gender,
        inputs,
        phantoms: phantoms || {}
    };
}

// Fonction pour tester un profil
function testProfile(profile, iterations = 2000) {
    const engine = new SchrodingerEngineV3(profile.inputs, profile.level, profile.phantoms);
    const results = engine.run(iterations);
    
    const data = results.aggregated_data;
    const p50 = data.find(d => d.survivalRate < 50);
    const lifeExp = p50 ? p50.age : 120;
    
    const age70 = data.find(d => d.age === 70);
    const energy70 = age70 ? age70.avgQuality : null;
    const survival70 = age70 ? age70.survivalRate : 0;
    
    const age80 = data.find(d => d.age === 80);
    const survival80 = age80 ? age80.survivalRate : 0;
    
    return {
        lifeExp,
        energy70,
        survival70,
        survival80
    };
}

// Créer les profils de test
const profiles = [];

// L1 - Profils
profiles.push(createProfile('L1 - MIN', 1, 30, 'M', {
    age: 30,
    gender: 'M',
    stress_cortisol: 10,
    bmi: 35,
    optimism: 1
}));

profiles.push(createProfile('L1 - MEDIAN', 1, 30, 'M', {
    age: 30,
    gender: 'M',
    stress_cortisol: 5,
    bmi: 25,
    optimism: 5
}));

profiles.push(createProfile('L1 - MAX', 1, 30, 'M', {
    age: 30,
    gender: 'M',
    stress_cortisol: 1,
    bmi: 22,
    optimism: 10
}));

// L2 - Profils (même structure que L1 mais avec plus de détails)
profiles.push(createProfile('L2 - MIN', 2, 30, 'M', {
    age: 30,
    gender: 'M',
    stress_cortisol: 10,
    bmi: 35,
    optimism: 1
}));

profiles.push(createProfile('L2 - MEDIAN', 2, 30, 'M', {
    age: 30,
    gender: 'M',
    stress_cortisol: 5,
    bmi: 25,
    optimism: 5
}));

profiles.push(createProfile('L2 - MAX', 2, 30, 'M', {
    age: 30,
    gender: 'M',
    stress_cortisol: 1,
    bmi: 22,
    optimism: 10
}));

// L3 - Profils (identique à L2)
profiles.push(createProfile('L3 - MIN', 3, 30, 'M', {
    age: 30,
    gender: 'M',
    stress_cortisol: 10,
    bmi: 35,
    optimism: 1
}));

profiles.push(createProfile('L3 - MEDIAN', 3, 30, 'M', {
    age: 30,
    gender: 'M',
    stress_cortisol: 5,
    bmi: 25,
    optimism: 5
}));

profiles.push(createProfile('L3 - MAX', 3, 30, 'M', {
    age: 30,
    gender: 'M',
    stress_cortisol: 1,
    bmi: 22,
    optimism: 10
}));

// L4 - Profils avec phantoms
const phantomsMin = {};
const phantomsMax = {};
const phantomsMedian = {};

if (window.PARAM_DICTIONARY && window.DEFAULT_VALUES_FRANCE) {
    Object.keys(window.PARAM_DICTIONARY).forEach(key => {
        const def = window.PARAM_DICTIONARY[key];
        if (def.type === 'L4') {
            // MIN : tous les risques à max, tous les protecteurs à min
            if (def.impact_S > 0) {
                phantomsMin[key] = 1; // Risques à max
            } else {
                phantomsMin[key] = -1; // Protecteurs à min
            }
            
            // MAX : tous les risques à min, tous les protecteurs à max
            if (def.impact_S > 0) {
                phantomsMax[key] = -1; // Risques à min
            } else {
                phantomsMax[key] = 1; // Protecteurs à max
            }
            
            // MEDIAN : valeurs par défaut
            phantomsMedian[key] = window.DEFAULT_VALUES_FRANCE[key] !== undefined 
                ? window.DEFAULT_VALUES_FRANCE[key] 
                : 0;
        }
    });
}

profiles.push(createProfile('L4 - MIN', 4, 30, 'M', {
    age: 30,
    gender: 'M',
    stress_cortisol: 10,
    bmi: 35,
    optimism: 1
}, phantomsMin));

profiles.push(createProfile('L4 - MEDIAN', 4, 30, 'M', {
    age: 30,
    gender: 'M',
    stress_cortisol: 5,
    bmi: 25,
    optimism: 5
}, phantomsMedian));

profiles.push(createProfile('L4 - MAX', 4, 30, 'M', {
    age: 30,
    gender: 'M',
    stress_cortisol: 1,
    bmi: 22,
    optimism: 10
}, phantomsMax));

// Exécuter les tests
console.log('=== TEST DES PROFILS EXTRÊMES ===\n');
console.log('Test de cohérence et réalisme pour chaque niveau\n');
console.log('Calcul en cours...\n');

const results = {};

profiles.forEach(profile => {
    process.stdout.write(`Test: ${profile.name}... `);
    const result = testProfile(profile, 2000);
    results[profile.name] = result;
    console.log(`✅ ${result.lifeExp} ans`);
});

// Analyse de cohérence
console.log('\n\n=== ANALYSE DE COHÉRENCE ===\n');

const levels = ['L1', 'L2', 'L3', 'L4'];
levels.forEach(level => {
    const min = results[`${level} - MIN`];
    const median = results[`${level} - MEDIAN`];
    const max = results[`${level} - MAX`];
    
    console.log(`${level}:`);
    console.log(`  MIN: ${min.lifeExp} ans`);
    console.log(`  MEDIAN: ${median.lifeExp} ans`);
    console.log(`  MAX: ${max.lifeExp} ans`);
    
    const isCoherent = min.lifeExp < median.lifeExp && median.lifeExp < max.lifeExp;
    const diffMinMedian = median.lifeExp - min.lifeExp;
    const diffMedianMax = max.lifeExp - median.lifeExp;
    
    console.log(`  ${isCoherent ? '✅' : '❌'} Cohérence: ${isCoherent ? 'OUI' : 'NON'}`);
    console.log(`  Écart MIN→MEDIAN: ${diffMinMedian.toFixed(1)} ans`);
    console.log(`  Écart MEDIAN→MAX: ${diffMedianMax.toFixed(1)} ans`);
    
    if (!isCoherent) {
        console.log(`  ⚠️  PROBLÈME: L'ordre n'est pas respecté !`);
    }
});

// Analyse de réalisme
console.log('\n\n=== ANALYSE DE RÉALISME ===\n');

console.log('Espérance de vie en France (INSEE 2023):');
console.log('  Homme: ~80 ans');
console.log('  Femme: ~85 ans\n');

levels.forEach(level => {
    const min = results[`${level} - MIN`];
    const max = results[`${level} - MAX`];
    
    console.log(`${level}:`);
    const minStatus = min.lifeExp < 70 ? '❌ Très pessimiste' : min.lifeExp < 75 ? '⚠️  Pessimiste' : '✅ Réaliste';
    const maxStatus = max.lifeExp > 100 ? '❌ Très optimiste' : max.lifeExp > 95 ? '⚠️  Optimiste' : '✅ Réaliste';
    
    console.log(`  Profil MIN: ${min.lifeExp} ans (${minStatus})`);
    console.log(`  Profil MAX: ${max.lifeExp} ans (${maxStatus})`);
    
    if (max.lifeExp < 85) {
        console.log(`  ⚠️  PROBLÈME: Le profil MAX devrait être > 85 ans (profil optimal)`);
    }
    if (min.lifeExp > 75) {
        console.log(`  ⚠️  PROBLÈME: Le profil MIN devrait être < 75 ans (profil à risque)`);
    }
});

// Résumé
console.log('\n\n=== RÉSUMÉ ===\n');

const l1Max = results['L1 - MAX'];
const l4Max = results['L4 - MAX'];

console.log(`L1 MAX (tout au top): ${l1Max.lifeExp} ans`);
console.log(`L4 MAX (tout au top + phantoms): ${l4Max.lifeExp} ans`);
console.log(`\nDifférence L1→L4: ${(l4Max.lifeExp - l1Max.lifeExp).toFixed(1)} ans`);

if (l1Max.lifeExp < 85) {
    console.log(`\n⚠️  PROBLÈME IDENTIFIÉ:`);
    console.log(`   Le profil L1 MAX (tout au top) donne ${l1Max.lifeExp} ans, ce qui est trop pessimiste.`);
    console.log(`   Un profil optimal devrait donner au moins 85-90 ans.`);
    console.log(`\n   Causes possibles:`);
    console.log(`   - Dégradation Gompertz trop forte (facteur 9000)`);
    console.log(`   - Coefficients d'entropie trop élevés`);
    console.log(`   - Chaos de base trop important`);
    console.log(`   - Dégradation depuis l'âge 0 trop importante`);
}

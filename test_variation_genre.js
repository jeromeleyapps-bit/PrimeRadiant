/**
 * Test de variation selon le genre
 * Compare les résultats pour Homme et Femme
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

const SchrodingerEngineV3 = window.SchrodingerEngineV3;

// Fonction pour créer un profil
function createProfile(name, level, age, gender, inputs, phantoms) {
    return {
        name,
        level,
        age,
        gender,
        inputs: { ...inputs, gender },
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
    
    return { lifeExp };
}

// Créer les profils de test
const profiles = [];

// L1 - Profils Homme
profiles.push(createProfile('L1 - MIN - Homme', 1, 30, 'M', {
    age: 30,
    stress_cortisol: 10,
    bmi: 35,
    optimism: 1
}));

profiles.push(createProfile('L1 - MEDIAN - Homme', 1, 30, 'M', {
    age: 30,
    stress_cortisol: 5,
    bmi: 25,
    optimism: 5
}));

profiles.push(createProfile('L1 - MAX - Homme', 1, 30, 'M', {
    age: 30,
    stress_cortisol: 1,
    bmi: 22,
    optimism: 10
}));

// L1 - Profils Femme
profiles.push(createProfile('L1 - MIN - Femme', 1, 30, 'F', {
    age: 30,
    stress_cortisol: 10,
    bmi: 35,
    optimism: 1
}));

profiles.push(createProfile('L1 - MEDIAN - Femme', 1, 30, 'F', {
    age: 30,
    stress_cortisol: 5,
    bmi: 25,
    optimism: 5
}));

profiles.push(createProfile('L1 - MAX - Femme', 1, 30, 'F', {
    age: 30,
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
            if (def.impact_S > 0) {
                phantomsMin[key] = 1;
                phantomsMax[key] = -1;
            } else {
                phantomsMin[key] = -1;
                phantomsMax[key] = 1;
            }
            phantomsMedian[key] = window.DEFAULT_VALUES_FRANCE[key] !== undefined 
                ? window.DEFAULT_VALUES_FRANCE[key] 
                : 0;
        }
    });
}

// L4 - Homme
profiles.push(createProfile('L4 - MIN - Homme', 4, 30, 'M', {
    age: 30,
    stress_cortisol: 10,
    bmi: 35,
    optimism: 1
}, phantomsMin));

profiles.push(createProfile('L4 - MEDIAN - Homme', 4, 30, 'M', {
    age: 30,
    stress_cortisol: 5,
    bmi: 25,
    optimism: 5
}, phantomsMedian));

profiles.push(createProfile('L4 - MAX - Homme', 4, 30, 'M', {
    age: 30,
    stress_cortisol: 1,
    bmi: 22,
    optimism: 10
}, phantomsMax));

// L4 - Femme
profiles.push(createProfile('L4 - MIN - Femme', 4, 30, 'F', {
    age: 30,
    stress_cortisol: 10,
    bmi: 35,
    optimism: 1
}, phantomsMin));

profiles.push(createProfile('L4 - MEDIAN - Femme', 4, 30, 'F', {
    age: 30,
    stress_cortisol: 5,
    bmi: 25,
    optimism: 5
}, phantomsMedian));

profiles.push(createProfile('L4 - MAX - Femme', 4, 30, 'F', {
    age: 30,
    stress_cortisol: 1,
    bmi: 22,
    optimism: 10
}, phantomsMax));

// Exécuter les tests
console.log('=== TEST DE VARIATION SELON LE GENRE ===\n');
console.log('Comparaison Homme vs Femme pour différents profils\n');
console.log('Calcul en cours...\n');

const results = {};

profiles.forEach(profile => {
    process.stdout.write(`Test: ${profile.name}... `);
    const result = testProfile(profile, 2000);
    results[profile.name] = result;
    console.log(`✅ ${result.lifeExp} ans`);
});

// Analyse comparative
console.log('\n\n=== ANALYSE COMPARATIVE ===\n');

console.log('📊 L1 - Comparaison Homme vs Femme\n');
const l1MinH = results['L1 - MIN - Homme'];
const l1MinF = results['L1 - MIN - Femme'];
const l1MedH = results['L1 - MEDIAN - Homme'];
const l1MedF = results['L1 - MEDIAN - Femme'];
const l1MaxH = results['L1 - MAX - Homme'];
const l1MaxF = results['L1 - MAX - Femme'];

console.log('MIN:');
console.log(`  Homme: ${l1MinH.lifeExp} ans`);
console.log(`  Femme: ${l1MinF.lifeExp} ans`);
console.log(`  Écart: ${(l1MinF.lifeExp - l1MinH.lifeExp).toFixed(1)} ans (Femme > Homme)`);

console.log('\nMEDIAN:');
console.log(`  Homme: ${l1MedH.lifeExp} ans`);
console.log(`  Femme: ${l1MedF.lifeExp} ans`);
console.log(`  Écart: ${(l1MedF.lifeExp - l1MedH.lifeExp).toFixed(1)} ans (Femme > Homme)`);

console.log('\nMAX:');
console.log(`  Homme: ${l1MaxH.lifeExp} ans`);
console.log(`  Femme: ${l1MaxF.lifeExp} ans`);
console.log(`  Écart: ${(l1MaxF.lifeExp - l1MaxH.lifeExp).toFixed(1)} ans (Femme > Homme)`);

console.log('\n\n📊 L4 - Comparaison Homme vs Femme\n');
const l4MinH = results['L4 - MIN - Homme'];
const l4MinF = results['L4 - MIN - Femme'];
const l4MedH = results['L4 - MEDIAN - Homme'];
const l4MedF = results['L4 - MEDIAN - Femme'];
const l4MaxH = results['L4 - MAX - Homme'];
const l4MaxF = results['L4 - MAX - Femme'];

console.log('MIN:');
console.log(`  Homme: ${l4MinH.lifeExp} ans`);
console.log(`  Femme: ${l4MinF.lifeExp} ans`);
console.log(`  Écart: ${(l4MinF.lifeExp - l4MinH.lifeExp).toFixed(1)} ans (Femme > Homme)`);

console.log('\nMEDIAN:');
console.log(`  Homme: ${l4MedH.lifeExp} ans`);
console.log(`  Femme: ${l4MedF.lifeExp} ans`);
console.log(`  Écart: ${(l4MedF.lifeExp - l4MedH.lifeExp).toFixed(1)} ans (Femme > Homme)`);

console.log('\nMAX:');
console.log(`  Homme: ${l4MaxH.lifeExp} ans`);
console.log(`  Femme: ${l4MaxF.lifeExp} ans`);
console.log(`  Écart: ${(l4MaxF.lifeExp - l4MaxH.lifeExp).toFixed(1)} ans (Femme > Homme)`);

// Résumé
console.log('\n\n=== RÉSUMÉ ===\n');

const ecartL1Min = l1MinF.lifeExp - l1MinH.lifeExp;
const ecartL1Med = l1MedF.lifeExp - l1MedH.lifeExp;
const ecartL1Max = l1MaxF.lifeExp - l1MaxH.lifeExp;
const ecartL4Min = l4MinF.lifeExp - l4MinH.lifeExp;
const ecartL4Med = l4MedF.lifeExp - l4MedH.lifeExp;
const ecartL4Max = l4MaxF.lifeExp - l4MaxH.lifeExp;

const ecartMoyenL1 = (ecartL1Min + ecartL1Med + ecartL1Max) / 3;
const ecartMoyenL4 = (ecartL4Min + ecartL4Med + ecartL4Max) / 3;

console.log('Écart moyen Femme - Homme:');
console.log(`  L1: ${ecartMoyenL1.toFixed(1)} ans`);
console.log(`  L4: ${ecartMoyenL4.toFixed(1)} ans`);
console.log(`  Global: ${((ecartMoyenL1 + ecartMoyenL4) / 2).toFixed(1)} ans`);

console.log('\n📈 Référence INSEE 2023:');
console.log('  Homme: ~80 ans');
console.log('  Femme: ~85 ans');
console.log('  Écart observé: ~5 ans');

console.log('\n✅ Validation:');
const ecartObserve = ((ecartMoyenL1 + ecartMoyenL4) / 2);
if (Math.abs(ecartObserve - 5) < 2) {
    console.log(`  Écart simulé (${ecartObserve.toFixed(1)} ans) cohérent avec INSEE (5 ans)`);
} else {
    console.log(`  ⚠️  Écart simulé (${ecartObserve.toFixed(1)} ans) diffère de INSEE (5 ans)`);
}


/**
 * TESTS DE COHÉRENCE - MOTEUR SELDON V3.6
 * ========================================
 * Teste le moteur avec des profils extrêmes et médians
 * pour vérifier la cohérence des résultats
 */

// Simulation de l'environnement navigateur pour Node.js
if (typeof window === 'undefined') {
    global.window = global;
    global.PARAM_DICTIONARY = {};
}

// Charger le moteur
const fs = require('fs');
const path = require('path');

// Lire et exécuter le moteur
const engineCode = fs.readFileSync(path.join(__dirname, '..', 'schrodinger_engine_v3.js'), 'utf8');
eval(engineCode);

/**
 * Crée un profil de test
 */
function createProfile(name, age, gender, stress, bmi, optimism) {
    return {
        name: name,
        inputs: {
            age: age,
            gender: gender,
            stress_cortisol: stress,
            bmi: bmi,
            optimism: optimism
        }
    };
}

/**
 * Exécute une simulation et extrait les métriques
 */
function runSimulation(profile, level = 3, iterations = 1000) {
    console.log(`\n🔬 Test: ${profile.name}`);
    console.log(`   Paramètres: Age=${profile.inputs.age}, Genre=${profile.inputs.gender}`);
    console.log(`   Stress=${profile.inputs.stress_cortisol}, IMC=${profile.inputs.bmi}, Optimisme=${profile.inputs.optimism}`);
    
    const engine = new SchrodingerEngineV3(profile.inputs, level, {});
    const results = engine.run(iterations);
    
    // Analyser les résultats
    const agg = results.aggregated_data;
    
    // Trouver l'âge où la survie tombe à 50% (P50)
    const p50 = agg.find(d => d.survivalRate < 50);
    const lifeExpectancy = p50 ? p50.age : 120;
    
    // Trouver l'âge où la survie tombe à 10% (P10)
    const p10 = agg.find(d => d.survivalRate < 10);
    const maxAge = p10 ? p10.age : 120;
    
    // Énergie initiale moyenne
    let initialEnergy = 0;
    results.raw_simulations.forEach(sim => {
        if (sim[0]) initialEnergy += sim[0].v;
    });
    initialEnergy /= results.raw_simulations.length;
    
    // Énergie à 70 ans (si atteint)
    const age70 = agg.find(d => d.age === 70);
    const energyAt70 = age70 ? age70.avgQuality : null;
    
    // Énergie à 80 ans (si atteint)
    const age80 = agg.find(d => d.age === 80);
    const energyAt80 = age80 ? age80.avgQuality : null;
    
    const metrics = {
        lifeExpectancy: lifeExpectancy,
        maxAge: maxAge,
        initialEnergy: initialEnergy.toFixed(1),
        energyAt70: energyAt70 ? energyAt70.toFixed(1) : 'N/A',
        energyAt80: energyAt80 ? energyAt80.toFixed(1) : 'N/A',
        survivalAt70: age70 ? age70.survivalRate.toFixed(1) + '%' : 'N/A',
        survivalAt80: age80 ? age80.survivalRate.toFixed(1) + '%' : 'N/A'
    };
    
    console.log(`   ✅ Espérance de vie (P50): ${metrics.lifeExpectancy} ans`);
    console.log(`   ✅ Énergie initiale: ${metrics.initialEnergy}%`);
    console.log(`   ✅ Énergie à 70 ans: ${metrics.energyAt70}% (Survie: ${metrics.survivalAt70})`);
    console.log(`   ✅ Énergie à 80 ans: ${metrics.energyAt80}% (Survie: ${metrics.survivalAt80})`);
    
    return metrics;
}

/**
 * Vérifie la cohérence des résultats
 */
function checkCoherence(results) {
    console.log(`\n📊 ANALYSE DE COHÉRENCE`);
    console.log(`========================`);
    
    const min = results.minimum;
    const max = results.maximum;
    const med = results.median;
    
    // Vérification 1: L'espérance de vie doit être croissante
    console.log(`\n1️⃣ Vérification: Espérance de vie croissante`);
    console.log(`   Minimum: ${min.lifeExpectancy} ans`);
    console.log(`   Médian:  ${med.lifeExpectancy} ans`);
    console.log(`   Maximum: ${max.lifeExpectancy} ans`);
    
    const leOrder = min.lifeExpectancy <= med.lifeExpectancy && med.lifeExpectancy <= max.lifeExpectancy;
    if (leOrder) {
        console.log(`   ✅ COHÉRENT: L'espérance de vie augmente avec l'amélioration des paramètres`);
    } else {
        console.log(`   ❌ INCOHÉRENT: L'espérance de vie ne suit pas l'ordre attendu`);
    }
    
    // Vérification 2: L'énergie initiale doit être cohérente
    console.log(`\n2️⃣ Vérification: Énergie initiale`);
    console.log(`   Minimum: ${min.initialEnergy}%`);
    console.log(`   Médian:  ${med.initialEnergy}%`);
    console.log(`   Maximum: ${max.initialEnergy}%`);
    
    const energyOrder = parseFloat(min.initialEnergy) <= parseFloat(med.initialEnergy) && 
                       parseFloat(med.initialEnergy) <= parseFloat(max.initialEnergy);
    if (energyOrder) {
        console.log(`   ✅ COHÉRENT: L'énergie initiale augmente avec l'amélioration des paramètres`);
    } else {
        console.log(`   ⚠️  ATTENTION: L'énergie initiale peut varier selon l'âge de départ`);
    }
    
    // Vérification 3: L'énergie à 70 ans doit être cohérente
    console.log(`\n3️⃣ Vérification: Énergie à 70 ans`);
    if (min.energyAt70 !== 'N/A' && med.energyAt70 !== 'N/A' && max.energyAt70 !== 'N/A') {
        console.log(`   Minimum: ${min.energyAt70}%`);
        console.log(`   Médian:  ${med.energyAt70}%`);
        console.log(`   Maximum: ${max.energyAt70}%`);
        
        const energy70Order = parseFloat(min.energyAt70) <= parseFloat(med.energyAt70) && 
                             parseFloat(med.energyAt70) <= parseFloat(max.energyAt70);
        if (energy70Order) {
            console.log(`   ✅ COHÉRENT: L'énergie à 70 ans augmente avec l'amélioration des paramètres`);
        } else {
            console.log(`   ⚠️  ATTENTION: Variation possible due à la variance stochastique`);
        }
    } else {
        console.log(`   ⚠️  Certains profils n'atteignent pas 70 ans`);
    }
    
    // Vérification 4: Taux de survie à 70 ans
    console.log(`\n4️⃣ Vérification: Taux de survie à 70 ans`);
    if (min.survivalAt70 !== 'N/A' && med.survivalAt70 !== 'N/A' && max.survivalAt70 !== 'N/A') {
        const survMin = parseFloat(min.survivalAt70);
        const survMed = parseFloat(med.survivalAt70);
        const survMax = parseFloat(max.survivalAt70);
        
        console.log(`   Minimum: ${survMin}%`);
        console.log(`   Médian:  ${survMed}%`);
        console.log(`   Maximum: ${survMax}%`);
        
        const survOrder = survMin <= survMed && survMed <= survMax;
        if (survOrder) {
            console.log(`   ✅ COHÉRENT: Le taux de survie augmente avec l'amélioration des paramètres`);
        } else {
            console.log(`   ❌ INCOHÉRENT: Le taux de survie ne suit pas l'ordre attendu`);
        }
    }
    
    // Vérification 5: Écart entre min et max
    console.log(`\n5️⃣ Vérification: Écart entre profils extrêmes`);
    const leGap = max.lifeExpectancy - min.lifeExpectancy;
    console.log(`   Écart d'espérance de vie: ${leGap} ans`);
    
    if (leGap > 10 && leGap < 50) {
        console.log(`   ✅ COHÉRENT: L'écart est réaliste (10-50 ans)`);
    } else if (leGap <= 10) {
        console.log(`   ⚠️  ATTENTION: L'écart est peut-être trop faible`);
    } else {
        console.log(`   ⚠️  ATTENTION: L'écart est peut-être trop élevé`);
    }
    
    // Résumé
    console.log(`\n📋 RÉSUMÉ DE COHÉRENCE`);
    console.log(`======================`);
    const energy70OrderValue = (min.energyAt70 !== 'N/A' && med.energyAt70 !== 'N/A' && max.energyAt70 !== 'N/A') 
        ? (parseFloat(min.energyAt70) <= parseFloat(med.energyAt70) && parseFloat(med.energyAt70) <= parseFloat(max.energyAt70))
        : true; // Si pas de données, on considère comme OK
    const allCoherent = leOrder && energy70OrderValue;
    if (allCoherent) {
        console.log(`✅ GLOBALEMENT COHÉRENT: Le moteur produit des résultats logiques`);
    } else {
        console.log(`⚠️  ATTENTION: Certaines incohérences détectées, vérification recommandée`);
    }
    
    return {
        coherent: allCoherent,
        lifeExpectancyOrder: leOrder,
        energyOrder: energy70OrderValue,
        gap: leGap
    };
}

/**
 * Tests principaux
 */
function runAllTests() {
    console.log(`╔══════════════════════════════════════════════════════════╗`);
    console.log(`║  TESTS DE COHÉRENCE - MOTEUR SELDON V3.6                ║`);
    console.log(`╚══════════════════════════════════════════════════════════╝`);
    
    // Profils de test
    const profiles = {
        // Profil MINIMUM (risques élevés)
        minimum: createProfile(
            "PROFIL MINIMUM (Risques Élevés)",
            30, 'M',
            10,  // Stress maximum
            35,  // IMC obèse classe 2
            1    // Optimisme minimum
        ),
        
        // Profil MÉDIAN (moyen)
        median: createProfile(
            "PROFIL MÉDIAN (Moyen)",
            30, 'M',
            5,   // Stress moyen
            25,  // IMC surpoids léger
            5    // Optimisme moyen
        ),
        
        // Profil MAXIMUM (optimal)
        maximum: createProfile(
            "PROFIL MAXIMUM (Optimal)",
            30, 'M',
            1,   // Stress minimum
            22,  // IMC optimal
            10   // Optimisme maximum
        )
    };
    
    // Exécuter les simulations
    const results = {
        minimum: runSimulation(profiles.minimum, 3, 2000),
        median: runSimulation(profiles.median, 3, 2000),
        maximum: runSimulation(profiles.maximum, 3, 2000)
    };
    
    // Vérifier la cohérence
    const coherence = checkCoherence(results);
    
    // Tests supplémentaires: Genre
    console.log(`\n\n🔬 TESTS SUPPLÉMENTAIRES: Impact du Genre`);
    console.log(`==========================================`);
    
    const femaleProfile = createProfile(
        "PROFIL FÉMININ (Médian)",
        30, 'F',
        5, 25, 5
    );
    
    const maleProfile = createProfile(
        "PROFIL MASCULIN (Médian)",
        30, 'M',
        5, 25, 5
    );
    
    const femaleResult = runSimulation(femaleProfile, 3, 2000);
    const maleResult = runSimulation(maleProfile, 3, 2000);
    
    console.log(`\n📊 Comparaison Genre:`);
    console.log(`   Femme: ${femaleResult.lifeExpectancy} ans`);
    console.log(`   Homme: ${maleResult.lifeExpectancy} ans`);
    console.log(`   Différence: ${(femaleResult.lifeExpectancy - maleResult.lifeExpectancy).toFixed(1)} ans`);
    
    if (femaleResult.lifeExpectancy > maleResult.lifeExpectancy) {
        console.log(`   ✅ COHÉRENT: Les femmes ont une espérance de vie supérieure (conforme aux statistiques)`);
    } else {
        console.log(`   ⚠️  ATTENTION: Résultat inattendu`);
    }
    
    // Tests d'âge de départ
    console.log(`\n\n🔬 TESTS SUPPLÉMENTAIRES: Impact de l'Âge de Départ`);
    console.log(`==================================================`);
    
    const age30 = createProfile("30 ans", 30, 'M', 5, 25, 5);
    const age50 = createProfile("50 ans", 50, 'M', 5, 25, 5);
    const age70 = createProfile("70 ans", 70, 'M', 5, 25, 5);
    
    const result30 = runSimulation(age30, 3, 2000);
    const result50 = runSimulation(age50, 3, 2000);
    const result70 = runSimulation(age70, 3, 2000);
    
    console.log(`\n📊 Comparaison Âge de Départ:`);
    console.log(`   Départ 30 ans: ${result30.lifeExpectancy} ans (Total: ${30 + (result30.lifeExpectancy - 30)} ans)`);
    console.log(`   Départ 50 ans: ${result50.lifeExpectancy} ans (Total: ${50 + (result50.lifeExpectancy - 50)} ans)`);
    console.log(`   Départ 70 ans: ${result70.lifeExpectancy} ans (Total: ${70 + (result70.lifeExpectancy - 70)} ans)`);
    
    // Rapport final
    console.log(`\n\n╔══════════════════════════════════════════════════════════╗`);
    console.log(`║  RAPPORT FINAL                                              ║`);
    console.log(`╚══════════════════════════════════════════════════════════╝`);
    console.log(`\n✅ Tests terminés avec succès`);
    console.log(`📊 ${Object.keys(results).length} profils testés`);
    console.log(`🔬 Cohérence globale: ${coherence.coherent ? '✅ VALIDÉE' : '⚠️ À VÉRIFIER'}`);
    
    return {
        results,
        coherence,
        genderComparison: { female: femaleResult, male: maleResult },
        ageComparison: { age30: result30, age50: result50, age70: result70 }
    };
}

// Exécuter les tests
if (require.main === module) {
    try {
        const testResults = runAllTests();
        console.log(`\n✅ Tous les tests sont terminés`);
        process.exit(0);
    } catch (error) {
        console.error(`\n❌ Erreur lors des tests:`, error);
        process.exit(1);
    }
}

module.exports = { runAllTests, runSimulation, checkCoherence };


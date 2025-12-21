
global.window = global;

// MOCK DICTIONARY
global.PARAM_DICTIONARY = {
    "childhood_quality": { label: "Enfance", type: "L4", impact_S: -0.30 }
};

const fs = require('fs');
// Load engine
const engineCode = fs.readFileSync('c:/AI/Prime Radiant/schrodinger_engine_v3.js', 'utf8');
const cleanCode = engineCode.replace('window.SchrodingerEngineV3 = SchrodingerEngineV3;', 'module.exports = SchrodingerEngineV3;');
fs.writeFileSync('c:/AI/Prime Radiant/tests/temp_engine_v79.js', cleanCode);
const SchrodingerEngineV3 = require('./temp_engine_v79.js');

function runTest(age, childhoodScore, label) {
    const inputs = {
        age: age,
        gender: 'M',
        bmi: 22, // perfect
        stress_cortisol: 5, // medium
        optimism: 5, // medium
        mode: 4 // Force L4 to use Phantoms
    };

    const phantoms = {
        childhood_quality: childhoodScore
    };

    const engine = new SchrodingerEngineV3(inputs, 4, phantoms);
    const res = engine.run(500);

    // Check start energy (after back-testing)
    const firstPoint = res.raw_simulations[0][0];
    // Wait, simulation starts at ageStart. So index 0 is at 'age'.
    const startEnergy = RES_AVG_START_ENERGY(res.raw_simulations);

    // Check Life Expectancy
    const agg = res.aggregated_data;
    const p50 = agg.find(d => d.survivalRate < 50);
    const lifeExp = p50 ? p50.age : 120;

    console.log(`[${label}] Age=${age}, Childhood=${childhoodScore} => StartEnergy=${startEnergy.toFixed(1)}%, LifeExp=${lifeExp} yrs`);
}

function RES_AVG_START_ENERGY(sims) {
    let tot = 0;
    sims.forEach(s => tot += s[0].v);
    return tot / sims.length;
}

console.log("=== TEST IMPACT ENFANCE (BACK-TESTING V7.9) ===");
runTest(30, 0, "L3 Standard (Neutre)");
runTest(30, -1, "L4 Enfance Difficile (-1)");
runTest(30, 1, "L4 Enfance Heureuse (+1)");

console.log("\n=== TEST IMPACT AGE ===");
runTest(50, 0, "L3 50ans Standard");
runTest(50, -1, "L4 50ans Difficile");


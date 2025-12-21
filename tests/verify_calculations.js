
global.window = global;

// MOCK DICTIONARY
global.PARAM_DICTIONARY = {
    // Only essentials for engine to not crash
};

// LOAD ENGINE
const fs = require('fs');
// We need to read the engine file and eval it or require it if it was a module. 
// It is written as a class on window.
// We will paste the engine code here essentially for the test context, or define a wrapper.
// Better: Read the file content and eval it.

const engineCode = fs.readFileSync('c:/AI/Prime Radiant/schrodinger_engine_v3.js', 'utf8');
// Remove "window.SchrodingerEngineV3 = SchrodingerEngineV3;" to avoid error
const cleanCode = engineCode.replace('window.SchrodingerEngineV3 = SchrodingerEngineV3;', 'module.exports = SchrodingerEngineV3;');
// Save to temp file to require
fs.writeFileSync('c:/AI/Prime Radiant/tests/temp_engine.js', cleanCode);

const SchrodingerEngineV3 = require('./temp_engine.js');

function runScenario(name, slidersValue, isCrisis) {
    // 1. Simulate Input Collection (Mode 3 logic)
    // index_final.html logic:
    // inputs.bmi = 30 - (getAvg('bio') * 1.5);
    // inputs.stress_cortisol = 11 - getAvg('pro');
    // inputs.optimism = getAvg('psy');

    // slidersValue is 1, 5, or 10.
    const avgBio = slidersValue;
    const avgPro = slidersValue;
    const avgPsy = slidersValue;

    const inputs = {
        age: 30,
        gender: 'M',
        // Calculator logic
        bmi: 30 - (avgBio * 1.5),
        stress_cortisol: 11 - avgPro,
        optimism: avgPsy,
        // Hack for Crisis mode check in engine
        mode: isCrisis ? 'crisis' : 'normal'
    };

    console.log(`\n--- SCENARIO: ${name} [Sliders=${slidersValue}, Crisis=${isCrisis}] ---`);
    console.log(`Inputs: BMI=${inputs.bmi.toFixed(1)}, Stress=${inputs.stress_cortisol}, Opt=${inputs.optimism}`);

    const engine = new SchrodingerEngineV3(inputs, 3, {}); // Level 3
    if (isCrisis) engine.CHAOS_BASE = 5.0;

    const res = engine.run(500); // 500 sims
    const agg = res.aggregated_data;

    // Analyze
    // Max Age (where survival > 0)
    const maxAge = agg[agg.length - 1].age;
    // P50 (Median Life Expectancy) - where survival drops below 50%
    const p50 = agg.find(d => d.survivalRate < 50);
    const lifeExp = p50 ? p50.age : 120;

    console.log(`Life Expectancy (P50): ${lifeExp} years`);
    console.log(`Max Reachable: ${maxAge} years`);

    return lifeExp;
}

console.log("=== SIMULATION VERIFICATION ===");

runScenario("WORST (All 1)", 1, false);
runScenario("MID (All 5)", 5, false);
runScenario("BEST (All 10)", 10, false);

runScenario("WORST + CHAOS", 1, true);
runScenario("MID + CHAOS", 5, true);
runScenario("BEST + CHAOS", 10, true);


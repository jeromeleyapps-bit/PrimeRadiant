
global.window = global;
global.PARAM_DICTIONARY = {}; // Engine needs at least empty

const fs = require('fs');
const engineCode = fs.readFileSync('c:/AI/Prime Radiant/schrodinger_engine_v3.js', 'utf8');
const cleanCode = engineCode.replace('window.SchrodingerEngineV3 = SchrodingerEngineV3;', 'module.exports = SchrodingerEngineV3;');
fs.writeFileSync('c:/AI/Prime Radiant/tests/temp_engine_v79_check.js', cleanCode);
const SchrodingerEngineV3 = require('./temp_engine_v79_check.js');

function runMaxCheck() {
    const inputs = {
        age: 30,
        gender: 'M',
        // MAX HEALTH
        bmi: 22,   // Perfect
        stress_cortisol: 1, // Zero Stress
        optimism: 10,       // Max Optimism
        mode: 3
    };

    console.log("Running ELITE PROFILE check...");
    const engine = new SchrodingerEngineV3(inputs, 3, {});
    const res = engine.run(500);

    // Start Energy
    let tot = 0; res.raw_simulations.forEach(s => tot += s[0].v);
    const startE = tot / res.raw_simulations.length;

    // Life Exp
    const agg = res.aggregated_data;
    const p50 = agg.find(d => d.survivalRate < 50);
    const lifeExp = p50 ? p50.age : 120;

    console.log(`ELITE (30yo, All 10/10) => StartEnergy=${startE.toFixed(1)}%, LifeExp=${lifeExp} yrs`);
}

runMaxCheck();

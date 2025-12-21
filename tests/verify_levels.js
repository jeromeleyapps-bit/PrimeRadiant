
global.window = global;
global.PARAM_DICTIONARY = {};

const fs = require('fs');
const engineCode = fs.readFileSync('c:/AI/Prime Radiant/schrodinger_engine_v3.js', 'utf8');
const cleanCode = engineCode.replace('window.SchrodingerEngineV3 = SchrodingerEngineV3;', 'module.exports = SchrodingerEngineV3;');
fs.writeFileSync('c:/AI/Prime Radiant/tests/temp_engine_v79_levels.js', cleanCode);
const SchrodingerEngineV3 = require('./temp_engine_v79_levels.js');

function runLevelTest(level, name, inputs) {
    // Inject level context
    const engine = new SchrodingerEngineV3(inputs, level, {});
    // Sim count varies by level usually, but here we test the physics consistency
    // L1=100, L2=500.
    const iters = (level === 1) ? 100 : 500;

    const res = engine.run(iters);

    // Initial Energy
    let startE = 0;
    res.raw_simulations.forEach(s => startE += s[0].v);
    startE /= res.raw_simulations.length;

    // Life Expectancy P50
    const agg = res.aggregated_data;
    const p50 = agg.find(d => d.survivalRate < 50);
    const lifeExp = p50 ? p50.age : 120;

    console.log(`[${name}] (N=${iters}) => StartE=${startE.toFixed(1)}%, LifeExp=${lifeExp} yrs`);
}

const inputsMid = { age: 30, gender: 'M', bmi: 22, stress_cortisol: 5, optimism: 5 };
const inputsBest = { age: 30, gender: 'M', bmi: 22, stress_cortisol: 1, optimism: 10 };

console.log("=== COMPARATIVE LEVEL TESTING ===");
runLevelTest(3, "REFERENCE L3 Mid", inputsMid);
console.log("---");
runLevelTest(1, "L1 Mid (Initié)", inputsMid);
runLevelTest(2, "L2 Mid (Encyclo)", inputsMid);
console.log("---");
// L1 souvent utilisé avec inputs par défaut dans l'UI, mais si on force Best:
runLevelTest(1, "L1 Best (Hypothétique)", inputsBest);

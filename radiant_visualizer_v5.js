/**
 * VISUALIZER V5.5 - DYNAMIC SCALES
 */
class RadiantVisualizerV5 {

    constructor(canvasId) {
        this.ctx = document.getElementById(canvasId).getContext('2d');
        this.chart = null;
        this.themes = {
            scenarioA: {
                line: 'rgba(100, 200, 255, 0.04)', // Brouillard de probabilités
                median: '#00f2ff',
                glow: 'rgba(0, 242, 255, 0.3)'
            },
            scenarioB: {
                line: 'rgba(255, 150, 0, 0.04)',
                median: '#ffaa00',
                glow: 'rgba(255, 170, 0, 0.3)'
            }
        };
    }

    renderComparison(resultsA, resultsB = null) {
        const datasets = [];

        // Determine Start Age from Data
        const startAge = resultsA.raw_simulations[0][0].age;

        // Dynamic Density:
        // En L3/L4 on montre beaucoup de lignes pour l'effet "Matrix"
        const densityA = Math.min(600, resultsA.raw_simulations.length);
        datasets.push(...this._buildSpaghettiDatasets(resultsA, 'scenarioA', densityA));

        // On ajoute la médiane en DERNIER pour qu'elle soit au dessus
        datasets.push(this._buildMedianDataset(resultsA, 'scenarioA'));

        if (resultsB) {
            const densityB = Math.min(600, resultsB.raw_simulations.length);
            datasets.push(...this._buildSpaghettiDatasets(resultsB, 'scenarioB', densityB));
            datasets.push(this._buildMedianDataset(resultsB, 'scenarioB'));
        }

        if (this.chart) this.chart.destroy();

        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 0 },
                elements: {
                    line: { capBezierPoints: true }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: {
                        type: 'linear',
                        min: startAge,
                        max: 120,
                        grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
                        ticks: { color: '#444', stepSize: 10, font: { size: 10 } }
                    },
                    y: {
                        min: 0,
                        max: 100, // Vitalité max = 100%
                        grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
                        ticks: { color: '#444', font: { size: 10 } }
                    }
                }
            }
        });
    }

    _buildSpaghettiDatasets(results, key, count) {
        const theme = this.themes[key];
        const subset = [];
        const source = results.raw_simulations;

        // Sampling intelligent
        for (let i = 0; i < count; i += 2) { // 1 ligne sur 2 pour perf
            const sim = source[i % source.length];
            const data = sim.map(p => ({ x: p.age, y: p.v }));

            subset.push({
                data,
                borderColor: theme.line,
                borderWidth: 0.5,
                pointRadius: 0,
                fill: false,
                tension: 0.4,
                borderDash: [2, 2], // Tirés pour l'effet "fantôme"
            });
        }
        return subset;
    }

    _buildMedianDataset(results, key) {
        const theme = this.themes[key];
        const data = results.aggregated_data.map(d => ({ x: d.age, y: d.avgQuality }));
        return {
            data,
            borderColor: theme.median,
            borderWidth: 4, // Plus épais
            borderCapStyle: 'round',
            pointRadius: 0,
            tension: 0.4,
            z: 10, // Force au dessus
        };
    }
}
window.RadiantVisualizerV5 = RadiantVisualizerV5;

/**
 * GENERATEUR DE RAPPORT SELDON (Portable)
 */
function generateSeldonReport(results, inputs) {
    if (!results || !results.aggregated_data) return "Données insuffisantes.";

    const data = results.aggregated_data;
    // Trouver l'Age Critique (Probabilité survie < 50%)
    let criticalAge = "Non atteint (>120)";
    let p50 = data.find(d => d.survivalRate < 50);
    if (p50) criticalAge = p50.age + " ans";

    // Trouver le "Seldon Point" (Pic de mortalité / Chute brutale de qualité)
    // Ici on cherche la plus forte baisse d'énergie vitale
    let maxDrop = 0;
    let seldonPoint = 0;
    for (let i = 1; i < data.length; i++) {
        let drop = data[i - 1].avgQuality - data[i].avgQuality;
        if (drop > maxDrop) {
            maxDrop = drop;
            seldonPoint = data[i].age;
        }
    }

    const startAge = inputs.age || 30;
    const horizon = criticalAge === "Non atteint (>120)" ? 120 : parseInt(criticalAge);
    const yearsLeft = horizon - startAge;

    const report = `
=========================================
          RAPPORT SELDON (v7.2)          
=========================================
ID SUJET    : ${inputs.gender} / ${startAge} ans
SIMULATIONS : ${results.raw_simulations.length} Itérations
CHAOS MODE  : ${window.app && window.app.crisisMode ? "ACTIF (CRITIQUE)" : "INACTIF (STABLE)"}

--- ANALYSE TEMPORELLE ---
> Espérance Prédite : ${criticalAge}
> Horizon de Vie    : +${yearsLeft} années probables
> Point de Rupture  : ${seldonPoint} ans (Risque Max)

--- FACTEURS DETERMINANTS ---
[+] Forces (Protection) :
${_analyzeStrengths(inputs)}

[-] Faiblesses (Entropie) :
${_analyzeWeaknesses(inputs)}

--- CONCLUSION DU MOTEUR ---
La trajectoire montre une stabilité jusqu'à ${seldonPoint} ans.
${_generateDynamicAdvice(inputs, seldonPoint)}

=========================================
    FIN DE TRANSMISSION - PRIME RADIANT    
=========================================
`;
    return report;
}

function _analyzeStrengths(i) {
    let s = [];
    if (i.optimism > 7) s.push("- Psyché : Haur Nv. Optimisme");
    if (i.stress_cortisol < 4) s.push("- Vecteur : Stress Maîtrisé");
    if (i.bmi >= 18.5 && i.bmi <= 25) s.push("- Temple : IMC Optimal");
    if (s.length === 0) return "- Profil équilibré sans pic de force.";
    return s.join("\n");
}

function _analyzeWeaknesses(i) {
    let w = [];
    if (i.stress_cortisol > 7) w.push("- Vecteur : Stress Chronique Critique");
    if (i.optimism < 4) w.push("- Psyché : Déficit Espérance/Moral");
    if (i.bmi > 28) w.push("- Temple : Surcharge Métabolique");
    if (w.length === 0) return "- Aucune faiblesse critique majeure.";
    return w.join("\n");
}

function _generateDynamicAdvice(i, point) {
    // Determine weakest link
    let scores = {
        'Bio': Math.abs(i.bmi - 22), // 0 is best
        'Pro': i.stress_cortisol,    // 0 is best
        'Psy': (10 - i.optimism)     // 0 is best
    };

    // Find Max Risk
    let maxRisk = 0;
    let category = 'Bio';

    if (scores.Bio > maxRisk) { maxRisk = scores.Bio; category = 'Bio'; }
    if (scores.Pro > maxRisk) { maxRisk = scores.Pro; category = 'Pro'; }
    if (scores.Psy > maxRisk) { maxRisk = scores.Psy; category = 'Psy'; }

    if (maxRisk < 3) {
        return "PROFIL ELITE DETECTÉ.\nConseil : Maintenez l'homéostasie actuelle.\nVotre plus grand défi sera l'ennui.";
    }

    const advice = {
        'Bio': "Priorité : Réduisez l'entropie métabolique.\nDormez +, Mangez mieux, Bougez.",
        'Pro': "Priorité : Le Vecteur Travail vous consume.\nUrgence : Désengagement ou changement d'environnement.",
        'Psy': "Priorité : La structure mentale fragilise l'ensemble.\nRenforcez le réseau social et l'Ikigai."
    };

    return `Analyse vectorielle : Facteur limitant identifié [${category}].\n${advice[category]}`;
}

window.generateSeldonReport = generateSeldonReport;

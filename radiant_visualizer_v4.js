/**
 * THE PRIME RADIANT - INTERFACE & VISUALIZATION ENGINE V4
 * =======================================================
 * Améliorations :
 * 1. Gestion avancée du Viewport (Padding dynamique, Axe 120 ans)
 * 2. Visualisation Seldon Crisis (Lignes de rupture rouges)
 * 3. Effet Glow Radial Quantique
 */

class RadiantVisualizerV4 {

    constructor(canvasId) {
        this.ctx = document.getElementById(canvasId).getContext('2d');
        this.chart = null;

        // --- STYLE V4 (GLOW & NEON) ---
        this.colors = {
            medianLine: '#ffffff',
            densityCore: 'rgba(0, 242, 255, 0.7)', // Coeur brillant
            densityOuter: 'rgba(0, 242, 255, 0.0)',
            seldonCrisis: '#ff0055', // Rouge rupture
            grid: 'rgba(255,255,255,0.03)'
        };
    }

    /* --- LOGIQUE DE RENDU PRINCIPALE --- */
    renderGraph(simResults, startAge) {
        // Pré-traitement Densité (Core Engine logic)
        const densityData = this._processDensity(simResults.raw_simulations, startAge, 120);

        // Détection Crises Seldon (Lignes de rupture)
        // On cherche 2 ou 3 simulations qui ont subi une chute brutale (>20 pts en 1 an)
        const crisisPaths = this._detectCrisisPaths(simResults.raw_simulations);

        // Configuration Gradient Radial (Simulé par interpolation linéaire multiple)
        // ChartJS ne gère pas nativement le "RadialGradient" sur une ligne, 
        // on utilise donc des couches superposées avec opacité variable pour simuler le Glow volumétrique.

        const labels = densityData.map(d => d.age);

        const datasets = [
            // 1. Layer Pénombre (Atmosphère)
            {
                label: 'Atmosphère Quantique',
                data: densityData.map(d => d.p95),
                backgroundColor: 'rgba(0, 242, 255, 0.02)', // Très léger
                borderColor: 'transparent',
                fill: '+1', // Fill to p5
                pointRadius: 0,
                tension: 0.4
            },
            {
                data: densityData.map(d => d.p5), // Bas de l'atmosphère
                borderColor: 'transparent',
                fill: false,
                pointRadius: 0,
                tension: 0.4
            },

            // 2. Layer Densité (Corps du nuage)
            {
                label: 'Probabilité Majeure',
                data: densityData.map(d => d.p80),
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
                    gradient.addColorStop(0, 'rgba(0, 242, 255, 0.2)');
                    gradient.addColorStop(0.5, 'rgba(0, 242, 255, 0.5)'); // Glow center fake
                    gradient.addColorStop(1, 'rgba(0, 242, 255, 0.05)');
                    return gradient;
                },
                borderColor: 'transparent',
                fill: '+1', // Fill to p20
                pointRadius: 0,
                tension: 0.4
            },
            {
                data: densityData.map(d => d.p20),
                borderColor: 'transparent',
                fill: false,
                pointRadius: 0,
                tension: 0.4
            },

            // 3. Layer Destin (Ligne pure)
            {
                label: 'Trajectoire Médiane',
                data: densityData.map(d => d.median),
                borderColor: '#ffffff',
                borderWidth: 2,
                shadowBlur: 15, // Glow CSS effect via Plugin
                shadowColor: '#00f2ff',
                tension: 0.4,
                pointRadius: 0
            }
        ];

        // 4. Injecter les Crises Seldon (Lignes pointillées rouges fantômes)
        crisisPaths.forEach((path, idx) => {
            // Mapping path data to chart labels
            const crisisData = labels.map(age => {
                const p = path.find(pt => pt.age === age);
                return p ? p.v : null;
            });

            datasets.push({
                label: `Crise Seldon ${idx}`,
                data: crisisData,
                borderColor: this.colors.seldonCrisis,
                borderDash: [5, 5],
                borderWidth: 1.5,
                pointRadius: 0,
                tension: 0.2, // Plus anguleux car accidentel
                hidden: false // Visible pour l'effet dramatique
            });
        });

        // Destruction instance précédente
        if (this.chart) this.chart.destroy();

        // Création Chart
        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 10, right: 30, top: 20, bottom: 10 // Padding sécurité pour labels
                    }
                },
                animation: { duration: 1000, easing: 'easeOutQuart' },
                plugins: {
                    legend: { display: false },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    x: {
                        type: 'linear',
                        min: startAge,
                        max: 120, // FORCE 120 ans
                        grid: { color: this.colors.grid },
                        ticks: { color: '#666', stepSize: 10 }
                    },
                    y: {
                        min: 0,
                        max: 110,
                        grid: { color: this.colors.grid },
                        ticks: { color: '#666' }
                    }
                }
            }
        });

        return this._calculateMarkerData(densityData, labels);
    }

    _processDensity(sims, start, end) {
        // ... (Même logique que V3 mais optimisée)
        let map = [];
        for (let t = start; t <= end; t++) {
            let vals = sims.map(s => s.find(p => p.age === t)?.v || 0).sort((a, b) => a - b);
            if (vals.length === 0) continue;
            map.push({
                age: t,
                p5: vals[Math.floor(vals.length * 0.05)],
                p20: vals[Math.floor(vals.length * 0.20)],
                median: vals[Math.floor(vals.length * 0.50)],
                p80: vals[Math.floor(vals.length * 0.80)],
                p95: vals[Math.floor(vals.length * 0.95)],
            });
        }
        return map;
    }

    _detectCrisisPaths(sims) {
        // Trouver 2 chemins où la dérivée est très négative à un moment donné
        const crises = [];
        for (let sim of sims) {
            if (crises.length >= 2) break;
            for (let i = 1; i < sim.length; i++) {
                if (sim[i - 1].v - sim[i].v > 25) { // Chute > 25% vitalité
                    crises.push(sim);
                    break;
                }
            }
        }
        return crises;
    }

    _calculateMarkerData(densityData, labels) {
        // Retourne positions pour Marqueurs DOM
        // Point Seldon (Death Peak) + Transition
        // ... (Logique V3 conservée)
        return {}; // Placeholder simplified
    }
}

// Export
window.RadiantVisualizerV4 = RadiantVisualizerV4;

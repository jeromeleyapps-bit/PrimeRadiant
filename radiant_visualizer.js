/**
 * THE PRIME RADIANT - VISUALIZATION ENGINE
 * ========================================
 * Role: Data Visualization & UX Design
 * Technology: Chart.js (Optimisé pour Canvas avec Gradients & Filling)
 * Concept: "Radiant Density Cloud" - Visualisation de la fonction d'onde de vie.
 */

class RadiantVisualizer {

    constructor(canvasId) {
        this.ctx = document.getElementById(canvasId).getContext('2d');
        this.chart = null;

        // --- STYLE PREMIUM ---
        this.colors = {
            medianLine: '#ffffff',
            densityZone: { // Zone 20-80% (Cœur)
                start: 'rgba(0, 242, 255, 0.4)',
                end: 'rgba(0, 242, 255, 0.05)'
            },
            penumbraZone: { // Zone 5-95% (Limites)
                start: 'rgba(0, 242, 255, 0.1)',
                end: 'rgba(0, 242, 255, 0.00)'
            },
            seldonPoint: '#ff0055', // Rouge néon pour le point de mort probable
            transitionPoint: '#ffaa00' // Ambre pour le déclin de santé
        };
    }

    /**
     * Traite les données brutes (1000 simus) pour extraire les zones de densité.
     * Pour chaque année, on calcule P10, P50 (Médiane), P90.
     */
    processDensityData(simulations, startAge, maxAge) {
        let densityMap = [];

        for (let t = startAge; t <= maxAge; t++) {
            // Collecter toutes les valeurs de vitalité vivantes à cet âge
            let valuesAtAge = [];
            simulations.forEach(sim => {
                const point = sim.find(p => p.age === t);
                if (point && point.v > 0) valuesAtAge.push(point.v);
                else valuesAtAge.push(0); // Considérer mort = 0 vitalité pour la moyenne visuelle
            });

            // Trier pour centiles
            valuesAtAge.sort((a, b) => a - b);
            const count = valuesAtAge.length;

            if (count === 0) {
                densityMap.push({ age: t, p5: 0, p20: 0, median: 0, p80: 0, p95: 0 });
                continue;
            }

            densityMap.push({
                age: t,
                p5: valuesAtAge[Math.floor(count * 0.05)],    // Bas Pénombre
                p20: valuesAtAge[Math.floor(count * 0.20)],   // Bas Densité
                median: valuesAtAge[Math.floor(count * 0.50)], // Destin
                p80: valuesAtAge[Math.floor(count * 0.80)],   // Haut Densité
                p95: valuesAtAge[Math.floor(count * 0.95)]    // Haut Pénombre
            });
        }
        return densityMap;
    }

    /**
     * Identifie les "Momentum Markers" (Health Transition & Seldon Point).
     */
    calculateKeyMarkers(densityMap, survivalCurve) {
        // 1. Âge de Transition (Santé < 50/100 en médiane)
        const transitionAge = densityMap.find(d => d.median < 50)?.age || null;

        // 2. Point Seldon (Pic de mortalité)
        // C'est là où la courbe de survie descend le plus vite (dérivée max)
        let maxDrop = 0;
        let seldonAge = null;
        for (let i = 1; i < survivalCurve.length; i++) {
            const drop = survivalCurve[i - 1].survivalRate - survivalCurve[i].survivalRate;
            if (drop > maxDrop) {
                maxDrop = drop;
                seldonAge = survivalCurve[i].age;
            }
        }

        return { transitionAge, seldonAge };
    }

    /**
     * Rendu principal du graphique Radiant.
     */
    renderRadiantGraph(simResults, startAge) {
        const densityData = this.processDensityData(simResults.raw_simulations, startAge, 120);
        const markers = this.calculateKeyMarkers(densityData, simResults.aggregated_data);

        // Data preparation for Chart.js Filling
        // Area 1 (Penumbra): Fill between p5 and p95
        // Area 2 (Density): Fill between p20 and p80
        // Line: Median

        const labels = densityData.map(d => d.age);

        // P95 (Top of Penumbra)
        const dataP95 = densityData.map(d => d.p95);
        // P5 (Bottom of Penumbra)
        const dataP5 = densityData.map(d => d.p5);

        // P80 (Top of Density)
        const dataP80 = densityData.map(d => d.p80);
        // P20 (Bottom of Density)
        const dataP20 = densityData.map(d => d.p20);

        // Median
        const dataMedian = densityData.map(d => d.median);

        // Créer les Gradients
        const gradientDensity = this.ctx.createLinearGradient(0, 0, 0, 400);
        gradientDensity.addColorStop(0, this.colors.densityZone.start);
        gradientDensity.addColorStop(1, this.colors.densityZone.end);

        if (this.chart) this.chart.destroy();

        this.chart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Destin Médian',
                        data: dataMedian,
                        borderColor: this.colors.medianLine,
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 0,
                        zIndex: 10
                    },
                    {
                        label: 'Zone de Densité (60%)',
                        data: dataP80,
                        backgroundColor: gradientDensity,
                        borderColor: 'transparent',
                        fill: '+1', // Fill to next dataset (P20)
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Zone Basse Densité',
                        data: dataP20,
                        borderColor: 'transparent',
                        tension: 0.4,
                        pointRadius: 0,
                        fill: false
                    },
                    {
                        label: 'Zone Pénombre (90%)',
                        data: dataP95,
                        backgroundColor: 'rgba(0, 242, 255, 0.05)',
                        borderColor: 'transparent',
                        fill: '+1', // Fill to next dataset (P5)
                        tension: 0.4,
                        pointRadius: 0
                    },
                    {
                        label: 'Zone Basse Pénombre',
                        data: dataP5,
                        borderColor: 'transparent',
                        tension: 0.4,
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1500, // Smooth transition morphing
                    easing: 'easeOutQuart'
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(10, 10, 20, 0.9)',
                        borderColor: 'rgba(0, 242, 255, 0.3)',
                        borderWidth: 1,
                        titleColor: '#00f2ff',
                        callbacks: {
                            label: function (context) {
                                if (context.datasetIndex === 0) // Median only in tooltip
                                    return `Vitalité Médiane: ${context.raw}/100`;
                                return null;
                            },
                            afterBody: function (contexts) { // Custom Footer in tooltip
                                const idx = contexts[0].dataIndex;
                                const age = labels[idx];
                                const surv = simResults.aggregated_data.find(d => d.age === age)?.survivalRate;
                                return `Probabilité Présence: ${surv}%`;
                            }
                        }
                    },
                    annotation: { // Plugin annotation (si disponible, sinon manuel)
                        // Nous ferons un rendu manuel des marqueurs Seldon/Transition ou via DOM overlay
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.02)' },
                        title: { display: true, text: 'Âge', color: '#666' }
                    },
                    y: {
                        min: 0,
                        max: 120, // Health score max
                        grid: { color: 'rgba(255,255,255,0.02)' },
                        title: { display: true, text: 'État Vital', color: '#666' }
                    }
                }
            }
        });

        return markers; // Return markers for UI Overlay update
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RadiantVisualizer };
} else {
    window.RadiantVisualizer = RadiantVisualizer;
}

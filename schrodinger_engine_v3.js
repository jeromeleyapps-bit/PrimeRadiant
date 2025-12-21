/**
 * THE PRIME RADIANT - ENGINE V3.5
 * ===============================
 * Mises à jour :
 * - Prise en compte de l'AGE DE DEPART (Start Age).
 * - Impact du GENRE sur l'espérance de vie de base.
 * - Intégration des micro-facteurs (Psy, Genre, Handicap).
 */

class SchrodingerEngineV3 {

    constructor(inputs, level = 3, phantomParams = {}) {
        this.inputs = inputs;
        this.level = level;
        this.phantom = phantomParams;
        this.dictionary = window.PARAM_DICTIONARY || {};

        // Constants
        this.MAX_AGE = 120;

        // --- GENDER BASELINE ---
        // Stats actuelles : Femmes ont une espérance de vie légèrement sup (+ Entropie plus faible)
        // Hommes : Usure plus rapide, plus de variance.
        this.BASE_ENTROPY = (inputs.gender === 'F') ? 0.95 : 1.05;

        this.CHAOS_BASE = (level === 4) ? 0.8 : 0.5;
    }

    _initializeState() {
        let state = {
            energy: 100,
            entropy_rate: this.BASE_ENTROPY,
        };

        // 1. INPUTS L1-L3 (Mapping simplifié)
        if (this.inputs.stress_cortisol) {
            // Stress: 1-10. 5 is neutral. Impact Increased (0.04 -> 0.07)
            state.entropy_rate += (this.inputs.stress_cortisol - 5) * 0.07;
        }
        if (this.inputs.bmi) {
            let dist = Math.abs(this.inputs.bmi - 22);
            state.entropy_rate += (dist * 0.025); // Increased weight penalty
        }
        if (this.inputs.optimism) {
            state.entropy_rate -= (this.inputs.optimism - 5) * 0.05; // Increased mind power
        }

        // 2. INPUTS L4 (PHANTOMS & MICRO-FACTEURS)
        if (this.level === 4) {
            const keys = Object.keys(this.dictionary);

            keys.forEach(k => {
                const def = this.dictionary[k];
                if (def.type === 'L4') {
                    // Valeur venant de l'UI (-1.0 à +1.0) ou Aléatoire (Gaussien centré 0)
                    let delta = (this.phantom[k] !== undefined) ? this.phantom[k] : (Math.random() - 0.5) * 2;

                    // Direct Impact:
                    // Si impact_S > 0 (Désordre ex: Pollution): +1 (Fort) => +Entropy. -1 (Faible) => -Entropy (Regain)
                    // Si impact_S < 0 (Ordre ex: Sport): +1 (Fort) => -Entropy (Gain).
                    state.entropy_rate += (delta * (def.impact_S * 0.5)); // 0.5 coeff d'atténuation
                }
            });
        }

        // Correction Age de Départ (Back-Testing)
        // On doit simuler l'usure réelle des années passées avec le taux d'entropie actuel.
        // Sinon, démarrer vieux donne un avantage mathématique injuste.
        let ageStart = this.inputs.age || 30;

        for (let y = 0; y < ageStart; y++) {
            // Usure historique : on considère que l'enfance/jeunesse est un peu plus résiliente (0.8)
            // mais que l'usure s'accumule quand même. 
            // On utilise l'entropy_rate du profil pour refléter le lifestyle "depuis toujours".
            let pastWear = state.entropy_rate * (1 + (y / 120)) * 0.9;
            state.energy -= pastWear;
        }

        if (state.energy < 20) state.energy = 20; // Seuil vital minimum pour garantir un début de sim

        return state;
    }

    _calculateCrossImpacts(currentAge) {
        let mult = 1.0;
        // ... (Cross impacts L3 logic)
        return mult;
    }

    run(iterations = 100) {
        const sims = [];
        let startAge = parseInt(this.inputs.age) || 30;

        for (let i = 0; i < iterations; i++) {
            const sim = [];
            let state = this._initializeState();
            let age = startAge;
            let alive = true;

            // First point
            sim.push({ age: age, v: state.energy });

            while (alive && age <= this.MAX_AGE) {
                // 1. Decay
                let decay = state.entropy_rate * (1 + (age / 120));

                // 2. Chaos (Second Law of Thermodynamics: Entropy increases)
                // Chaos is not symmetric. Engines break easier than they fix themselves.
                // Shift to a negative bias.
                let chaos = (Math.random() - 0.2) * this.CHAOS_BASE;
                if (this.inputs.mode === 'crisis') chaos = Math.abs(chaos) * 2; // Always positive entropy (destructive)

                // 3. Bifurcation (Accidents / Black Swans)
                // In L4, high probability of massive energy drops (accidents)
                if (this.level === 4 && Math.random() < 0.005) {
                    // 90% chance of accident vs 10% miracle
                    if (Math.random() > 0.1) {
                        state.energy -= (Math.random() * 25); // Accident
                    } else {
                        state.energy += (Math.random() * 10); // Miracle recovery
                    }
                }

                state.energy -= (decay + chaos);

                // Cap
                if (state.energy > 110) state.energy = 110;

                age++;
                if (state.energy <= 0) {
                    alive = false;
                    state.energy = 0;
                }

                sim.push({ age: age, v: state.energy });
            }
            sims.push(sim);
        }

        // Aggregation
        const agg = this._aggregate(sims, startAge);
        return { raw_simulations: sims, aggregated_data: agg };
    }

    _aggregate(sims, startAge) {
        const agg = [];
        for (let t = startAge; t <= this.MAX_AGE; t++) {
            let survivors = 0;
            let totalQ = 0;
            sims.forEach(s => {
                const pt = s.find(p => p.age === t);
                if (pt && pt.v > 0) {
                    survivors++;
                    totalQ += pt.v;
                }
            });
            let survRate = (survivors / sims.length) * 100;
            let avgQ = survivors ? totalQ / survivors : 0;
            agg.push({ age: t, survivalRate: survRate, avgQuality: avgQ });
        }
        return agg;
    }
}
window.SchrodingerEngineV3 = SchrodingerEngineV3;

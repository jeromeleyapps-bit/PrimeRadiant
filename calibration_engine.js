/**
 * MODULE DE CALIBRATION - MOTEUR SELDON V4
 * ==========================================
 * Calibre les coefficients du moteur à partir de données scientifiques réelles
 */

class CalibrationEngine {
    constructor() {
        // Données de référence basées sur études épidémiologiques
        this.referenceData = {
            // Espérance de vie par genre (France 2023 - INSEE)
            lifeExpectancy: { 
                M: 79.2, 
                F: 85.1 
            },
            
            // Impact du tabagisme (Doll & Peto, 2004 - British Doctors Study)
            smokingImpact: {
                never: 0,
                former_gt10y: -1.0,      // Arrêté > 10 ans : -1 an
                former_5to10y: -3.0,      // Arrêté 5-10 ans : -3 ans
                former_lt5y: -6.0,       // Arrêté < 5 ans : -6 ans
                current_light: -7.0,      // < 10 cigarettes/jour : -7 ans
                current_moderate: -9.0,   // 10-20 cigarettes/jour : -9 ans
                current_heavy: -12.0      // > 20 cigarettes/jour : -12 ans
            },
            
            // Impact IMC (Flegal et al., 2013 - JAMA Meta-analysis)
            bmiImpact: {
                underweight: -1.5,       // IMC < 18.5
                normal_low: 0,            // IMC 18.5-22 (optimal)
                normal_high: 0,           // IMC 22-25
                overweight: -1.8,         // IMC 25-30
                obese_class1: -3.5,       // IMC 30-35
                obese_class2: -5.5,       // IMC 35-40
                obese_class3: -8.0        // IMC > 40
            },
            
            // Stress chronique (Epel et al., 2004 - Telomere study)
            stressImpact: {
                very_low: 0,              // Stress 1-2
                low: -0.5,                // Stress 3-4
                moderate: -1.5,            // Stress 5-6
                high: -3.0,                // Stress 7-8
                extreme: -5.0               // Stress 9-10
            },
            
            // Activité physique (Lee et al., 2012 - Lancet)
            physicalActivityImpact: {
                sedentary: -3.5,          // < 150 min/semaine
                low: -1.5,                 // 150-300 min/semaine
                moderate: 0,               // 300-600 min/semaine
                high: +2.0,                 // > 600 min/semaine
                very_high: +3.5            // > 1000 min/semaine (diminishing returns)
            },
            
            // Qualité du sommeil (Cappuccio et al., 2010 - Sleep meta-analysis)
            sleepImpact: {
                very_poor: -3.0,          // < 5h ou > 9h
                poor: -1.5,                // 5-6h ou 8-9h
                adequate: 0,                // 6-7h
                good: +0.5,                // 7-8h (optimal)
                excellent: +1.0            // 7-8h + qualité REM élevée
            },
            
            // Alcool (Di Castelnuovo et al., 2006 - Meta-analysis)
            alcoholImpact: {
                abstainer: 0,              // 0 unités/semaine
                light: +0.5,               // 1-7 unités/semaine (J-curve)
                moderate: 0,               // 7-14 unités/semaine
                heavy: -2.0,               // 14-28 unités/semaine
                very_heavy: -5.0           // > 28 unités/semaine
            },
            
            // Isolement social (Holt-Lunstad et al., 2015 - Meta-analysis)
            socialIsolationImpact: {
                very_connected: +2.0,      // Réseau social fort
                connected: +1.0,           // Réseau modéré
                moderate: 0,                // Réseau moyen
                isolated: -2.5,            // Isolement modéré
                very_isolated: -5.0        // Isolement sévère (équivalent tabagisme)
            },
            
            // Précarité financière (Stringhini et al., 2017 - Lancet)
            financialPrecariousnessImpact: {
                secure: +1.0,              // Sécurité financière
                stable: 0,                 // Stabilité
                moderate: -1.5,            // Précarité modérée
                high: -3.5,                // Précarité élevée
                extreme: -6.0              // Précarité extrême
            }
        };
        
        // Facteur de conversion : années d'espérance de vie → coefficient d'entropie
        // Basé sur l'équation: ΔE = -k * ΔLE / LE_base
        this.conversionFactor = 10.0; // À calibrer empiriquement
    }
    
    /**
     * Calcule les coefficients d'impact pour le moteur
     * @param {string} gender - 'M' ou 'F'
     * @returns {Object} Coefficients calibrés
     */
    calibrateCoefficients(gender = 'M') {
        const baseLE = this.referenceData.lifeExpectancy[gender];
        
        return {
            // Stress : conversion de l'impact en années vers coefficient
            stress_cortisol: {
                // Impact linéaire: stress 1-10 → impact -5 à +0 ans
                // Coefficient = (impact_max / baseLE) * conversionFactor
                baseCoeff: (this.referenceData.stressImpact.extreme / baseLE) * this.conversionFactor,
                // Formule: entropy_rate += (stress - 5) * baseCoeff
                formula: (stress) => (stress - 5) * ((this.referenceData.stressImpact.extreme / baseLE) * this.conversionFactor / 5)
            },
            
            // IMC : courbe en U
            bmi: {
                // Distance par rapport à l'optimal (22)
                formula: (bmi) => {
                    let impact = 0;
                    if (bmi < 18.5) {
                        impact = this.referenceData.bmiImpact.underweight;
                    } else if (bmi <= 25) {
                        impact = 0; // Optimal
                    } else if (bmi <= 30) {
                        impact = this.referenceData.bmiImpact.overweight;
                    } else if (bmi <= 35) {
                        impact = this.referenceData.bmiImpact.obese_class1;
                    } else if (bmi <= 40) {
                        impact = this.referenceData.bmiImpact.obese_class2;
                    } else {
                        impact = this.referenceData.bmiImpact.obese_class3;
                    }
                    return (impact / baseLE) * this.conversionFactor * 0.1; // Facteur d'échelle
                }
            },
            
            // Optimisme / Résilience psychologique
            optimism: {
                // Impact protecteur: optimisme élevé → +1.5 ans (études de résilience)
                baseCoeff: (1.5 / baseLE) * this.conversionFactor,
                formula: (optimism) => -(optimism - 5) * ((1.5 / baseLE) * this.conversionFactor / 5)
            },
            
            // Tabagisme
            smoking: {
                formula: (smokingLevel) => {
                    // smokingLevel: 0 (jamais) à 1.0 (fumeur lourd)
                    let impact;
                    if (smokingLevel === 0) {
                        impact = this.referenceData.smokingImpact.never;
                    } else if (smokingLevel < 0.3) {
                        impact = this.referenceData.smokingImpact.current_light;
                    } else if (smokingLevel < 0.7) {
                        impact = this.referenceData.smokingImpact.current_moderate;
                    } else {
                        impact = this.referenceData.smokingImpact.current_heavy;
                    }
                    return (impact / baseLE) * this.conversionFactor * 0.15;
                }
            },
            
            // Activité physique
            physicalActivity: {
                formula: (activityLevel) => {
                    // activityLevel: 1 (sédentaire) à 10 (athlète)
                    let impact;
                    if (activityLevel <= 2) {
                        impact = this.referenceData.physicalActivityImpact.sedentary;
                    } else if (activityLevel <= 4) {
                        impact = this.referenceData.physicalActivityImpact.low;
                    } else if (activityLevel <= 7) {
                        impact = this.referenceData.physicalActivityImpact.moderate;
                    } else if (activityLevel <= 9) {
                        impact = this.referenceData.physicalActivityImpact.high;
                    } else {
                        impact = this.referenceData.physicalActivityImpact.very_high;
                    }
                    return -(impact / baseLE) * this.conversionFactor * 0.1; // Négatif car protecteur
                }
            },
            
            // Sommeil
            sleep: {
                formula: (sleepQuality) => {
                    // sleepQuality: 1 (très mauvais) à 10 (excellent)
                    let impact;
                    if (sleepQuality <= 2) {
                        impact = this.referenceData.sleepImpact.very_poor;
                    } else if (sleepQuality <= 4) {
                        impact = this.referenceData.sleepImpact.poor;
                    } else if (sleepQuality <= 6) {
                        impact = this.referenceData.sleepImpact.adequate;
                    } else if (sleepQuality <= 8) {
                        impact = this.referenceData.sleepImpact.good;
                    } else {
                        impact = this.referenceData.sleepImpact.excellent;
                    }
                    return -(impact / baseLE) * this.conversionFactor * 0.1; // Négatif car protecteur
                }
            },
            
            // Isolement social
            socialIsolation: {
                formula: (isolationLevel) => {
                    // isolationLevel: 1 (très isolé) à 10 (très connecté)
                    let impact;
                    if (isolationLevel <= 2) {
                        impact = this.referenceData.socialIsolationImpact.very_isolated;
                    } else if (isolationLevel <= 4) {
                        impact = this.referenceData.socialIsolationImpact.isolated;
                    } else if (isolationLevel <= 6) {
                        impact = this.referenceData.socialIsolationImpact.moderate;
                    } else if (isolationLevel <= 8) {
                        impact = this.referenceData.socialIsolationImpact.connected;
                    } else {
                        impact = this.referenceData.socialIsolationImpact.very_connected;
                    }
                    return -(impact / baseLE) * this.conversionFactor * 0.1; // Négatif car protecteur
                }
            }
        };
    }
    
    /**
     * Ajuste le facteur de conversion en comparant avec des données réelles
     * @param {Array} validationData - Données de cohorte pour validation
     * @returns {number} Facteur de conversion optimisé
     */
    optimizeConversionFactor(validationData) {
        // Algorithme d'optimisation (grid search ou gradient descent)
        let bestFactor = this.conversionFactor;
        let bestError = Infinity;
        
        // Test de différents facteurs
        for (let factor = 5; factor <= 20; factor += 0.5) {
            this.conversionFactor = factor;
            const error = this._calculateValidationError(validationData);
            
            if (error < bestError) {
                bestError = error;
                bestFactor = factor;
            }
        }
        
        this.conversionFactor = bestFactor;
        return bestFactor;
    }
    
    /**
     * Calcule l'erreur de validation
     * @private
     */
    _calculateValidationError(validationData) {
        // Implémentation simplifiée - à compléter avec le moteur réel
        let totalError = 0;
        
        validationData.forEach(individual => {
            // Simuler avec le moteur et comparer avec la réalité
            // totalError += Math.abs(predictedLE - actualLE);
        });
        
        return totalError / validationData.length;
    }
    
    /**
     * Génère un rapport de calibration
     * @returns {Object} Rapport détaillé
     */
    generateCalibrationReport() {
        const coeffs = this.calibrateCoefficients('M');
        
        return {
            timestamp: new Date().toISOString(),
            baseLifeExpectancy: this.referenceData.lifeExpectancy,
            conversionFactor: this.conversionFactor,
            coefficients: coeffs,
            dataSources: [
                "INSEE - Tables de mortalité 2023",
                "Doll & Peto (2004) - British Doctors Study",
                "Flegal et al. (2013) - JAMA Meta-analysis BMI",
                "Epel et al. (2004) - Telomere length and stress",
                "Lee et al. (2012) - Lancet Physical Activity",
                "Cappuccio et al. (2010) - Sleep Meta-analysis",
                "Di Castelnuovo et al. (2006) - Alcohol Meta-analysis",
                "Holt-Lunstad et al. (2015) - Social Isolation Meta-analysis",
                "Stringhini et al. (2017) - Lancet Socioeconomic factors"
            ],
            notes: [
                "Les coefficients sont calibrés pour la population française",
                "Les impacts sont convertis en coefficients d'entropie",
                "Le facteur de conversion peut être optimisé avec des données de validation"
            ]
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalibrationEngine;
} else {
    window.CalibrationEngine = CalibrationEngine;
}


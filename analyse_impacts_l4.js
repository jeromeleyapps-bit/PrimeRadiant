/**
 * Script d'analyse et réévaluation des impacts L4
 */

const fs = require('fs');

// Charger le fichier
const content = fs.readFileSync('param_dictionary_l4.js', 'utf8');

// Extraire tous les paramètres L4 avec leurs impacts
const l4Params = [];
const regex = /"([^"]+)":\s*\{\s*label:\s*"([^"]+)",\s*type:\s*"L4",\s*impact_S:\s*(-?[\d.]+)/g;
let match;

while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const label = match[2];
    const impact_S = parseFloat(match[3]);
    
    l4Params.push({ key, label, impact_S });
}

// Trier par impact
l4Params.sort((a, b) => a.impact_S - b.impact_S);

console.log('=== ANALYSE DES IMPACTS L4 ===\n');
console.log(`Total paramètres L4: ${l4Params.length}\n`);

// Grouper par catégorie
const categories = {
    'Très élevé (<= -0.18)': [],
    'Élevé (-0.15 à -0.17)': [],
    'Moyen (-0.10 à -0.14)': [],
    'Faible (-0.05 à -0.09)': [],
    'Très faible (> -0.05)': [],
    'Positifs (risques)': []
};

l4Params.forEach(p => {
    if (p.impact_S <= -0.18) {
        categories['Très élevé (<= -0.18)'].push(p);
    } else if (p.impact_S <= -0.15) {
        categories['Élevé (-0.15 à -0.17)'].push(p);
    } else if (p.impact_S <= -0.10) {
        categories['Moyen (-0.10 à -0.14)'].push(p);
    } else if (p.impact_S <= -0.05) {
        categories['Faible (-0.05 à -0.09)'].push(p);
    } else if (p.impact_S < 0) {
        categories['Très faible (> -0.05)'].push(p);
    } else {
        categories['Positifs (risques)'].push(p);
    }
});

// Afficher
Object.keys(categories).forEach(cat => {
    if (categories[cat].length > 0) {
        console.log(`\n${cat}: ${categories[cat].length} paramètres`);
        categories[cat].forEach(p => {
            const impactWithCoeff = (p.impact_S * 0.5).toFixed(4);
            console.log(`  - ${p.label}: ${p.impact_S} (impact réel: ${impactWithCoeff})`);
        });
    }
});

// Impact cumulatif
const protectiveParams = l4Params.filter(p => p.impact_S < 0);
const totalImpact = protectiveParams.reduce((sum, p) => sum + (p.impact_S * 0.5), 0);

console.log(`\n=== IMPACT CUMULATIF ===`);
console.log(`Si TOUS les ${protectiveParams.length} paramètres protecteurs sont à +1:`);
console.log(`Réduction totale d'entropie: ${totalImpact.toFixed(4)}`);
console.log(`Réduction de ${(Math.abs(totalImpact) * 100).toFixed(1)}% de l'entropie de base`);
console.log(`\n⚠️  PROBLÈME: Impact cumulatif excessif !`);

// Nouveaux impacts recommandés
console.log(`\n=== NOUVEAUX IMPACTS RECOMMANDÉS ===`);
const factors = {
    'Très élevé (<= -0.18)': 0.35,
    'Élevé (-0.15 à -0.17)': 0.40,
    'Moyen (-0.10 à -0.14)': 0.50,
    'Faible (-0.05 à -0.09)': 0.60,
    'Très faible (> -0.05)': 0.70
};

console.log('\n// CORRECTION V3.8: Impacts réduits pour réalisme scientifique');
Object.keys(categories).forEach(cat => {
    if (categories[cat].length > 0 && cat !== 'Positifs (risques)') {
        const factor = factors[cat] || 1.0;
        categories[cat].forEach(p => {
            const newImpact = (p.impact_S * factor).toFixed(3);
            const reduction = ((1 - factor) * 100).toFixed(0);
            console.log(`"${p.key}": ${p.impact_S} → ${newImpact} (réduction ${reduction}%)`);
        });
    }
});

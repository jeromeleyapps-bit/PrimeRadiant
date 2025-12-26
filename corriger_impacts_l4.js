/**
 * Script pour corriger automatiquement tous les impacts L4
 */

const fs = require('fs');

// Facteurs de réduction par catégorie
const reductionFactors = {
    'very_high': 0.35,  // <= -0.18 : réduction 65%
    'high': 0.40,       // -0.15 à -0.17 : réduction 60%
    'medium': 0.50,     // -0.10 à -0.14 : réduction 50%
    'low': 0.60,        // -0.05 à -0.09 : réduction 40%
    'very_low': 0.70    // > -0.05 : réduction 30%
};

function getReductionFactor(impact) {
    if (impact <= -0.18) return reductionFactors.very_high;
    if (impact <= -0.15) return reductionFactors.high;
    if (impact <= -0.10) return reductionFactors.medium;
    if (impact <= -0.05) return reductionFactors.low;
    if (impact < 0) return reductionFactors.very_low;
    return 1.0; // Pas de réduction pour les risques (positifs)
}

// Lire le fichier
let content = fs.readFileSync('param_dictionary_l4.js', 'utf8');

// Remplacer tous les impacts négatifs L4
const regex = /("([^"]+)":\s*\{\s*label:\s*"[^"]+",\s*type:\s*"L4",\s*impact_S:\s*)(-?[\d.]+)/g;

let replacements = [];
let match;

while ((match = regex.exec(content)) !== null) {
    const fullMatch = match[0];
    const prefix = match[1];
    const key = match[2];
    const oldImpact = parseFloat(match[3]);
    
    if (oldImpact < 0) {
        const factor = getReductionFactor(oldImpact);
        const newImpact = oldImpact * factor;
        const newLine = prefix + newImpact.toFixed(3);
        
        replacements.push({
            old: fullMatch,
            new: newLine,
            key,
            oldImpact,
            newImpact,
            reduction: ((1 - factor) * 100).toFixed(0)
        });
    }
}

// Appliquer les remplacements
let newContent = content;
replacements.forEach(r => {
    // Remplacer avec le contexte complet pour éviter les doublons
    const oldPattern = new RegExp(`("${r.key}":\\s*\\{\\s*label:\\s*"[^"]+",\\s*type:\\s*"L4",\\s*impact_S:\\s*)${r.oldImpact}`, 'g');
    newContent = newContent.replace(oldPattern, `$1${r.newImpact.toFixed(3)}`);
});

// Ajouter un commentaire en haut du fichier
const comment = `/**
 * THE PRIME RADIANT - DICTIONNAIRE MULTI-VECTEURS ÉTENDU (~100 Paramètres L4)
 * =============================================================================
 * Version optimisée pour accessibilité utilisateur lambda :
 * - Labels simplifiés (termes techniques → langage accessible)
 * - Paramètres nécessitant tests médicaux supprimés
 * - Descriptions/tooltips pour tous les paramètres
 * 
 * CORRECTION V3.8: Impacts réduits pour réalisme scientifique
 * - Impacts très élevés (<= -0.18): réduits de 65%
 * - Impacts élevés (-0.15 à -0.17): réduits de 60%
 * - Impacts moyens (-0.10 à -0.14): réduits de 50%
 * - Impacts faibles (-0.05 à -0.09): réduits de 40%
 * - Impacts très faibles (> -0.05): réduits de 30%
 * Objectif: Éviter des espérances de vie irréalistes (>120 ans) même avec plusieurs paramètres à "Fort"
 */\n\n`;

// Remplacer le commentaire initial
newContent = newContent.replace(/^\/\*\*[\s\S]*?\*\/\n\n/, comment);

// Sauvegarder
fs.writeFileSync('param_dictionary_l4.js', newContent, 'utf8');

console.log(`✅ ${replacements.length} paramètres corrigés`);
console.log('\nRésumé des modifications:');
const summary = {};
replacements.forEach(r => {
    const cat = r.reduction + '%';
    if (!summary[cat]) summary[cat] = [];
    summary[cat].push(r.key);
});

Object.keys(summary).sort().forEach(cat => {
    console.log(`\nRéduction ${cat}: ${summary[cat].length} paramètres`);
    summary[cat].slice(0, 5).forEach(k => console.log(`  - ${k}`));
    if (summary[cat].length > 5) console.log(`  ... et ${summary[cat].length - 5} autres`);
});


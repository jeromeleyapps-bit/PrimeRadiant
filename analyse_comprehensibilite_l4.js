// Analyse de la compréhensibilité des paramètres L4
const fs = require('fs');

const dictContent = fs.readFileSync('param_dictionary_l4.js', 'utf8');
const dictMatch = dictContent.match(/const PARAM_DICTIONARY = \{([\s\S]*?)\};/);

if (!dictMatch) {
    console.error('Impossible de lire PARAM_DICTIONARY');
    process.exit(1);
}

const lines = dictMatch[1].split('\n');
const params = [];
let currentKey = null;
let currentLabel = null;
let currentType = null;

lines.forEach(line => {
    const keyMatch = line.match(/"([^"]+)":\s*\{/);
    if (keyMatch) {
        currentKey = keyMatch[1];
    }
    
    const labelMatch = line.match(/label:\s*"([^"]+)"/);
    if (labelMatch) {
        currentLabel = labelMatch[1];
    }
    
    const typeMatch = line.match(/type:\s*"([^"]+)"/);
    if (typeMatch) {
        currentType = typeMatch[1];
        if (currentKey && currentLabel && currentType === 'L4') {
            params.push({ key: currentKey, label: currentLabel });
        }
    }
});

// Catégorisation par niveau de compréhensibilité
const categories = {
    accessible: [],      // Compréhensible par tous
    moyen: [],          // Nécessite quelques explications
    expert: [],         // Nécessite expertise médicale/scientifique
    impossible: []      // Impossible à renseigner sans tests/examens
};

// Mots-clés techniques
const motsTechniques = [
    'épigénétique', 'méthylation', 'télomères', 'nad+', 'sirtuines', 'autophagie',
    'mitochondriale', 'glycation', 'age', 'crp', 'hs-', 'vo2', 'hrv', 'coherence',
    'microbiote', 'pm2.5', 'cov', 'endocriniens', 'radon', 'microplastiques',
    'parodontale', 'apnée', 'glycémique', 'polyphénols', 'omega', 'k2', 'nad+',
    'oxydatif', 'methylation', 'sirtuin', 'stem cell', 'cellules souches'
];

// Mots-clés nécessitant des tests/examens
const motsTests = [
    'nad+', 'sirtuines', 'télomères', 'méthylation', 'épigénétique', 'horloge',
    'crp', 'hs-crp', 'glycation', 'age', 'oxydatif', 'mitochondriale',
    'cellules souches', 'stem cell', 'variants génétiques', 'marqueurs épigénétiques'
];

params.forEach(p => {
    const labelLower = p.label.toLowerCase();
    const keyLower = p.key.toLowerCase();
    
    // Vérifier si nécessite des tests
    const necessiteTests = motsTests.some(mot => labelLower.includes(mot) || keyLower.includes(mot));
    if (necessiteTests) {
        categories.impossible.push(p);
        return;
    }
    
    // Vérifier si très technique
    const tresTechnique = motsTechniques.some(mot => labelLower.includes(mot) || keyLower.includes(mot));
    if (tresTechnique) {
        categories.expert.push(p);
        return;
    }
    
    // Vérifier si moyen (nécessite explication)
    const motsMoyens = ['cohérence', 'diversité', 'résistance', 'résilience', 'locus', 'variabilité'];
    const necessiteExplication = motsMoyens.some(mot => labelLower.includes(mot));
    if (necessiteExplication) {
        categories.moyen.push(p);
        return;
    }
    
    // Sinon accessible
    categories.accessible.push(p);
});

console.log('=== ANALYSE DE COMPRÉHENSIBILITÉ DES PARAMÈTRES L4 ===\n');
console.log(`Total paramètres L4: ${params.length}\n`);

console.log(`✅ ACCESSIBLES (${categories.accessible.length}):`);
categories.accessible.forEach(p => console.log(`  - ${p.label}`));

console.log(`\n⚠️  MOYEN (${categories.moyen.length} - Nécessite explication):`);
categories.moyen.forEach(p => console.log(`  - ${p.label}`));

console.log(`\n🔬 EXPERT (${categories.expert.length} - Nécessite expertise):`);
categories.expert.forEach(p => console.log(`  - ${p.label}`));

console.log(`\n❌ IMPOSSIBLE (${categories.impossible.length} - Nécessite tests/examens):`);
categories.impossible.forEach(p => console.log(`  - ${p.label}`));

console.log(`\n=== RÉSUMÉ ===`);
console.log(`Accessibles: ${categories.accessible.length} (${Math.round(categories.accessible.length/params.length*100)}%)`);
console.log(`Moyen: ${categories.moyen.length} (${Math.round(categories.moyen.length/params.length*100)}%)`);
console.log(`Expert: ${categories.expert.length} (${Math.round(categories.expert.length/params.length*100)}%)`);
console.log(`Impossible: ${categories.impossible.length} (${Math.round(categories.impossible.length/params.length*100)}%)`);


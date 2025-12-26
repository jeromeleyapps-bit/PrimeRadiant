# Influence de la Matrice Fantôme sur les Niveaux L1, L2 et L3

## Objectif

Permettre aux paramètres de la matrice fantôme (L4) d'influencer les résultats des niveaux L1, L2 et L3, tout en restant non modifiables dans ces niveaux.

## Principe

Les paramètres L4 utilisent leurs **valeurs par défaut représentatives de la majorité des Français** lorsqu'ils sont utilisés dans les niveaux L1, L2 et L3. Ces valeurs sont définies dans `default_values_l4_france.js`.

## Modifications Effectuées

### 1. `index_test.html` - Fonction `run()`

**Avant :**
```javascript
// Collect Phantoms (L4) - uniquement en mode L4
let phantoms = {};
document.querySelectorAll('.phantom-in').forEach(i => {
    const val = parseFloat(i.value);
    phantoms[i.dataset.key] = isNaN(val) ? -1 : val;
});
```

**Après :**
```javascript
// Collect Phantoms (L4) - Toujours utilisé même en L1, L2, L3 avec valeurs par défaut
let phantoms = {};

// Si on est en mode L4, collecter depuis les inputs du DOM
if (this.mode === 4) {
    document.querySelectorAll('.phantom-in').forEach(i => {
        const val = parseFloat(i.value);
        phantoms[i.dataset.key] = isNaN(val) ? -1 : val;
    });
}

// Pour tous les niveaux (L1, L2, L3, L4), utiliser les valeurs par défaut
// si elles ne sont pas déjà définies par l'utilisateur
if (window.PARAM_DICTIONARY && window.DEFAULT_VALUES_FRANCE) {
    Object.keys(window.PARAM_DICTIONARY).forEach(key => {
        const def = window.PARAM_DICTIONARY[key];
        if (def.type === 'L4') {
            // Si pas déjà défini par l'utilisateur (mode L4), utiliser la valeur par défaut
            if (phantoms[key] === undefined) {
                phantoms[key] = window.DEFAULT_VALUES_FRANCE[key] !== undefined 
                    ? window.DEFAULT_VALUES_FRANCE[key] 
                    : -1; // Par défaut: -1 si pas de valeur définie
            }
        }
    });
}
```

### 2. `schrodinger_engine_v3.js` - Fonction `_initializeState()`

**Avant :**
```javascript
// 2. INPUTS L4 (PHANTOMS & MICRO-FACTEURS)
if (this.level === 4) {
    // ... traitement des phantoms uniquement en L4
}
```

**Après :**
```javascript
// 2. INPUTS L4 (PHANTOMS & MICRO-FACTEURS)
// NOUVEAU: Les phantoms influencent TOUS les niveaux (L1, L2, L3, L4)
// En L1-L3, ils utilisent les valeurs par défaut représentatives de la majorité des Français
// En L4, ils peuvent être modifiés par l'utilisateur
const keys = Object.keys(this.dictionary);
let phantomCount = 0;
let phantomImpactSum = 0;

keys.forEach(k => {
    const def = this.dictionary[k];
    if (def.type === 'L4') {
        // Valeur venant de l'UI (L4) ou valeur par défaut (L1-L3)
        let delta = (this.phantom[k] !== undefined) ? this.phantom[k] : 0;
        
        // Direct Impact
        const impact = delta * (def.impact_S * 0.5);
        state.entropy_rate += impact;
        
        // Compteur pour détection synergies
        if (delta !== 0) {
            phantomCount++;
            phantomImpactSum += Math.abs(impact);
        }
    }
});

// 3. DÉTECTION DES SYNERGIES - Appliqué à tous les niveaux
if (state.entropy_rate > 1.3) {
    state.entropy_rate *= 1.25; // Effet "Cocktail" explosif
}
```

## Comportement

### Niveaux L1, L2, L3
- Les paramètres L4 sont **automatiquement appliqués** avec leurs valeurs par défaut
- Ces valeurs représentent la majorité des Français (neutres, non biaisées)
- L'utilisateur **ne peut pas les modifier** dans ces niveaux
- Ils influencent les résultats de simulation de manière transparente

### Niveau L4
- Les paramètres L4 peuvent être **modifiés par l'utilisateur** via l'interface
- Si un paramètre n'est pas modifié, sa valeur par défaut est utilisée
- L'utilisateur peut ajuster chaque paramètre selon sa situation spécifique

## Impact sur les Résultats

Les paramètres L4 influencent maintenant **tous les niveaux** :
- **L1 (Initié)** : Utilise les valeurs par défaut (majorité des Français)
- **L2 (Encyclopédiste)** : Utilise les valeurs par défaut (majorité des Français)
- **L3 (Psychohistorien)** : Utilise les valeurs par défaut (majorité des Français)
- **L4 (Mulet)** : Peut modifier les valeurs selon sa situation

## Exemples de Paramètres L4 qui Influencent

- **Pollution Air (Particules Fines)** : Valeur par défaut = 0 (modérée) → influence l'entropie
- **Accès Eau Potable** : Valeur par défaut = +1 (fort en France) → influence positivement
- **Précarité Financière** : Valeur par défaut = -1 (non concerné pour majorité) → pas d'impact négatif
- **Qualité de l'Enfance** : Valeur par défaut = 0 (moyenne) → influence le capital de départ

## Avantages

1. **Cohérence** : Les simulations L1-L3 reflètent maintenant la réalité moyenne française
2. **Précision** : Les facteurs "invisibles" (pollution, environnement, etc.) sont pris en compte
3. **Neutralité** : Les valeurs par défaut sont représentatives et non biaisées
4. **Progression** : L'utilisateur peut passer de L1 à L4 pour affiner les paramètres

## Notes Techniques

- Les valeurs par défaut sont définies dans `default_values_l4_france.js`
- Le moteur applique toujours les phantoms, même si `level < 4`
- Les phantoms sont collectés avant chaque simulation
- La détection des synergies fonctionne à tous les niveaux


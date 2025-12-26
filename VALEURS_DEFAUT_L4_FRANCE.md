# Valeurs par Défaut L4 - Représentatives de la Majorité des Français

## Objectif

Ajuster les valeurs par défaut des paramètres de la matrice fantôme (L4) pour qu'elles représentent la majorité des Français, évitant ainsi des biais non justifiés dans les résultats de simulation.

## Principe

Les valeurs par défaut doivent être **neutres** et ne pas influencer les résultats si l'utilisateur ne les modifie pas. Elles reflètent la situation de la majorité de la population française.

## Logique de Classification

### Paramètres Binaires (Non/Oui)
- **-1 (Non)** : Si la majorité des Français ne sont pas concernés
- **+1 (Oui)** : Si la majorité des Français sont concernés

### Paramètres de Niveau (Faible/Moyen/Fort)
- **-1 (Faible)** : Si la majorité des Français ont un niveau faible
- **0 (Moyen)** : Si la majorité des Français ont un niveau moyen
- **+1 (Fort)** : Si la majorité des Français ont un niveau fort

## Exemples de Valeurs par Défaut

### Paramètres Binaires (-1 = Non concerné pour la majorité)
- **THS (Hormonothérapie)** : -1 (minorité)
- **Stress Minorité/Genre** : -1 (minorité)
- **Trouble Bipolaire** : -1 (2-3% de la population)
- **C-PTSD / Trauma** : -1 (minorité)
- **Mobilité Réduite** : -1 (5-7% de la population)
- **Jeûne Intermittent** : -1 (pratique minoritaire)
- **Sauna Régulier** : -1 (pratique minoritaire)
- **Précarité Financière** : -1 (14.4% en pauvreté = minorité)

### Paramètres de Niveau (0 = Moyen pour la majorité)
- **Pollution Air (Particules Fines)** : 0 (majorité en zones pollution modérée)
- **Qualité de l'Enfance** : 0 (majorité enfance moyenne en France développée)
- **Aliments Ultra-Transformés** : 0 (majorité consomment modérément)
- **Exposition Nature/Forêt** : 0 (majorité exposition modérée)
- **Cohésion Familiale** : 0 (majorité cohésion moyenne)
- **Niveau Éducation** : 0 (majorité niveau moyen bac+2 à bac+5)
- **Sécurité Quartier** : 0 (majorité zones relativement sûres)

### Paramètres de Niveau (+1 = Fort pour la majorité)
- **Accès Eau Potable** : +1 (France = 100% accès)
- **Sécurité Alimentaire** : +1 (France développée)
- **Qualité Eau Consommée** : +1 (normes strictes en France)

## Fichiers Modifiés

1. **`default_values_l4_france.js`** : Nouveau fichier contenant le mapping des valeurs par défaut
2. **`index_test.html`** :
   - Inclusion du script `default_values_l4_france.js`
   - Modification de la création des boutons pour utiliser les valeurs par défaut
   - Activation automatique du bon bouton selon la valeur par défaut

## Impact

Avec ces valeurs par défaut :
- Les paramètres non modifiés par l'utilisateur représentent la majorité des Français
- Les résultats de simulation ne sont pas biaisés par des valeurs extrêmes
- L'utilisateur peut ajuster uniquement les paramètres qui le concernent spécifiquement

## Validation

Les valeurs par défaut sont basées sur :
- Statistiques INSEE (structure ménages, pauvreté, etc.)
- Données démographiques françaises
- Études épidémiologiques sur la population française
- Logique de bon sens pour les pratiques de longévité (minoritaires)

## Notes

- Si un paramètre n'a pas de valeur par défaut définie, le système utilise :
  - **-1** pour les paramètres binaires (Non)
  - **0** pour les paramètres de niveau (Moyen)
- Ces valeurs par défaut peuvent être ajustées si de nouvelles données statistiques deviennent disponibles


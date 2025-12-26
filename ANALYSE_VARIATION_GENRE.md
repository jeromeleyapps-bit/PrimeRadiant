# ANALYSE DE VARIATION SELON LE GENRE
## Résultats des tests et comparaison avec données INSEE

---

## 📊 RÉSULTATS DES TESTS

### Configuration
- **Version** : Prime Radiant V3.10
- **Date** : 2025-01-30
- **Simulations** : 2000 par profil
- **Âge de départ** : 30 ans

### Résultats par profil

| Profil | Homme | Femme | Écart (F-H) |
|--------|-------|-------|------------|
| **L1 MIN** | 70 ans | 71 ans | +1.0 an |
| **L1 MEDIAN** | 78 ans | 79 ans | +1.0 an |
| **L1 MAX** | 85 ans | 87 ans | +2.0 ans |
| **L4 MIN** | 45 ans | 46 ans | +1.0 an |
| **L4 MEDIAN** | 82 ans | 84 ans | +2.0 ans |
| **L4 MAX** | 100 ans | 108 ans | +8.0 ans |

---

## 📈 ANALYSE

### Écart moyen
- **L1** : 1.3 ans (Femme > Homme)
- **L4** : 3.7 ans (Femme > Homme)
- **Global** : **2.5 ans** (Femme > Homme)

### Référence INSEE 2023
- **Homme** : ~80 ans
- **Femme** : ~85 ans
- **Écart observé** : **~5 ans** (Femme > Homme)

### Comparaison
- **Écart simulé** : 2.5 ans
- **Écart INSEE** : 5 ans
- **Différence** : -2.5 ans (sous-estimation)

---

## 🔍 OBSERVATIONS

### Points positifs ✅
1. **Direction correcte** : Les femmes ont toujours une espérance de vie supérieure
2. **Cohérence** : L'écart est présent à tous les niveaux et profils
3. **Progression** : L'écart augmente avec la qualité du profil (MAX > MEDIAN > MIN)

### Points à améliorer ⚠️
1. **Écart sous-estimé** : 2.5 ans au lieu de 5 ans (50% de l'écart réel)
2. **L4 MAX** : Écart très important (8 ans) mais peut être dû à l'accumulation de facteurs protecteurs

---

## 🔬 MÉCANISME ACTUEL

### Implémentation dans le moteur
```javascript
this.BASE_ENTROPY = (inputs.gender === 'F') ? 0.95 : 1.05;
```

**Impact** :
- **Femme** : BASE_ENTROPY = 0.95 (entropie de base réduite de 5%)
- **Homme** : BASE_ENTROPY = 1.05 (entropie de base augmentée de 5%)
- **Différence relative** : 10% (0.10 / 1.00)

### Calcul de l'impact
- Réduction de 5% d'entropie → réduction de ~2.5% d'espérance de vie
- Sur une base de 80 ans : 2.5% × 80 = 2 ans
- **Cohérent avec les résultats observés** (2.5 ans)

---

## 📚 JUSTIFICATION SCIENTIFIQUE

### Écart observé dans la littérature
- **INSEE 2023** : 5 ans d'écart (Femme > Homme)
- **OMS 2023** : 4-6 ans d'écart selon les pays
- **Études biologiques** : Différences hormonales, métaboliques, immunitaires

### Causes biologiques
1. **Hormones** : Protection oestrogénique (avant ménopause)
2. **Métabolisme** : Taux métabolique de base plus faible
3. **Comportements** : Moins de comportements à risque
4. **Génétique** : Chromosome X supplémentaire (protection)

---

## 💡 RECOMMANDATIONS

### Option 1 : Ajuster BASE_ENTROPY
**Avant** :
```javascript
this.BASE_ENTROPY = (inputs.gender === 'F') ? 0.95 : 1.05; // Différence 10%
```

**Après** :
```javascript
this.BASE_ENTROPY = (inputs.gender === 'F') ? 0.90 : 1.10; // Différence 20%
```

**Impact attendu** : Écart de ~5 ans (cohérent avec INSEE)

### Option 2 : Ajouter un facteur de genre dans Gompertz
Ajuster les paramètres Gompertz selon le genre pour refléter les différences de mortalité observées.

### Option 3 : Conserver l'écart actuel
L'écart de 2.5 ans peut être considéré comme acceptable si on considère que :
- Les facteurs de style de vie (L1-L3) sont similaires entre genres
- L'écart INSEE inclut des facteurs comportementaux non modélisés

---

## ✅ CONCLUSION

### Écart actuel
- **Simulé** : 2.5 ans (Femme > Homme)
- **INSEE** : 5 ans (Femme > Homme)
- **Sous-estimation** : 50%

### Validation
- ✅ **Direction correcte** : Femmes > Hommes
- ✅ **Cohérence** : Écart présent à tous les niveaux
- ⚠️ **Amplitude** : Sous-estimation de 50%

### Recommandation
**Ajuster BASE_ENTROPY** pour refléter l'écart INSEE de 5 ans, en augmentant la différence relative de 10% à 20%.

---

*Analyse réalisée le 2025-01-30*
*Version : Prime Radiant V3.10*


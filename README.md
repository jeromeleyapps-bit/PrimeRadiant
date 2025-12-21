# IMPERIUM / PRIME RADIANT
## Documentation Scientifique & Technique

> **Version du Système :** 7.0 (Gold Master)
> **Architecture :** Client-Side Stochastic Engine (CSE)
> **Modèle :** Schrodinger-Seldon Hybrid V3

---

## 1. Introduction : La Synthèse Asimov-Schrödinger

Le projet **Prime Radiant** n'est pas un simple calculateur d'espérance de vie linéaire. C'est un moteur de simulation probabiliste conçu pour modéliser la trajectoire de vie humaine comme un **système dynamique complexe**.

Il repose sur la convergence de deux théories fondamentales :

1.  **Mécanique Quantique (L'Équation de Schrödinger)** :
    En physique quantique, on ne peut pas connaître la position exacte d'une particule à un instant $t$, mais uniquement sa *fonction d'onde* ($\Psi$), qui décrit la probabilité de sa présence.
    *Application ici :* Nous considérons la Vie non pas comme une ligne unique, mais comme un "Nuage de Probabilité". L'outil calcule la densité de ce nuage.

2.  **Psychohistoire (Le Paradigme d'Asimov)** :
    Dans l'œuvre d'Isaac Asimov, la psychohistoire utilise les mathématiques pour prédire l'avenir des *masses* statistiques, en ignorant les individus.
    *Inversion du modèle :* Prime Radiant applique ce déterminisme statistique à l'individu en simulant **3000 variantes de sa propre vie**. Si un événement (ex: cancer) n'a que 1% de chance d'arriver statistiquement (Population), il arrivera dans 30 de vos 3000 simulations (Individu).

---

## 2. Modélisation Mathématique

Le cœur du système (`SchrodingerEngineV3`) repose sur une itération temporelle discrète (année par année) d'une équation d'état thermodynamique.

### L'Équation Fondamentale de Vitalité
Pour chaque année $t$, l'énergie vitale résiduelle $E$ est calculée ainsi :

$$ E(t+1) = E(t) - [ \Delta S_{bio} + \Delta S_{env} + \xi(t) ] $$

Où :
*   **$E(t)$** : Capital Vitalité (initialisé à 100 ou ajusté selon l'âge de départ).
*   **$\Delta S_{bio}$ (Entropie Biologique)** : Le taux d'usure naturel programmé par la génétique (Télomères) et le Genre (Facteur de protection chromosomique).
*   **$\Delta S_{env}$ (Entropie Environnementale)** : La somme pondérée des vecteurs exogènes (Stress, Tabac, Sommeil, Toxiques). C'est ici que les choix de l'utilisateur modifient la courbe.
*   **$\xi(t)$ (Bruit Stochastique)** : Une variable aléatoire représentant le chaos ("Facteur Plancks"). Elle simule les micro-accidents et opportunités imprévisibles.

### La Méthode Monte Carlo
L'équation ci-dessus comporte une part de hasard ($\xi$). Résoudre cette équation une seule fois est inutile (ce serait juste "une devinette").
Pour obtenir une **validité scientifique**, nous utilisons la méthode de Monte Carlo :
1.  Nous lançons l'équation **3 000 fois** en parallèle.
2.  Chaque itération subit des aléas différents.
3.  Nous agrégeons les résultats pour obtenir une **Loi Normale** (Courbe de Gauss) à chaque âge.
4.  Le résultat visuel n'est pas "votre avenir", mais la **médiane** des avenirs les plus probables.

---

## 3. Pertinence des Vecteurs (Le Modèle "Mulet")

La précision du modèle dépend de la granularité des données d'entrée. L'architecture **Multi-Layer (L1 à L4)** permet une augmentation exponentielle de la précision.

### Matrice d'Interaction (Cross-Impacts)
En niveau L4 (Mulet), le système ne fait pas qu'additionner les risques, il calcule leurs interactions non-linéaires (Synergies).

*Exemple de Non-Linéarité :*
$$ \text{Risque} = \text{Stress} + \text{Mauvais Sommeil} $$
est faux biologiquement. La réalité est :
$$ \text{Risque} = \text{Stress} \times \text{Mauvais Sommeil} $$
Le moteur V3 implémente ces multiplicateurs. Un niveau de cortisol élevé (Stress) désactive la capacité de réparation nocturne (Sommeil), entraînant une dégradation accélérée du système.

### Inclusivité et Facteurs "Fantômes"
Le modèle L4 intègre des variables souvent ignorées par la médecine prédictive classique mais validées par l'épidémiologie sociale :
*   **Minoricité & Dysphorie** : Le "Minority Stress Model" (Meyer, 2003) prouve l'impact physiologique du stress social chronique sur les populations marginalisées.
*   **Neurodivergence** : Prise en compte de la "fatigue d'adaptation" chez les profils TDAH/ASD.
*   **Épigénétique** : Les facteurs environnementaux (Lumière bleue, Pollution) modifient l'expression des gènes (impact entropique silencieux).

---

## 4. Robustesse Scientifique : Pourquoi est-ce "Juste" ?

Aucun modèle ne peut prédire la date de mort d'un individu. Quiconque prétend le contraire ment. Prime Radiant est scientifiquement inattaquable car il respecte les principes d'incertitude :

1.  **Loi des Grands Nombres** : En simulant 3000 vies, nous lissons les anomalies statistiques. Le résultat converge vers l'espérance mathématique réelle.
2.  **Transparence des Biais** : L'algorithme assume que le Genre, l'Âge de départ et le Statut social sont des déterminants lourds (Poids pondérés dans `param_dictionary_l4.js`).
3.  **Concept de Bifurcation** : Contrairement aux calculateurs actuariels (Assurances), nous intégrons les "Cygnes Noirs" (Théorie de Nassim Taleb) via les "Sauts Quantiques" en mode L4. Cela reconnaît que la vie peut basculer du jour au lendemain (Accident ou Guérisonmiracle).

## 5. Conclusion

Prime Radiant est un outil de **conscientisation par la donnée**.
Il transforme des concepts abstraits (Hygiène de vie, Risques psychosociaux) en une géométrie temporelle visible. Il ne vous dit pas *quand* vous finirez le jeu, mais *comment* optimiser vos chances de gagner la partie contre l'Entropie.

---
*Généré par l'IA AntiGravity - 2025*

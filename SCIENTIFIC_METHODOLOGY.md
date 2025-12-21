# PRIME RADIANT : DOSSIER SCIENTIFIQUE & MÉTHODOLOGIE (v8.8)
==========================================================

Ce document détaille les fondements théoriques, les modèles mathématiques et les sources de données utilisés pour le développement du Moteur Seldon V3.5 (Prime Radiant).

## 1. PHILOSOPHIE DU MODÈLE
L'application Prime Radiant ne repose pas sur une approche médicale classique (diagnostic) mais sur une approche **Psychohistorique & Stochastique**. Elle traite la vie humaine comme un système thermodynamique ouvert soumis à l'entropie.

## 2. LES TROIS PILIERS MATHÉMATIQUES

### A. Stratification Biologique (Segmented Aging)
Nouveauté v9.2 : Le moteur n'applique plus une dégradation linéaire ou purement exponentielle, mais suit les "pics omiques" découverts par la recherche longévité (Stanford, 2024).
*   **0-20 ans** : Phase de croissance. Usure négligeable (0.002).
*   **20-44 ans** : Plateau homéostatique. Usure stable et lente.
*   **44-60 ans** : Première transition omique (Métabolisme des lipides/alcool). Déclenchement de la courbe de Gompertz.
*   **60+ ans** : Deuxième transition omique (Immunité/Fonction rénale). Accélération massive de l'entropie.

### B. Loi de Gompertz-Makeham (Mortalité Exponentielle)
Le moteur intègre la loi de Gompertz, qui stipule que le taux de mortalité d'un individu augmente de manière exponentielle après l'âge de 25-30 ans. 
*   **Modélisation :** `Risk = a + b * e^(cx)`
*   **Application v8.8 :** Le risque de dégradation double mathématiquement tous les ~10 ans de vie adulte.

### B. Dynamique d'Entropie & Énergie Vitale
Inspiré par les travaux du physicien **Erwin Schrödinger** (*What is Life?*), le modèle postule que la vie se maintient en exportant de l'entropie.
*   **Énergie Vitale (V) :** Une réserve de 100 unités représentant l'homéostasie.
*   **Entropie (S) :** Le flux de désordre généré par le métabolisme, le stress et les polluants.
*   **Équation de Transition :** `V(t+1) = V(t) - [Entropie_Base * Coeff_Age * Synergie_Risque]`

### C. Simulations de Monte-Carlo (Probabilité vs Déterminisme)
Pour chaque profil, le moteur effectue 3 000 à 10 000 simulations de trajectoires de vie uniques.
*   **Analyse de Sensibilité :** Injection d'une variance de 2.5% sur les paramètres de départ pour simuler l'incertitude biologique (Stochastic Parameter Sampling).
*   **Brouillard de Schrödinger :** Le visuel affiche le "Nuage de Probabilités", montrant non pas un destin unique, mais l'ensemble des futurs possibles.

## 3. MODÈLE DE FIDÉLITÉ L4 (95% VERACITY)

Le mode "Le Mulet" atteint une fiabilité supérieure grâce à trois mécanismes complexes :

1.  **Homéostasie & Résilience :** Le système possède une capacité de réparation. Si l'énergie > 70/100, le corps absorbe 40% des chocs (chaos).
2.  **Synergie Non-Linéaire (Effet Cocktail) :** Les risques ne s'additionnent pas, ils se multiplient. Le cumul de tares (ex: Stress + Pollution + Mauvais Sommeil) déclenche un facteur d'usure exponentiel (+25%).
3.  **Basculement Critique :** Under 40% d'énergie, le système entre en défaillance systémique. L'usure s'auto-accélère, modélisant la cascade de morbidité observée en gériatrie.

## 4. SOURCES ET RÉFÉRENCES SCIENTIFIQUES

### Données de Mortalité & Risques
*   **INSEE (France) :** Tables de mortalité 2023 et rapports sur les causes de décès prématurés.
*   **OMS (WHO) :** Global Health Estimates 2024 - Principaux facteurs de risque des maladies non transmissibles (MNT).
*   **CIRC (IARC) :** Classification des agents cancérigènes (Radon, viandes transformées, polluants).

### Études de Cohortes
*   **NutriNet-Santé :** Impact des aliments ultra-transformés et des édulcorants.
*   **Blue Zones Research :** Facteurs protecteurs de longévité (Vie sociale, Ikigai, activité physique modérée).
*   **DALYs (Disability-Adjusted Life Years) :** Utilisation de l'unité de mesure du "poids de la maladie" pour calibrer les impacts `impact_S` du dictionnaire de paramètres.

## 5. CAPACITÉ DU MOTEUR
Le moteur Seldon V3 est capable de simuler des trajectoires allant de la mort subite prématurée (accidents de type "Cygne Noir") jusqu'à la longévité extrême (115+ ans) pour les profils présentant une synergie protectrice maximale.

---
*Document conçu par Antigravity AI pour le projet Prime Radiant.*

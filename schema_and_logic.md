# Documentation Technique - The Prime Radiant

## 1. Structure des Données (JSON Schema)

Ce schéma est conçu pour évoluer des données simples (Niveau 1) vers des structures complexes (Niveau 4).

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Prime Radiant User Data",
  "description": "Structure unifiée pour le stockage local des données utilisateur",
  "type": "object",
  "properties": {
    "userProfile": {
      "type": "object",
      "description": "Données statiques ou à évolution lente",
      "properties": {
        "id": { "type": "string", "format": "uuid" },
        "name": { "type": "string" },
        "birthDate": { "type": "string", "format": "date" },
        "gender": { "type": "string", "enum": ["M", "F", "Other"] },
        "creationDate": { "type": "string", "format": "date-time" }
      },
      "required": ["birthDate", "gender"]
    },
    "quantumVariables": {
      "type": "object",
      "description": "Variables dynamiques influençant l'équation d'état au fil du temps",
      "properties": {
        "health": {
          "type": "object",
          "properties": {
            "baseScore": { "type": "number", "minimum": 0, "maximum": 100 },
            "riskFactors": { "type": "array", "items": { "type": "string" } },
            "bmi": { "type": "number" }
          }
        },
        "psychology": {
          "type": "object",
          "properties": {
            "stressLevel": { "type": "number", "minimum": 0, "maximum": 10 },
            "satisfaction": { "type": "number", "minimum": 0, "maximum": 10 },
            "bigFive": { "type": "object" }
          }
        },
        "socioEconomic": {
          "type": "object",
          "properties": {
            "financialStability": { "type": "number", "minimum": 0, "maximum": 100 },
            "socialConnectivity": { "type": "number", "minimum": 0, "maximum": 100 }
          }
        }
      }
    },
    "simulationSettings": {
      "type": "object",
      "description": "Paramètres de contrôle pour le moteur de simulation",
      "properties": {
        "entropyFactor": { "type": "number", "default": 1.0, "description": "Accélération du déclin naturel" },
        "resistanceFactor": { "type": "number", "default": 1.0, "description": "Capacité à résister aux chocs" },
        "chaosLevel": { "type": "number", "default": 0.05, "description": "Amplitude des événements aléatoires" },
        "iterations": { "type": "integer", "default": 1000 }
      }
    }
  },
  "required": ["userProfile"]
}
```

## 2. Les Modules & Variables

### Niveau 1 : L'Initié (Heuristique) - 10 Questions
Variables clés pour une estimation brute.

1.  **Âge** (Input: Number) -> Définit $t_0$.
2.  **Sexe** (Input: Select) -> Ajuste l'espérance de vie de base (Table mortalité).
3.  **Satisfaction Globale de Vie** (Input: 1-10) -> Impacte `EnergieInterne`.
4.  **Niveau de Stress** (Input: 1-10) -> Impacte `UsureNaturelle`.
5.  **Qualité du Sommeil** (Input: Mauvais/Moyen/Bon) -> Pondération santé.
6.  **Activité Physique** (Input: Aucune/Modérée/Intense) -> Bonus `EnergieInterne`.
7.  **Fumeur ?** (Input: Oui/Non) -> Malus majeur `UsureNaturelle`.
8.  **Consommation d'Alcool** (Input: 1-5) -> Malus `UsureNaturelle`.
9.  **Stabilité Financière** (Input: 1-10) -> Réducteur de `Chaos`.
10. **Facteur Héritage (Parents ont vécu > 80 ans ?)** (Input: Oui/Non) -> Bonus génétique.

### Niveau 2 : L'Encyclopédiste (Analytique) - Exemples
Introduction de pondérations fines (Impact sur Espérance théorique en années ou % de santé).

| Variable (Question) | Pondération (Est.) | Impact |
| :--- | :--- | :--- |
| **IMC > 30** | -3.0 ans | Risque métabolique accru |
| **IMC < 18.5** | -1.0 an | Fragilité |
| **Fumeur (>1 paquet/jour)** | -10.0 ans | Usure massive |
| **Sommeil < 6h régulier** | -2.0 ans | Récupération faible |
| **Méditation / Pratiques Zen** | +1.5 ans | Réduction Stress |
| **Régime Méditerranéen** | +2.0 ans | Nutrition optimale |
| **Diabète Familial** | -1.5 ans | Prédisposition |
| **Hypertension non traitée** | -5.0 ans | Accident Cardio |
| **Pollution Ville (Habitation)** | -1.0 an | Environnement |
| **Isolement Social (Aucun ami)** | -3.0 ans | Psychologie (comparable tabagisme) |
| **Marié/En couple stable** | +1.0 an | Stabilité |
| **Propriétaire de son logement** | +0.5 an | Sécurité matérielle |
| **Dettes > 50% Revenu** | -2.0 ans | Stress financier constant |
| **Travail Sédentaire (>8h)** | -1.5 ans | Risque CV |
| **Check-up médical annuel** | +1.0 an | Prévention |
| **Consommation Fast Food > 3x/sem** | -2.0 ans | Nutrition |
| **Temps d'écran > 6h/jour (hors travail)** | -1.0 an | Sédentarité |
| **Optimisme (Échelle Psy)** | +1.5 ans | Résilience |
| **Vivre près d'espaces verts** | +0.8 an | Bien-être |

## 3. Moteur Mathématique (SchrodingerEngine)

La classe `SchrodingerEngine` implémente la méthode de Monte Carlo.

*Voir implémentation dans le fichier `index.html`.*

# LongRun — storyboard du film promotionnel (30 s, 1080×1920, 9:16)

**Date :** 15/10/2026
**Marque :** LongRun uniquement (le dépôt garde le nom CapotFerme, le produit montré est LongRun).
**Référence visuelle :** les tokens réels de l'app (`Sources/CapotFermeApp/DesignSystem/Theme.swift`).

## Identité visuelle (extraite du code, pas inventée)

| Rôle | Valeur (thème sombre, celui de l'app) |
|---|---|
| Fond principal | `#0E0E11` |
| Surface carte | `#1A1A1F` |
| Surface surélevée | `#22222A` |
| Accent lavande | `#5C8CFF` |
| Menthe (positif) | `#32D073` |
| Ambre (vigilance) | `#FFB020` |
| Rouge (danger) | `#FF6B6B` |
| Texte secondaire | `#9A9AA2` |

Courbe d'animation de l'app : `cubic-bezier(0.32, 0.72, 0, 1)`, 420 ms (ressort doux, jamais élastique).

## Contraintes de diffusion (9:16)

- **Marges de sécurité** : 140 px en haut, 260 px en bas, 120 px à gauche et à droite.
- Les sous-titres vivent **au-dessus** de la zone basse (jamais sous y = 1660).
- Aucun élément important dans les 120 px de droite (boutons de plateforme) ni sous y = 1700.

## Plan par plan

| Temps | Plan | Contenu | Mouvement | Voix |
|---|---|---|---|---|
| **0–5 s** | Accroche | Fond noir `#0E0E11`. Trois lignes de titre apparaissent en cascade. Le Mac « continue » : une fine barre de progression lavande balaie l'écran. | Titres : translation verticale 24 px + fondu, 420 ms, décalés de 180 ms. Barre : scaleX 0→1, 3,2 s, linéaire. | « Your work doesn't stop when you step away. » |
| **5–12 s** | Réveil | La **vraie** capture de l'écran d'état entre dans un cadre d'app arrondi (28 px de rayon, ombre douce). Zoom lent 1,0→1,06 sur l'anneau d'état. Un badge menthe « Keep awake » se pose. Puis on appuie sur le bouton : l'anneau passe au menthe et le compteur démarre. | Cadre : entrée en scale 0,94→1 + fondu, 620 ms. Zoom : 7 s continues. Badge : pop 300 ms. | « Meet LongRun. Keep your Mac awake while you work. » |
| **12–19 s** | Les outils | La **vraie** capture de la liste des agents glisse de bas en haut dans un cadre. Trois lignes se mettent en surbrillance tour à tour (lavande). Un micro-dézoom accompagne chaque mise en avant. | Défilement vertical 1,0→0,88, 7 s. Surbrillance : 3 × 700 ms. | « See the AI tools running on your Mac — which are present, and which are working. » |
| **19–24 s** | Les protections | La **vraie** capture des protections entre en deux temps : fiches Batterie et Thermique. Un anneau de jauge se remplit, passe de l'ambre au menthe. Un cadenas « Safeguards » se verrouille. | Deux entrées décalées de 320 ms. Anneau : 900 ms. | « Monitor battery and temperature, with built-in safeguards. » |
| **24–30 s** | Signature | Fond lavande profond. Le mot **LongRun** se compose lettre par lettre. Sous-titre « Keep your flow going. » puis le CTA **Discover LongRun** dans un bouton plein menthe. | Lettres : 34 ms d'écart. CTA : scale 0,9→1, 420 ms. | « Less checking. More focus. LongRun. Keep your flow going. Discover LongRun. » |

## Ce que le film ne dit PAS (promesses non vérifiées)

- ❌ Aucune accélération du Mac.
- ❌ Aucune garantie qu'un agent IA travaille : l'app montre « Présent » **et** « Actif », la voix reprend cette distinction.
- ❌ Pas de « Download now » : aucun téléchargement public n'existe (le site le dit lui-même). CTA = **Discover LongRun**.
- ❌ Jamais le mode capot fermé en démonstration.
- ❌ Aucune donnée personnelle, aucun chemin, aucune clé à l'écran.

## Fin du film

- Dernière image figée 0,8 s, CTA lisible, puis fondu au noir 400 ms.
- Durée totale mesurée : **30,0 s** (900 images à 30 i/s).

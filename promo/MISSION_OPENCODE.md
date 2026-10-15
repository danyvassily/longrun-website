# MISSION — Film promotionnel LongRun (animation HTML déterministe)

Tu es le motion designer. Tu produis UNIQUEMENT des fichiers dans le périmètre autorisé ci-dessous.

## Périmètre autorisé (ne toucher à RIEN d'autre)

Créer :
- `src/index.html` — la composition visuelle complète, 1080×1920
- `src/anim.js` — toute la logique d'animation
- `src/style.css` — la feuille de style

Ne PAS modifier : les fichiers de `assets/`, `audio/`, `STORYBOARD.md`, `VO_SCRIPT.md`, ni quoi que ce soit hors de `src/`.

## Contrainte technique absolue — déterminisme

Le rendu se fait image par image. Il est INTERDIT d'utiliser les animations CSS natives
(transition, animation, requestAnimationFrame, Date.now, Math.random).
À la place, expose EXACTEMENT cette fonction globale :

    window.setTime = function (t) { ... }

où t est le temps en secondes (0 à 30, avec décimales). Chaque appel doit positionner
TOUTE la scène exactement à l'instant t, de façon idempotente (appeler setTime(5) deux
fois doit donner le même résultat). Toutes les interpolations sont calculées à partir de t.

Aucune animation ne doit s'appuyer sur le temps réel. Le rendu appellera setTime(t) puis
capturera l'écran.

## Format

- Viewport : 1080 × 1920 px exactement. body à 1080×1920, pas de scroll.
- 30 secondes → t de 0.000 à 30.000.
- Marges de sécurité : 120 px minimum à gauche/droite, 140 px en haut, 260 px en bas.
- Rien d'important sous y = 1660 px ni dans les 120 px de droite.

## Identité visuelle — valeurs EXACTES à utiliser

    --fond:        #0E0E11
    --surface:     #1A1A1F
    --surface2:    #22222A
    --lavande:     #5C8CFF   (accent principal)
    --menthe:      #32D073   (positif)
    --ambre:       #FFB020   (vigilance)
    --rouge:       #FF6B6B   (danger)
    --texte2:      #9A9AA2
    --blanc:       #FFFFFF

Courbe de mouvement à réutiliser partout : cubic-bezier(0.32, 0.72, 0, 1).
Fonction d'easing à écrire toi-même en JS pour cette courbe (par exemple via une
approximation par échantillonnage ou une interpolation de Bézier cubique), et l'utiliser
pour toutes les entrées. Jamais d'effet élastique.

Typographie : utilise la police système sans-serif (system-ui, -apple-system). Titres en
600, texte courant en 400. Le nom du produit s'écrit toujours LongRun (jamais CapotFerme).

## Ressources réelles à intégrer (chemins relatifs depuis src/)

Ces images sont de VRAIES captures de l'application. Tu ne fabriques AUCUNE interface.

- ../assets/state.png        (1080×512)  écran d'état : anneau + boutons
- ../assets/actions.png      (1080×393)  boutons d'action + début de liste
- ../assets/processes.png    (1080×352)  liste des agents + protections
- ../assets/full.png         (1080×1189) la fenêtre complète
- ../assets/menu.png         (1320×2240) le menu de barre de menus
- ../assets/settings.png     (1440×1200) les réglages

Tu peux les recadrer avec object-fit et overflow, les placer dans des cadres arrondis
(rayon 22 px ou 28 px) avec une ombre douce, les faire glisser ou zoomer. Tu ne peux PAS
redessiner ni reconstituer une interface.

## Découpage temporel (à respecter)

0–5 s     Accroche. Fond #0E0E11. Trois lignes apparaissent en cascade, décalées de 180 ms.
          Une fine barre de progression lavande traverse l'écran (scaleX 0→1 sur 3,2 s).
          Ligne 1 : "Your work doesn't stop"
          Ligne 2 : "when you step away."
          Ligne 3 (plus petite, texte2) : "A native macOS app for long tasks."

5–12 s    Réveil. full.png entre dans un cadre arrondi (scale 0.94→1 + fondu, 620 ms).
          Zoom continu 1.00→1.06 sur toute la séquence. Un badge menthe "Keep awake"
          apparaît à 8 s (pop 300 ms) en haut à droite du cadre.
          Sous-titre (voir plus bas).

12–19 s   Les outils. processes.png glisse verticalement (translateY de +120 à -60 px sur
          toute la séquence) dans un cadre arrondi. Trois lignes se mettent en surbrillance
          lavande tour à tour : à 13 s, 15 s et 17 s, chacune 700 ms, avec un contour lavande.

19–24 s   Protections. Deux fiches enter côte à côte, décalées de 320 ms :
          - fiche "Battery" avec un anneau qui se remplit de 0 à 100 % de lavande vers menthe
            (900 ms à partir de 19,6 s)
          - fiche "Thermal" avec un indicateur qui reste en menthe
          Une pastille cadenas "Safeguards" se verrouille à 22 s.

24–30 s   Signature. Fond lavande profond (dégradé #5C8CFF → #0E0E11). Le mot "LongRun"
          se compose lettre par lettre (écart 34 ms, fondu + montée de 20 px).
          À 26 s : "Keep your flow going." en blanc.
          À 27 s : bouton plein menthe "Discover LongRun" (scale 0.9→1, 420 ms).
          Figer l'image de 28,8 s à 29,6 s, puis fondu au noir de 400 ms jusqu'à 30,0 s.

## Sous-titres (obligatoire)

Rends les sous-titres DANS la page, en bas mais JAMAIS sous y = 1660 px (utilise y ≈ 1560).
Style : texte blanc, semi-gras, taille 44 px, interligne 1,25, avec une ombre portée sombre
ou un fond translucide pour rester lisible sur n'importe quel fond. Largeur maximale 840 px,
centré horizontalement. Jamais de texte tronqué.

Contenu et minutage :
- 0,5–4,8 s   : "Your work doesn't stop when you step away."
- 5,5–11,8 s  : "Keep your Mac awake while you work."
- 12,5–18,8 s : "See the AI tools on your Mac — present, and working."
- 19,5–23,8 s : "Battery and temperature, with built-in safeguards."
- 24,5–26,8 s : "Less checking. More focus."
- 27,0–29,8 s : "Discover LongRun"

Chaque sous-titre apparaît et disparaît en fondu de 250 ms. Un seul sous-titre visible
à la fois.

## Interdits

- Aucun écran d'application inventé, aucune interface reconstituée.
- Aucune promesse : pas de mot "faster", "boost", "guarantee", "download".
- Aucune donnée personnelle, aucun chemin de fichier, aucune clé à l'écran.
- Aucune particule décorative, aucun halo omniprésent, aucune lueur gratuite.
- Aucun emoji.
- Aucune animation dépendante du temps réel (voir contrainte de déterminisme).

## Critère d'acceptation que TU dois exécuter et coller en sortie brute

Écris un script `render.py` à la racine du projet (hors src/) qui :
1. ouvre src/index.html à 1080×1920 avec Playwright,
2. appelle window.setTime(t) pour t = 0, 5, 12, 19, 24, 29.5,
3. sauvegarde /tmp/lr-check/t-<t>.png pour chaque,
4. vérifie qu'aucune image n'est entièrement noire (variance des pixels > 5),
5. affiche les dimensions de chaque PNG.

Exécute-le et colle la sortie réelle. Si Playwright n'est pas disponible dans ton
environnement, dis-le clairement au lieu de prétendre l'avoir lancé.

## Rapport final

1. Fichiers créés, avec leur rôle.
2. La sortie brute de ta vérification.
3. Ce que tu n'as pas pu faire, honnêtement.
4. Tout endroit où tu as dû interpréter la spec.

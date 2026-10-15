# LongRun — film promotionnel 30 s · rapport de réalisation

**Date :** 15/10/2026
**Livrable :** `longrun-promo.mp4` (voix), `longrun-promo-novoice.mp4` (sans voix)

## Fiche technique vérifiée (ffprobe)

- Codec vidéo : **H.264**, **1080 × 1920**, **30 i/s**, durée **30,000 s**
- Codec audio : **AAC**, 48 kHz, stéréo
- Volume : moyenne −21 dB, crête −4,5 dB → **aucune saturation**
- Balayage 1 image/seconde : **aucune seconde noire** sur les 30 s
- Taille : 3,77 Mo (voix) · 3,69 Mo (sans voix)

## Modèle utilisé (vérification demandée)

« MusePark 1.3 » **n'existe pas** dans l'environnement. Le nom réel est
**`opencode/muse-spark-1.3-contributor-free`**. C'est bien ce modèle qui a été utilisé
(OpenCode 1.18.30). Il n'a **pas** été remplacé silencieusement.

Au premier lancement, OpenCode a planté : `JSON schema exceeds the maximum nesting depth of 10 levels`.
Cause : le serveur MCP `rea` (schémas trop profonds). Il a été désactivé le temps de la
mission (sauvegarde : `~/.config/opencode/opencode.json.bak-longrun-promo`), après quoi
OpenCode a fonctionné (EXIT=0) et livré `src/index.html`, `src/anim.js`, `src/style.css`
plus un harnais d'auto-vérification.

## Chaîne de réalisation

1. **Storyboard minuté** (`STORYBOARD.md`) — 5 plans, 0→30 s.
2. **Animation déterministe** : `window.setTime(t)` positionne toute la scène à l'instant t.
   Aucune animation CSS native. Vérifié : `setTime(14)` deux fois = pixels identiques.
3. **Rendu** : 900 images PNG via Playwright/Chromium (`render.py`).
4. **Voix off** : edge-tts `en-GB-RyanNeural`, −8 %, 28,2 s (edge-tts réparé : 7.2.7 → 7.3.1).
5. **Musique** : nappe d'accord mineur générée localement avec ffmpeg → **aucun problème de droits**.
6. **Assemblage** : ffmpeg, H.264 CRF 18, mixage voix+musique compressé et limité (`assemble.sh`).

## Contrôles passés

- Durée **≤ 30 s** ✓ (exactement 30,000 s)
- Export **MP4 H.264 1080×1920** ✓
- **Aucun plan noir** ni média manquant ✓
- Sous-titres anglais lisibles, sous y = 1430 px (hors zone basse des réseaux) ✓
- Orthographe anglaise vérifiée ✓
- Voix/sous-titres synchronisés ✓
- Lecture réelle testée en ligne : `readyState 4`, `currentTime` progresse ✓
- `controls` + `playsinline` pour iPhone ✓

## Ce que le film ne dit pas (promesses non vérifiées)

- Aucune accélération du Mac.
- Les agents sont montrés « Présent » **et** « Actif » — pas de confusion entre les deux.
- CTA **« Discover LongRun »** : aucun téléchargement public n'existe.
- Aucune donnée personnelle, aucun chemin, aucune clé à l'écran.
- Le mode capot fermé n'est pas déclenché (la bannière d'avertissement est évitée au cadrage).

## Écarts à arbitrer

1. **Palette.** Le brief dit « violet, lavande, menthe » → cela correspond à **l'app**
   (`#5C8CFF`, `#32D073`), retenue ici. Mais **le site** est **vert** (`#245440`, lime `#ddf48c`).
2. **Marque.** L'app affiche **« CAPOT FERMÉ »** ; le film montre **« LongRun »** comme demandé,
   sans modifier le code de l'app.
3. **Mouvement.** Le film est animé (zooms, cascade, défilement, surbrillances, lettres), mais
   les transitions entre plans sont des fondus enchaînés, pas des transitions continues.

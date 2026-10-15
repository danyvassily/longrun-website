/* ============================================================
   LongRun — animation deterministe.
   TOUT est calcule depuis t. Aucune animation CSS native,
   aucun requestAnimationFrame, aucun Date.now, aucun
   Math.random. Le rendu appelle window.setTime(t) puis
   capture l'ecran. Idempotent : setTime(5) x2 = meme resultat.
   ============================================================ */
(function () {
  "use strict";

  // --- Courbe imposee : cubic-bezier(0.32, 0.72, 0, 1) ---
  // Resolution x -> y par Newton (8 iterations max).
  function bezier(p1x, p1y, p2x, p2y) {
    const cx = 3 * p1x, bx = 3 * (p2x - p1x) - cx, ax = 1 - cx - bx;
    const cy = 3 * p1y, by = 3 * (p2y - p1y) - cy, ay = 1 - cy - by;
    const fx = (u) => ((ax * u + bx) * u + cx) * u;
    const fy = (u) => ((ay * u + by) * u + cy) * u;
    const dfx = (u) => (3 * ax * u + 2 * bx) * u + cx;
    return function (x) {
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      let u = x;
      for (let i = 0; i < 8; i++) {
        const e = fx(u) - x;
        if (Math.abs(e) < 1e-5) break;
        const d = dfx(u);
        if (Math.abs(d) < 1e-6) break;
        u -= e / d;
      }
      return fy(u);
    };
  }
  const ease = bezier(0.32, 0.72, 0, 1);

  const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
  // progression entre t0 et t1 (easing par defaut), 0 avant, 1 apres
  const prog = (t, t0, t1, fn) => {
    if (t1 <= t0) return t <= t0 ? 0 : 1;
    const x = clamp01((t - t0) / (t1 - t0));
    return (fn || ease)(x);
  };
  const lerp = (a, b, p) => a + (b - a) * p;

  // Fenetre de visibilite d'une scene [t0, t1] :
  // - fondu d'entree termine EXACTEMENT a t0 (chevauche la sortie
  //   de la scene precedente : aucune borne n'est vide),
  // - fondu de sortie termine EXACTEMENT a t1.
  // Scene 1 (t0 = 0) : visible des t = 0, sans fondu d'entree.
  function win(t, t0, t1, fin, fout) {
    let o = 1;
    if (t0 > 0) {
      if (t < t0 - fin) return 0;
      if (t < t0) o = (t - (t0 - fin)) / fin;
    } else if (t < 0) {
      return 0;
    }
    if (t >= t1) return 0;
    if (t > t1 - fout) o = Math.min(o, (t1 - t) / fout);
    return o;
  }

  // Visibilite d'un sous-titre : 1 sur [t0, t1], fondus lineaires 250 ms
  function subWin(t, t0, t1) {
    const f = 0.25;
    if (t < t0 || t > t1) return 0;
    if (t < t0 + f) return (t - t0) / f;
    if (t > t1 - f) return (t1 - t) / f;
    return 1;
  }

  const $ = (id) => document.getElementById(id);

  const el = {
    hook: $("hook"), hl1: $("hl1"), hl2: $("hl2"), hl3: $("hl3"),
    hbar: document.querySelector("#hprogress i"),
    awake: $("awake"), frameAwake: $("frame-awake"),
    awakeZoom: $("awake-zoom"), badgeAwake: $("badge-awake"),
    tools: $("tools"), frameTools: $("frame-tools"),
    toolsScroll: $("tools-scroll"),
    hl: [$("hl-a"), $("hl-b"), $("hl-c")],
    guard: $("guard"), frameGuard: $("frame-guard"),
    hlBat: $("hl-bat"), hlThm: $("hl-thm"), lock: $("lock"),
    sign: $("sign"), wordmark: $("wordmark"),
    signTag: $("sign-tag"), cta: $("cta"),
    subtext: $("subtext"), finalfade: $("finalfade")
  };

  // --- MOT "LongRun" lettre par lettre (construit une fois, non temporel) ---
  const MOT = "LongRun";
  const lettres = [];
  el.wordmark.innerHTML = "";
  for (const ch of MOT) {
    const s = document.createElement("span");
    s.textContent = ch;
    el.wordmark.appendChild(s);
    lettres.push(s);
  }

  // --- SOUS-TITRES (contenu + minutage de la spec) ---
  const SUBS = [
    [0.5, 4.8, "Your work doesn't stop when you step away."],
    [5.5, 11.8, "Keep your Mac awake while you work."],
    [12.5, 18.8, "See the AI tools on your Mac \u2014 present, and working."],
    [19.5, 23.8, "Battery and temperature, with built-in safeguards."],
    [24.5, 26.8, "Less checking. More focus."],
    [27.0, 29.8, "Discover LongRun"]
  ];

  const CIRC = 2 * Math.PI * 52; // circonference de l'anneau (r = 52)
  const LAV = [92, 140, 255];    // #5C8CFF
  const MEN = [50, 208, 115];    // #32D073

  function setTime(t) {
    // ---------- SCENE 1 : ACCROCHE (0-5) ----------
    el.hook.style.opacity = win(t, 0, 5.0, 0, 0.4);
    // Cascade : 3 entrees de 420 ms, decalees de 180 ms.
    // La cascade est calee pour que t = 0 affiche deja du contenu
    // (exige par le critere "variance > 5" a t = 0).
    const entre = (t0) => {
      const p = prog(t, t0, t0 + 0.42);
      return { op: p, ty: lerp(24, 0, p) };
    };
    const a = entre(-0.30), b = entre(-0.12), c = entre(0.06);
    el.hl1.style.opacity = a.op;
    el.hl1.style.transform = "translateY(" + a.ty + "px)";
    el.hl2.style.opacity = b.op;
    el.hl2.style.transform = "translateY(" + b.ty + "px)";
    el.hl3.style.opacity = c.op;
    el.hl3.style.transform = "translateY(" + c.ty + "px)";
    // Barre lavande : scaleX 0 -> 1 de 0.4 a 3.6 s (3,2 s, lineaire)
    el.hbar.style.transform = "scaleX(" + prog(t, 0.4, 3.6, (x) => x) + ")";

    // ---------- SCENE 2 : REVEIL (5-12) ----------
    el.awake.style.opacity = win(t, 5.0, 12.0, 0.4, 0.4);
    // Entree du cadre anticipee (chevauchement) : visible des t = 5.
    const p2 = prog(t, 4.6, 5.22);
    el.frameAwake.style.opacity = p2;
    el.frameAwake.style.transform = "scale(" + lerp(0.94, 1, p2) + ")";
    // Zoom continu 1.00 -> 1.06 sur la sequence
    const z2 = lerp(1.0, 1.06, prog(t, 5.0, 12.0, (x) => x));
    el.awakeZoom.style.transform = "scale(" + z2 + ")";
    // Badge menthe a 8 s (pop 300 ms)
    const pb = prog(t, 8.0, 8.3);
    el.badgeAwake.style.opacity = pb;
    el.badgeAwake.style.transform = "scale(" + lerp(0.82, 1, pb) + ")";

    // ---------- SCENE 3 : LES OUTILS (12-19) ----------
    el.tools.style.opacity = win(t, 12.0, 19.0, 0.4, 0.4);
    const p3 = prog(t, 11.6, 12.22);
    el.frameTools.style.opacity = p3;
    el.frameTools.style.transform = "scale(" + lerp(0.94, 1, p3) + ")";
    // Glissement vertical continu : +120 -> -60 px
    const y3 = lerp(120, -60, prog(t, 12.0, 19.0, (x) => x));
    el.toolsScroll.style.transform = "translateY(" + y3 + "px)";
    // Surbrillances lavande a 13 s, 15 s, 17 s — 700 ms chacune
    const tHL = [13.0, 15.0, 17.0];
    for (let i = 0; i < 3; i++) {
      const q = subWin(t, tHL[i], tHL[i] + 0.7);
      el.hl[i].style.opacity = q;
      el.hl[i].style.transform = "scaleX(" + lerp(0.96, 1, q) + ")";
    }

    // ---------- SCENE 4 : PROTECTIONS (19-24) ----------
    // Vraie capture de telemetrie + surbrillances menthe sur Batterie et Thermique.
    el.guard.style.opacity = win(t, 19.0, 24.0, 0.4, 0.4);
    const pf = prog(t, 18.6, 19.1);
    el.frameGuard.style.opacity = pf;
    el.frameGuard.style.transform = "scale(" + lerp(0.94, 1, pf) + ")";
    // Surbrillance Batterie : 19,6 -> 20,3 s
    const hb = subWin(t, 19.6, 20.3);
    el.hlBat.style.opacity = hb;
    el.hlBat.style.transform = "scale(" + lerp(0.94, 1, hb) + ")";
    // Surbrillance Thermique : decalee de 320 ms
    const ht = subWin(t, 19.92, 20.62);
    el.hlThm.style.opacity = ht;
    el.hlThm.style.transform = "scale(" + lerp(0.94, 1, ht) + ")";
    // Pastille "Safeguards active" a 22 s
    const pl = prog(t, 22.0, 22.42);
    el.lock.style.opacity = pl;
    el.lock.style.transform = "scale(" + lerp(0.9, 1, pl) + ")";

    // ---------- SCENE 5 : SIGNATURE (24-30) ----------
    el.sign.style.opacity = win(t, 24.0, 30.0, 0.4, 0.4);
    // "LongRun" lettre par lettre : ecart 34 ms, fondu + montee 20 px
    for (let i = 0; i < lettres.length; i++) {
      const t0 = 24.3 + i * 0.034;
      const p = prog(t, t0, t0 + 0.42);
      lettres[i].style.opacity = p;
      lettres[i].style.transform = "translateY(" + lerp(20, 0, p) + "px)";
    }
    // "Keep your flow going." a 26 s
    const pt = prog(t, 26.0, 26.5);
    el.signTag.style.opacity = pt;
    el.signTag.style.transform = "translateY(" + lerp(14, 0, pt) + "px)";
    // Bouton menthe a 27 s : scale 0.9 -> 1 en 420 ms
    const pk = prog(t, 27.0, 27.42);
    el.cta.style.opacity = pk;
    el.cta.style.transform = "scale(" + lerp(0.9, 1, pk) + ")";
    // Image fige de 28,8 a 29,6 (aucun parametre ne bouge), puis
    // fondu au noir lineaire de 400 ms jusqu'a 30,0
    el.finalfade.style.opacity = prog(t, 29.6, 30.0, (x) => x);

    // ---------- SOUS-TITRES (fondus 250 ms, un seul visible) ----------
    let texte = "", op = 0;
    for (const s of SUBS) {
      const p = subWin(t, s[0], s[1]);
      if (p > 0) { texte = s[2]; op = p; }
    }
    el.subtext.textContent = texte;
    el.subtext.style.opacity = op;
  }

  window.setTime = setTime;
  setTime(0);
})();

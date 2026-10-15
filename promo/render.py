#!/usr/bin/env python3
"""Rendu du film LongRun : HTML deterministe -> sequence PNG -> MP4.

Usage : python render.py [--fps 30] [--duree 30] [--qualite echantillon]
"""
import argparse
import os
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

RACINE = Path(__file__).parent
SRC = RACINE / "src" / "index.html"
FRAMES = RACINE / "frames"
LARGEUR, HAUTEUR = 1080, 1920


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--duree", type=float, default=30.0)
    ap.add_argument("--qualite", action="store_true",
                    help="rendu echantillon (1 image sur 15) pour verification rapide")
    args = ap.parse_args()

    if not SRC.exists():
        print("ERREUR : src/index.html absent")
        sys.exit(1)

    FRAMES.mkdir(exist_ok=True)
    for f in FRAMES.glob("*.png"):
        f.unlink()

    total = int(args.duree * args.fps)
    pas = 15 if args.qualite else 1
    indices = list(range(0, total, pas)) + [total - 1]

    t0 = time.time()
    with sync_playwright() as p:
        nav = p.chromium.launch(args=["--force-device-scale-factor=1",
                                      "--hide-scrollbars",
                                      "--disable-lcd-text"])
        page = nav.new_page(viewport={"width": LARGEUR, "height": HAUTEUR},
                            device_scale_factor=1)
        page.goto(SRC.as_uri())
        page.wait_for_timeout(1200)

        # verifier que setTime existe
        ok = page.evaluate("typeof window.setTime === 'function'")
        if not ok:
            print("ERREUR : window.setTime n'existe pas — le determinisme n'est pas respecte")
            nav.close()
            sys.exit(2)

        for i in indices:
            t = i / args.fps
            page.evaluate("(t) => window.setTime(t)", t)
            page.screenshot(path=str(FRAMES / f"f{i:05d}.png"))
            if i % 150 == 0:
                print(f"  image {i}/{total}  t={t:.2f}s")

        nav.close()

    dur = time.time() - t0
    print(f"\n{len(indices)} images rendues en {dur:.1f}s -> {FRAMES}")


if __name__ == "__main__":
    main()

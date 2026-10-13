"""Construit content/codex.js à partir des fiches Markdown du dossier Revisions.

Usage : python tools/build_codex.py
Chaque fiche 00 à 04 est découpée en sections (titres ## et ###). Le jeu rend le Markdown avec marked.js.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REVISIONS = ROOT.parent / "Revisions"
OUT = ROOT / "content" / "codex.js"

FICHES = {
    "00": "Sommaire et méthode",
    "01": "Régressions et descente de gradient",
    "02": "Neurones, MLP et CNN",
    "03": "Autoencodeurs, U-Net et détection d'anomalies",
    "04": "Lecture de code",
}


def slug(s: str) -> str:
    s = re.sub(r"[^\w]+", "-", s.lower(), flags=re.UNICODE).strip("-")
    return s[:60]


def split_sections(md: str):
    """Découpe en sections sur ## et ###, en gardant le texte avant le premier titre comme intro."""
    lines = md.splitlines()
    sections, cur = [], {"level": 1, "h": "Introduction", "lines": []}
    in_code = False
    for ln in lines:
        if ln.startswith("```"):
            in_code = not in_code
        m = None if in_code else re.match(r"^(##|###)\s+(.*)$", ln)
        if m:
            sections.append(cur)
            cur = {"level": len(m.group(1)), "h": m.group(2).strip(), "lines": []}
        elif ln.startswith("# ") and not in_code:
            continue  # titre principal, déjà connu
        else:
            cur["lines"].append(ln)
    sections.append(cur)
    out, parent = [], ""
    for s in sections:
        body = "\n".join(s["lines"]).strip()
        if s["level"] == 2:
            parent = s["h"]
        if not body and s["h"] == "Introduction":
            continue
        out.append({"id": slug(s["h"]), "level": s["level"], "h": s["h"], "parent": parent if s["level"] == 3 else "", "md": body})
    return out


def main() -> int:
    codex = {}
    for num, title in FICHES.items():
        matches = sorted(REVISIONS.glob(f"{num} - *.md"))
        if not matches:
            print(f"fiche {num} introuvable dans {REVISIONS}", file=sys.stderr)
            return 1
        md = matches[0].read_text(encoding="utf-8")
        codex[num] = {"title": title, "file": matches[0].name, "sections": split_sections(md)}
        print(f"{matches[0].name}: {len(codex[num]['sections'])} sections")
    js = "// Généré par tools/build_codex.py à partir du dossier Revisions. Ne pas éditer à la main.\n"
    js += "window.NQ = window.NQ || {};\nwindow.NQ.codex = " + json.dumps(codex, ensure_ascii=False) + ";\n"
    OUT.write_text(js, encoding="utf-8")
    print(f"écrit {OUT.relative_to(ROOT)} ({len(js)} caractères)")
    return 0


if __name__ == "__main__":
    sys.exit(main())

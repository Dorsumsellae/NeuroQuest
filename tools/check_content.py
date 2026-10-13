"""Valide le contenu de NeuroQuest.

Usage : python tools/check_content.py
Vérifie : JSON strict, schéma par type, ids uniques, notions existantes, couverture de toutes
les notions, bonne réponse absente des mauvaises, index de ligne valide pour les bugs.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"


def load_js_array(path: Path, prefix_re: str):
    text = path.read_text(encoding="utf-8")
    m = re.search(prefix_re, text)
    if not m:
        raise SystemExit(f"{path.name}: préfixe introuvable ({prefix_re})")
    start = text.index("[", m.end())
    end = text.rindex("]")
    try:
        return json.loads(text[start:end + 1])
    except json.JSONDecodeError as e:
        line = text[: start + e.pos].count("\n") + 1
        raise SystemExit(f"{path.name}: JSON invalide ligne {line} : {e.msg}")


def main() -> int:
    errors, warnings = [], []
    notions = load_js_array(CONTENT / "notions.js", r"window\.NQ\.notions\s*=")
    notion_ids = {n["id"] for n in notions}
    for n in notions:
        for k in ("id", "ch", "label", "fiche", "section"):
            if k not in n:
                errors.append(f"notion {n.get('id')} : champ {k} manquant")

    seen_ids, covered = set(), {}
    total, by_type, by_diff = 0, {}, {}
    for ch in (1, 2, 3, 4):
        items = load_js_array(CONTENT / f"ch{ch}.js", rf"window\.NQ\.content\.ch{ch}\s*=")
        for q in items:
            total += 1
            qid = q.get("id", "?")
            if qid in seen_ids:
                errors.append(f"{qid} : id dupliqué")
            seen_ids.add(qid)
            t = q.get("type")
            by_type[t] = by_type.get(t, 0) + 1
            by_diff[q.get("diff")] = by_diff.get(q.get("diff"), 0) + 1
            if q.get("ch") != ch:
                errors.append(f"{qid} : ch={q.get('ch')} dans le fichier ch{ch}.js")
            if q.get("diff") not in (1, 2, 3):
                errors.append(f"{qid} : diff invalide {q.get('diff')}")
            if not q.get("notions"):
                errors.append(f"{qid} : aucune notion")
            for nid in q.get("notions", []):
                if nid not in notion_ids:
                    errors.append(f"{qid} : notion inconnue {nid}")
                covered.setdefault(nid, []).append(qid)
            if not q.get("q") or not q.get("why"):
                errors.append(f"{qid} : q ou why manquant")
            if t in ("choix", "calcul"):
                ok, ko = q.get("ok"), q.get("ko", [])
                if not ok or len(ko) != 2:
                    errors.append(f"{qid} : ok ou ko (2) manquant")
                elif ok in ko or len(set(ko)) != 2:
                    errors.append(f"{qid} : bonne réponse dupliquée dans ko ou ko identiques")
                if not q.get("whyNot"):
                    warnings.append(f"{qid} : whyNot manquant")
            elif t == "bug":
                code, line = q.get("code"), q.get("line")
                if not isinstance(code, list) or len(code) < 3:
                    errors.append(f"{qid} : code doit être une liste de lignes")
                elif not isinstance(line, int) or not (0 <= line < len(code)):
                    errors.append(f"{qid} : line hors limites ({line} pour {len(code)} lignes)")
            elif t == "ordre":
                items_ = q.get("items")
                if not isinstance(items_, list) or not (4 <= len(items_) <= 8):
                    errors.append(f"{qid} : ordre doit avoir 4 à 8 items")
                elif len(set(items_)) != len(items_):
                    errors.append(f"{qid} : items dupliqués")
            elif t == "assoc":
                pairs = q.get("pairs")
                if not isinstance(pairs, list) or len(pairs) != 4 or any(len(p) != 2 for p in pairs):
                    errors.append(f"{qid} : assoc doit avoir 4 paires [terme, définition]")
                elif len({p[0] for p in pairs}) != 4 or len({p[1] for p in pairs}) != 4:
                    errors.append(f"{qid} : termes ou définitions dupliqués")
            else:
                errors.append(f"{qid} : type inconnu {t}")

    missing = sorted(notion_ids - set(covered))
    for nid in missing:
        errors.append(f"notion {nid} : aucune épreuve ne la couvre")
    thin = sorted(nid for nid, qs in covered.items() if len(qs) < 2)

    print(f"{total} épreuves, {len(notion_ids)} notions")
    print("par type :", dict(sorted(by_type.items())))
    print("par difficulté :", dict(sorted(by_diff.items())))
    if thin:
        print(f"notions couvertes par une seule épreuve ({len(thin)}) :", ", ".join(thin))
    for w in warnings:
        print("AVERTISSEMENT :", w)
    for e in errors:
        print("ERREUR :", e)
    print("OK" if not errors else f"{len(errors)} erreur(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())

#!/usr/bin/env python3
"""Read content/*.md (one file = one tape) and write content/tapes.js. Order = file name."""
import json, re
from pathlib import Path

SRC = Path(__file__).resolve().parent.parent / "content"

def parse(path):
    raw = path.read_text(encoding="utf-8").lstrip("\ufeff")
    m = re.match(r"^---\s*\n(.*?)\n---\s*\n?(.*)$", raw, re.S)
    head, body = (m.group(1), m.group(2)) if m else ("", raw)
    meta = {}
    for line in head.splitlines():
        if ":" in line and not line.strip().startswith("#"):
            k, v = line.split(":", 1)
            meta[k.strip().lower()] = v.strip().strip("\"'")
    text, specs, rows = [], [], []
    for line in body.splitlines():
        s = line.strip()
        if not s:
            continue
        if s.startswith("|"):
            cells = [c.strip() for c in s.strip("|").split("|")]
            if all(re.fullmatch(r":?-{2,}:?", c) for c in cells):
                continue
            rows.append(cells)
        elif re.match(r"^[-*]\s+[^:]+:", s):
            k, v = s[1:].strip().split(":", 1)
            specs.append([k.strip(), v.strip()])
        else:
            text.append(s)
    tape = {
        "type": meta.get("type", "work"),
        "title": meta.get("title", path.stem),
        "en": meta.get("en", ""),
        "jp": meta.get("jp", ""),
        "tag": meta.get("tag", ""),
        "label": meta.get("label", ""),
        "image": meta.get("image", ""),
        "text": " ".join(text),
        "specs": specs,
    }
    if rows:
        subjects, gpa = [], []
        for r in rows[1:]:
            vals = r[1:]
            if r[0].strip().lower() == "gpa":
                gpa = [float(v) for v in vals if re.fullmatch(r"\d+(\.\d+)?", v)]
            else:
                subjects.append([r[0], [float(v) if re.fullmatch(r"\d+(\.\d+)?", v) else v for v in vals]])
        tape["grades"] = {"terms": rows[0][1:], "rows": subjects, "gpa": gpa}
    return tape

files = sorted(p for p in SRC.glob("*.md") if not p.name.startswith("_") and p.name.lower() != "readme.md")
tapes = [parse(p) for p in files]
(SRC / "tapes.js").write_text("window.TAPES = " + json.dumps(tapes, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8")
print(f"{len(tapes)} tapes -> content/tapes.js")
for p in files:
    print("  ", p.name)

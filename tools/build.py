#!/usr/bin/env python3
"""Read content/*.md (one file = one tape) and write content/tapes.js. Order = file name."""
import json, re
from pathlib import Path

HERE = Path(__file__).resolve().parent
SRC = next((d for d in (HERE / "content", HERE.parent / "content") if d.is_dir()), HERE.parent / "content")

def parse(path):
    raw = path.read_text(encoding="utf-8").lstrip("\ufeff").replace("\r", "")
    m = re.match(r"^---[ \t]*\n(.*?)\n---[ \t]*\n?(.*)$", raw, re.S)
    head, body = (m.group(1), m.group(2)) if m else ("", raw)
    meta = {}
    for line in head.splitlines():
        if ":" in line and not line.strip().startswith("#"):
            k, v = line.split(":", 1)
            meta[k.strip().lower()] = v.strip().strip("\"'")
    paras, cur, specs, rows = [], [], [], []
    def flush():
        nonlocal cur
        if cur:
            paras.append(" ".join(cur))
        cur = []
    for line in body.splitlines():
        s = line.strip()
        if not s:
            flush()
            continue
        if s.startswith("|"):
            flush()
            cells = [c.strip() for c in s.strip("|").split("|")]
            if all(re.fullmatch(r":?-{2,}:?", c) for c in cells):
                continue
            rows.append(cells)
        elif re.match(r"^[-*]\s+[^:]+:", s):
            flush()
            k, v = s[1:].strip().split(":", 1)
            specs.append([k.strip(), v.strip()])
        else:
            cur.append(s)
    flush()
    tape = {
        "file": path.name,
        "type": meta.get("type", "work"),
        "title": meta.get("title", path.stem),
        "en": meta.get("en", ""),
        "jp": meta.get("jp", ""),
        "tag": meta.get("tag", ""),
        "label": meta.get("label", ""),
        "image": meta.get("image", ""),
        "sound": meta.get("sound", ""),
        "text": "\n\n".join(paras),
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
print(f"{len(tapes)} tapes -> {SRC / 'tapes.js'}")
for p in files:
    print("  ", p.name)

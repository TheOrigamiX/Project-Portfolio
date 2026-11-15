# Nanthapop Nupradub — Portfolio

Single-page portfolio styled as a curved VHS shelf. Plain HTML, CSS and JavaScript. One Markdown file in `content/` is one tape.

## Add or edit a tape

1. Copy any file in `content/` (for example `03-plane-1.md`) and rename it. The file name sets the order: `07-plane-5.md` goes after `06-...`.
2. Edit the text and save.
3. Push to GitHub. A GitHub Action rebuilds `content/tapes.js` and the shelf shows one tape per file.

To delete a tape, delete its file. To reorder, rename the files.

Without GitHub, run `python3 tools/build.py` after any change, then open `index.html`.

## File format

```
---
type: work          # intro | grades | work
title: ชื่อบนปก
en: English title
jp: 日本語            # optional
tag: Work           # small label under the title
label: Work 1       # label on the timeline
image: images/plane1.jpg   # optional photo on the cover
---
Description text.

- ปีกกว้าง: 60 ซม.     # work: each "- name: value" line becomes a spec
```

`type: grades` reads a Markdown table. The first row is the term names. A row named `GPA` draws the GPA chart.

Files whose name starts with `_` are ignored.

## Run locally

Open `index.html`, or run `python3 -m http.server 8000`. Fonts need a network connection.

## Deploy with GitHub Pages

Settings, then Pages. Source: `main`, `/ (root)`.

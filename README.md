# Epictetus-Style Obsidian Starter Vault

A ready-to-use [Obsidian](https://obsidian.md) vault, pre-configured for **daily journaling, weekly reviews, Kanban project boards, and GTD** — with 24 community plugins already installed and set up. Clone it, open it, and you're journaling in under two minutes.

## Setup (2 minutes)

1. **Install Obsidian** → [obsidian.md/download](https://obsidian.md/download)
2. **Get this vault** — any of:
   - Click the green **Code** button above → **Download ZIP** → unzip it, **or**
   - `git clone` this repository, **or**
   - **let Claude Code do it** — from a terminal, ask it in plain words:
     `claude "clone github.com/lumora-int/ObsidianSetup into ~/Notes and tell me what to click next"`
     It clones the vault, puts it where you want it, and can adjust settings for you. The one
     step it cannot do is the click inside Obsidian in step 4 — that dialog is yours.
3. **Open it in Obsidian** — launch Obsidian → **Open folder as vault** → select the folder you just downloaded
4. When asked, choose **"Trust author and enable plugins"** — this turns on the pre-installed community plugins (all open source, listed below)
5. Open the **`Start Here`** note and follow along

That's it. Press `Cmd/Ctrl + D` to create your first daily note.

## What you get

- 📅 **Daily notes** built around a first-hour routine, a "big three", a protected deep-work block, and an end-of-day shutdown (`Cmd/Ctrl + D`)
- 🗓️ **Weekly review notes** — what went well, what to improve, gratitude
- 📋 **Kanban boards** for projects (drag-and-drop cards)
- 🏃 **A Scrum starter** — a sprint board and a sprint note (goal, daily, review, retrospective)
- ✅ **GTD workflow** — Clarify → Organize → Reflect → Engage
- ✏️ **Excalidraw** for sketches and diagrams
- 🎈 **Task Balloons** — ticking a checklist item releases a burst of balloons (and only when you tick it, never when you un-tick)
- ✅ **Completed tasks styled** in italic light green with an underline instead of a strikethrough
- 🎨 **AnuPpuccin theme**, tuned and ready
- 🌍 **RTL support** for Arabic/Hebrew notes (`Cmd/Ctrl + R`)
- 📤 **Export to Word/PDF/LaTeX** (install [Pandoc](https://pandoc.org/installing.html) for full export support)

## Folder structure

```
├── Journal/      ← daily & weekly notes land here automatically
├── Kanban/       ← project boards (prefix: k_)
├── GTD/          ← Getting Things Done boards
├── Templates/    ← daily / weekly / GTD templates
├── Excalidraw/   ← drawings
├── Kindle/       ← Kindle highlights (optional plugin sign-in)
└── Start Here.md ← read this first
```

## Scrum, if your team runs sprints

The Kanban plugin also carries a ready Scrum setup, so you do not have to build one:

| file | what it is |
|---|---|
| `Kanban/k_ Scrum Sprint Board.md` | the board — Product Backlog → Sprint Backlog → In Progress → In Review → Done |
| `Templates/Scrum Sprint Template.md` | the sprint note — goal, capacity, daily blockers, review, retrospective |

Two rules make it work, and both are written on the board itself: **In Progress is limited to
three cards per person**, and **nothing is added to the Sprint Backlog after planning**. A sprint
that absorbs new work mid-way stops being a commitment and becomes a list.

Open the board, drag your cards, and start the sprint note from **Templates → Scrum Sprint
Template** (Templater is already installed).

## Included community plugins

Calendar, Periodic Notes, Kanban, Tasks, Templater, Dataview, Excalidraw, Outliner, Advanced Slides, Style Settings, RTL, LanguageTool, Pandoc, Enhancing Export, PlantUML, Quick LaTeX, Table Generator, Checklist, Cycle Through Panes, Editor Syntax Highlight, Kindle Highlights, Chesser (chess), Financial Statement, Hot Reload.

Plus two of our own, bundled in this vault:

- **Task Balloons** — a burst of balloons when you complete a checklist item. Tune the emoji, count, and float time in **Settings → Task Balloons**, or turn it off entirely in **Settings → Community plugins**.
- **`checked-task-style` snippet** — renders completed tasks in italic light green with an underline rather than a line through them. Edit the two colour values in `.obsidian/snippets/checked-task-style.css`, or switch it off in **Settings → Appearance → CSS snippets**.

All plugins are open-source community plugins by their respective authors, bundled here for convenience under their own licenses. You can update them anytime from **Settings → Community plugins → Check for updates**.

## Make it yours

- Edit `Templates/Daily Note Template.md` — change the habits to your own
- Don't want balloons? **Settings → Community plugins → Task Balloons** → off
- Delete plugins you don't need from **Settings → Community plugins**
- Tweak the theme in **Settings → Appearance** and **Style Settings**

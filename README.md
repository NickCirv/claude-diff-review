<div align="center">

# claude-diff-review

**Colour-coded terminal dashboard showing every file Claude touched — with per-file risk scoring**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?labelColor=0B0A09)](LICENSE)
[![Node >=18](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg?labelColor=0B0A09)](https://nodejs.org)

</div>

## Install

```bash
npx github:NickCirv/claude-diff-review
```

## Usage

```bash
# Review all uncommitted changes (staged + unstaged)
npx github:NickCirv/claude-diff-review

# Review last 3 commits
npx github:NickCirv/claude-diff-review --since HEAD~3

# Generate a standalone HTML report
npx github:NickCirv/claude-diff-review --html

# HTML report with a custom filename
npx github:NickCirv/claude-diff-review --html report.html
```

| Flag | Description | Default |
|------|-------------|---------|
| `--since <ref>` | Diff against a git ref (`HEAD~3`, a commit SHA, a branch name) | uncommitted changes |
| `--html [file]` | Write a self-contained dark-theme HTML report | `diff-report.html` |
| `--no-color` | Disable coloured terminal output | colour enabled |

## What it does

Runs `git diff` against uncommitted changes or a given ref, parses every changed file into per-file records, and scores each one for risk using filename patterns, content patterns, and change size. Results are sorted HIGH → MEDIUM → LOW and rendered as a colour-coded terminal report. Pass `--html` to get a fully self-contained HTML file with expandable per-file diffs, risk-level filtering, and a summary bar — no external dependencies, no API key required.

**Risk levels at a glance:**

| Level | Triggers |
|-------|----------|
| HIGH | Auth/secret/credential filenames · hardcoded credentials in added lines · test files deleted or significantly reduced |
| MEDIUM | `package.json` / lock files · config files (`.yaml`, `.json`, Dockerfile, tsconfig…) · large deletions (>50 lines) |
| LOW | New files · documentation changes · standard source edits |

---
<sub>Node >=18 · MIT · by <a href="https://github.com/NickCirv">NickCirv</a></sub>

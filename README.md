# claude-diff-review

Visual diff dashboard showing everything Claude changed — with risk scoring.

After a Claude Code session, see all changes with per-file risk scores before you commit.

## Usage

```bash
# Review all uncommitted changes
npx claude-diff-review

# Review last 3 commits
npx claude-diff-review --since HEAD~3

# Review since a specific commit
npx claude-diff-review --since abc1234

# Generate a standalone HTML report
npx claude-diff-review --html

# HTML report with custom filename
npx claude-diff-review --html report.html

# Combine: HTML report of last 5 commits
npx claude-diff-review --since HEAD~5 --html
```

## Risk Scoring

| Level | Triggers |
|-------|---------|
| **HIGH** | Files matching: `auth`, `secret`, `env`, `password`, `key`, `token`, `credential` |
| **HIGH** | Added lines contain hardcoded secrets or credentials |
| **HIGH** | Test file deleted or significant test reduction (>10 lines net removed) |
| **MEDIUM** | `package.json`, lock files, new dependencies added |
| **MEDIUM** | Config files (`.yaml`, `.json`, `.toml`, `dockerfile`, etc.) |
| **MEDIUM** | Large source deletions (>50 lines removed) |
| **LOW** | New files added |
| **LOW** | Documentation changes |
| **LOW** | Standard source edits |

## Change Categories

`security` · `tests` · `dependencies` · `config` · `new-file` · `docs` · `source`

## Features

- Terminal output with color-coded risk badges and diff stats
- `--html` mode generates a dark-themed, self-contained HTML report with:
  - Expandable per-file diff views with syntax highlighting
  - Filter by risk level
  - Summary stats (files changed, lines added/removed, risk breakdown)
- No Anthropic API required — purely local git analysis
- Works anywhere `git` is available

## Install globally

```bash
npm install -g claude-diff-review
```

## Requirements

- Node.js 18+
- Git

## License

MIT

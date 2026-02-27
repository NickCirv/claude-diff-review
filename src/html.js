const RISK_STYLES = {
  high: { bg: '#ef4444', text: '#fff', label: 'HIGH' },
  medium: { bg: '#f59e0b', text: '#000', label: 'MED' },
  low: { bg: '#22c55e', text: '#000', label: 'LOW' },
};

const CATEGORY_ICONS = {
  security: '🔐',
  tests: '🧪',
  dependencies: '📦',
  config: '⚙️',
  'new-file': '✨',
  docs: '📝',
  source: '📄',
};

const STATUS_COLORS = {
  added: '#4ade80',
  deleted: '#f87171',
  modified: '#fbbf24',
  renamed: '#67e8f9',
};

/**
 * Escape HTML special chars.
 */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Render a single unified diff patch as colored HTML lines.
 */
function renderPatch(rawPatch) {
  const lines = rawPatch.split('\n');
  const rendered = [];

  for (const line of lines) {
    if (line.startsWith('diff --git') || line.startsWith('index ') ||
        line.startsWith('old mode') || line.startsWith('new mode') ||
        line.startsWith('new file') || line.startsWith('deleted file') ||
        line.startsWith('rename') || line.startsWith('similarity')) {
      rendered.push(`<span class="diff-meta">${esc(line)}</span>`);
    } else if (line.startsWith('---') || line.startsWith('+++')) {
      rendered.push(`<span class="diff-file">${esc(line)}</span>`);
    } else if (line.startsWith('@@')) {
      rendered.push(`<span class="diff-hunk">${esc(line)}</span>`);
    } else if (line.startsWith('+')) {
      rendered.push(`<span class="diff-add">${esc(line)}</span>`);
    } else if (line.startsWith('-')) {
      rendered.push(`<span class="diff-del">${esc(line)}</span>`);
    } else {
      rendered.push(`<span class="diff-ctx">${esc(line)}</span>`);
    }
  }

  return rendered.join('\n');
}

/**
 * Generate a standalone HTML report.
 * @param {import('./scorer.js').ScoredFile[]} scored
 * @param {{ since: string|null }} opts
 * @returns {string}
 */
export function generateHtml(scored, { since }) {
  const total = scored.length;
  const high = scored.filter(s => s.risk === 'high').length;
  const medium = scored.filter(s => s.risk === 'medium').length;
  const low = scored.filter(s => s.risk === 'low').length;
  const totalAdded = scored.reduce((n, s) => n + s.file.added, 0);
  const totalRemoved = scored.reduce((n, s) => n + s.file.removed, 0);
  const generated = new Date().toLocaleString();
  const scope = since ? `since ${esc(since)}` : 'uncommitted changes';

  const fileCards = scored.map(({ file, risk, riskReason, category }, i) => {
    const rs = RISK_STYLES[risk];
    const icon = CATEGORY_ICONS[category] || '📄';
    const statusColor = STATUS_COLORS[file.status] || '#94a3b8';
    const patchHtml = renderPatch(file.rawPatch);

    return `
    <div class="file-card risk-${risk}" id="file-${i}">
      <div class="file-header" onclick="togglePatch(${i})">
        <div class="file-left">
          <span class="risk-badge" style="background:${rs.bg};color:${rs.text}">${rs.label}</span>
          <span class="file-icon">${icon}</span>
          <span class="file-path">${esc(file.path)}</span>
          <span class="file-status" style="color:${statusColor}">${esc(file.status)}</span>
          ${file.oldPath ? `<span class="file-old-path">← ${esc(file.oldPath)}</span>` : ''}
        </div>
        <div class="file-right">
          <span class="diff-add-count">+${file.added}</span>
          <span class="diff-del-count">-${file.removed}</span>
          <span class="expand-icon" id="icon-${i}">▸</span>
        </div>
      </div>
      <div class="file-reason">${esc(riskReason)}</div>
      <div class="patch-container" id="patch-${i}" style="display:none">
        <pre class="patch-pre"><code>${patchHtml}</code></pre>
      </div>
    </div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>claude-diff-review</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0d1117;
      --surface: #161b22;
      --surface2: #21262d;
      --border: #30363d;
      --text: #e6edf3;
      --text-muted: #8b949e;
      --accent: #58a6ff;
      --high: #ef4444;
      --medium: #f59e0b;
      --low: #22c55e;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      line-height: 1.6;
      min-height: 100vh;
    }

    .container { max-width: 1100px; margin: 0 auto; padding: 32px 16px; }

    /* Header */
    .header { margin-bottom: 32px; }
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .header h1 span.mono { font-family: 'SF Mono', 'Fira Code', monospace; color: var(--accent); }
    .header .subtitle { color: var(--text-muted); margin-top: 4px; font-size: 13px; }

    /* Summary bar */
    .summary {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px 20px;
      display: flex;
      gap: 24px;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    .summary-stat { display: flex; align-items: center; gap: 6px; }
    .summary-stat .label { color: var(--text-muted); font-size: 12px; }
    .summary-stat .value { font-weight: 600; }
    .stat-high { color: var(--high); }
    .stat-medium { color: var(--medium); }
    .stat-low { color: var(--low); }
    .stat-add { color: #4ade80; }
    .stat-del { color: #f87171; }

    /* Risk filter tabs */
    .filter-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
    .filter-tab {
      padding: 5px 14px;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--text-muted);
      cursor: pointer;
      font-size: 13px;
      transition: all 0.15s;
    }
    .filter-tab:hover { border-color: var(--accent); color: var(--text); }
    .filter-tab.active { background: var(--accent); border-color: var(--accent); color: #000; font-weight: 600; }

    /* File cards */
    .files { display: flex; flex-direction: column; gap: 10px; }
    .file-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow: hidden;
      transition: border-color 0.15s;
    }
    .file-card:hover { border-color: #58a6ff44; }
    .file-card.risk-high { border-left: 3px solid var(--high); }
    .file-card.risk-medium { border-left: 3px solid var(--medium); }
    .file-card.risk-low { border-left: 3px solid var(--low); }

    .file-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      cursor: pointer;
      user-select: none;
      gap: 12px;
    }
    .file-header:hover { background: var(--surface2); }

    .file-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; min-width: 0; }
    .file-right { display: flex; align-items: center; gap: 10px; white-space: nowrap; }

    .risk-badge {
      font-size: 10px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      letter-spacing: 0.05em;
      flex-shrink: 0;
    }
    .file-icon { font-size: 15px; }
    .file-path {
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 13px;
      color: var(--text);
      word-break: break-all;
    }
    .file-status { font-size: 11px; color: var(--text-muted); }
    .file-old-path { font-size: 11px; color: var(--text-muted); font-family: monospace; }

    .diff-add-count { color: #4ade80; font-weight: 600; font-size: 13px; }
    .diff-del-count { color: #f87171; font-weight: 600; font-size: 13px; }
    .expand-icon { color: var(--text-muted); font-size: 12px; transition: transform 0.2s; }

    .file-reason {
      padding: 0 16px 10px 16px;
      font-size: 12px;
      color: var(--text-muted);
      border-top: 1px solid var(--border);
      padding-top: 8px;
      font-style: italic;
    }

    /* Patch / diff */
    .patch-container {
      border-top: 1px solid var(--border);
      overflow-x: auto;
    }
    .patch-pre {
      padding: 16px;
      font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
      font-size: 12px;
      line-height: 1.5;
      background: #0a0e14;
      margin: 0;
    }
    .patch-pre code { display: block; }

    .diff-meta  { color: #6e7681; }
    .diff-file  { color: #58a6ff; }
    .diff-hunk  { color: #8b949e; background: #1f2937; display: block; padding: 0 4px; }
    .diff-add   { color: #4ade80; background: #0d2818; display: block; }
    .diff-del   { color: #f87171; background: #2d1a1a; display: block; }
    .diff-ctx   { color: #8b949e; }

    /* Footer */
    .footer { margin-top: 40px; text-align: center; color: var(--text-muted); font-size: 12px; }
    .footer a { color: var(--accent); text-decoration: none; }

    /* Responsive */
    @media (max-width: 600px) {
      .summary { gap: 12px; }
      .file-header { flex-direction: column; align-items: flex-start; }
      .file-right { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🔍 <span class="mono">claude-diff-review</span></h1>
      <p class="subtitle">Generated ${generated} · Scope: ${scope}</p>
    </div>

    <!-- Summary -->
    <div class="summary">
      <div class="summary-stat">
        <span class="label">Files</span>
        <span class="value">${total}</span>
      </div>
      <div class="summary-stat">
        <span class="label">Added</span>
        <span class="value stat-add">+${totalAdded}</span>
      </div>
      <div class="summary-stat">
        <span class="label">Removed</span>
        <span class="value stat-del">-${totalRemoved}</span>
      </div>
      <div class="summary-stat">
        <span class="label">High Risk</span>
        <span class="value stat-high">${high}</span>
      </div>
      <div class="summary-stat">
        <span class="label">Medium</span>
        <span class="value stat-medium">${medium}</span>
      </div>
      <div class="summary-stat">
        <span class="label">Low</span>
        <span class="value stat-low">${low}</span>
      </div>
    </div>

    <!-- Filter tabs -->
    <div class="filter-tabs">
      <button class="filter-tab active" onclick="filter('all')">All (${total})</button>
      <button class="filter-tab" onclick="filter('high')" style="${high === 0 ? 'opacity:0.4' : ''}">High Risk (${high})</button>
      <button class="filter-tab" onclick="filter('medium')" style="${medium === 0 ? 'opacity:0.4' : ''}">Medium (${medium})</button>
      <button class="filter-tab" onclick="filter('low')" style="${low === 0 ? 'opacity:0.4' : ''}">Low (${low})</button>
    </div>

    <!-- File cards -->
    <div class="files" id="file-list">
      ${fileCards}
    </div>

    <div class="footer">
      <p>Generated by <a href="https://github.com/NickCirv/claude-diff-review">claude-diff-review</a></p>
    </div>
  </div>

  <script>
    function togglePatch(i) {
      const patch = document.getElementById('patch-' + i);
      const icon = document.getElementById('icon-' + i);
      const visible = patch.style.display !== 'none';
      patch.style.display = visible ? 'none' : 'block';
      icon.textContent = visible ? '▸' : '▾';
    }

    function filter(risk) {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      event.target.classList.add('active');

      document.querySelectorAll('.file-card').forEach(card => {
        if (risk === 'all') {
          card.style.display = '';
        } else {
          card.style.display = card.classList.contains('risk-' + risk) ? '' : 'none';
        }
      });
    }
  </script>
</body>
</html>`;
}

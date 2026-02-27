import chalk from 'chalk';

const RISK_COLORS = {
  high: chalk.bgRed.white.bold,
  medium: chalk.bgYellow.black.bold,
  low: chalk.bgGreen.black.bold,
};

const RISK_BADGE = {
  high: ' HIGH ',
  medium: ' MED  ',
  low: ' LOW  ',
};

const CATEGORY_ICONS = {
  security: '🔐',
  tests: '🧪',
  dependencies: '📦',
  config: '⚙️ ',
  'new-file': '✨',
  docs: '📝',
  source: '📄',
};

const STATUS_COLORS = {
  added: chalk.green,
  deleted: chalk.red,
  modified: chalk.yellow,
  renamed: chalk.cyan,
};

/**
 * Render a color-coded terminal diff report.
 * @param {import('./scorer.js').ScoredFile[]} scored
 * @param {{ since: string|null, color: boolean }} opts
 */
export function renderTerminal(scored, { since, color }) {
  if (!color) chalk.level = 0;

  const total = scored.length;
  const high = scored.filter(s => s.risk === 'high').length;
  const medium = scored.filter(s => s.risk === 'medium').length;
  const low = scored.filter(s => s.risk === 'low').length;
  const totalAdded = scored.reduce((n, s) => n + s.file.added, 0);
  const totalRemoved = scored.reduce((n, s) => n + s.file.removed, 0);

  // Header
  console.log('');
  console.log(chalk.bold.white('━'.repeat(70)));
  console.log(chalk.bold.white('  claude-diff-review') + chalk.gray('  —  what Claude changed'));
  if (since) {
    console.log(chalk.gray(`  Scope: since ${since}`));
  } else {
    console.log(chalk.gray('  Scope: uncommitted changes'));
  }
  console.log(chalk.bold.white('━'.repeat(70)));
  console.log('');

  // Summary bar
  console.log(
    chalk.bold('  Summary: ') +
    chalk.white(`${total} file${total !== 1 ? 's' : ''}`) +
    chalk.gray(' · ') +
    chalk.green(`+${totalAdded}`) +
    chalk.gray('/') +
    chalk.red(`-${totalRemoved}`) +
    chalk.gray(' · ') +
    RISK_COLORS.high(RISK_BADGE.high) + chalk.gray(`×${high}`) +
    ' ' +
    RISK_COLORS.medium(RISK_BADGE.medium) + chalk.gray(`×${medium}`) +
    ' ' +
    RISK_COLORS.low(RISK_BADGE.low) + chalk.gray(`×${low}`)
  );
  console.log('');

  // File list
  for (const { file, risk, riskReason, category } of scored) {
    const badge = RISK_COLORS[risk](RISK_BADGE[risk]);
    const icon = CATEGORY_ICONS[category] || '📄';
    const statusColor = STATUS_COLORS[file.status] || chalk.white;
    const statusTag = chalk.gray(`[${file.status}]`);
    const diffStats = chalk.green(`+${file.added}`) + chalk.gray('/') + chalk.red(`-${file.removed}`);

    console.log(
      `  ${badge} ${icon}  ${statusColor.bold(file.path)} ${statusTag}  ${diffStats}`
    );
    console.log(
      `       ${chalk.gray('↳')} ${chalk.italic.gray(riskReason)}`
    );

    if (file.status === 'renamed' && file.oldPath) {
      console.log(`       ${chalk.gray('↳ was: ' + file.oldPath)}`);
    }

    console.log('');
  }

  // Risk breakdown
  if (high > 0) {
    console.log(chalk.bold.white('━'.repeat(70)));
    console.log('');
    console.log(RISK_COLORS.high('  HIGH RISK FILES — REVIEW CAREFULLY  '));
    console.log('');
    for (const { file, riskReason } of scored.filter(s => s.risk === 'high')) {
      console.log(`  ${chalk.red.bold('✗')} ${chalk.bold(file.path)}`);
      console.log(`    ${chalk.red(riskReason)}`);
      console.log('');
    }
  }

  // Footer
  console.log(chalk.bold.white('━'.repeat(70)));
  console.log(chalk.gray('  Run with --html to generate a shareable report'));
  console.log('');
}

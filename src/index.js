import { Command } from 'commander';
import { getDiff } from './differ.js';
import { scoreFiles } from './scorer.js';
import { renderTerminal } from './formatter.js';
import { generateHtml } from './html.js';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const program = new Command();

program
  .name('claude-diff-review')
  .description('Visual diff dashboard showing everything Claude changed — with risk scoring')
  .version('1.0.0')
  .option('--since <ref>', 'Review changes since a git ref (e.g. HEAD~3, abc1234)', null)
  .option('--html [output]', 'Generate standalone HTML report (default: diff-report.html)')
  .option('--no-color', 'Disable colored output')
  .parse(process.argv);

const opts = program.opts();

async function main() {
  const since = opts.since || null;
  const htmlMode = opts.html !== undefined && opts.html !== false;
  const htmlOutput = typeof opts.html === 'string' ? opts.html : 'diff-report.html';

  let files;
  try {
    files = getDiff(since);
  } catch (err) {
    console.error(`Error running git diff: ${err.message}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log('No changes found.');
    process.exit(0);
  }

  const scored = scoreFiles(files);

  if (htmlMode) {
    const html = generateHtml(scored, { since });
    const outPath = resolve(process.cwd(), htmlOutput);
    writeFileSync(outPath, html, 'utf8');
    console.log(`HTML report written to: ${outPath}`);
  } else {
    renderTerminal(scored, { since, color: opts.color !== false });
  }
}

main();

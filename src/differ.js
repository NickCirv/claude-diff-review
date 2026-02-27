import { execFileSync } from 'node:child_process';

/**
 * @typedef {Object} FileDiff
 * @property {string} path - Relative file path
 * @property {string} status - 'modified' | 'added' | 'deleted' | 'renamed'
 * @property {number} added - Lines added
 * @property {number} removed - Lines removed
 * @property {string[]} addedLines - Raw added lines (without leading '+')
 * @property {string[]} removedLines - Raw removed lines (without leading '-')
 * @property {string} rawPatch - Full unified diff patch for this file
 * @property {string|null} oldPath - Previous path if renamed
 */

/**
 * Run git diff and parse output into structured file diffs.
 * @param {string|null} since - Git ref to diff against (null = uncommitted changes)
 * @returns {FileDiff[]}
 */
export function getDiff(since) {
  const baseArgs = ['git', 'diff', '--unified=5'];

  let args;
  if (since) {
    // Compare since ref to current HEAD (includes uncommitted if working tree dirty)
    args = [...baseArgs, since];
  } else {
    // Uncommitted changes: staged + unstaged
    args = [...baseArgs, 'HEAD'];
  }

  let rawDiff;
  try {
    rawDiff = execFileSync('git', args.slice(1), {
      encoding: 'utf8',
      maxBuffer: 50 * 1024 * 1024,
    });
  } catch (err) {
    // git diff exits 0 normally; exit 1 only on error
    if (err.status === 128 || err.status === 129) {
      throw new Error(err.stderr || err.message);
    }
    rawDiff = err.stdout || '';
  }

  if (!rawDiff.trim()) {
    // Fall back to staged-only if HEAD doesn't exist yet
    try {
      rawDiff = execFileSync('git', ['diff', '--unified=5', '--cached'], {
        encoding: 'utf8',
        maxBuffer: 50 * 1024 * 1024,
      });
    } catch (_) {
      return [];
    }
  }

  return parseDiff(rawDiff);
}

/**
 * Parse unified diff output into FileDiff objects.
 * @param {string} raw
 * @returns {FileDiff[]}
 */
function parseDiff(raw) {
  const files = [];
  const fileBlocks = raw.split(/^(?=diff --git )/m).filter(Boolean);

  for (const block of fileBlocks) {
    const lines = block.split('\n');

    const diffHeader = lines[0];
    // diff --git a/path b/path
    const diffMatch = diffHeader.match(/^diff --git a\/(.*) b\/(.*)$/);
    if (!diffMatch) continue;

    const aPath = diffMatch[1];
    const bPath = diffMatch[2];

    let status = 'modified';
    let oldPath = null;

    // Detect status from extended headers
    for (const line of lines.slice(1, 8)) {
      if (line.startsWith('new file mode')) { status = 'added'; break; }
      if (line.startsWith('deleted file mode')) { status = 'deleted'; break; }
      if (line.startsWith('rename from')) { status = 'renamed'; oldPath = aPath; break; }
    }

    const addedLines = [];
    const removedLines = [];

    for (const line of lines) {
      if (line.startsWith('+') && !line.startsWith('+++')) {
        addedLines.push(line.slice(1));
      } else if (line.startsWith('-') && !line.startsWith('---')) {
        removedLines.push(line.slice(1));
      }
    }

    files.push({
      path: bPath,
      status,
      added: addedLines.length,
      removed: removedLines.length,
      addedLines,
      removedLines,
      rawPatch: block,
      oldPath,
    });
  }

  return files;
}

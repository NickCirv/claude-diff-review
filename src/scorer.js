/**
 * @typedef {'high'|'medium'|'low'} RiskLevel
 * @typedef {'security'|'tests'|'dependencies'|'config'|'new-file'|'docs'|'source'} ChangeCategory
 */

/**
 * @typedef {Object} ScoredFile
 * @property {import('./differ.js').FileDiff} file
 * @property {RiskLevel} risk
 * @property {string} riskReason
 * @property {ChangeCategory} category
 */

const SECURITY_PATTERNS = [
  /auth/i,
  /secret/i,
  /password/i,
  /passwd/i,
  /credential/i,
  /token/i,
  /apikey/i,
  /api[_-]?key/i,
  /private[_-]?key/i,
  /\.pem$/i,
  /\.key$/i,
  /\.p12$/i,
  /\.pfx$/i,
  /\.cer$/i,
  /id_rsa/i,
  /id_ed25519/i,
  /htpasswd/i,
  /oauth/i,
  /jwt/i,
  /\.env$/i,
  /\.env\./i,
];

const CONFIG_PATTERNS = [
  /\.(ya?ml|toml|ini|cfg|conf)$/i,
  /\.json$/i,
  /\.config\.[jt]s$/i,
  /dockerfile/i,
  /docker-compose/i,
  /\.htaccess$/i,
  /nginx\.conf/i,
  /apache\.conf/i,
  /webpack\.config/i,
  /vite\.config/i,
  /rollup\.config/i,
  /tsconfig/i,
  /\.babelrc/i,
  /eslint/i,
  /prettier/i,
];

const TEST_PATTERNS = [
  /\.(test|spec)\.[jt]sx?$/i,
  /\.(test|spec)\.py$/i,
  /__tests__\//i,
  /\/tests?\//i,
  /\/spec\//i,
  /test_.*\.py$/i,
  /.*_test\.go$/i,
];

const DOC_PATTERNS = [
  /\.(md|mdx|rst|txt)$/i,
  /^readme/i,
  /^changelog/i,
  /^license/i,
  /^contributing/i,
  /docs?\//i,
];

const DEP_FILES = [
  'package.json',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'Pipfile',
  'Pipfile.lock',
  'requirements.txt',
  'requirements.lock',
  'Gemfile',
  'Gemfile.lock',
  'go.mod',
  'go.sum',
  'Cargo.toml',
  'Cargo.lock',
  'composer.json',
  'composer.lock',
];

/**
 * Determine change category for a file.
 * @param {import('./differ.js').FileDiff} file
 * @returns {ChangeCategory}
 */
function categorize(file) {
  const name = file.path.toLowerCase();
  const basename = name.split('/').pop();

  if (DEP_FILES.some(dep => dep.toLowerCase() === basename)) return 'dependencies';
  if (TEST_PATTERNS.some(p => p.test(file.path))) return 'tests';
  if (DOC_PATTERNS.some(p => p.test(file.path))) return 'docs';
  if (SECURITY_PATTERNS.some(p => p.test(file.path))) return 'security';
  if (CONFIG_PATTERNS.some(p => p.test(file.path))) return 'config';
  if (file.status === 'added') return 'new-file';
  return 'source';
}

/**
 * Detect if content contains sensitive values (not just file name).
 * @param {string[]} lines
 * @returns {boolean}
 */
function hasSensitiveContent(lines) {
  const sensitiveValuePattern = /(?:password|secret|token|key|credential)\s*[=:]\s*["']?[^\s"']{8,}/i;
  return lines.some(l => sensitiveValuePattern.test(l));
}

/**
 * Score a single file and return risk + reason.
 * @param {import('./differ.js').FileDiff} file
 * @param {ChangeCategory} category
 * @returns {{ risk: RiskLevel, reason: string }}
 */
function scoreFile(file, category) {
  // HIGH: security-named files
  if (SECURITY_PATTERNS.some(p => p.test(file.path))) {
    return { risk: 'high', reason: 'Security-sensitive filename (auth/secret/token/key/credential/env)' };
  }

  // HIGH: sensitive values added in any file
  if (hasSensitiveContent(file.addedLines)) {
    return { risk: 'high', reason: 'Added lines contain potential hardcoded secrets or credentials' };
  }

  // HIGH: test file deleted
  if (category === 'tests' && file.status === 'deleted') {
    return { risk: 'high', reason: 'Test file deleted — coverage likely reduced' };
  }

  // HIGH: significant test reduction (more lines removed than added in test file)
  if (category === 'tests' && file.removed > file.added && file.removed > 10) {
    return { risk: 'high', reason: `Test lines reduced by ${file.removed - file.added} (possible test removal)` };
  }

  // MEDIUM: new dependencies added
  if (category === 'dependencies') {
    const newDeps = file.addedLines.filter(l => /["'][a-z@][a-z0-9@/_.-]+["']\s*:/.test(l));
    if (newDeps.length > 0) {
      return { risk: 'medium', reason: `${newDeps.length} new dependency/dependencies added` };
    }
    return { risk: 'medium', reason: 'Dependency file modified' };
  }

  // MEDIUM: config files
  if (category === 'config') {
    return { risk: 'medium', reason: 'Configuration file changed' };
  }

  // MEDIUM: large deletions in source (>50 lines removed)
  if (category === 'source' && file.removed > 50) {
    return { risk: 'medium', reason: `Large deletion: ${file.removed} lines removed` };
  }

  // LOW: new files, docs, small changes
  if (category === 'new-file') {
    return { risk: 'low', reason: 'New file added' };
  }
  if (category === 'docs') {
    return { risk: 'low', reason: 'Documentation change' };
  }

  return { risk: 'low', reason: 'Standard source change' };
}

/**
 * Score all files and return sorted array (high risk first).
 * @param {import('./differ.js').FileDiff[]} files
 * @returns {ScoredFile[]}
 */
export function scoreFiles(files) {
  const riskOrder = { high: 0, medium: 1, low: 2 };

  const scored = files.map(file => {
    const category = categorize(file);
    const { risk, reason } = scoreFile(file, category);
    return { file, risk, riskReason: reason, category };
  });

  return scored.sort((a, b) => riskOrder[a.risk] - riskOrder[b.risk]);
}

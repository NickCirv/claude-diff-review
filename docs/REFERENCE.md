# claude-diff-review — implementation reference

Source revision: `d71941e88440141994e101cb902ca387a4e69214`. This reference records source declarations; it is not a transcript of a successful run.

## Entrypoint and runtime

[package.json](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/package.json) declares `bin/review.js`. Node.js `>=20` and npm; Git is also used by the implementation.

Executable mapping: `claude-diff-review` → `./bin/review.js`.

## Supported workflow

Git-ref comparison; file categorization and sensitive-content hints; terminal or standalone HTML reports.

Scores are heuristics based on file type, changed content and size; they do not prove security or correctness. HTML output includes source diffs and should be handled as project data.

## Declared command interface

Options belong to the preceding command in the linked source; they are not necessarily global.

| Kind | Declaration | Source description | Source |
| --- | --- | --- | --- |
| option | `--since <ref>` | Review changes since a git ref (e.g. HEAD~3, abc1234) | [src/index.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/index.js) |
| option | `--html [output]` | Generate standalone HTML report (default: diff-report.html) | [src/index.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/index.js) |
| option | `--no-color` | Disable colored output | [src/index.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/index.js) |

## Option defaults

These are literal defaults or parsers declared by the command builder; flags belong to their command as shown above.

| Option | Declared default / parser |
| --- | --- |
| `--since <ref>` | `null` |

## Package scripts

| Script | Exact command |
| --- | --- |
| `start` | `node bin/review.js` |
| `test` | `node --test test/smoke.test.js` |

## Implementation sources

[src/index.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/index.js).

## Verification boundary

No repository code, tests, network operation, hook installer or migration was executed for this review. Source inspection supports the documented interface; runtime correctness and external-service compatibility remain unverified.

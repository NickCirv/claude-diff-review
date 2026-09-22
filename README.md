![Nicholas Ashkar — claude-diff-review](assets/nicholas-ashkar/banner.png)

# claude-diff-review

Scores Git changes with local rules to help reviewers prioritize files.






<a id="usage"></a>

<a id="review-all-uncommitted-changes-staged--unstaged"></a>

<a id="review-last-3-commits"></a>

<a id="generate-a-standalone-html-report"></a>

<a id="html-report-with-a-custom-filename"></a>

## What it does

- Git-ref comparison.
- File categorization and sensitive-content hints.
- Terminal or standalone HTML reports.


<a id="install"></a>

## Quickstart

Prerequisites: Node.js `>=20` and npm; Git is also used by the implementation. The checkout below pins the source used for this documentation.

```sh
git clone https://github.com/NickCirv/claude-diff-review.git
cd claude-diff-review
git checkout d71941e88440141994e101cb902ca387a4e69214
npm install
node bin/review.js --since HEAD~1 --no-color
```

**Expected behavior (illustrative, not captured):** Prints a risk-oriented summary of the latest commit range when the repository has a parent commit.

Examples are source-inspected, **not runtime-tested**. See the research record for verification gaps.

## Boundaries and data

Scores are heuristics based on file type, changed content and size; they do not prove security or correctness. HTML output includes source diffs and should be handled as project data.

## Development

The manifest defines `npm test` as:

```sh
node --test test/smoke.test.js
```

The captured suite is a smoke check, not end-to-end behavior coverage. Examples include “entry is valid JavaScript”. Tests were not run for this documentation revision.

See [implementation and command reference](docs/REFERENCE.md) for the package scripts and inspected interfaces, and [research record](docs/RESEARCH.md) for the pinned source, document decisions and unresolved checks.

## License and contact

See [LICENSE](LICENSE) for the original terms and attribution. Legal text is unchanged.

[Nicholas Ashkar](https://nicholashkar.com/) · [Discuss a project](https://nicholashkar.com/#oxblood-contact)

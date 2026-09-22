# claude-diff-review — documentation research

Reviewed 21 September 2026. Public GitHub source only.

## Revision and scope

- Commit: [`d71941e88440141994e101cb902ca387a4e69214`](https://github.com/NickCirv/claude-diff-review/commit/d71941e88440141994e101cb902ca387a4e69214).
- Tree: `30eb229f603c01f70ded8095596f49486e7bfa02`; truncated: `false`.
- Capture: 11 of 11 eligible text files; all eligible text files.
- Method: package and entrypoint inspection, implementation-interface review, targeted behavior/limitation inspection, and test-source review. This is not an exhaustive correctness or security audit.
- Commands run against repository code: **none**. External services, deployment and npm publication were not verified.

## Claim and evidence map

| Documentation claim | Pinned evidence | Assessment |
| --- | --- | --- |
| Runtime, executable and development commands | [package.json](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/package.json) | Source declaration inspected; runtime unverified |
| Scores Git changes with local rules to help reviewers prioritize files. | [bin/review.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/bin/review.js) · [src/index.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/index.js) | Implementation interfaces inspected; behavior not executed |
| Git-ref comparison; file categorization and sensitive-content hints; terminal or standalone HTML reports. | [bin/review.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/bin/review.js), [src/differ.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/differ.js), [src/formatter.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/formatter.js), [src/html.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/html.js), [src/index.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/index.js), [src/scorer.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/scorer.js) | Source-backed scope, not a test result |
| Scores are heuristics based on file type, changed content and size; they do not prove security or correctness. HTML output includes source diffs and should be handled as project data. | [bin/review.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/bin/review.js), [src/differ.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/differ.js), [src/formatter.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/formatter.js), [src/html.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/html.js), [src/index.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/index.js), [src/scorer.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/scorer.js) | Material limits documented; service compatibility remains open |
| Existing checks | [test/smoke.test.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/test/smoke.test.js) | Test source read; no passing-run claim |

## Documentation inventory and disposition

| Existing document | Decision |
| --- | --- |
| [README.md](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/README.md) | Rewritten with source-specific purpose, direct checkout setup, limitations and verification status. Old section fragments retained where practical. |

Added `docs/REFERENCE.md` for the observed implementation and command surface, and this research record. Protected license and attribution files remain in their original locations without edits. No source or product UI was changed.

## Quality dimensions

| Dimension | Status | Evidence / next step |
| --- | --- | --- |
| Pinned provenance | Verified | Captured commit, tree and per-file hashes recorded below |
| Interface documentation | Partially verified | Source inspection only; run clean-checkout quickstart |
| Runtime behavior | Unverified | No repository execution in this review |
| Test results | Unverified | Existing tests were not run |
| Deployment / package availability | Unverified | No remote publish or live-service check |
| Visual / link checks | Unverified | Portfolio renderer and independent QA are separate from this authoring step |

## Unresolved issues

Scores are heuristics based on file type, changed content and size; they do not prove security or correctness. HTML output includes source diffs and should be handled as project data.

## Captured source inventory

This lists captured provenance, not a claim that every line received a full audit. Binary/generated/excluded files are outside the eligible text capture.

| File | SHA-256 | Bytes |
| --- | --- | --- |
| [LICENSE](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/LICENSE) | `68729cab364d82364078b08d8580ccfa51dc69c81a7d64e8d8d47a1da6c9349d` | 1072 |
| [README.md](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/README.md) | `936c93c85cd2c49a6f4a560d89a83dbb8927df7bcf09dee26ebf22c32617bbec` | 2112 |
| [package.json](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/package.json) | `6a99886966653d6e4186c0b8ceddb0a2d234cf6bb598ac349e12664da5d2f74b` | 734 |
| [.github/workflows/ci.yml](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/.github/workflows/ci.yml) | `e818f4e6bd805f798665dbbf04964d02f12fc59dd7f18903ad63d26d374ae3f0` | 380 |
| [bin/review.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/bin/review.js) | `b2c8f60d8498a4f67cc3547b6b42480362f8239b8885a37686a0fcea6a0eb28e` | 46 |
| [src/differ.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/differ.js) | `1efe58728d5cebdb5b475e06ee35154d69095ee64e5e905e399081df8ad274d6` | 3235 |
| [src/formatter.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/formatter.js) | `7a1faa0ee22c3ddc733cae8893ecff830f07e6b3756267ee11476ccdda088496` | 3431 |
| [src/html.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/html.js) | `ad64d2baf401a9599f2d7c98f14622514b21cedf5c27678122d777a1d5fc29c1` | 12004 |
| [src/index.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/index.js) | `66856dec01f69b47cfeb287e9dd7d6fb17c52f599dabd19bb26749cbe63a05e9` | 1572 |
| [src/scorer.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/src/scorer.js) | `096b0dcd565092854e4956fbab1cf421b187ddeca676f6fbda28a9ae37115739` | 5176 |
| [test/smoke.test.js](https://github.com/NickCirv/claude-diff-review/blob/d71941e88440141994e101cb902ca387a4e69214/test/smoke.test.js) | `fd6daef2684dc29fad800f7c5d6a92b31f192b39fe6525e7f8df2f1c2e28df00` | 343 |

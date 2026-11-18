---
inclusion: manual
---
# /kiro-log: update the Kiro usage log

Run this at the end of each work session. It keeps `docs/KIRO_USAGE.md` current, so the hackathon write-up ("how was Kiro used?") is mostly written by the deadline.

## What to do
1. Read `docs/KIRO_USAGE.md` and find the date of the last entry under "## Daily log".
2. Look at what changed since then: `git log --since=<that date> --stat`, the spec task checkboxes in `.kiro/specs/*/tasks.md`, and any changes to `.kiro/steering/`, `.kiro/hooks/` or `.kiro/settings/mcp.json`.
3. Append one entry for today under "## Daily log" with:
   - **Built:** one or two lines on what now works.
   - **Kiro features used:** specs (which spec and tasks), hooks (which ones fired and what they caught), steering (which file changed Kiro's output, and how), MCP (which server, for what), property-based tests (any counterexample they found, quoted from the test output), Kiro Crew or parallel tasks, powers.
   - **What surprised us:** one honest line about what worked better or worse than plain chat ("vibe coding").
4. If something belongs in the summary sections at the top of the file (for example a strong PBT story), update that section too.

## Rules
- Only record things you can see in the repo or in this session. Never invent results, numbers or quotes.
- Keep each entry under 15 lines.
- Don't change any file other than `docs/KIRO_USAGE.md`.

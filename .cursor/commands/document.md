# Update Documentation Task

You are updating documentation after code changes.

## 1. Identify Changes
- Check git diff or recent commits for modified files
- Identify which features/modules were changed
- Note any new files, deleted files, or renamed files

## 2. Verify Current Implementation
**CRITICAL**: DO NOT trust existing documentation. Read the actual code.

For each changed file:
- Read the current implementation
- Understand actual behavior (not documented behavior)
- Note any discrepancies with existing docs

## 3. Update Relevant Documentation

- **CHANGELOG.md**: Add entry under "Unreleased" section
  - Use categories: Added, Changed, Fixed, Security, Removed
  - Be concise, user-facing language

- **SYSTEM-ARCHITECTURE.md**: Update any sections affected by the changes
  - Route table, file structure tree, database schema, component library table, auth flow, security notes
  - Only update sections that are actually affected — don't rewrite unrelated sections
  - If a file was added, deleted, or renamed, reflect it in the file structure
  - If a route was added or removed, update the route table

- **FEATURES.md**: Update customer-facing capabilities when user-visible behavior changes
  - Focus on value/features users can see and use
  - Do not include implementation-only details (internal refactors, provider internals)
  - Track Added / Changed / Removed behavior at feature level
  - If no user-facing feature changed, explicitly state "No customer-facing feature changes" in your final response

## 3.1 Documentation Completion Checklist (Required)
- [ ] Checked code diff and verified behavior from source code
- [ ] Updated `CHANGELOG.md` (or confirmed not needed)
- [ ] Updated `docs/SYSTEM-ARCHITECTURE.md` where affected
- [ ] Updated `docs/FEATURES.md` for customer-facing changes (or explicitly confirmed none)


## 4. Documentation Style Rules

✅ **Concise** - Sacrifice grammar for brevity
✅ **Practical** - Examples over theory
✅ **Accurate** - Code verified, not assumed
✅ **Current** - Matches actual implementation

❌ No enterprise fluff
❌ No outdated information
❌ No assumptions without verification

## 5. Ask if Uncertain

If you're unsure about intent behind a change or user-facing impact, **ask the user** - don't guess.
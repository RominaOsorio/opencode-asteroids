COMMAND COMMIT

---
description: Group changes into semantic commits in Spanish and push
---

# Semantic Commit and Push

Review all current Git changes, group them into logical units, create semantic commits, and push the commits to the current remote branch.

## Instructions

1. Inspect the current Git status.
2. Review all modified, added, and deleted files.
3. Inspect the actual diffs before creating commits.
4. Group related changes into logical commits.
5. Do not combine unrelated changes into a single commit.
6. Use semantic commit messages following Conventional Commits.
7. The commit description after the type MUST be written in Spanish.

## Commit Format

Use:

<type>(<scope>): <description>

Common types:

- `feat` — New functionality
- `fix` — Bug fix
- `refactor` — Code restructuring without changing behavior
- `style` — Formatting or stylistic changes
- `perf` — Performance improvements
- `test` — Tests
- `docs` — Documentation
- `build` — Build system changes
- `ci` — CI/CD changes
- `chore` — Maintenance

## Commit Guidelines

- Keep each commit focused on one logical change.
- Write concise commit messages.
- Use imperative language.
- Do not include unnecessary details in the commit subject.
- Avoid vague messages such as:
  - `update`
  - `changes`
  - `fix stuff`
  - `misc`
- Do not commit unrelated changes together.
- Do not modify files merely to make the commit cleaner.
- Do not discard existing user changes.

## Safety Checks

Before committing:

- Verify the current branch.
- Review the staged changes.
- Ensure no sensitive files or secrets are being committed.
- Check for:
  - `.env` files
  - API keys
  - passwords
  - credentials
  - private keys
  - tokens
  - certificates
  - other sensitive information
- If sensitive information is detected, stop and report it instead of committing it.
- Do not discard or overwrite user changes.
- Do not reset the working tree.
- Do not perform destructive Git operations.

## Commit Process

For each logical group:

1. Stage only the files belonging to that change.
2. Review the staged diff.
3. Create the semantic commit.
4. Repeat until all intended changes have been committed.

Do not stage unrelated files.

Do not use:

- `git add .` when it would include unrelated changes.
- `git add -A` when it would include unrelated changes.

Prefer explicitly staging the files that belong to each logical commit.

## Before Push

After all semantic commits have been created:

1. Verify the current branch.
2. Verify the configured remote.
3. Review the commit history.
4. Check the working tree.
5. Confirm that all intended changes have been committed.
6. Verify that there are no unexpected changes.
7. Push the commits to the current branch's configured upstream.

## Push Rules

- Push only after all semantic commits have been created successfully.
- Push to the current branch's configured upstream.
- NEVER use `git push --force`.
- NEVER use `git push -f`.
- NEVER use `git push --force-with-lease`.
- NEVER rewrite remote history.
- NEVER overwrite commits that already exist on the remote.
- NEVER use destructive Git operations to resolve a rejected push.
- NEVER force a push under any circumstances.

If the push is rejected because the remote contains commits that are not present locally:

1. Stop immediately.
2. Do not force push.
3. Do not use `--force`.
4. Do not use `--force-with-lease`.
5. Do not reset the local branch.
6. Do not delete commits.
7. Report the reason for the rejection to the user.

If the push fails for any other reason:

1. Stop.
2. Report the error.
3. Do not retry using destructive options.
4. Do not force push.

If no upstream branch exists:

1. Stop.
2. Report that no upstream branch is configured.
3. Do not automatically modify the remote configuration.
4. Do not create or change the upstream unless explicitly requested by the user.

## Git History Safety

The following operations are prohibited unless explicitly requested by the user:

- `git push --force`
- `git push -f`
- `git push --force-with-lease`
- `git reset --hard`
- `git reset --merge`
- `git rebase` on already-pushed commits
- `git commit --amend` on already-pushed commits
- deleting branches
- deleting tags
- rewriting remote history

Never rewrite published Git history as part of this command.

## Handling Existing Commits

Before creating new commits:

- Do not amend an existing commit.
- Do not modify existing commits.
- Do not squash existing commits.
- Do not rebase existing commits.
- Create new commits for the current changes.

If the working tree contains changes that appear to belong to a previous commit, do not rewrite that commit. Create a new appropriate commit instead.

## Handling Unrelated Changes

If the working tree contains unrelated changes:

- Leave them untouched.
- Do not include them in commits.
- Only stage files that belong to the changes being committed.
- Mention remaining uncommitted changes in the final report.

## Final Verification

After pushing:

- Verify the current branch.
- Verify the latest commits.
- Verify the push completed successfully.
- Check the working tree again.
- Identify any remaining uncommitted changes.

## Final Report

After completion, report:

### Commits Created

For each commit:

- Commit hash
- Commit message
- Files included

### Push Result

- Remote
- Branch
- Push status

### Remaining Changes

List any files that remain uncommitted.

### Summary

Provide a concise summary of what was committed and pushed.


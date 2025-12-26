## Prettier Formatting

Use the following commands to check and fix code formatting:

```bash
# Check formatting issues (no changes)
npx prettier --check .

# Fix formatting issues in all files
npx prettier --write .

# Fix formatting for specific files only
npx prettier --write server.js database/db.js

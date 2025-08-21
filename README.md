# Interprovincial Trade Barriers Tracker


## Getting Started

- Fork the repo, clone it, and install dependencies:

  ```bash
  git clone https://github.com/BuildCanada/TradeBarriers.git
  cd TradeBarriers
  pnpm install
  ```

- Run the app

  ```bash
  pnpm turbo
  ```

- 🎉 **Time to explore!** Head over to [http://localhost:4444](http://localhost:4444) to see your local instance in action!

## Linting

This project uses ESLint with Next.js configuration. Run linting with:

```bash
pnpm lint          # Check for linting issues
pnpm lint:fix      # Auto-fix auto-fixable issues
```

The linting configuration enforces TypeScript best practices, React rules, and Next.js optimizations while keeping most issues as warnings (temporarily) to avoid blocking development.

## Git Hooks

This project automatically runs linting checks before each commit using `simple-git-hooks`. This is enabled automatically when you run `pnpm install`. If you need to enable it manually:

```bash
npx simple-git-hooks
```

If linting fails, the commit will be blocked until issues are resolved.


## Contributing

We would love to have your help! Please fill in our volunteer [intake form](https://www.buildcanada.com/en/get-involved).

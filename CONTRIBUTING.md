# Contributing

Contributions are welcome.

## Getting set up

```bash
pnpm install
cp .env.example .env.local
pnpm db:push
pnpm dev
```

## Before opening a pull request

- Run `pnpm lint` and `pnpm typecheck`.
- Keep pull requests focused on a single change.
- Open an issue first for larger features.

## Adding course content

New courses are a registry entry in `lib/courses.ts` plus MDX files under `content/courses/`. Keep lesson content original — do not paste copyrighted material.

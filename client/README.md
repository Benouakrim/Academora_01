# Academora Client (React + TypeScript + Vite)

This client application is built with React 18, TypeScript and Vite. An error boundary wraps the root, and an admin health page surfaces key library versions to help detect mismatches (e.g. React vs Recharts / react-is).

## Environment Variables

Copy `.env.example` to `.env.local` (or `.env`) and provide a production Clerk publishable key before deploying:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_live_XXXXXXXXXXXXXXXXXXXXXXXX
```

Never expose secret Clerk keys in the client bundle.

## Health & Error Handling

`AdminHealthPage` displays versions for React, Recharts, Clerk, and `react-is`. `ErrorBoundary` catches render errors; replace the placeholder logger (`useErrorLogger.ts`) with a monitoring provider (Sentry, Datadog, LogRocket, etc.) for production.

## React Compiler

The React Compiler is not enabled due to current performance impact. To add it later see the official docs: https://react.dev/learn/react-compiler/installation

## ESLint Configuration

For production, enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      // tseslint.configs.strictTypeChecked, // optional stricter
      // tseslint.configs.stylisticTypeChecked, // optional stylistic
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```

Optional additional React-specific lint rules:

```js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactX.configs['recommended-typescript'],
      reactDom.configs.recommended,
    ],
  },
])
```

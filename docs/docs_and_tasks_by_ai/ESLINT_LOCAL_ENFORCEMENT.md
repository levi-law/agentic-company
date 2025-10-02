# ESLint Local Enforcement Setup

## Summary
Enabled strict ESLint rules locally to match build-time enforcement, preventing build failures from unused variables.

## Changes Made

### 1. ESLint Configuration (`eslint.config.mjs`)
- **Added**: `"@typescript-eslint/no-unused-vars": "error"` rule
- **Effect**: Now catches unused variables during local development (`npm run lint`)

### 2. Code Fixes in `src/app/App.tsx`
- **Removed unused variable**: `logServerEvent` from `useEvent()` hook
- **Commented out unused functions**: `sdkAudioElement` and `fetchEphemeralKey` (deployment-disabled SDK code)
- **Fixed mock function signature**: `mute` function now accepts boolean parameter with eslint-disable comment
- **Added type import**: `SessionStatus` type for proper TypeScript typing
- **Fixed type declaration**: Changed `sessionStatus` from `string` to `SessionStatus` type
- **Fixed function call**: Changed `sendUserText` to `sendSimulatedUserMessage` in `handleSendTextMessage`

### 3. Code Cleanup in `src/app/hooks/useSessionPersistence.ts`
- **Removed**: Unnecessary `eslint-disable-next-line react-hooks/exhaustive-deps` comment (no longer needed)

## Benefits

1. **Early Detection**: Catch unused variable errors during development before pushing
2. **Faster Feedback**: No need to wait for CI/CD build to discover issues
3. **Consistency**: Local linting now matches build-time linting rules
4. **Type Safety**: Proper TypeScript types prevent runtime errors

## Verification

Both commands now pass successfully:
```bash
npm run lint    # ✔ No ESLint warnings or errors
npm run build   # ✔ Compiled successfully
```

## Recommendation

Always run `npm run lint` before committing code to catch issues early.

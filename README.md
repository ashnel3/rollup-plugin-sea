# rollup-plugin-sea

[![codecov](https://codecov.io/gh/ashnel3/rollup-plugin-sea/branch/main/graph/badge.svg)](https://codecov.io/gh/ashnel3/rollup-plugin-sea)
[![CI](https://github.com/ashnel3/rollup-plugin-sea/actions/workflows/ci.yml/badge.svg)](https://github.com/ashnel3/rollup-plugin-sea/actions/workflows/ci.yml)

> [!WARNING]
>
> **Warning:** Node SEA is experimental! (see: [nodejs.org](https://nodejs.org/api/single-executable-applications.html))

Rollup plugin for NodeJS single executable applications **(SEA!)**

<br />

## Usage:

```
npm install rollup-plugin-sea
```

<details>
  <summary>rollup</summary>

```js
// https://rollupjs.org/configuration-options

import { defineConfig } from 'rollup'
import { sea } from 'rollup-plugin-sea'

export default defineConfig({
  plugins: [sea()],
  output: {
    // inline dynamic imports
    inlineDynamicImports: true,
  },
  external: [],
})
```

</details>

<details>
  <summary>vite</summary>

```js
// https://vite.dev/config

import { defineConfig } from 'vite'
import { sea } from 'rollup-plugin-sea'

export default defineConfig({
  plugins: [sea()],
  build: {
    lib: { ... },
    // inline dynamic imports
    rollupOptions: { inlineDynamicImports: true },
    // build for server runtimes
    ssr: true,
  },
  ssr: {
    // inline external dependencies
    noExternal: true,
    // target node-js
    target: 'node',
  }
})
```

</details>

<details>
  <summary>programatic</summary>

> See: [bin/sea.ts](./src/bin/sea.ts)

```js
import { defaultContext, createWorkspace } from 'rollup-plugin-sea/workspace'

const workspace = createWorkspace(
  defaultContext(),
  '{input_filename}',
  '{output_filename}',
  '[outdir]',
  { ...options },
)
try {
  // setup files & build executable
  await workspace.build()
} finally {
  // remove temporary files
  await workspace.finalize()
}
```

</details>
<br />

## Limitations

### Native Addons:

SEA doesn't support native addons.

### Single File:

> See: [nodejs.org - "sea require is not file based"](https://nodejs.org/api/single-executable-applications.html#requireid-in-the-injected-main-script-is-not-file-based)

SEA doesn't currently support path imports.

```javascript
// This will fail at runtime.
// Error [ERR_UNKNOWN_BUILTIN_MODULE]: No such built-in module: ./test.js
require('./test.js')
```

<br />

## Errors

### ERR_UNKNOWN_BUILTIN_MODULE

> See: [single-file limitation](#single-file)

This error occurs when you import an external file from a SEA script (multiple files).

import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const source = (pkg: string) =>
  fileURLToPath(new URL(`./packages/@kaktovik-numerals/${pkg}/src/index.ts`, import.meta.url));

export default defineConfig({
  resolve: {
    // Test against source, matching the paths in tsconfig.json.
    alias: {
      '@kaktovik-numerals/core': source('core'),
      '@kaktovik-numerals/raster': source('raster'),
    },
  },
  test: {
    include: ['packages/*/*/test/**/*.test.ts'],
  },
});

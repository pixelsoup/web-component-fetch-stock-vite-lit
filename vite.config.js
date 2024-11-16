import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
  if (mode === 'library') {
    return {
      build: {
        lib: {
          entry: './src/wc-stock-fetcher/wc-stock-fetcher.js', // Path for named web component
          name: 'StockFetcher',
          fileName: (format) => `wc-stock-fetcher.${format}.js`,
        },
        rollupOptions: {
          external: ['lit'], // Prevent bundling of lit
          output: {
            globals: {
              lit: 'lit',
            },
          },
        },
      },
    };
  } else { // Default to production preview
    return {
      build: {
        outDir: 'dist', // Output directory for production files
        // Other production-specific options can go here
      },
    };
  }
});
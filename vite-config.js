import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/wc-stock-fetcher/wc-stock-fetcher.js', // Path to your main component file
      name: 'StockFetcher',
      fileName: (format) => `wc-stock-fetcher.${format}.js`,
    },
    rollupOptions: {
      // Ensure external dependencies are not bundled
      external: ['lit'],
      output: {
        globals: {
          lit: 'lit', // Specify how to reference the external library
        },
      },
    },
  },
});
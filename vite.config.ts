import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const isProd = mode === 'production';

  return {
    server: {
      host: '::',
      port: 8080,
      strictPort: true,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      }
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        dev: isDev,
      }),
      isDev && componentTagger(),
      isProd && visualizer({
        open: true,
        filename: 'bundle-analysis.html',
        gzipSize: true,
        brotliSize: true,
      }) as PluginOption,
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@lib': path.resolve(__dirname, './src/lib'),
      },
    },
    build: {
      target: 'es2022',
      sourcemap: isDev,
      minify: isProd ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            vendor: ['lodash', 'axios'],
          }
        }
      }
    },
    optimizeDeps: {
      include: [
        '@emotion/react',
        '@emotion/styled',
      ],
      esbuildOptions: {
        target: 'es2022'
      }
    }
  };
});

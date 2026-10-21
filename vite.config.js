import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

const adminRoutes = () => ({
  name: 'admin-route-fallback',
  configureServer(server) {
    server.middlewares.use((request, _response, next) => {
      const path = new URL(request.url || '/', 'http://localhost').pathname;
      if (/^\/admin(?:\/(?:dashboard|applications|programs|events|news|mentors|startups|partners|activity|settings))?\/?$/.test(path)) request.url = '/admin.html';
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((request, _response, next) => {
      const path = new URL(request.url || '/', 'http://localhost').pathname;
      if (/^\/admin(?:\/(?:dashboard|applications|programs|events|news|mentors|startups|partners|activity|settings))?\/?$/.test(path)) request.url = '/admin.html';
      next();
    });
  }
});

export default defineConfig({
  base: '/',
  plugins: [tailwindcss(), adminRoutes()],
  build: {
    rollupOptions: {
      input: ['index.html', 'admin.html']
    }
  }
});

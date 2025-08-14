import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/login': 'http://localhost:3000',
      '/user-pass': 'http://localhost:3000',
      '/check-username': 'http://localhost:3000',
      '/webauthn': 'http://localhost:3000',
    },
  },
});

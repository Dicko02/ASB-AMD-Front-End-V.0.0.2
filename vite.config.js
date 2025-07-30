import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist' // <--- dossier de sortie attendu par Vercel
  },
  base: './' // <--- rend les chemins relatifs dans index.html valides
})

import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {fileURLToPath, URL} from 'url'

// Vite 3's resolver predates the wildcard `exports` patterns used by
// @fontsource, so map weight entries (e.g. @fontsource/inter/400.css) to paths.
const fontsourceAlias = {
  find: /^@fontsource\/([^/]+)\/([0-9]+(?:-italic)?)\.css$/,
  replacement: fileURLToPath(new URL('./node_modules/@fontsource/$1/$2.css', import.meta.url)),
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [fontsourceAlias],
  },
})

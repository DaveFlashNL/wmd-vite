import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";
import { nodePolyfills } from 'vite-plugin-node-polyfills'

const base = process.env.PUBLIC_URL ?? '/';

console.log(`Building for base = ${base}`);

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    base,
    plugins: [ svgr(), react(), nodePolyfills(), ],
    build: {
      commonjsOptions: { transformMixedEsModules: true }
    }
  })  
}
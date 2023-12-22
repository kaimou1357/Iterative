import * as esbuild from 'esbuild-wasm';

const initializationPromise = esbuild.initialize({
  wasmURL: '/esbuild.wasm',
});

export default initializationPromise;
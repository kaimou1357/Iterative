"use client";

import * as esbuild from "esbuild-wasm";

const initializationPromise = async () => {
  if (typeof window !== 'undefined') {
    console.log("Initialize Called");
    await esbuild.initialize({
      wasmURL: "/esbuild.wasm",
    });
  }
}

export default initializationPromise;

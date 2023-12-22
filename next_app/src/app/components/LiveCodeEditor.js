import React, { useRef, useEffect } from 'react';
import esbuildInitializationPromise from './esbuildInitializer';
import * as esbuild from 'esbuild-wasm';

const LiveCodeEditor = ({ code, css, cssFramework, fullScreen }) => {
  const iframeRef = useRef(null);

  const updateIframeContent = async () => {
    if (!iframeRef.current || !iframeRef.current.contentDocument) return;

    await esbuildInitializationPromise; // Wait for esbuild initialization
    const result = await esbuild.transform(code, { loader: 'jsx', target: 'es2015', format: 'iife', globalName: 'MyApp' });

    let cssHead = ``;
    let cssBody = ``;

    if (cssFramework === "DAISYUI") {
      cssHead = `
        <link href="https://cdn.jsdelivr.net/npm/daisyui@3.7.6/dist/full.css" rel="stylesheet" type="text/css" />
        <script src="https://cdn.tailwindcss.com"></script>
      `;
    } else if (cssFramework === "BOOTSTRAP") {
      cssHead = `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">`;
      cssBody = `<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>`;
    }

    // Transpile the withDraggable code
    // Can add this next to result.code below if Draggability is enabled
    // const draggableResult = await esbuild.transform(withDraggable, { loader: 'jsx', target: 'es2015' });

    const iframeDoc = iframeRef.current.contentDocument;
    iframeDoc.open();
    iframeDoc.write(`
      <html>
        <head>
          ${cssHead}
          <style>${css}</style>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.production.min.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script>
            ${result.code}
            ReactDOM.render(React.createElement(MyApp.default), document.getElementById('root'));
          </script>
          ${cssBody}
        </body>
      </html>
    `);
    iframeDoc.close();
  };

  useEffect(() => {
    updateIframeContent();
  }, [code, css, cssFramework]);

  return (
    <div style={{ height: '100%' }}>
        <iframe ref={iframeRef} width="100%" height="100%" />
    </div>
  );
};

export default LiveCodeEditor;
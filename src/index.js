// Webpack entry point
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import ImageViewer from './image-viewer';
import Backend from './backend';

let root = createRoot(document.getElementById('root'));

let backend = new Backend(window.backend);

root.render(
  <App url="entry" backend={backend} ref={backend.ref} />
);

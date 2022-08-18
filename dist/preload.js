const { contextBridge, ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  for(let dependency of ['chrome', 'node', 'electron']) {
    let selector = `${dependency}-version`;
    let text = process.versions[dependency];
    let element = document.getElementById(selector);
    if(element)
      element.innerText = text;
  }
});

contextBridge.exposeInMainWorld('backend', {
  fetch(index, options = {}) {
    return ipcRenderer.invoke('fetch', index, options);
  }
});

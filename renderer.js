const { shell, ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('click', (event) => {
    if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
      event.preventDefault();
      shell.openExternal(event.target.href);
    }
  });

  const versionElement = document.getElementById('app-version');
  const appVersion = ipcRenderer.sendSync('get-app-version');
  versionElement.innerText = appVersion;
});
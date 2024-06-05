const { shell, ipcRenderer } = require('electron');
const { BrowserWindow } = require('@electron/remote');

document.addEventListener('DOMContentLoaded', () => {
  const win = BrowserWindow.getFocusedWindow();

  if (win) {
    setupWindowControls(win);
  }

  window.onbeforeunload = () => {
    if (win) {
      win.removeAllListeners();
    }
  };

  function setupWindowControls(win) {
    const minButton = document.getElementById('min-button');
    const maxButton = document.getElementById('max-button');
    const restoreButton = document.getElementById('restore-button');
    const closeButton = document.getElementById('close-button');

    minButton.addEventListener("click", () => win.minimize());
    maxButton.addEventListener("click", () => win.maximize());
    restoreButton.addEventListener("click", () => win.unmaximize());
    closeButton.addEventListener("click", () => win.close());

    toggleMaxRestoreButtons(win);
    win.on('maximize', () => toggleMaxRestoreButtons(win));
    win.on('unmaximize', () => toggleMaxRestoreButtons(win));
  }

  function toggleMaxRestoreButtons(win) {
    const body = document.body;
    if (win.isMaximized()) {
      body.classList.add('maximized');
    } else {
      body.classList.remove('maximized');
    }
  }

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
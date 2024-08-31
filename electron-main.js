'use strict';
const {app, BrowserWindow, Menu, shell, screen, dialog, ipcMain, ipcRenderer} = require('electron');
const path = require('path');

const isWindows = process.platform === 'win32';
const isMac = process.platform === 'darwin';
const isLinux = process.platform === 'linux';

let mainWindow = null;

if (isMac) {
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    { role: 'appMenu' },
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'windowMenu' },
    { role: 'help' }
  ]));
} else {
  //Menu.setApplicationMenu(null);
}

const resourcesURL = Object.assign(new URL('file://'), {
  pathname: path.join(__dirname, '/')
}).href;
const defaultProjectURL = new URL('./index.html', resourcesURL).href;

const createWindow = (windowOptions) => {
  const options = {
    title: "Steamworks test",
    icon: path.resolve(__dirname, "icon.png"),
    useContentSize: true,
    webPreferences: {
      sandbox: true,
      contextIsolation: false,
      nodeIntegration: false,
      preload: path.resolve(__dirname, "electron-preload.js"),
    },
    frame: true,
    show: true,
    width: 480,
    height: 360,
    ...windowOptions,
  };

  const activeScreen = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const bounds = activeScreen.workArea;
  options.x = bounds.x + ((bounds.width - options.width) / 2);
  options.y = bounds.y + ((bounds.height - options.height) / 2);

  const window = new BrowserWindow(options);
  return window;
};

const createProjectWindow = (url) => {
  const windowMode = "window";
  const options = {
    show: false,
    backgroundColor: "#000000",
    width: 480,
    height: 360,
    minWidth: 50,
    minHeight: 50,
  };
  // fullscreen === false disables fullscreen on macOS so only set this property when it's true
  if (windowMode === 'fullscreen') {
    options.fullscreen = true;
  }
  const window = createWindow(options);
  if (windowMode === 'maximize') {
    window.maximize();
  }
  window.loadURL(url);
  window.show();

  mainWindow = window;
};

const createDataWindow = (dataURI) => {
  const window = createWindow({});
  window.loadURL(dataURI);
};

const isResourceURL = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'file:' && parsedUrl.href.startsWith(resourcesURL);
  } catch (e) {
    // ignore
  }
  return false;
};

const SAFE_PROTOCOLS = [
  'https:',
  'http:',
  'mailto:',
];

const isSafeOpenExternal = (url) => {
  try {
    const parsedUrl = new URL(url);
    return SAFE_PROTOCOLS.includes(parsedUrl.protocol);
  } catch (e) {
    // ignore
  }
  return false;
};

const isDataURL = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'data:';
  } catch (e) {
    // ignore
  }
  return false;
};

const openLink = (url) => {
  if (isDataURL(url)) {
    createDataWindow(url);
  } else if (isResourceURL(url)) {
    createProjectWindow(url);
  } else if (isSafeOpenExternal(url)) {
    shell.openExternal(url);
  }
};

const createProcessCrashMessage = (details) => {
  let message = details.type ? details.type + ' child process' : 'Renderer process';
  message += ' crashed: ' + details.reason + ' (' + details.exitCode + ')\n\n';
  if (process.arch === 'ia32') {
    message += 'Usually this means the project was too big for the 32-bit Electron environment or your computer is out of memory. Ask the creator to use the 64-bit environment instead.';
  } else {
    message += 'Usually this means your computer is out of memory.';
  }
  return message;
};

app.on('render-process-gone', (event, webContents, details) => {
  const window = BrowserWindow.fromWebContents(webContents);
  dialog.showMessageBoxSync(window, {
    type: 'error',
    title: 'Error',
    message: createProcessCrashMessage(details)
  });
});

app.on('child-process-gone', (event, details) => {
  dialog.showMessageBoxSync({
    type: 'error',
    title: 'Error',
    message: createProcessCrashMessage(details)
  });
});

app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler((details) => {
    setImmediate(() => {
      openLink(details.url);
    });
    return {action: 'deny'};
  });
  contents.on('will-navigate', (e, url) => {
    if (!isResourceURL(url)) {
      e.preventDefault();
      openLink(url);
    }
  });
  contents.on('before-input-event', (e, input) => {
    const window = BrowserWindow.fromWebContents(contents);
    if (!window || input.type !== "keyDown") return;
    if (input.key === 'F11' || (input.key === 'Enter' && input.alt)) {
      window.setFullScreen(!window.isFullScreen());
    } else if (input.key === 'Escape') {
      const behavior = "unfullscreen-only";
      if (window.isFullScreen() && (behavior === 'unfullscreen-only' || behavior === 'unfullscreen-or-exit')) {
        window.setFullScreen(false);
      } else if (behavior === 'unfullscreen-or-exit' || behavior === 'exit-only') {
        window.close();
      }
    }
  });
});

app.on('session-created', (session) => {
  session.webRequest.onBeforeRequest({
    urls: ["file://*"]
  }, (details, callback) => {
    callback({
      cancel: !details.url.startsWith(resourcesURL)
    });
  });
});

app.on('window-all-closed', () => {
  app.quit();
});

app.whenReady().then(() => {
  createProjectWindow(defaultProjectURL);
});

      const enableSteamworks = () => {
        const APP_ID = +"480";
        const steamworks = require('./steamworks.js/');

        const client = steamworks.init(APP_ID);
        let currentLobby = null;
        let controllers = [];

        const async = (event, callback) => ipcMain.handle(event, (e, ...args) => {
          return callback(...args);
        });
        const sync = (event, callback) => ipcMain.on(event, (e, ...args) => {
          e.returnValue = callback(...args);
        });

        const steamCallback = (event, callback) => {
          client.callback.register(event, callback);
        }

        async('Steamworks.achievement.activate', (achievement) => client.achievement.activate(achievement));
        async('Steamworks.achievement.clear', (achievement) => client.achievement.clear(achievement));
        sync('Steamworks.achievement.isActivated', (achievement) => client.achievement.isActivated(achievement));
        
        sync('Steamworks.apps.isDlcInstalled', (dlc) => client.apps.isDlcInstalled(dlc));

        sync('Steamworks.input.activateActionSet', (action, controllerID) => {
          //Verify ControllerAndActions
          if (!controllers[controllerID]) return;
          const actionHandle = client.input.getActionSet(action);
          //Action Handles
          if (!actionHandle) return;
          controllers[controllerID].activateActionSet(actionHandle);
        });
        sync('Steamworks.input.isDigitalActionPressed', (action, controllerID) => {
          //Verify ControllerAndActions
          if (!controllers[controllerID]) return;
          const actionHandle = client.input.getDigitalAction(action);
          //Action Handles
          if (!actionHandle) return;
          return controllers[controllerID].isDigitalActionPressed(actionHandle);
        });
        sync('Steamworks.input.getAnalogActionVector', (action, controllerID) => {
          //Verify ControllerAndActions
          if (!controllers[controllerID]) return;
          const actionHandle = client.input.getAnalogAction(action);
          //Action Handles
          if (!actionHandle) return;
          return controllers[controllerID].getAnalogActionVector(actionHandle);
        });
        sync('Steamworks.input.getControllerType', (controllerID) => {
          //Verify ControllerAndActions
          if (!controllers[controllerID]) return;

          return controllers[controllerID].getType();
        });

        sync('Steamworks.localplayer.getName', () => client.localplayer.getName());
        sync('Steamworks.localplayer.getLevel', () => client.localplayer.getLevel());
        sync('Steamworks.localplayer.getIpCountry', () => client.localplayer.getIpCountry());
        sync('Steamworks.localplayer.getSteamId', () => client.localplayer.getSteamId());
        
        async('Steamworks.overlay.activateToWebPage', (url) => client.overlay.activateToWebPage(url));
        async('Steamworks.overlay.activateInviteDialog', (lobbyID) => client.overlay.activateInviteDialog(lobbyID));
        
        async('Steamworks.matchmaking.createLobby', (TYPE, MAX_PLAYERS) => {
          if (currentLobby) {
            currentLobby.leave();
          }
          client.matchmaking.createLobby(TYPE,MAX_PLAYERS).then(lobby => {
            currentLobby = lobby;
          }).catch(() => {
            currentLobby = null;
          });
          return TYPE;
        });
        async('Steamworks.matchmaking.joinLobby', (lobbyID) => {
          if (currentLobby) {
            currentLobby.leave();
          }

          client.matchmaking.joinLobby(lobbyID).then(lobby => {
            currentLobby = lobby;
            currentLobby.getMembers().forEach(peer => {
              client.networking.sendP2PPacket(peer.steamId64, client.networking.SendType.Reliable, Buffer.from('Connection request'));
            });
          }).catch(() => {
            currentLobby = null;
          });
          return TYPE;
        });

        sync('Steamworks.networking.sendGlobalMessage', (message) => {
          currentLobby.getMembers().forEach(peer => {
            client.networking.sendP2PPacket(peer.steamId64, client.networking.SendType.Reliable, Buffer.from(message));
          })
        })
        sync('Steamworks.networking.sendPrivateMessage', (peer,message) => {
          client.networking.sendP2PPacket(peer, client.networking.SendType.Reliable, Buffer.from(message));
        })

        sync('Steamworks.currentLobby.getID', () => {
          return currentLobby.id || "No lobby";
        });
        sync('Steamworks.currentLobby.getMemberCount', () => {
          return currentLobby ? currentLobby.getMemberCount() : "No lobby";
        });
        sync('Steamworks.currentLobby.getMemberLimit', () => {
          return currentLobby ? currentLobby.getMemberLimit() : "No lobby";
        });
        sync('Steamworks.currentLobby.getOwner', () => {
          return currentLobby ? currentLobby.getOwner() : "No lobby";
        });
        sync('Steamworks.currentLobby.getMembers', () => {
          return currentLobby ? JSON.stringify(currentLobby.getMembers(),(item) => {
            return item.steamId64;
          }) : "[]";
        });

        sync('Steamworks.currentLobby.setJoinable', (newValue) => {
          if (currentLobby) {
            currentLobby.setJoinable(newValue);
          }
        });

        sync('Steamworks.currentLobby.inLobby', () => {
          return currentLobby;
        });

        async('Steamworks.currentLobby.leave', () => {
          currentLobby.leave();
          currentLobby = null;
        });

        steamCallback(client.callback.SteamCallback.P2PSessionRequest,(remote) => {
          client.networking.acceptP2PSession(remote)
          mainWindow.webContents.send("steam_peerConnected",remote);
        })

        setInterval(() => {
          let size;
          while ((size = client.networking.isP2PPacketAvailable()) > 0) {
              const { steamId, data } = client.networking.readP2PPacket(size);
              mainWindow.webContents.send("steam_messageRecieved",data.toString());
              //if (steamId.steamId64 !== client.localplayer.getSteamId().steamId64) {
              //    mainWindow.webContents.send("steam_messageRecieved",data.toString());
              //}
          }

          controllers = client.input.getControllers();
        }, 66);

        client.input.shutdown();

        steamworks.electronEnableSteamOverlay();
        sync('Steamworks.ok', () => true);
      };

      try {
        enableSteamworks();
      } catch (e) {
        console.error(e);
        ipcMain.on('Steamworks.ok', (e) => {
          e.returnValue = false;
        });
        app.whenReady().then(() => {
          const ON_ERROR = "warning";
          const window = BrowserWindow.getAllWindows()[0];
          if (ON_ERROR === 'warning') {
            dialog.showMessageBox(window, {
              type: 'error',
              message: 'Error initializing Steamworks: ' + e,
            });
          } else if (ON_ERROR === 'error') {
            dialog.showMessageBoxSync(window, {
              type: 'error',
              message: 'Error initializing Steamworks: ' + e,
            });
            app.quit();
          }
        });
      }
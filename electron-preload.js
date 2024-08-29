'use strict';
const {ipcRenderer} = require('electron');

      const enableSteamworks = () => {
        const sync = (event) => (...args) => ipcRenderer.sendSync(event, ...args);
        const async = (event) => (...args) => ipcRenderer.invoke(event, ...args);

        window.Steamworks = {
          ok: sync('Steamworks.ok'),
          achievement: {
            activate: async('Steamworks.achievement.activate'),
            clear: async('Steamworks.achievement.clear'),
            isActivated: sync('Steamworks.achievement.isActivated'),
          },
          apps: {
            isDlcInstalled: async('Steamworks.apps.isDlcInstalled'),
          },
          leaderboard: {
            uploadScore: async('Steamworks.leaderboard.uploadScore'),
          },
          localplayer: {
            getName: sync('Steamworks.localplayer.getName'),
            getLevel: sync('Steamworks.localplayer.getLevel'),
            getIpCountry: sync('Steamworks.localplayer.getIpCountry'),
            getSteamId: sync('Steamworks.localplayer.getSteamId'),
          },
          overlay: {
            activateToWebPage: async('Steamworks.overlay.activateToWebPage'),
            activateInviteDialog: async('Steamworks.overlay.activateInviteDialog'),
          },
          matchmaking: {
            LobbyType: {
              Private: 0,
              FriendsOnly: 1,
              Public: 2,
              Invisible: 3
            },
            createLobby: async('Steamworks.matchmaking.createLobby'),
            joinLobby: async('Steamworks.matchmaking.joinLobby'),
          },
          networking: {
            sendGlobalMessage: sync('Steamworks.networking.sendGlobalMessage'),
            sendPrivateMessage: sync('Steamworks.networking.sendPrivateMessage'),

            onMessageRecieved: (data) => {},
            onPeerConnected: (peer) => {}
          },
          currentLobby: {
            getID:sync('Steamworks.currentLobby.getID'),
            
            getMemberCount:sync('Steamworks.currentLobby.getMemberCount'),
            getMemberLimit:sync('Steamworks.currentLobby.getMemberLimit'),
            getOwner:sync('Steamworks.currentLobby.getOwner'),
            getMembers:sync('Steamworks.currentLobby.getMembers'),

            setJoinable:sync('Steamworks.currentLobby.setJoinable'),
            leave:sync('Steamworks.currentLobby.leave'),

            inLobby:sync('Steamworks.currentLobby.inLobby'),
          }
        };

        ipcRenderer.on('steam_peerConnected', (event, message) => {
          window.Steamworks.networking.onPeerConnected(message);
        });

        ipcRenderer.on('steam_messageRecieved', (event, message) => {
          window.Steamworks.networking.onMessageRecieved(message);
        });
      };
      enableSteamworks();
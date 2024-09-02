// Name: Steamworks
// ID: steamworks
// Description: Connect your project to Steamworks APIs.
// License: MPL-2.0
// Context: Probably don't translate the word "Steamworks".

/* generated l10n code */Scratch.translate.setup({"fi":{"_IP country":"IP-osoitteen valtio","_URL":"URL-osoite","_[TYPE] [ID] installed?":"onko [TYPE] [ID] asennettu?","_achievement [ACHIEVEMENT] unlocked?":"onko saavutus [ACHIEVEMENT] avaamaton?","_false":"epätosi","_get user [THING]":"käyttäjän [THING]","_has steamworks?":"onko steamworksissa?","_level":"taso","_name":"nimi","_open [TYPE] [DATA] in overlay":"avaa [TYPE] [DATA] peittokuvana","_set achievement [ACHIEVEMENT] unlocked to [STATUS]":"saavutus [ACHIEVEMENT] avattu = [STATUS]","_steam ID":"steam-tunniste","_true":"tosi"},"it":{"_name":"nome"},"ja":{"_false":"偽","_name":"名前","_true":"真"},"ko":{"_IP country":"IP 국가","_[TYPE] [ID] installed?":"[TYPE] [ID](이)가 설치되었는가?","_achievement [ACHIEVEMENT] unlocked?":"업적 [ACHIEVEMENT]이(가) 달성되었는가? ","_false":"거짓","_get user [THING]":"사용자 [THING] 얻기  ","_level":"레벨","_name":"이름","_set achievement [ACHIEVEMENT] unlocked to [STATUS]":"업적 [ACHIEVEMENT] 달성을 [STATUS](으)로 정하기","_steam ID":"스팀 ID","_true":"참"},"nb":{"_name":"navn","_true":"sann"},"nl":{"_false":"onwaar","_name":"naam","_true":"waar"},"pl":{"_false":"fałsz","_name":"nazwa"},"ru":{"_URL":"URL-адрес","_false":"нет","_name":"имя","_true":"да"},"uk":{"_[TYPE] [ID] installed?":"[TYPE] [ID] встановлено?","_achievement [ACHIEVEMENT] unlocked?":"досягнення [ACHIEVEMENT] отримано?","_get user [THING]":"отримати [THING] користувача","_has steamworks?":"має steamworks?","_level":"рівень","_name":"ім'я","_set achievement [ACHIEVEMENT] unlocked to [STATUS]":"встановити статус досягнення [ACHIEVEMENT] \"отримано?\" до [STATUS]"},"zh-cn":{"_IP country":"IP 所属地","_[TYPE] [ID] installed?":"[TYPE][ID]已安装?","_achievement [ACHIEVEMENT] unlocked?":"成就[ACHIEVEMENT]已解锁?","_false":"假","_get user [THING]":"用户[THING]","_has steamworks?":"连接了 Steamworks?","_level":"Steam 账户等级","_name":"名字","_open [TYPE] [DATA] in overlay":"在 Steam Overlay 上打开[TYPE][DATA]","_set achievement [ACHIEVEMENT] unlocked to [STATUS]":"设置成就[ACHIEVEMENT]解锁状态为[STATUS]","_steam ID":"Steam ID","_true":"真"}});/* end generated l10n code */(function (Scratch) {
  "use strict";

  /* globals Steamworks */

  const canUseSteamworks = typeof Steamworks !== "undefined" && Steamworks.ok();
  let peerData = "";
  let messageData = "";

  if (canUseSteamworks) {
    Steamworks.networking.onPeerConnected = (peer) => {
      console.log(peer);
      peerData = peer;

      Scratch.vm.runtime.startHats('steamworks_whenPeerConnected');
    }

    Steamworks.networking.onMessageRecieved = (message) => {
      console.log(message);
      messageData = message;
      Scratch.vm.runtime.startHats('steamworks_whenMessageRecieved');
    }
  }
  class SteamworksExtension {
    getInfo() {
      return {
        id: "steamworks",
        name: "Steamworks",
        color1: "#136C9F",
        color2: "#105e8c",
        color3: "#0d486b",
        docsURI: "https://extensions.turbowarp.org/steamworks",
        blocks: [
          {
            blockType: Scratch.BlockType.BOOLEAN,
            opcode: "hasSteamworks",
            text: Scratch.translate("has steamworks?"),
          },

          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: "getUserInfo",
            text: Scratch.translate({
              default: "get user [THING]",
              description:
                "[THING] is a dropdown with name, steam ID, account level, IP country, etc.",
            }),
            arguments: {
              THING: {
                type: Scratch.ArgumentType.STRING,
                menu: "userInfo",
              },
            },
          },

          "---",

          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: "setAchievement",
            text: Scratch.translate({
              default: "set achievement [ACHIEVEMENT] unlocked to [STATUS]",
              description: "[STATUS] is true/false dropdown",
            }),
            arguments: {
              ACHIEVEMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
              STATUS: {
                type: Scratch.ArgumentType.STRING,
                menu: "achievementUnlocked",
              },
            },
          },
          {
            blockType: Scratch.BlockType.BOOLEAN,
            opcode: "getAchievement",
            text: Scratch.translate("achievement [ACHIEVEMENT] unlocked?"),
            arguments: {
              ACHIEVEMENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },

          "---",

          {
            blockType: Scratch.BlockType.BOOLEAN,
            opcode: "getInstalled",
            text: Scratch.translate({
              default: "[TYPE] [ID] installed?",
              description: "eg. can be read as 'DLC 1234 installed?'",
            }),
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "installType",
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },

          "---",

          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: "openInOverlay",
            text: Scratch.translate({
              default: "open [TYPE] [DATA] in overlay",
              description: "eg. 'open URL example.com in overlay'",
            }),
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "overlayType",
              },
              DATA: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "https://example.com/",
              },
            },
          },
          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Controllers"
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode:"setActionSet",
            text:"set controller [ID]'s action set to [ACTIONSET]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                menu: "controllerIDs"
              },
              ACTIONSET: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Set Name"
              }
            }
          },
          {
            blockType: Scratch.BlockType.BOOLEAN,
            opcode:"isActionPressed",
            text:"is [ACTION] pressed on controller [ID]?",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                menu: "controllerIDs"
              },
              ACTION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Action"
              }
            }
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode:"getAxisActionPressed",
            text:"[AXIS] position of [ACTION] on controller [ID]",
            arguments: {
              AXIS: {
                type: Scratch.ArgumentType.STRING,
                menu: "axisXY"
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                menu: "controllerIDs"
              },
              ACTION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Action"
              }
            }
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode:"getControllerType",
            text:"type of controller [ID]",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                menu: "controllerIDs"
              }
            }
          },

          "---",
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Networking"
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode:"createLobby",
            text:"create a [TYPE] lobby with [MAX_PLAYERS] slots",
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "lobbyType"
              },
              MAX_PLAYERS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode:"joinLobby",
            text:"join the lobby with [ID] as its ID",
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1234567890"
              }
            }
          },
          "---",
          {
            blockType: Scratch.BlockType.EVENT,
            opcode: "whenPeerConnected",
            text: "when peer joins",
            isEdgeActivated: false
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: "getJoinedPeerData",
            text: "joined peer",
          },
          "---",
          {
            blockType: Scratch.BlockType.BOOLEAN,
            opcode:"inLobby",
            text:"in lobby?"
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode:"getLobbyAttribute",
            text:"get lobby [TYPE]",
            arguments: {
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "lobbyDataTypes"
              }
            }
          },
          "---",
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode:"setJoinability",
            text:"make lobby [JOINABILITY]",
            arguments: {
              JOINABILITY: {
                type: Scratch.ArgumentType.STRING,
                menu: "joinabilityTypes"
              }
            }
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode:"openInviteWindow",
            text:"open invite overlay"
          },
          "---",
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode:"leaveLobby",
            text:"leave current lobby",
            arguments: {
              JOINABILITY: {
                type: Scratch.ArgumentType.STRING,
                menu: "joinabilityTypes"
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Network Messaging"
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode:"sendGlobalMessage",
            text:"send message with data [DATA]",
            arguments: {
              DATA: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "message"
              }
            }
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode:"sendPrivateMessage",
            text:"send message with data [DATA] to [PEER]",
            arguments: {
              DATA: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "message"
              },
              PEER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "1234567890"
              }
            }
          },
          {
            blockType: Scratch.BlockType.EVENT,
            opcode: "whenMessageRecieved",
            text: "when I get a message",
            isEdgeActivated: false
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: "getMessageData",
            text: "message data",
          },

          //{
          //  blockType: Scratch.BlockType.REPORTER,
          //  opcode:"getSessionToken",
          //  text: "get session token"
          //},
        ],
        menus: {
          userInfo: {
            acceptReporters: true,
            items: [
              {
                value: "name",
                text: Scratch.translate("name"),
              },
              {
                value: "level",
                text: Scratch.translate({
                  default: "level",
                  description: "Steam account level",
                }),
              },
              {
                value: "IP country",
                text: Scratch.translate("IP country"),
              },
              {
                value: "steam ID",
                text: Scratch.translate("steam ID"),
              },
            ],
          },

          achievementUnlocked: {
            acceptReporters: true,
            items: [
              {
                value: "true",
                text: Scratch.translate("true"),
              },
              {
                value: "false",
                text: Scratch.translate("false"),
              },
            ],
          },

          installType: {
            acceptReporters: true,
            items: [
              {
                value: "DLC",
                text: Scratch.translate({
                  default: "DLC",
                  description: "Downloadable content",
                }),
              },
            ],
          },

          overlayType: {
            acceptReporters: true,
            items: [
              {
                value: "URL",
                text: Scratch.translate("URL"),
              },
            ],
          },

          controllerIDs: {
            acceptReporters: true,
            items: [
              {
                value: "1",
                text: "1",
              },
              {
                value: "2",
                text: "2",
              },
              {
                value: "3",
                text: "3",
              },
              {
                value: "4",
                text: "4",
              },
            ],
          },

          axisXY: {
            acceptReporters: true,
            items: [
              {
                value: "x",
                text: "horizontal",
              },
              {
                value: "y",
                text: "vertical",
              },
            ]
          },

          lobbyType: {
            acceptReporters: true,
            items:[
              {
                value: "Private",
                text: "private",
              },
              {
                value: "FriendsOnly",
                text: "friends Only",
              },
              {
                value: "Public",
                text: "public",
              },
            ]
          },

          lobbyDataTypes: {
            acceptReporters: true,
            items:[
              {
                value: "ID",
                text: "ID",
              },
              {
                value: "MEMBERCOUNT",
                text: "player count",
              },
              {
                value: "MEMBERLIMIT",
                text: "max player count",
              },
              {
                value: "OWNER",
                text: "owner",
              },
            ]
          },

          joinabilityTypes: {
            acceptReporters: true,
            items:[
              {
                value: "true",
                text: "joinable",
              },
              {
                value: "false",
                text: "un-joinable",
              },
            ]
          }
        },
      };
    }

    hasSteamworks() {
      return canUseSteamworks;
    }

    getUserInfo({ THING }) {
      if (!canUseSteamworks) return "Steamworks unavailable";
      switch (THING) {
        case "name":
          return Steamworks.localplayer.getName();
        case "level":
          return Steamworks.localplayer.getLevel();
        case "IP country":
          return Steamworks.localplayer.getIpCountry();
        case "steam ID":
          return Steamworks.localplayer.getSteamId().steamId64;
      }
      return "???";
    }

    setAchievement({ ACHIEVEMENT, STATUS }) {
      if (!canUseSteamworks) return;
      if (Scratch.Cast.toBoolean(STATUS)) {
        Steamworks.achievement.activate(Scratch.Cast.toString(ACHIEVEMENT));
      } else {
        Steamworks.achievement.clear(Scratch.Cast.toString(ACHIEVEMENT));
      }
    }

    getAchievement({ ACHIEVEMENT }) {
      if (!canUseSteamworks) return false;
      return Steamworks.achievement.isActivated(
        Scratch.Cast.toString(ACHIEVEMENT)
      );
    }

    getInstalled({ TYPE, ID }) {
      if (!canUseSteamworks) return false;
      if (TYPE === "DLC") {
        return Steamworks.apps.isDlcInstalled(Scratch.Cast.toNumber(ID));
      }
      return false;
    }

    openInOverlay({ TYPE, DATA }) {
      if (TYPE === "URL") {
        const url = Scratch.Cast.toString(DATA);
        if (canUseSteamworks) {
          // This will always be a packaged environment so don't need to bother
          // with canOpenWindow()
          Steamworks.overlay.activateToWebPage(DATA);
        } else {
          // Don't await result, we don't care
          Scratch.openWindow(url);
        }
      }
    }

    //Controller API
    setActionSet({ID, ACTIONSET}) {
      if (!canUseSteamworks) return;
      Steamworks.input.activateActionSet(Scratch.Cast.toString(ACTIONSET), Scratch.Cast.toNumber(ID));
    }

    isActionPressed({ACTION, ID}) {
      if (!canUseSteamworks) return false;
      return Scratch.Cast.toBoolean(Steamworks.input.isDigitalActionPressed(Scratch.Cast.toString(ACTION), Scratch.Cast.toNumber(ID)));
    }

    getAxisActionPressed({AXIS, ACTION, ID}) {
      if (!canUseSteamworks) return 0;
      const axis = Steamworks.input.getAnalogActionVector(Scratch.Cast.toString(ACTION), Scratch.Cast.toNumber(ID));
      if (axis && axis[AXIS]) return Scratch.Cast.toNumber(axis[AXIS]);
      return 0;
    }

    getControllerType({ ID }) {
      if (!canUseSteamworks) return "Steamworks API not available";
      return Scratch.Cast.toString(Steamworks.input.isDigitalActionPressed(Scratch.Cast.toString(ACTION), Scratch.Cast.toNumber(ID)));
    }

    //Networking!
    createLobby({ TYPE, MAX_PLAYERS }) {
      if (!canUseSteamworks) return "Steamworks unavailable";
      TYPE = Steamworks.matchmaking.LobbyType[TYPE];

      return Steamworks.matchmaking.createLobby(Scratch.Cast.toNumber(TYPE), Scratch.Cast.toNumber(MAX_PLAYERS));
    }

    joinLobby({ ID }) {
      if (!canUseSteamworks) return "Steamworks unavailable";
      Steamworks.matchmaking.joinLobby(ID);
    }

    getJoinedPeerData() {
      return Scratch.Cast.toString(peerData);
    }

    inLobby() {
      if (!canUseSteamworks) return false;
      console.log(Steamworks.currentLobby.inLobby());
      return Scratch.Cast.toBoolean(Steamworks.currentLobby.inLobby());
    }

    getLobbyAttribute({ TYPE }) {
      if (!canUseSteamworks) return "Steamworks unavailable";
      if (!Steamworks.currentLobby.inLobby()) return "No lobby"

      switch (TYPE) {
        case "ID":
          return Steamworks.currentLobby.getID();

        case "MEMBERCOUNT":
          return Steamworks.currentLobby.getMemberCount();

        case "MEMBERLIMIT":
          return Steamworks.currentLobby.getMemberLimit();

        case "OWNER":
          return Steamworks.currentLobby.getOwner().steamId64;
      
        default:
          return "???"
      }
    }

    getLobbyMembers({ TYPE }) {
      if (!canUseSteamworks) return "[]";
      if (!Steamworks.currentLobby.inLobby()) return "[]";

      Steamworks.currentLobby.getMembers();
    }

    setJoinability({ JOINABILITY }) {
      if (!canUseSteamworks) return;
      if (!Steamworks.currentLobby.inLobby()) return;

      Steamworks.currentLobby.setJoinable(Scratch.Cast.toBoolean(JOINABILITY));
    }

    openInviteWindow() {
      if (!canUseSteamworks) return;
      if (!Steamworks.currentLobby.inLobby()) return;
      
      Steamworks.overlay.activateInviteDialog(Steamworks.currentLobby.getID());
    }

    leaveLobby() {
      Steamworks.currentLobby.leave();
    }

    sendGlobalMessage({ DATA }) {
      if (!canUseSteamworks) return;
      if (!Steamworks.currentLobby.inLobby()) return;

      Steamworks.networking.sendGlobalMessage(Scratch.Cast.toString(DATA));
    }

    sendPrivateMessage({ DATA, PEER }) {
      if (!canUseSteamworks) return;
      if (!Steamworks.currentLobby.inLobby()) return;

      Steamworks.networking.sendPrivateMessage(Scratch.Cast.toString(DATA), Scratch.Cast.toNumber(PEER));
    }

    getMessageData({}) {
      return Scratch.Cast.toString(messageData);
    }

    getSessionToken() {
      if (!canUseSteamworks) return "Steamworks unavailable";
      //Get our session ticket.
      return Steamworks.auth.getSessionTicketWithSteamId(Steamworks.localplayer.getSteamId().steamId64);
    }
  }

  Scratch.extensions.register(new SteamworksExtension());
})(Scratch);
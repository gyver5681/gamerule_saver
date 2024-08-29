// scripts/main.ts
import { GameRule, system, world } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";
var gyverGameruleName = "GyverGamerules";
var tagGameruleUser = "GameruleUser";
var namespaceGrSaver = "grsaver";
var grSaverMainMenu = `${namespaceGrSaver}:mainMenu`;
var grSaverAddRule = `${namespaceGrSaver}:addRule`;
function setSavedGameRules(gamerules) {
  world.setDynamicProperty(gyverGameruleName, JSON.stringify(gamerules));
}
function getSavedGameRules() {
  let jsonGameRules = world.getDynamicProperty(gyverGameruleName);
  if (jsonGameRules) {
    let savedGameRules = JSON.parse(jsonGameRules);
    if (savedGameRules) {
      return savedGameRules;
    }
  }
}
function getSavedNames(savedRules) {
  let returnData = [];
  savedRules.forEach((cachedRule) => {
    returnData.push(cachedRule.name);
  });
  return returnData;
}
function updateSavedGameRules(updRule) {
  const cachedRules = getSavedGameRules();
  var newCachedRules = [];
  var newRule = true;
  if (cachedRules) {
    for (var index = 0; index < cachedRules.length; index++) {
      if (cachedRules[index].name == updRule.name) {
        newCachedRules.push(updRule);
        newRule = false;
      } else {
        newCachedRules.push(cachedRules[index]);
      }
    }
  }
  if (newRule) {
    newCachedRules.push(updRule);
    newCachedRules.sort((a, b) => a.name < b.name ? -1 : 1);
  }
  setSavedGameRules(newCachedRules);
}
function clearSavedGameRules() {
  setSavedGameRules([]);
}
function applySavedGamerules() {
  const cachedRules = getSavedGameRules();
  if (cachedRules) {
    for (let index = 0; index < cachedRules.length; index++) {
      world.getDimension("overworld").runCommandAsync(`gamerule ${cachedRules[index].name} ${cachedRules[index].value}`);
    }
    world.sendMessage("Custom Gamerules Loaded");
  }
}
function applySavedGamerulesByPlayer(player) {
  const cachedRules = getSavedGameRules();
  if (cachedRules) {
    for (let index = 0; index < cachedRules.length; index++) {
      player.sendMessage(`running: "gamerule ${cachedRules[index].name} ${cachedRules[index].value}"`);
      world.getDimension("overworld").runCommandAsync(`gamerule ${cachedRules[index].name} ${cachedRules[index].value}`);
    }
    player.sendMessage("Custom Gamerules Loaded");
  }
}
function showEditGameRules(player) {
  const savedRules = getSavedGameRules();
  if (savedRules) {
    const gameRulesEditorUi = new ModalFormData();
    gameRulesEditorUi.title("Custom Game Rules");
    for (const rule of savedRules) {
      switch (typeof rule.value) {
        case "boolean": {
          gameRulesEditorUi.toggle(rule.name, rule.value);
          break;
        }
        case "number": {
          gameRulesEditorUi.textField(rule.name, "", rule.value.toString());
          break;
        }
      }
    }
    gameRulesEditorUi.show(player).then((results) => {
      if (!results.canceled && results.formValues) {
        let newRules = [];
        for (let index = 0; index < results.formValues.length; index++) {
          switch (typeof results.formValues[index]) {
            case "boolean": {
              newRules.push({ name: savedRules[index].name, value: results.formValues[index] });
              break;
            }
            case "string": {
              newRules.push({ name: savedRules[index].name, value: parseInt(results.formValues[index]) });
              break;
            }
          }
        }
        setSavedGameRules(newRules);
      }
      returnToGameruleMain(player);
    });
  } else {
    const showNoGameRulesUi = new MessageFormData().title("").body("No Custom Game Rules").button1("Ok").button2("Ok");
    showNoGameRulesUi.show(player).then(() => {
      returnToGameruleMain(player);
    });
  }
}
function showAddGameRules(player) {
  const addRulesUi = new ActionFormData();
  addRulesUi.title("Add Game Rules");
  addRulesUi.body(
    "Below are Game Rules that aren't being customized via this addon. Select on to add it to the customization form."
  );
  const savedRules = getSavedGameRules() || [];
  const savedNames = getSavedNames(savedRules);
  let gamerules = Object.entries(GameRule);
  gamerules.sort((a, b) => a[1].toString().toUpperCase() < b[1].toString().toUpperCase() ? -1 : 1);
  let defaultRules = [];
  for (const [Name, Value] of gamerules) {
    let addButton = true;
    if (savedNames.length > 0) {
      for (const savedName of savedNames) {
        if (savedName === Value.toString()) {
          addButton = false;
          break;
        }
      }
    }
    if (addButton) {
      addRulesUi.button(Value);
      defaultRules.push([Value.toString(), Value]);
    }
  }
  addRulesUi.show(player).then((response) => {
    if (typeof response.selection === "number") {
      const selectedValue = defaultRules[response.selection][1];
      updateSavedGameRules({
        name: selectedValue.toString(),
        value: world.gameRules[selectedValue]
      });
      returnToAddRules(player);
    } else {
      returnToGameruleMain(player);
    }
  });
}
function showGameruleMainMenu(player) {
  const mainMenuUi = new ActionFormData();
  mainMenuUi.title("Gamerule Menu");
  mainMenuUi.body("");
  mainMenuUi.button("add gamerules");
  mainMenuUi.button("edit gamerules");
  mainMenuUi.button("show saved gamerules");
  mainMenuUi.button("apply saved gamerules");
  mainMenuUi.button("clear saved gamerules");
  mainMenuUi.show(player).then((response) => {
    if (typeof response.selection === "number") {
      switch (response.selection) {
        case 0: {
          showAddGameRules(player);
          break;
        }
        case 1: {
          showEditGameRules(player);
          break;
        }
        case 2: {
          const cachedRulesJSON = world.getDynamicProperty(gyverGameruleName);
          const showGamerulesUi = new MessageFormData();
          showGamerulesUi.title("");
          showGamerulesUi.body(`GyverGamerules: ${cachedRulesJSON}`);
          showGamerulesUi.button1("Ok");
          showGamerulesUi.button2("Ok");
          showGamerulesUi.show(player).then(() => {
            returnToGameruleMain(player);
          });
          break;
        }
        case 3: {
          applySavedGamerulesByPlayer(player);
          returnToGameruleMain(player);
          break;
        }
        case 4: {
          clearSavedGameRules();
          returnToGameruleMain(player);
          break;
        }
      }
    }
  });
}
function returnToGameruleMain(player) {
  player.dimension.runCommand(`scriptevent ${grSaverMainMenu} ${player.name}`);
}
function returnToAddRules(player) {
  player.dimension.runCommand(`scriptevent ${grSaverAddRule} ${player.name}`);
}
function reloadForm(event) {
  switch (event.id) {
    case grSaverMainMenu: {
      const player = world.getPlayers({ name: event.message })[0];
      showGameruleMainMenu(player);
      break;
    }
    case grSaverAddRule: {
      const player = world.getPlayers({ name: event.message })[0];
      showAddGameRules(player);
      break;
    }
  }
}
var onPlayerJoin = world.afterEvents.playerJoin.subscribe((event) => {
  system.runTimeout(applySavedGamerules, 200);
  world.afterEvents.playerJoin.unsubscribe(onPlayerJoin);
});
world.afterEvents.itemUse.subscribe((event) => {
  const { source, itemStack } = event;
  if (source.hasTag(tagGameruleUser)) {
    if (itemStack.typeId === "minecraft:amethyst_shard" && itemStack.nameTag === "gamerules") {
      showGameruleMainMenu(source);
    }
  }
});
system.afterEvents.scriptEventReceive.subscribe(reloadForm, { namespaces: [namespaceGrSaver] });

//# sourceMappingURL=../debug/main.js.map

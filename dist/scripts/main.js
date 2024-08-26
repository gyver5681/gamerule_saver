// scripts/main.ts
import { world } from "@minecraft/server";
var gyverGameruleName = "gyver:gamerules";
var gyverGameruleLoadedName = "gyver:gamerulesloaded";
function getGamerulesLoaded() {
  var returnValue = false;
  const gameruleLoaded = world.getDynamicProperty(gyverGameruleLoadedName);
  if (typeof gameruleLoaded === "boolean") {
    returnValue = gameruleLoaded;
  }
  return returnValue;
}
function setGamerulesLoaded(value) {
  world.setDynamicProperty(gyverGameruleLoadedName, value);
}
function applySavedGamerules() {
  const cachedRulesJSON = world.getDynamicProperty(gyverGameruleName);
  if (typeof cachedRulesJSON === "string") {
    let cachedRules = JSON.parse(cachedRulesJSON);
    Object.entries(cachedRules).forEach(([key, value]) => {
      world.getDimension("overworld").runCommandAsync(`gamerule ${key} ${value}`);
    });
  }
}
world.afterEvents.worldInitialize.subscribe((event) => {
  setGamerulesLoaded(false);
});
var onPlayerJoin = world.afterEvents.playerJoin.subscribe((event) => {
  const player = world.getPlayers({ name: event.playerName });
  if (getGamerulesLoaded()) {
    world.afterEvents.playerJoin.unsubscribe(onPlayerJoin);
  } else {
    applySavedGamerules();
  }
});
world.afterEvents.gameRuleChange.subscribe((event) => {
  let cachedRules;
  const cachedRulesJSONold = world.getDynamicProperty(gyverGameruleName);
  if (typeof cachedRulesJSONold === "string") {
    cachedRules = JSON.parse(cachedRulesJSONold);
    cachedRules[event.rule] = event.value;
  }
  const cachedRulesJSON = JSON.stringify(cachedRules);
  if (typeof cachedRulesJSON === "string") {
    world.setDynamicProperty(gyverGameruleName, cachedRulesJSON);
  }
});
console.log("gamerule-saver loaded!");

//# sourceMappingURL=../debug/main.js.map

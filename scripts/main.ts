import { GameRules, world, system, GameRule } from "@minecraft/server";

const gyverGameruleName = "gyver:gamerules";
const gyverGameruleLoadedName = "gyver:gamerulesloaded";

function getGamerulesLoaded(): boolean {
  var returnValue: boolean = false;
  const gameruleLoaded = world.getDynamicProperty(gyverGameruleLoadedName);
  if (typeof gameruleLoaded === "boolean") {
    returnValue = gameruleLoaded;
  }
  return returnValue;
}

function setGamerulesLoaded(value: boolean): void {
  world.setDynamicProperty(gyverGameruleLoadedName, value);
}

function applySavedGamerules(): void {
  const cachedRulesJSON = world.getDynamicProperty(gyverGameruleName);
  if (typeof cachedRulesJSON === "string") {
    let cachedRules = <GameRules>JSON.parse(cachedRulesJSON);
    Object.entries(cachedRules).forEach(([key, value]) => {
      world.getDimension("overworld").runCommandAsync(`gamerule ${key} ${value}`);
    });
  }
}

world.afterEvents.worldInitialize.subscribe((event) => {
  setGamerulesLoaded(false);
});

const onPlayerJoin = world.afterEvents.playerJoin.subscribe((event) => {
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

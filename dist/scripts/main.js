// scripts/main.ts
import { world } from "@minecraft/server";
var gyverGameruleName = "gyver:gamerules";
world.afterEvents.worldInitialize.subscribe((event) => {
  const cachedRulesJSON = world.getDynamicProperty(gyverGameruleName);
  if (typeof cachedRulesJSON === "string") {
    let cachedRules = JSON.parse(cachedRulesJSON);
    Object.entries(cachedRules).forEach(([key, value]) => {
      world.getDimension("overworld").runCommandAsync(`gamerule ${key} ${value}`);
    });
  }
  world.afterEvents.gameRuleChange.subscribe((event2) => {
    let cachedRules;
    const cachedRulesJSONold = world.getDynamicProperty(gyverGameruleName);
    if (typeof cachedRulesJSONold === "string") {
      cachedRules = JSON.parse(cachedRulesJSONold);
      cachedRules[event2.rule] = event2.value;
    }
    const cachedRulesJSON2 = JSON.stringify(cachedRules);
    if (typeof cachedRulesJSON2 === "string") {
      world.setDynamicProperty(gyverGameruleName, cachedRulesJSON2);
    }
  });
  console.log("gamerule-saver loaded!");
});

//# sourceMappingURL=../debug/main.js.map

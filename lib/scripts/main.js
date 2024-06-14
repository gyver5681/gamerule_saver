import { world } from "@minecraft/server";
const gyverGameruleName = "gyver:gamerules";
world.afterEvents.worldInitialize.subscribe((event) => {
    const cachedRulesJSON = world.getDynamicProperty(gyverGameruleName);
    if (typeof cachedRulesJSON === "string") {
        let cachedRules = JSON.parse(cachedRulesJSON);
        Object.entries(cachedRules).forEach(([key, value]) => {
            world.getDimension("overworld").runCommandAsync(`gamerule ${key} ${value}`);
        });
    }
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
});
//# sourceMappingURL=main.js.map
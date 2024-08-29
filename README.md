# Overview

For Bedrock Realms; This addon will save custom gamerules as a dynamic property on the world and apply them via the gamerule command when the first player logs into an unloaded world.

To use, add a tag named "GameruleUser" to the player and Use an amethyst crystal that's been renamed "gamerules".

# Functions

When the crystal is used, a Main Menu opens with the following options:

## Add Gamerules

This form lists all gamerules that have not been added to the addon. Rules are in alphabetical order for convenience. Select one and the gamerule will be added to the addon with its current default value. The form will reload so that multiple gamerules can be added faster. Close the form without making a selection to return to the Main Menu.

## Edit Gamerules

This form loads all custom gamerules with the value currently stored on the world. Pressing the Submit button will write the changes to world data. Cancelling the form will throw out any changes. Changes made are NOT automatically applied to the loaded world.

## Show Saved Gamerules

This option will display the raw JSON data saved on the world.

## Apply Saved Gamerules

This option will go through each saved gamerule and apply them to the active game via the gamerule command.

## Clear Saved Gamerules

This option will remove all saved gamerules from the saved data on the world. This will not affect the loaded game, but when the world is reloaded it will revert to its default behavior.

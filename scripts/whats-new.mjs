const MODULE_ID = "wild-magic-items";

// Heading is built from the manifest version so it can't drift out of date.
const CHANGELOG = `
<ul>
  <li>The Ring of Familiars now summons creatures bundled with the module</li>
  <li>Added the Goliath Werebear to the Wild Magic Actors compendium</li>
  <li>Fixed a Deck of Many Creatures result that linked to missing content</li>
</ul>
`;

Hooks.once("init", () => {
  // Registered at init so the setting exists before anything reads it.
  game.settings.register(MODULE_ID, "lastSeenVersion", {
    name: "Last Seen Version",
    scope: "client",
    config: false,
    type: String,
    default: "",
  });
});

Hooks.once("ready", async () => {
  // Only show to GMs
  if (!game.user.isGM) return;

  const currentVersion = game.modules.get(MODULE_ID).version;
  const lastSeen = game.settings.get(MODULE_ID, "lastSeenVersion");

  if (lastSeen === currentVersion) return;

  // Show the dialog (DialogV2 — V14 compatible)
  await foundry.applications.api.DialogV2.wait({
    window: { title: "Wild Magic Items — What's New" },
    content: `<h2>Wild Magic Items v${currentVersion}</h2>${CHANGELOG}`,
    buttons: [
      {
        action: "acknowledge",
        label: "Got it!",
        default: true,
      },
    ],
    rejectClose: false,
  });

  // Recorded after the dialog closes so dismissing with the window's X counts
  // as seen too — otherwise the dialog returns on every login.
  await game.settings.set(MODULE_ID, "lastSeenVersion", currentVersion);
});

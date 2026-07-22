const MODULE_ID = "wild-magic-items";

const CHANGELOG = `
<h2>Wild Magic Items v1.3.0</h2>
<ul>
  <li>Verified compatibility with Foundry VTT V14</li>
  <li>Migrated the "What's New" dialog to the modern DialogV2 API</li>
</ul>
`;

Hooks.once("ready", async () => {
  // Only show to GMs
  if (!game.user.isGM) return;

  // Register the setting to track last seen version
  game.settings.register(MODULE_ID, "lastSeenVersion", {
    name: "Last Seen Version",
    scope: "client",
    config: false,
    type: String,
    default: "",
  });

  const currentVersion = game.modules.get(MODULE_ID).version;
  const lastSeen = game.settings.get(MODULE_ID, "lastSeenVersion");

  if (lastSeen === currentVersion) return;

  // Show the dialog (DialogV2 — V14 compatible)
  await foundry.applications.api.DialogV2.wait({
    window: { title: "Wild Magic Items — What's New" },
    content: CHANGELOG,
    buttons: [
      {
        action: "close",
        label: "Got it!",
        default: true,
        callback: () =>
          game.settings.set(MODULE_ID, "lastSeenVersion", currentVersion),
      },
    ],
    rejectClose: false,
  });
});

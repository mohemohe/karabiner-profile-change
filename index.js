const { exec } = require("child_process");
const activeWindow = require("active-win");
const SysTray = require("systray").default;

const config = require("./config.json");

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(() => resolve(true), ms));

const sendNotification = (message) =>
  new Promise((resolve) =>
    exec(
      `'/opt/homebrew/bin/terminal-notifier' -title "Karabiner-Elements" -message "${message}"`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        if (stdout) {
          console.log(stdout);
        }
        if (stderr) {
          console.log(stderr);
        }
        resolve(null);
      }
    )
  );

const activeWindowOption = {
  screenRecordingPermission: false,
};

// LICENSE: https://github.com/twitter/twemoji/blob/master/LICENSE
const appleIcon =
  "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";
const windowIcon =
  "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";

const main = async () => {
  let waitMs = parseInt(process.env.KPC_WAIT_MS, 10);
  if (isNaN(waitMs)) {
    waitMs = 250;
  }

  const systrayMenuConfig = {
    title: "",
    icon: appleIcon,
    tooltip: "",
    items: [
      {
        title: "",
        tooltip: "",
        checked: false,
        enabled: false,
      },
      {
        title: "",
        tooltip: "",
        checked: false,
        enabled: false,
      },
    ],
  };
  const systray = new SysTray({
    menu: systrayMenuConfig,
  });

  let lastInfo;
  let lastProfile;

  let info;
  let profile;

  while (true) {
    try {
      info = await activeWindow(activeWindowOption);
    } catch (e) {
      sendNotification(e.message);
      continue;
    }

    if (lastInfo && info && info.owner.name != lastInfo.owner.name) {
      profile = config[info.owner.name] ? config[info.owner.name] : config["_"];

      if (lastProfile && lastProfile === profile) {
        continue;
      }

      console.log(info.owner.name, "->", profile);

      lastProfile = profile;

      if (profile === "Default") {
        systrayMenuConfig.icon = appleIcon;
      } else {
        systrayMenuConfig.icon = windowIcon;
      }
      systray.sendAction({
        type: "update-menu",
        seq_id: 0,
        menu: systrayMenuConfig,
      });

      systrayMenuConfig.items[0].title = info.owner.name;
      systray.sendAction({
        type: "update-item",
        seq_id: 0,
        item: systrayMenuConfig.items[0],
      });

      systrayMenuConfig.items[1].title = profile;
      systray.sendAction({
        type: "update-item",
        seq_id: 1,
        item: systrayMenuConfig.items[1],
      });

      await new Promise((resolve) =>
        exec(
          `'/Library/Application Support/org.pqrs/Karabiner-Elements/bin/karabiner_cli' --select-profile "${profile}"`,
          async (err, stdout, stderr) => {
            if (err) {
              console.error(err);
              return;
            }
            if (stdout) {
              console.log(stdout);
            }
            if (stderr) {
              console.log(stderr);
            }

            if (process.env.KPC_SEND_NOTIFICATION) {
              await sendNotification(profile);
            }

            resolve(null);
          }
        )
      );
    }
    lastInfo = info;
    await sleep(waitMs);
  }
};

main();

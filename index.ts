const { Client } = require("discord.js");
const client = new Client();
const { GiveawaysManager } = require("discord-giveaways");

const manager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  updateCountdownEvery: 10000,
  hasGuildMembersIntent: false,
  default: {
    botsCanWin: false,
    exemptPermissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    embedColor: "#FF0000",
    reaction: "🎉",
  },
});

client.giveawaysManager = manager;

let settings = {
  token: require("./config.json").token,
  prefix: require("./config.json").prefix,
};

client.on("message", (message) => {
  const ms = require("ms"); // npm install ms
  const args = message.content
    .slice(settings.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === "start-giveaway") {
    // g!start-giveaway 2d 1 Awesome prize!
    // will create a giveaway with a duration of two days, with one winner and the prize will be "Awesome prize!"

    client.giveawaysManager
      .start(message.channel, {
        time: ms(args[0]),
        prize: args.slice(2).join(" "),
        winnerCount: parseInt(args[1]),
      })
      .then((gData) => {});
    // And the giveaway has started!
  }

  if (command === "reroll") {
    let messageID = args[0];
    client.giveawaysManager
      .reroll(messageID)
      .then(() => {
        message.channel.send("Success! Giveaway rerolled!");
      })
      .catch((err) => {
        message.channel.send(
          "No giveaway found for " + messageID + ", please check and try again"
        );
      });
  }

  if (command === "delete") {
    let messageID = args[0];
    client.giveawaysManager
      .delete(messageID)
      .then(() => {
        message.channel.send("Success! Giveaway deleted!");
      })
      .catch((err) => {
        message.channel.send(
          "No giveaway found for " + messageID + ", please check and try again"
        );
      });
  }

  if (command === "edit") {
    let messageID = args[0];
    if (!messageID) return message.reply("No message ID was given");
    client.giveawaysManager
      .edit(messageID, {
        newWinnerCount: 3,
        newPrize: "New Prize!",
        addTime: 5000,
      })
      .then(() => {
        // here, we can calculate the time after which we are sure that the lib will update the giveaway
        const numberOfSecondsMax =
          client.giveawaysManager.options.updateCountdownEvery / 1000;
        message.channel.send(
          "Success! Giveaway will updated in less than " +
            numberOfSecondsMax +
            " seconds."
        );
      })
      .catch((err) => {
        message.channel.send(
          "No giveaway found for " + messageID + ", please check and try again"
        );
      });
  }
});

client.login(settings.token);

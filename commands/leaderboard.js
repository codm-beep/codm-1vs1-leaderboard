const { SlashCommandBuilder } = require("discord.js");
const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "./credentials/codm-leaderboard-502322-4400356b923e.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = "1TUbiTpKjDji0YLBJes8AsY1xmZQdwY1vFcTjC3yET1g";
const RANGE = "CodM 1vs1 Leaderboard!A2:F";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the current leaderboard"),

  async execute(interaction) {
    console.log("🔥 leaderboard.js EXECUTED");

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
      });

      const rows = response.data.values;

      if (!rows || rows.length === 0) {
        return interaction.reply("The leaderboard is empty.");
      }

      let message = "🏆 **1vs1 Sniper Leaderboard**\n\n";

rows.forEach((row, index) => {
    let place;

    if (index === 0) place = "🥇";
    else if (index === 1) place = "🥈";
    else if (index === 2) place = "🥉";
    else place = `${row[0]}.`;

    message += `${place} **${row[1]}** (${row[2]})
${row[3]} Wins • ${row[4]} Losses • ${row[5]} Win Rate

`;
});

      await interaction.reply(message);

    } catch (err) {
      console.error(err);
      await interaction.reply("Couldn't load the leaderboard.");
    }
  },
};
const { SlashCommandBuilder } = require("discord.js");
const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "./credentials/codm-leaderboard-502322-7cd67a4e30f7.json",
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
    await interaction.deferReply();
    console.log("🔥 leaderboard.js EXECUTED");

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
      });

      const rows = response.data.values;
      console.log("Rows received:", rows.length);
      console.log(rows);
      rows.sort((a, b) => {
    const winsA = parseInt(a[3]) || 0;
    const winsB = parseInt(b[3]) || 0;

    if (winsB !== winsA) {
        return winsB - winsA; // Most wins first
    }

    const winRateA = parseFloat((a[5] || "0").replace("%", ""));
    const winRateB = parseFloat((b[5] || "0").replace("%", ""));

    return winRateB - winRateA; // Tie-breaker
});

      if (!rows || rows.length === 0) {
        return interaction.reply("The leaderboard is empty.");
      }

let message = ` 🏆✨ 1vs1 Sniper Leaderboard ✨🏆 

`;
rows.slice(0, 10).forEach((row, index) => {
    let place;

    if (index === 0) place = "🥇";
    else if (index === 1) place = "🥈";
    else if (index === 2) place = "🥉";
    else place = `${index + 1}.`;

message += `${place} **${row[1]} (${row[2]})**
${row[3]} Wins | ${row[4]} Losses | Win Rate: ${parseFloat(row[5].replace(",", ".")).toFixed(1)}%

`;
});

const timestamp = Math.floor(Date.now() / 1000);

message += `👥 Total Players: ${rows.length}\n\n`;
message += `🕒 Last updated: <t:${timestamp}:R>`;

    await interaction.editReply(message);

  } catch (err) {
    console.error(err);
    await interaction.editReply("Couldn't load the leaderboard.");
  }
},
};
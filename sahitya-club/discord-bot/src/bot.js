import "dotenv/config";
import {
  Client,
  Events,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} from "discord.js";

const required = ["DISCORD_BOT_TOKEN", "DISCORD_APPLICATION_ID", "DISCORD_BOT_SYNC_SECRET", "WLC_API_BASE_URL"];
for (const key of required) {
  if (!process.env[key]?.trim()) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

const token = process.env.DISCORD_BOT_TOKEN.trim();
const applicationId = process.env.DISCORD_APPLICATION_ID.trim();
const guildId = process.env.DISCORD_GUILD_ID?.trim();
const apiBase = process.env.WLC_API_BASE_URL.trim().replace(/\/$/, "");
const syncSecret = process.env.DISCORD_BOT_SYNC_SECRET.trim();

const commands = [
  new SlashCommandBuilder().setName("wlc").setDescription("WLC bot help and status"),
  new SlashCommandBuilder().setName("panels").setDescription("Show available WLC generations"),
  new SlashCommandBuilder()
    .setName("gen")
    .setDescription("View a published WLC generation panel")
    .addStringOption(option => option.setName("generation").setDescription("Generation").setRequired(true)
      .addChoices({ name: "GEN-1", value: "GEN-1" }, { name: "GEN-2", value: "GEN-2" }, { name: "GEN-3", value: "GEN-3" })),
  new SlashCommandBuilder()
    .setName("announce")
    .setDescription("Publish an official WLC announcement")
    .addStringOption(option => option.setName("message").setDescription("Announcement text").setRequired(true).setMaxLength(1800))
    .addChannelOption(option => option.setName("channel").setDescription("Destination channel").addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  new SlashCommandBuilder()
    .setName("sync")
    .setDescription("Synchronize published GEN panel roles from the WLC website")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

async function fetchPanels() {
  const response = await fetch(`${apiBase}/api/discord/panels`, {
    headers: { Authorization: `Bearer ${syncSecret}` },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`WLC sync API returned HTTP ${response.status}`);
  const body = await response.json();
  if (!body.success || !body.panels) throw new Error("WLC sync API returned an invalid payload");
  return body;
}

function panelEmbed(generation, members) {
  const lines = members.slice(0, 35).map(member =>
    `• **${member.name || "Unnamed"}** — ${member.role || "Member"}${member.department ? ` (${member.department})` : ""}`
  );
  if (members.length > 35) lines.push(`…and ${members.length - 35} more members.`);
  return {
    color: 0x8f263d,
    title: `Willes Literary Club · ${generation}`,
    description: lines.join("\n") || "No published records are available for this generation yet.",
    footer: { text: "Official WLC panel directory · Data from wlc.pro.bd" },
    timestamp: new Date().toISOString(),
  };
}

client.once(Events.ClientReady, async readyClient => {
  console.log(`WLC Discord Bot online as ${readyClient.user.tag}`);
  try {
    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(applicationId, guildId), { body: commands });
      console.log(`Registered commands for guild ${guildId}`);
    } else {
      await rest.put(Routes.applicationCommands(applicationId), { body: commands });
      console.log("Registered global slash commands");
    }
  } catch (error) {
    console.error("Slash command registration failed:", error);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === "wlc") {
      await interaction.reply({
        ephemeral: true,
        content: "**Willes Literary Club Bot**\nOfficial community management and panel directory.\nCommands: `/panels`, `/gen`, `/sync`, `/announce`.",
      });
      return;
    }

    if (interaction.commandName === "panels") {
      await interaction.deferReply({ ephemeral: true });
      const { panels, generatedAt } = await fetchPanels();
      const summary = ["GEN-1", "GEN-2", "GEN-3"].map(id =>
        `**${id}:** ${panels[id]?.length || 0} published members`
      );
      await interaction.editReply(`${summary.join("\n")}\n\nLast sync: <t:${Math.floor(new Date(generatedAt).getTime() / 1000)}:R>`);
      return;
    }

    if (interaction.commandName === "gen") {
      await interaction.deferReply();
      const generation = interaction.options.getString("generation", true);
      const { panels } = await fetchPanels();
      await interaction.editReply({ embeds: [panelEmbed(generation, panels[generation] || [])] });
      return;
    }

    if (interaction.commandName === "announce") {
      const message = interaction.options.getString("message", true);
      const channel = interaction.options.getChannel("channel") || interaction.channel;
      if (!channel || !channel.isTextBased() || !("send" in channel)) {
        await interaction.reply({ content: "Choose a text channel.", ephemeral: true });
        return;
      }
      await channel.send({
        embeds: [{
          color: 0x8f263d,
          author: { name: "Willes Literary Club · Official Announcement" },
          description: message,
          footer: { text: `Published by ${interaction.user.username}` },
          timestamp: new Date().toISOString(),
        }],
      });
      await interaction.reply({ content: "Announcement published.", ephemeral: true });
      return;
    }

    if (interaction.commandName === "sync") {
      await interaction.deferReply({ ephemeral: true });
      const { panels, generatedAt } = await fetchPanels();
      const guild = interaction.guild;
      if (!guild) throw new Error("This command must be used inside a server.");
      await guild.roles.fetch();

      const results = [];
      for (const generation of ["GEN-1", "GEN-2", "GEN-3"]) {
        const members = panels[generation] || [];
        const roleName = `${generation} Panel`;
        let role = guild.roles.cache.find(item => item.name === roleName);
        if (!role) role = await guild.roles.create({ name: roleName, reason: "WLC generation panel sync" });
        results.push(`${generation}: ${members.length} published records; role **@${role.name}** ready`);
      }

      await interaction.editReply([
        "**WLC panel sync check completed.**",
        ...results,
        "",
        `Source timestamp: ${generatedAt}`,
        "This initial sync prepares generation roles; individual Discord account linking and member-role assignment are not enabled yet.",
      ].join("\n"));
    }
  } catch (error) {
    console.error(`Command /${interaction.commandName} failed:`, error);
    const message = "Something went wrong. Please try again or contact a WLC administrator.";
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({ content: message }).catch(() => {});
    } else {
      await interaction.reply({ content: message, ephemeral: true }).catch(() => {});
    }
  }
});

client.on(Events.Error, error => console.error("Discord client error:", error));
process.on("unhandledRejection", error => console.error("Unhandled rejection:", error));

client.login(token);

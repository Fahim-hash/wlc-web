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
import { LavalinkManager } from "lavalink-client";

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
const welcomeChannelId = process.env.DISCORD_WELCOME_CHANNEL_ID?.trim();
const autoRoleId = process.env.DISCORD_AUTO_ROLE_ID?.trim();
const welcomeAllowedRoleIds = (process.env.DISCORD_WELCOME_ALLOWED_ROLE_IDS || "")
  .split(",").map(id => id.trim()).filter(Boolean);

const musicGuildId = process.env.MUSIC_GUILD_ID?.trim() || guildId;
const musicVoiceChannelId = process.env.MUSIC_VOICE_CHANNEL_ID?.trim();
const musicTextChannelId = process.env.MUSIC_TEXT_CHANNEL_ID?.trim() || welcomeChannelId;
const musicRadioQueries = (process.env.MUSIC_RADIO_QUERIES ||
  "lofi study beats;chill instrumental music;acoustic cafe music;ambient piano music;soft instrumental music")
  .split(";").map(query => query.trim()).filter(Boolean);
const defaultMusicVolume = Math.min(100, Math.max(1, Number(process.env.MUSIC_DEFAULT_VOLUME) || 35));
let radioEnabled = (process.env.MUSIC_RADIO_ENABLED || "true").toLowerCase() !== "false";
let radioQueryIndex = 0;

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

  new SlashCommandBuilder()
    .setName("play").setDescription("Search YouTube Music and play a song")
    .addStringOption(option => option.setName("query").setDescription("Song name or YouTube URL").setRequired(true).setMaxLength(500)),
  new SlashCommandBuilder().setName("skip").setDescription("Skip the current song"),
  new SlashCommandBuilder().setName("pause").setDescription("Pause music"),
  new SlashCommandBuilder().setName("resume").setDescription("Resume music"),
  new SlashCommandBuilder().setName("stop").setDescription("Stop playback and clear the queue"),
  new SlashCommandBuilder().setName("queue").setDescription("Show the current music queue"),
  new SlashCommandBuilder().setName("nowplaying").setDescription("Show the currently playing song"),
  new SlashCommandBuilder()
    .setName("volume").setDescription("Set music volume")
    .addIntegerOption(option => option.setName("level").setDescription("Volume from 1 to 100").setRequired(true).setMinValue(1).setMaxValue(100)),
  new SlashCommandBuilder()
    .setName("radio").setDescription("Enable or disable the automatic WLC radio")
    .addBooleanOption(option => option.setName("enabled").setDescription("Turn automatic radio on or off").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates],
});

const lavalinkHost = process.env.LAVALINK_HOST?.trim();
const lavalinkPassword = process.env.LAVALINK_PASSWORD?.trim();
const lavalinkPort = Number(process.env.LAVALINK_PORT || 2333);
const lavalinkSecure = (process.env.LAVALINK_SECURE || "false").toLowerCase() === "true";
const musicConfigured = Boolean(lavalinkHost && lavalinkPassword && Number.isInteger(lavalinkPort) && lavalinkPort > 0);

if (musicConfigured) {
  client.lavalink = new LavalinkManager({
    nodes: [{
      id: "wlc-primary",
      host: lavalinkHost,
      port: lavalinkPort,
      authorization: lavalinkPassword,
      secure: lavalinkSecure,
      retryAmount: 10,
      retryDelay: 10_000,
      requestTimeout: 15_000,
    }],
    sendToShard: (targetGuildId, payload) => client.guilds.cache.get(targetGuildId)?.shard?.send(payload),
    autoSkip: true,
    client: { id: applicationId, username: "সাহিত্য বন্ধু" },
    playerOptions: {
      applyVolumeAsFilter: false,
      clientBasedPositionUpdateInterval: 250,
      defaultSearchPlatform: "ytmsearch",
      onDisconnect: { autoReconnect: true, destroyPlayer: false },
      // Allow a few isolated YouTube failures without destroying the voice player.
      // autoSkip still advances past individual failed tracks.
      maxErrorsPerTime: { threshold: 30_000, maxAmount: 6 },
      minAutoPlayMs: 15_000,
      onEmptyQueue: {
        autoPlayFunction: async player => {
          if (!radioEnabled || player.guildId !== musicGuildId) return;
          await addRadioTrack(player);
        },
      },
    },
    queueOptions: { maxPreviousTracks: 10 },
  });

  client.on("raw", packet => client.lavalink.sendRawData(packet));
  client.lavalink.on("trackStart", (player, track) => {
    console.log(`Music started in ${player.guildId}: ${track.info?.title || "Unknown track"}`);
  });
  client.lavalink.on("trackError", (player, track, payload) => {
    const exception = payload?.exception || payload || {};
    console.error(
      `Track playback failed in ${player.guildId}: ${track?.info?.title || "Unknown track"}`,
      JSON.stringify({
        message: exception.message,
        severity: exception.severity,
        cause: exception.cause,
      })
    );
  });
  client.lavalink.on("trackStuck", (player, track, payload) => {
    console.warn(
      `Track playback stuck in ${player.guildId}: ${track?.info?.title || "Unknown track"}`,
      JSON.stringify(payload || {})
    );
  });
  client.lavalink.on("playerDisconnect", (player, voiceChannelId) => {
    console.warn(`Music player disconnected in ${player.guildId} from voice channel ${voiceChannelId || "unknown"}`);
  });
  client.lavalink.on("playerDestroy", (player, reason) => {
    console.warn(`Music player destroyed in ${player.guildId}; reason: ${reason || "not provided"}`);
  });
  client.lavalink.nodeManager.on("create", node => {
    console.log(`Lavalink node created: ${node.id} (${node.options?.host || lavalinkHost}:${node.options?.port || lavalinkPort})`);
  });
  client.lavalink.nodeManager.on("connect", node => {
    console.log(`Lavalink node connected: ${node.id}`);
    if (discordReady && radioEnabled) void startWlcRadioWhenReady();
  });
  client.lavalink.nodeManager.on("reconnecting", node => {
    console.warn(`Lavalink node reconnecting: ${node.id}`);
  });
  client.lavalink.nodeManager.on("disconnect", (node, reason) => {
    console.warn(`Lavalink node disconnected: ${node.id}`, reason);
  });
  client.lavalink.nodeManager.on("error", (node, error) => {
    console.error(`Lavalink node ${node.id} error:`, error?.message || error);
  });
} else {
  console.warn("Music is disabled: configure LAVALINK_HOST, LAVALINK_PORT and LAVALINK_PASSWORD.");
}

function getMusicPlayer(guildId) {
  return client.lavalink?.getPlayer(guildId);
}

async function addRadioTrack(player) {
  if (!client.lavalink?.useable || !musicRadioQueries.length) return false;

  for (let attempt = 0; attempt < musicRadioQueries.length; attempt += 1) {
    const query = musicRadioQueries[radioQueryIndex % musicRadioQueries.length];
    radioQueryIndex += 1;
    try {
      const result = await player.search({ query: `ytmsearch:${query}` }, client.user);
      const tracks = result?.tracks || [];
      if (!tracks.length) continue;
      await player.queue.add(tracks[0]);
      console.log(`WLC Radio queued: ${tracks[0].info?.title || query}`);
      return true;
    } catch (error) {
      console.error(`Radio search failed for "${query}":`, error);
    }
  }
  console.error("WLC Radio could not find a playable track from the configured queries.");
  return false;
}

async function createMusicPlayer(guild, voiceChannelId, textChannelId) {
  if (!client.lavalink?.useable) throw new Error("The music server is not connected yet. Please try again shortly.");
  let player = getMusicPlayer(guild.id);
  if (player && player.voiceChannelId && player.voiceChannelId !== voiceChannelId) {
    throw new Error(`I am already playing in <#${player.voiceChannelId}>. Join that voice channel first.`);
  }
  if (!player) {
    player = await client.lavalink.createPlayer({
      guildId: guild.id,
      voiceChannelId,
      textChannelId: textChannelId || undefined,
      selfDeaf: true,
      selfMute: false,
      volume: defaultMusicVolume,
    });
  }
  if (!player.connected) await player.connect();
  return player;
}

let discordReady = false;
let radioStartPromise = null;

async function waitForLavalinkConnection(timeoutMs = 60_000) {
  if (client.lavalink?.useable) return;
  console.log(`Waiting up to ${Math.round(timeoutMs / 1000)}s for Lavalink node connection...`);
  await new Promise((resolve, reject) => {
    const manager = client.lavalink?.nodeManager;
    if (!manager) return reject(new Error("Lavalink node manager is unavailable."));
    const timeout = setTimeout(() => {
      manager.off("connect", onConnect);
      reject(new Error("Timed out waiting for Lavalink node connection. Check TCP proxy, port and Lavalink password."));
    }, timeoutMs);
    const onConnect = () => {
      clearTimeout(timeout);
      manager.off("connect", onConnect);
      resolve();
    };
    manager.on("connect", onConnect);
    if (client.lavalink?.useable) onConnect();
  });
}

function startWlcRadioWhenReady() {
  if (!radioEnabled || !client.lavalink?.useable) return Promise.resolve();
  if (radioStartPromise) return radioStartPromise;
  radioStartPromise = startWlcRadio()
    .catch(error => {
      console.error("WLC Radio startup failed:", error);
      radioStartPromise = null;
    });
  return radioStartPromise;
}

async function startWlcRadio() {
  if (!musicVoiceChannelId || !musicGuildId) {
    throw new Error("Set MUSIC_GUILD_ID and MUSIC_VOICE_CHANNEL_ID to configure the WLC radio.");
  }
  if (!radioEnabled) return;
  if (!client.lavalink?.useable) throw new Error(musicUnavailableMessage());

  const guild = await client.guilds.fetch(musicGuildId);
  const voiceChannel = await guild.channels.fetch(musicVoiceChannelId);
  if (!voiceChannel?.isVoiceBased()) {
    throw new Error("MUSIC_VOICE_CHANNEL_ID must point to a voice or stage channel.");
  }

  const player = await createMusicPlayer(guild, voiceChannel.id, musicTextChannelId);
  if (!player.playing && !player.queue.current && player.queue.tracks.length === 0) {
    const added = await addRadioTrack(player);
    if (added) await player.play();
  } else if (!player.playing && (player.queue.current || player.queue.tracks.length > 0)) {
    await player.play();
  }
  console.log(`WLC Radio connected to #${voiceChannel.name}`);
}

async function configureWelcomeChannel(guild) {
  if (!welcomeChannelId) return;
  const channel = await guild.channels.fetch(welcomeChannelId);
  if (!channel || !channel.isTextBased() || !("permissionOverwrites" in channel)) {
    throw new Error("DISCORD_WELCOME_CHANNEL_ID must point to a text channel in the target server.");
  }

  await channel.permissionOverwrites.edit(guild.roles.everyone, {
    SendMessages: false,
    SendMessagesInThreads: false,
    CreatePublicThreads: false,
    CreatePrivateThreads: false,
  });

  const botMember = await guild.members.fetchMe();
  await channel.permissionOverwrites.edit(botMember, {
    ViewChannel: true,
    SendMessages: true,
    SendMessagesInThreads: true,
    EmbedLinks: true,
  });

  for (const roleId of welcomeAllowedRoleIds) {
    const role = await guild.roles.fetch(roleId);
    if (!role) {
      console.warn(`Welcome channel role not found: ${roleId}`);
      continue;
    }
    await channel.permissionOverwrites.edit(role, {
      ViewChannel: true,
      SendMessages: true,
      SendMessagesInThreads: true,
    });
  }
  console.log(`Welcome channel permissions configured: #${channel.name}`);
}

async function handleNewMember(member) {
  if (!welcomeChannelId) return;
  try {
    if (autoRoleId) {
      const role = await member.guild.roles.fetch(autoRoleId);
      if (!role) throw new Error(`Auto role not found: ${autoRoleId}`);
      await member.roles.add(role, "Automatic WLC Discord welcome role");
    }

    const channel = await member.guild.channels.fetch(welcomeChannelId);
    if (!channel || !channel.isTextBased() || !("send" in channel)) {
      throw new Error("Welcome channel is missing or is not a text channel.");
    }

    await channel.send({
      content: `Welcome to **Willes Literary Club**! 🎉\nস্বাগতম, <@${member.id}>! WLC Discord community-তে যোগ দেওয়ার জন্য ধন্যবাদ।\n\nসার্ভারের নিয়মাবলি মেনে চলুন এবং সাহিত্যচর্চার সঙ্গে যুক্ত থাকুন।`,
      allowedMentions: { users: [member.id] },
    });
    console.log(`Welcomed new member ${member.user.tag} in #${channel.name}`);
  } catch (error) {
    console.error(`New member welcome failed for ${member.id}:`, error);
  }
}

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

function durationLabel(milliseconds) {
  if (!milliseconds) return "LIVE";
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}` :
    `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function musicUnavailableMessage() {
  return "Music service is not configured or the Lavalink node is offline. Please contact a WLC administrator.";
}

async function requireMusicPlayer(interaction) {
  if (!client.lavalink?.useable) throw new Error(musicUnavailableMessage());
  const player = getMusicPlayer(interaction.guildId);
  if (!player?.connected) throw new Error("Nothing is connected to a voice channel right now. Join a voice channel and use /play.");
  const member = await interaction.guild.members.fetch(interaction.user.id);
  const memberVoiceId = member.voice.channelId;
  if (memberVoiceId && player.voiceChannelId !== memberVoiceId) {
    throw new Error(`Join <#${player.voiceChannelId}> to control the music.`);
  }
  return player;
}

client.once(Events.ClientReady, async readyClient => {
  discordReady = true;
  console.log(`WLC Discord Bot online as ${readyClient.user.tag}`);
  if (welcomeChannelId) {
    try {
      const channel = await readyClient.channels.fetch(welcomeChannelId);
      if (!channel || !channel.guild) throw new Error("Welcome channel could not be found.");
      await configureWelcomeChannel(channel.guild);
    } catch (error) {
      console.error("Welcome channel setup failed. Check channel ID and Manage Channels permission:", error);
    }
  }
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

  if (client.lavalink) {
    try {
      console.log(`Connecting to Lavalink at ${lavalinkHost}:${lavalinkPort} (secure=${lavalinkSecure})...`);
      await client.lavalink.init({ ...readyClient.user });
      console.log("Lavalink manager initialized; waiting for a connected node.");
      await waitForLavalinkConnection(60_000);
      console.log("Lavalink node is usable.");
      await startWlcRadioWhenReady();
    } catch (error) {
      console.error("Lavalink startup diagnostic:", error?.stack || error);
      console.error("Music will remain unavailable until the Lavalink node connects; automatic reconnect is enabled.");
    }
  }
});

client.on(Events.GuildMemberAdd, handleNewMember);

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === "wlc") {
      await interaction.reply({
        ephemeral: true,
        content: "**Willes Literary Club Bot**\nOfficial community management, panel directory and music radio.\nManagement: `/panels`, `/gen`, `/sync`, `/announce`.\nMusic: `/play`, `/skip`, `/pause`, `/resume`, `/queue`, `/nowplaying`, `/volume`, `/stop`.",
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
      return;
    }

    if (interaction.commandName === "play") {
      await interaction.deferReply();
      if (!interaction.guild) {
        await interaction.editReply("Use /play inside a Discord server.");
        return;
      }
      const member = await interaction.guild.members.fetch(interaction.user.id);
      const requesterVoiceId = member.voice.channelId;
      if (!requesterVoiceId) {
        await interaction.editReply("Join a voice channel first, then use /play.");
        return;
      }
      const voiceId = musicVoiceChannelId && interaction.guildId === musicGuildId
        ? musicVoiceChannelId
        : requesterVoiceId;
      if (musicVoiceChannelId && interaction.guildId === musicGuildId && requesterVoiceId !== musicVoiceChannelId) {
        await interaction.editReply(`Please join the WLC Music voice channel <#${musicVoiceChannelId}> first.`);
        return;
      }
      const player = await createMusicPlayer(interaction.guild, voiceId, interaction.channelId);
      const query = interaction.options.getString("query", true);
      const searchQuery = /^https?:\/\//i.test(query) ? query : `ytmsearch:${query}`;
      const result = await player.search({ query: searchQuery }, interaction.user);
      if (!result?.tracks?.length) {
        await interaction.editReply("No playable YouTube Music results found. Try another song title or a direct YouTube link.");
        return;
      }
      // A search returns many similarly named videos. Add only the top match,
      // not every result, so unrelated videos do not flood the queue.
      const first = result.tracks[0];
      await player.queue.add(first);
      if (!player.playing) await player.play();
      await interaction.editReply(`🎶 Added **[${first.info.title}](${first.info.uri || "https://youtube.com"})** to the queue.`);
      return;
    }

    if (interaction.commandName === "skip") {
      const player = await requireMusicPlayer(interaction);
      if (!player.queue.current) throw new Error("There is no song to skip.");
      await player.skip();
      await interaction.reply("⏭️ Skipped the current song.");
      return;
    }

    if (interaction.commandName === "pause") {
      const player = await requireMusicPlayer(interaction);
      if (player.paused) throw new Error("Music is already paused.");
      await player.pause();
      await interaction.reply("⏸️ Music paused.");
      return;
    }

    if (interaction.commandName === "resume") {
      const player = await requireMusicPlayer(interaction);
      if (!player.paused && player.playing) throw new Error("Music is already playing.");
      await player.resume();
      await interaction.reply("▶️ Music resumed.");
      return;
    }

    if (interaction.commandName === "stop") {
      const player = await requireMusicPlayer(interaction);
      await player.stopPlaying(true, false);
      await interaction.reply("⏹️ Playback stopped and the queue was cleared. Use /play or ask an admin to restart /radio.");
      return;
    }

    if (interaction.commandName === "queue") {
      const player = await requireMusicPlayer(interaction);
      const current = player.queue.current;
      const upcoming = player.queue.tracks.slice(0, 10);
      const lines = upcoming.map((track, index) =>
        `${index + 1}. **${track.info.title}** — ${durationLabel(track.info.duration)}`
      );
      await interaction.reply({
        embeds: [{
          color: 0x8f263d,
          title: "🎶 WLC Music Queue",
          description: [
            current ? `**Now playing:** [${current.info.title}](${current.info.uri || "https://youtube.com"})` : "Nothing is playing right now.",
            lines.length ? "\n**Up next:**\n" + lines.join("\n") : "\nThe queue is empty.",
            player.queue.tracks.length > 10 ? `\n…and ${player.queue.tracks.length - 10} more tracks.` : "",
          ].join("\n"),
          footer: { text: `${player.queue.tracks.length} tracks in queue` },
        }],
      });
      return;
    }

    if (interaction.commandName === "nowplaying") {
      const player = await requireMusicPlayer(interaction);
      const track = player.queue.current;
      if (!track) throw new Error("Nothing is playing right now.");
      await interaction.reply({
        embeds: [{
          color: 0x8f263d,
          title: "🎧 Now Playing",
          description: `[${track.info.title}](${track.info.uri || "https://youtube.com"})\n**Artist:** ${track.info.author || "Unknown"}\n**Duration:** ${durationLabel(track.info.duration)}`,
          thumbnail: track.info.artworkUrl ? { url: track.info.artworkUrl } : undefined,
        }],
      });
      return;
    }

    if (interaction.commandName === "volume") {
      const player = await requireMusicPlayer(interaction);
      const level = interaction.options.getInteger("level", true);
      await player.setVolume(level);
      await interaction.reply(`🔊 Volume set to **${level}%**.`);
      return;
    }

    if (interaction.commandName === "radio") {
      radioEnabled = interaction.options.getBoolean("enabled", true);
      if (radioEnabled) {
        await interaction.deferReply({ ephemeral: true });
        await startWlcRadio();
        await interaction.editReply("📻 WLC Auto Radio is enabled. It will refill the queue automatically.");
      } else {
        const player = musicGuildId ? getMusicPlayer(musicGuildId) : undefined;
        if (player) await player.stopPlaying(true, false);
        await interaction.reply({ content: "📻 WLC Auto Radio is disabled. Members can still use /play.", ephemeral: true });
      }
      return;
    }
  } catch (error) {
    console.error(`Command /${interaction.commandName} failed:`, error);
    const message = error instanceof Error ? error.message : "Something went wrong. Please try again or contact a WLC administrator.";
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

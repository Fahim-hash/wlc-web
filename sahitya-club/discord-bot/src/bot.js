import "dotenv/config";
import {
  Client,
  Events,
  GatewayIntentBits,
  ActivityType,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  ModalBuilder, TextInputBuilder, TextInputStyle,
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
const generalMemberRoleId = process.env.DISCORD_GENERAL_MEMBER_ROLE_ID?.trim();
const panelMemberRoleId = process.env.DISCORD_PANEL_MEMBER_ROLE_ID?.trim();
const generalInviteCode = process.env.DISCORD_GENERAL_INVITE_CODE?.trim();
const panelInviteCode = process.env.DISCORD_PANEL_INVITE_CODE?.trim();
const inviteUseCache = new Map();
const presenceIntervalMs = 45_000;
// Ten curated presence lines. The event entry is refreshed from the WLC website.
const presenceNotes = [
  { type: ActivityType.Listening, name: "Chaina Meye • Hridoy Khan" },
  { type: ActivityType.Playing, name: "Organising WLC's latest event", dynamicEvent: true },
  { type: ActivityType.Playing, name: "loving sahitto" },
  { type: ActivityType.Playing, name: "boka chele siam" },
  { type: ActivityType.Playing, name: "Willes Literary Club" },
  { type: ActivityType.Watching, name: "words turn into stories" },
  { type: ActivityType.Playing, name: "with creativity & imagination" },
  { type: ActivityType.Listening, name: "the silence between words" },
  { type: ActivityType.Watching, name: "WLC memories unfold" },
  { type: ActivityType.Playing, name: "living in a literary world" },
];
let presenceIndex = 0;
let latestEventTitle = null;
let presenceTimer = null;

async function refreshLatestEventActivity() {
  try {
    const response = await fetch(`${apiBase}/api/discord/presence-event`, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`Event endpoint returned ${response.status}`);
    const data = await response.json();
    latestEventTitle = data?.event?.title
      ? String(data.event.title).trim().slice(0, 100)
      : null;
  } catch (error) {
    console.warn("Could not refresh WLC latest-event presence:", error?.message || error);
  }
}

function rotateWlcPresence() {
  const note = presenceNotes[presenceIndex % presenceNotes.length];
  const activityName = note.dynamicEvent && latestEventTitle
    ? `Organising: ${latestEventTitle}`.slice(0, 100)
    : note.name;
  client.user?.setPresence({
    status: "online",
    activities: [{ name: activityName, type: note.type }],
  });
  presenceIndex = (presenceIndex + 1) % presenceNotes.length;
}

async function startWlcPresence() {
  await refreshLatestEventActivity();
  rotateWlcPresence();
  if (presenceTimer) clearInterval(presenceTimer);
  presenceTimer = setInterval(() => {
    rotateWlcPresence();
    if (presenceIndex === 0) void refreshLatestEventActivity();
  }, presenceIntervalMs);
}

let joinProcessing = Promise.resolve();
const welcomeAllowedRoleIds = (process.env.DISCORD_WELCOME_ALLOWED_ROLE_IDS || "")
  .split(",").map(id => id.trim()).filter(Boolean);

const musicGuildId = process.env.MUSIC_GUILD_ID?.trim() || guildId;
const musicVoiceChannelId = process.env.MUSIC_VOICE_CHANNEL_ID?.trim();
const musicTextChannelId = process.env.MUSIC_TEXT_CHANNEL_ID?.trim() || welcomeChannelId;
const musicRadioQueries = (process.env.MUSIC_RADIO_QUERIES ||
  "lofi study beats;chill instrumental music;acoustic cafe music;ambient piano music;soft instrumental music")
  .split(";").map(query => query.trim()).filter(Boolean);
const defaultMusicVolume = Math.min(100, Math.max(1, Number(process.env.MUSIC_DEFAULT_VOLUME) || 35));
let radioEnabled = false; // Automatic radio intentionally disabled.
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
    .setName("post")
    .setDescription("Send a normal text message to a channel")
    .addStringOption(option => option.setName("message").setDescription("Message to send (up to 2000 characters)").setRequired(true).setMaxLength(2000))
    .addChannelOption(option => option.setName("channel").setDescription("Destination channel (defaults to this channel)").addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
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
  new SlashCommandBuilder().setName("setupjoinlinks")
    .setDescription("Create permanent General Member and Panel Member invite links")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),


  new SlashCommandBuilder().setName("userinfo").setDescription("View a member's Discord profile")
    .addUserOption(o => o.setName("member").setDescription("Member to inspect")),
  new SlashCommandBuilder().setName("serverinfo").setDescription("View WLC Discord server information"),
  new SlashCommandBuilder().setName("avatar").setDescription("Show a member's avatar")
    .addUserOption(o => o.setName("member").setDescription("Member whose avatar to show")),
  new SlashCommandBuilder().setName("clear").setDescription("Delete recent messages from this channel")
    .addIntegerOption(o => o.setName("amount").setDescription("Number of messages (1–100)").setRequired(true).setMinValue(1).setMaxValue(100))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder().setName("lock").setDescription("Lock this text channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  new SlashCommandBuilder().setName("unlock").setDescription("Unlock this text channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  new SlashCommandBuilder().setName("slowmode").setDescription("Set this channel's slowmode")
    .addIntegerOption(o => o.setName("seconds").setDescription("0 to 21600 seconds").setRequired(true).setMinValue(0).setMaxValue(21600))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  new SlashCommandBuilder().setName("timeout").setDescription("Temporarily timeout a member")
    .addUserOption(o => o.setName("member").setDescription("Member to timeout").setRequired(true))
    .addIntegerOption(o => o.setName("minutes").setDescription("Timeout duration (1–40320 minutes)").setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption(o => o.setName("reason").setDescription("Reason for timeout").setMaxLength(500))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder().setName("untimeout").setDescription("Remove a member's timeout")
    .addUserOption(o => o.setName("member").setDescription("Member to untimeout").setRequired(true))
    .addStringOption(o => o.setName("reason").setDescription("Reason").setMaxLength(500))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder().setName("kick").setDescription("Kick a member from the server")
    .addUserOption(o => o.setName("member").setDescription("Member to kick").setRequired(true))
    .addStringOption(o => o.setName("reason").setDescription("Reason").setMaxLength(500))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  new SlashCommandBuilder().setName("ban").setDescription("Ban a member from the server")
    .addUserOption(o => o.setName("member").setDescription("Member to ban").setRequired(true))
    .addStringOption(o => o.setName("reason").setDescription("Reason").setMaxLength(500))
    .addIntegerOption(o => o.setName("delete_days").setDescription("Delete up to 7 days of messages").setMinValue(0).setMaxValue(7))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

].map(command => command.toJSON());

const rest = new REST({ version: "10" }).setToken(token);
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates],
});

const lavalinkHost = process.env.LAVALINK_HOST?.trim();
const lavalinkPassword = process.env.LAVALINK_PASSWORD?.trim();
const lavalinkPort = Number(process.env.LAVALINK_PORT || 2333);
const lavalinkSecure = (process.env.LAVALINK_SECURE || "false").toLowerCase() === "true";
const musicConfigured = false; // Music system intentionally disabled; WLC bot remains for community features.

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
      defaultSearchPlatform: "scsearch",
      onDisconnect: { autoReconnect: true, destroyPlayer: false },
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

  client.on("raw", packet => {
    // Discord voice-state updates can arrive while Lavalink is reconnecting.
    // Do not forward them into a disconnected node.
    if (!client.lavalink?.useable) return;
    try {
      client.lavalink.sendRawData(packet);
    } catch (error) {
      console.warn("Skipped Lavalink voice-state packet while node was unavailable:", error?.message || error);
    }
  });
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
  client.lavalink.on("queueEnd", player => {
    if (!radioEnabled || player.guildId !== musicGuildId) return;
    if (radioRetryTimers.has(player.guildId)) return;
    console.warn("WLC Radio queue ended without a replacement track; retrying in 6 seconds.");
    const timer = setTimeout(async () => {
      radioRetryTimers.delete(player.guildId);
      if (!radioEnabled || !client.lavalink?.useable || player.queue.current || player.queue.tracks.length) return;
      try {
        const added = await addRadioTrack(player);
        if (added && !player.playing) await player.play();
      } catch (error) {
        console.error("WLC Radio recovery attempt failed:", error);
      }
    }, 6000);
    radioRetryTimers.set(player.guildId, timer);
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

function musicSearchCandidates(query) {
  const value = query.trim();
  if (!value) throw new Error("Enter a song name or a SoundCloud link.");
  if (value.toLowerCase().startsWith("http://") || value.toLowerCase().startsWith("https://")) {
    const host = new URL(value).hostname.toLowerCase();
    if (host === "soundcloud.com" || host.endsWith(".soundcloud.com")) return [value];
    if (host === "youtube.com" || host.endsWith(".youtube.com") || host === "youtu.be") {
      throw new Error("এই বট এখন শুধু SoundCloud চালায়। গানটির নাম দিয়ে সার্চ করুন অথবা SoundCloud link দিন।");
    }
    throw new Error("Use a SoundCloud track/playlist link, or search by song name.");
  }
  const simplified = value.split(" | ")[0].split(" (")[0].trim();
  const candidates = ["scsearch:" + value];
  if (simplified && simplified.toLowerCase() !== value.toLowerCase()) candidates.push("scsearch:" + simplified);
  return [...new Set(candidates)];
}

async function searchMusic(player, query, requester = client.user) {
  const failures = [];
  for (const searchQuery of musicSearchCandidates(query)) {
    try {
      const result = await player.search({ query: searchQuery }, requester);
      if (result?.tracks?.length) return { result, track: result.tracks[0], searchQuery };
      console.info("No SoundCloud match from " + searchQuery);
    } catch (error) {
      failures.push(searchQuery + ": " + (error?.message || error));
      console.warn("SoundCloud search failed for " + searchQuery + ":", error?.message || error);
    }
  }
  if (failures.length) console.warn("SoundCloud search attempts failed:", failures.join(" | "));
  return null;
}
const radioFetchInProgress = new Set();
const radioRetryTimers = new Map();

async function addRadioTrack(player) {
  if (!client.lavalink?.useable || !musicRadioQueries.length || radioFetchInProgress.has(player.guildId)) return false;

  radioFetchInProgress.add(player.guildId);
  try {
    // Radio uses SoundCloud only; each station query tries a relevance-ranked match.
    for (let attempt = 0; attempt < musicRadioQueries.length; attempt += 1) {
      if (!client.lavalink?.useable) return false;
      if (player.queue.tracks.length > 0) return false;

      const query = musicRadioQueries[radioQueryIndex % musicRadioQueries.length];
      radioQueryIndex = (radioQueryIndex + 1) % musicRadioQueries.length;

      const found = await searchMusic(player, query, client.user);
      if (!found?.track) {
        console.warn(`WLC Radio found no result for "${query}" on SoundCloud; trying the next station query.`);
        continue;
      }

      if (!radioEnabled || player.guildId !== musicGuildId) return false;
      if (player.queue.tracks.length > 0) {
        console.log("WLC Radio skipped its result because another track was queued while search was running.");
        return false;
      }

      await player.queue.add(found.track);
      console.log(`WLC Radio queued via ${found.searchQuery}: ${found.track.info?.title || query}`);
      return true;
    }

    console.error("WLC Radio could not find a track after trying every configured query and source.");
    return false;
  } catch (error) {
    console.error("WLC Radio search failed:", error);
    return false;
  } finally {
    radioFetchInProgress.delete(player.guildId);
  }
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
    })
    .finally(() => {
      // Allow a later Lavalink reconnect to initialize the radio again.
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

async function cacheGuildInvites(guild) {
  const invites = await guild.invites.fetch();
  inviteUseCache.set(guild.id, new Map(invites.map(invite => [invite.code, invite.uses || 0])));
}

async function identifyJoinInvite(member) {
  const before = inviteUseCache.get(member.guild.id) || new Map();
  const invites = await member.guild.invites.fetch();
  const increased = [...invites.values()].filter(invite => (invite.uses || 0) > (before.get(invite.code) || 0));
  inviteUseCache.set(member.guild.id, new Map(invites.map(invite => [invite.code, invite.uses || 0])));
  if (increased.length !== 1) {
    console.warn(`Invite attribution ambiguous for ${member.user.tag}; changed invites: ${increased.length}`);
    return null;
  }
  if (increased[0].code === generalInviteCode) return "general";
  if (increased[0].code === panelInviteCode) return "panel";
  return null;
}

async function handleNewMember(member) {
  try {
    const inviteType = await identifyJoinInvite(member);
    if (inviteType === "panel") {
      const role = panelMemberRoleId && await member.guild.roles.fetch(panelMemberRoleId);
      if (!role) throw new Error("Panel Member role missing or not configured.");
      await member.roles.add(role, "Joined using WLC Panel Member invite");
      await member.send("স্বাগতম WLC Panel! তোমাকে স্বয়ংক্রিয়ভাবে **Panel Member** role দেওয়া হয়েছে।").catch(() => {});
    } else if (inviteType === "general") {
      if (!generalMemberRoleId) throw new Error("General Member role ID is not configured.");
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId(`wlc_verify:${member.guild.id}`).setLabel("Verify WLC Member ID").setStyle(ButtonStyle.Primary)
      );
      await member.send({
        content: "স্বাগতম **Willes Literary Club** Discord community-তে!\nGeneral Member role পেতে নিচের বাটনে ক্লিক করে WLC Member ID verify করো। শুধু ACTIVE membership গ্রহণযোগ্য।",
        components: [row],
      });
    } else {
      console.warn(`Could not identify a trusted WLC invite for ${member.user.tag}; no member role assigned.`);
      await member.send("স্বাগতম WLC Discord server-এ! তোমার invite link শনাক্ত করা যায়নি, তাই member role দেওয়া হয়নি। WLC administrator-এর সঙ্গে যোগাযোগ করো।").catch(() => {});
    }

    if (autoRoleId && autoRoleId !== generalMemberRoleId && autoRoleId !== panelMemberRoleId) {
      const role = await member.guild.roles.fetch(autoRoleId);
      if (role) await member.roles.add(role, "Automatic WLC Discord welcome role");
    }
    if (welcomeChannelId) {
      const channel = await member.guild.channels.fetch(welcomeChannelId);
      if (channel?.isTextBased() && "send" in channel) {
        await channel.send({
          content: `Welcome to **Willes Literary Club**! 🎉\nস্বাগতম, <@${member.id}>! WLC Discord community-তে যোগ দেওয়ার জন্য ধন্যবাদ।`,
          allowedMentions: { users: [member.id] },
        });
      }
    }
  } catch (error) {
    console.error(`New member onboarding failed for ${member.id}:`, error);
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

  // The client library's connected flag can briefly lag behind the persisted
  // voiceChannelId during node reconnects. The channel ID is the reliable
  // indicator that this guild has an assigned voice player.
  if (!player?.voiceChannelId) {
    throw new Error("Nothing is connected to a voice channel right now. Join a voice channel and use /play.");
  }

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
  await startWlcPresence();
  for (const guild of readyClient.guilds.cache.values()) {
    try { await cacheGuildInvites(guild); }
    catch (error) { console.error(`Invite cache initialization failed for ${guild.id}; check Manage Server permission:`, error); }
  }
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

client.on(Events.GuildMemberAdd, member => {
  joinProcessing = joinProcessing.then(() => handleNewMember(member)).catch(error => console.error("Join queue failed:", error));
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isButton() && interaction.customId.startsWith("wlc_verify:")) {
    const guildIdForVerify = interaction.customId.split(":")[1];
    const modal = new ModalBuilder().setCustomId(`wlc_verify_modal:${guildIdForVerify}`).setTitle("WLC Member Verification");
    const field = new TextInputBuilder().setCustomId("member_id").setLabel("WLC Member ID")
      .setPlaceholder("WLC-XXXX-001").setStyle(TextInputStyle.Short).setRequired(true).setMaxLength(64);
    modal.addComponents(new ActionRowBuilder().addComponents(field));
    await interaction.showModal(modal);
    return;
  }
  if (interaction.isModalSubmit() && interaction.customId.startsWith("wlc_verify_modal:")) {
    await interaction.deferReply({ ephemeral: true });
    const guildIdForVerify = interaction.customId.split(":")[1];
    const memberId = interaction.fields.getTextInputValue("member_id").trim().toUpperCase();
    try {
      const response = await fetch(`${apiBase}/api/member-portal/verify?id=${encodeURIComponent(memberId)}`);
      const result = await response.json();
      if (!response.ok || !result.valid) {
        await interaction.editReply(result.message || "এই Member ID verify করা যায়নি। ACTIVE WLC membership প্রয়োজন।");
        return;
      }
      const guild = await client.guilds.fetch(guildIdForVerify);
      const member = await guild.members.fetch(interaction.user.id);
      const role = generalMemberRoleId && await guild.roles.fetch(generalMemberRoleId);
      if (!role) throw new Error("General Member role missing or not configured.");
      await member.roles.add(role, `Verified active WLC Member ID: ${result.memberId}`);
      await interaction.editReply(`✅ Verification successful! **${result.memberId}** যাচাই হয়েছে এবং তোমাকে **General Member** role দেওয়া হয়েছে।`);
    } catch (error) {
      console.error("WLC member verification failed:", error);
      await interaction.editReply("Verification service এখন unavailable। কিছুক্ষণ পর আবার চেষ্টা করো।");
    }
    return;
  }
  if (!interaction.isChatInputCommand()) return;

  try {
    if (interaction.commandName === "setupjoinlinks") {
      const guild = interaction.guild;
      if (!guild) throw new Error("এই command server-এর ভিতরে ব্যবহার করতে হবে।");
      if (!generalMemberRoleId || !panelMemberRoleId) throw new Error("Railway-এ দুইটি member role ID configure করা হয়নি।");
      const channel = (welcomeChannelId && await guild.channels.fetch(welcomeChannelId).catch(() => null))
        || guild.systemChannel || guild.channels.cache.find(c => c.type === ChannelType.GuildText);
      if (!channel || !channel.isTextBased() || !("createInvite" in channel)) throw new Error("Invite তৈরির জন্য text channel পাওয়া যায়নি।");
      const generalInvite = await channel.createInvite({ maxAge: 0, maxUses: 0, unique: true, reason: "Permanent WLC General Member onboarding invite" });
      const panelInvite = await channel.createInvite({ maxAge: 0, maxUses: 0, unique: true, reason: "Permanent WLC Panel Member onboarding invite" });
      await cacheGuildInvites(guild);
      await interaction.reply({ ephemeral: true, content: [
        "**WLC join links created**",
        `General Member: https://discord.gg/${generalInvite.code}`,
        `Panel Member: https://discord.gg/${panelInvite.code}`,
        "",
        "**দুইটি invite code Railway variables-এ বসাতে হবে:**",
        `DISCORD_GENERAL_INVITE_CODE=${generalInvite.code}`,
        `DISCORD_PANEL_INVITE_CODE=${panelInvite.code}`,
        "Link দুটির মেয়াদ নেই এবং ব্যবহারসংখ্যার সীমা নেই। এগুলো delete/regenerate কোরো না।",
      ].join("\n") });
      return;
    }

    if (interaction.commandName === "wlc") {
      await interaction.reply({
        ephemeral: true,
        content: "**Willes Literary Club Bot**\nOfficial WLC community management and panel directory.\nCommunity: `/panels`, `/gen`, `/userinfo`, `/serverinfo`, `/avatar`.\\nModeration: `/clear`, `/lock`, `/unlock`, `/slowmode`, `/timeout`, `/untimeout`, `/kick`, `/ban`.\\nManagement: `/sync`, `/announce`, `/post`.",
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

    if (interaction.commandName === "post") {
      const message = interaction.options.getString("message", true);
      const channel = interaction.options.getChannel("channel") || interaction.channel;
      if (!channel || !channel.isTextBased() || !("send" in channel)) {
        await interaction.reply({ content: "একটি টেক্সট চ্যানেল নির্বাচন করুন।", ephemeral: true });
        return;
      }
      await channel.send({
        content: message,
        allowedMentions: { parse: [] },
      });
      await interaction.reply({ content: `বার্তাটি ${channel} চ্যানেলে সাধারণ টেক্সট হিসেবে পাঠানো হয়েছে।`, ephemeral: true });
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


    if (interaction.commandName === "userinfo") {
      const user = interaction.options.getUser("member") || interaction.user;
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      const roles = member ? member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r.toString()).slice(0, 12) : [];
      await interaction.reply({ embeds: [{
        color: 0x8f263d, title: `Member · ${user.username}`,
        thumbnail: { url: user.displayAvatarURL({ size: 256 }) },
        fields: [
          { name: "User", value: `${user}\\n` + `\`${user.tag}\``, inline: true },
          { name: "Account created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
          ...(member ? [{ name: "Joined server", value: member.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "Unknown", inline: true },
            { name: `Roles (${member.roles.cache.size - 1})`, value: roles.join(" ") || "No roles" }] : [])
        ],
        footer: { text: `User ID: ${user.id}` }
      }] });
      return;
    }

    if (interaction.commandName === "serverinfo") {
      const guild = interaction.guild;
      await guild.fetch();
      const owner = await guild.fetchOwner();
      await interaction.reply({ embeds: [{
        color: 0x8f263d, title: guild.name, thumbnail: { url: guild.iconURL({ size: 256 }) || undefined },
        fields: [
          { name: "Owner", value: `${owner.user.tag}`, inline: true },
          { name: "Members", value: `${guild.memberCount}`, inline: true },
          { name: "Channels", value: `${guild.channels.cache.size}`, inline: true },
          { name: "Roles", value: `${guild.roles.cache.size - 1}`, inline: true },
          { name: "Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
          { name: "Verification", value: `${guild.verificationLevel}`, inline: true }
        ],
        footer: { text: `Server ID: ${guild.id}` }
      }] });
      return;
    }

    if (interaction.commandName === "avatar") {
      const user = interaction.options.getUser("member") || interaction.user;
      const url = user.displayAvatarURL({ size: 1024, extension: "png" });
      await interaction.reply({ embeds: [{ color: 0x8f263d, title: `${user.username}'s avatar`, image: { url }, url }] });
      return;
    }

    if (interaction.commandName === "clear") {
      const amount = interaction.options.getInteger("amount", true);
      if (!interaction.channel?.bulkDelete) throw new Error("এই চ্যানেলে মেসেজ মুছে ফেলা যাবে না।");
      const deleted = await interaction.channel.bulkDelete(amount, true);
      await interaction.reply({ content: `🧹 ${deleted.size}টি সাম্প্রতিক মেসেজ মুছে ফেলা হয়েছে। (১৪ দিনের বেশি পুরোনো মেসেজ Discord bulk delete করতে দেয় না।)`, ephemeral: true });
      return;
    }

    if (interaction.commandName === "lock" || interaction.commandName === "unlock") {
      const locked = interaction.commandName === "lock";
      if (!interaction.channel?.permissionOverwrites) throw new Error("এই চ্যানেলের permission পরিবর্তন করা যাচ্ছে না।");
      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: locked ? false : null,
        SendMessagesInThreads: locked ? false : null,
        CreatePublicThreads: locked ? false : null,
        CreatePrivateThreads: locked ? false : null
      }, { reason: `${locked ? "Locked" : "Unlocked"} by ${interaction.user.tag}` });
      await interaction.reply({ content: locked ? "🔒 এই চ্যানেলটি lock করা হয়েছে।" : "🔓 এই চ্যানেলটি unlock করা হয়েছে।" });
      return;
    }

    if (interaction.commandName === "slowmode") {
      const seconds = interaction.options.getInteger("seconds", true);
      if (!interaction.channel?.setRateLimitPerUser) throw new Error("এই চ্যানেলে slowmode support নেই।");
      await interaction.channel.setRateLimitPerUser(seconds, `Changed by ${interaction.user.tag}`);
      await interaction.reply({ content: seconds ? `🐢 Slowmode ${seconds} সেকেন্ড করা হয়েছে।` : "⚡ Slowmode বন্ধ করা হয়েছে।" });
      return;
    }

    if (["timeout", "untimeout", "kick", "ban"].includes(interaction.commandName)) {
      const target = interaction.options.getUser("member", true);
      if (target.id === interaction.user.id) throw new Error("নিজের ওপর এই moderation action নেওয়া যাবে না।");
      if (target.id === client.user.id) throw new Error("বটের ওপর এই action নেওয়া যাবে না।");
      const member = await interaction.guild.members.fetch(target.id);
      const reason = interaction.options.getString("reason") || `Action by ${interaction.user.tag}`;
      if (member.id === interaction.guild.ownerId) throw new Error("Server owner-এর ওপর এই action নেওয়া যাবে না।");
      if (!member.moderatable && ["timeout", "untimeout"].includes(interaction.commandName)) throw new Error("এই member-কে moderate করার permission/role hierarchy নেই।");
      if (!member.kickable && interaction.commandName === "kick") throw new Error("এই member-কে kick করা যাচ্ছে না; bot role hierarchy পরীক্ষা করুন।");
      if (!member.bannable && interaction.commandName === "ban") throw new Error("এই member-কে ban করা যাচ্ছে না; bot role hierarchy পরীক্ষা করুন।");

      if (interaction.commandName === "timeout") {
        const minutes = interaction.options.getInteger("minutes", true);
        await member.timeout(minutes * 60 * 1000, reason);
        await interaction.reply({ content: `⏳ ${target.tag}-কে ${minutes} মিনিটের জন্য timeout করা হয়েছে।\nকারণ: ${reason}` });
      } else if (interaction.commandName === "untimeout") {
        await member.timeout(null, reason);
        await interaction.reply({ content: `✅ ${target.tag}-এর timeout তুলে নেওয়া হয়েছে।` });
      } else if (interaction.commandName === "kick") {
        await member.kick(reason);
        await interaction.reply({ content: `👢 ${target.tag}-কে server থেকে kick করা হয়েছে।\nকারণ: ${reason}` });
      } else {
        const days = interaction.options.getInteger("delete_days") || 0;
        await interaction.guild.members.ban(target.id, { reason, deleteMessageSeconds: days * 86400 });
        await interaction.reply({ content: `🔨 ${target.tag}-কে ban করা হয়েছে।\nকারণ: ${reason}` });
      }
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
      const query = interaction.options.getString("query", true).trim();
      const found = await searchMusic(player, query, interaction.user);
      if (!found?.track) {
        await interaction.editReply("SoundCloud-এ কোনো playable match পাওয়া যায়নি। কাছাকাছি title বা artist দিয়ে আবার চেষ্টা করুন।");
        return;
      }
      // Keep search results focused: one best match is queued for text searches.
      const first = found.track;
      await player.queue.add(first);
      if (!player.playing) await player.play();
      await interaction.editReply(`🎶 Added **[${first.info.title}](${first.info.uri || "https://soundcloud.com"})** to the queue.\nSource: SoundCloud · Best related match`);
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
            current ? `**Now playing:** [${current.info.title}](${current.info.uri || "https://soundcloud.com"})` : "Nothing is playing right now.",
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
          description: `[${track.info.title}](${track.info.uri || "https://soundcloud.com"})\n**Artist:** ${track.info.author || "Unknown"}\n**Duration:** ${durationLabel(track.info.duration)}`,
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

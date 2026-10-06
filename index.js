const {
    Client,
    GatewayIntentBits,
    ChannelType
} = require("discord.js");

const {
    joinVoiceChannel,
    entersState,
    VoiceConnectionStatus
} = require("@discordjs/voice");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const VOICE_CHANNEL_ID = process.env.VOICE_CHANNEL_ID;

let connection;

async function connectToVoice() {
    try {
        const guild = await client.guilds.fetch(GUILD_ID);

        const channel = await guild.channels.fetch(VOICE_CHANNEL_ID);

        if (!channel || channel.type !== ChannelType.GuildVoice) {
            console.log("Ses kanalı bulunamadı veya kanal bir ses kanalı değil.");
            return;
        }

        connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: true
        });

        await entersState(
            connection,
            VoiceConnectionStatus.Ready,
            30_000
        );

        console.log(`✅ ${channel.name} kanalına bağlandım.`);
    } catch (error) {
        console.error("Ses kanalına bağlanırken hata:", error);

        setTimeout(connectToVoice, 10_000);
    }
}

client.once("ready", async () => {
    console.log(`🤖 ${client.user.tag} olarak giriş yaptım.`);
    console.log("Bot çalışıyor.");

    await connectToVoice();
});

client.on("error", console.error);
console.log("TOKEN VAR MI:", !!process.env.DISCORD_TOKEN);
console.log("TOKEN UZUNLUGU:", process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.length : 0);

client.login(TOKEN);

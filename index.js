const {
    Client,
    GatewayIntentBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events,
    MessageFlags
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const TOKEN = process.env.TOKEN;
const ROLE_ID = process.env.ROLE_ID;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.once(Events.ClientReady, async () => {

    console.clear();

    console.log("======================================");
    console.log(`🤖 Login sebagai ${client.user.tag}`);
    console.log("🏙️ NewEra Roleplay Bot Online");
    console.log("======================================");

    try {

        const channel = await client.channels.fetch(CHANNEL_ID);

        if (!channel) {
            return console.log("❌ CHANNEL_ID tidak ditemukan.");
        }

        // Cek apakah panel sudah ada
        const messages = await channel.messages.fetch({ limit: 10 });

        const alreadyExists = messages.find(msg =>
            msg.author.id === client.user.id &&
            msg.components.length > 0
        );

        if (alreadyExists) {
            console.log("✅ Panel verify sudah ada.");
            return;
        }

        const embed = new EmbedBuilder()
            .setColor("#2B2D31")
            .setDescription(
                "Silahkan ambil role dengan klik <:ne:1533526607636205700> di bawah ini. Happy Roleplay"
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("verify")
                .setLabel("Ambil Role")
                .setEmoji("1533526607636205700")
                .setStyle(ButtonStyle.Secondary)
        );

        await channel.send({
            embeds: [embed],
            components: [row]
        });

        console.log("✅ Panel verify berhasil dikirim.");

    } catch (err) {

        console.error(err);

    }

});

client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isButton()) return;

    if (interaction.customId !== "verify") return;

    const role = interaction.guild.roles.cache.get(ROLE_ID);

    if (!role) {

        return interaction.reply({
            content: "❌ Role tidak ditemukan.",
            flags: MessageFlags.Ephemeral
        });

    }

    if (interaction.member.roles.cache.has(ROLE_ID)) {

        return interaction.reply({
            content: "✅ Kamu sudah memiliki role ini.",
            flags: MessageFlags.Ephemeral
        });

    }

    try {

        await interaction.member.roles.add(role);

        await interaction.reply({
            content: "🎉 Role berhasil diberikan. Selamat datang!",
            flags: MessageFlags.Ephemeral
        });

        console.log(`${interaction.user.tag} mengambil role.`);

    } catch (err) {

        console.error(err);

        await interaction.reply({
            content: "❌ Gagal memberikan role.",
            flags: MessageFlags.Ephemeral
        });

    }

});

client.login(TOKEN);

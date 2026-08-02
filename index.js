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
const MESSAGE_ID = process.env.MESSAGE_ID;

client.once(Events.ClientReady, async () => {

    console.clear();

    console.log("========================================");
    console.log(`🤖 Login : ${client.user.tag}`);
    console.log("🏙️ NewEra Roleplay Verification");
    console.log("========================================");

    try {

        const channel = await client.channels.fetch(CHANNEL_ID);

        if (!channel) {
            console.log("❌ CHANNEL_ID tidak ditemukan.");
            return;
        }

        const embed = new EmbedBuilder()
            .setColor("#2B2D31")
            .setDescription(
                "<:ne:1533526607636205700> Silahkan ambil role dengan menekan tombol di bawah.\n\nSelamat datang di **NewEra Roleplay**.\nHappy Roleplay 🙂"
            )
            .setFooter({
                text: "NewEra Roleplay"
            })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("verify")
                .setLabel("Ambil Role")
                .setEmoji({
                    id: "1533526607636205700",
                    name: "ne"
                })
                .setStyle(ButtonStyle.Secondary)
        );

        // Jika MESSAGE_ID sudah diisi, edit panel lama
        if (MESSAGE_ID) {

            try {

                const message = await channel.messages.fetch(MESSAGE_ID);

                await message.edit({
                    embeds: [embed],
                    components: [row]
                });

                console.log("✅ Panel berhasil diperbarui.");
                return;

            } catch (err) {

                console.log("⚠️ MESSAGE_ID tidak valid, membuat panel baru.");

            }

        }

        // Kirim panel baru
        const sent = await channel.send({
            embeds: [embed],
            components: [row]
        });

    console.log("========================================");
    console.log("✅ Panel Verify berhasil dibuat.");
    console.log(`📩 MESSAGE_ID : ${sent.id}`);
    console.log("========================================");
    
    } catch (err) {
    
        console.error("❌ Terjadi kesalahan saat membuat panel:");
        console.error(err);
    
    }

});

client.on(Events.InteractionCreate, async (interaction) => {

    if (!interaction.isButton()) return;

    if (interaction.customId !== "verify") return;

    const role = interaction.guild.roles.cache.get(ROLE_ID);

    if (!role) {

        return interaction.reply({
            content: "❌ Role tidak ditemukan. Hubungi Administrator.",
            flags: MessageFlags.Ephemeral
        });

    }

    if (interaction.member.roles.cache.has(ROLE_ID)) {

        return interaction.reply({
            content: "⚠️ Kamu sudah memiliki role tersebut.",
            flags: MessageFlags.Ephemeral
        });

    }

    try {

        await interaction.member.roles.add(role);

        console.log(
            `✅ ${interaction.user.tag} berhasil mengambil role ${role.name}`
        );

        await interaction.reply({
            content: "🎉 Selamat! Role berhasil diberikan.",
            flags: MessageFlags.Ephemeral
        });

    } catch (err) {

        console.error("❌ Gagal memberikan role:");
        console.error(err);

        await interaction.reply({
            content: "❌ Gagal memberikan role. Pastikan role bot berada di atas role Member.",
            flags: MessageFlags.Ephemeral
        });

    }

});
// ==============================
// Cek Environment Variables
// ==============================

if (!TOKEN) {
    console.error("❌ TOKEN belum diisi di Railway.");
    process.exit(1);
}

if (!CHANNEL_ID) {
    console.error("❌ CHANNEL_ID belum diisi di Railway.");
    process.exit(1);
}

if (!ROLE_ID) {
    console.error("❌ ROLE_ID belum diisi di Railway.");
    process.exit(1);
}

// ==============================
// Login Bot
// ==============================

client.login(TOKEN);

const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Events
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const ROLE_ID = process.env.ROLE_ID;

// =========================
// Register Slash Command
// =========================

const commands = [
    new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Kirim panel verify")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .toJSON()
];

const rest = new REST({ version: "10" }).setToken(TOKEN);

client.once(Events.ClientReady, async () => {

    console.log(`✅ ${client.user.tag} Online`);

    try {

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            {
                body: commands
            }
        );

        console.log("✅ Slash Command berhasil diregister.");

    } catch (err) {

        console.error(err);

    }

});

// =========================
// Interaction
// =========================

client.on(Events.InteractionCreate, async interaction => {

    // Slash Command
    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === "setup") {

            const embed = new EmbedBuilder()
                .setColor("#2B2D31")
                .setDescription(
                    "Silahkan ambil role dengan react <:verify:1533526607636205700> di bawah ini. Happy Roleplay 🙂"
                );

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("verify")
                    .setLabel("Ambil Role")
                    .setEmoji("✅") // Bisa diganti ID emoji custom
                    .setStyle(ButtonStyle.Secondary)
            );

            await interaction.reply({
                embeds: [embed],
                components: [row]
            });

        }

    }

    // Button
    if (interaction.isButton()) {

        if (interaction.customId !== "verify") return;

        const role = interaction.guild.roles.cache.get(ROLE_ID);

        if (!role) {

            return interaction.reply({
                content: "❌ Role tidak ditemukan.",
                ephemeral: true
            });

        }

        if (interaction.member.roles.cache.has(ROLE_ID)) {

            return interaction.reply({
                content: "✅ Kamu sudah memiliki role ini.",
                ephemeral: true
            });

        }

        try {

            await interaction.member.roles.add(role);

            await interaction.reply({
                content: "🎉 Berhasil! Role telah diberikan.",
                ephemeral: true
            });

        } catch (err) {

            console.error(err);

            await interaction.reply({
                content: "❌ Gagal memberikan role.",
                ephemeral: true
            });

        }

    }

});

client.login(TOKEN);

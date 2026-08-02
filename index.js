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

const command = new SlashCommandBuilder()
    .setName("setup-whitelist")
    .setDescription("Membuat panel whitelist.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

client.once(Events.ClientReady, async (c) => {
    console.clear();
    console.log("======================================");
    console.log(`🤖 Login sebagai ${c.user.tag}`);
    console.log("🏙️ NewEra Roleplay Bot Online");
    console.log("======================================");

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            {
                body: [command.toJSON()]
            }
        );

        console.log("✅ Slash Command berhasil didaftarkan.");
    } catch (err) {
        console.error(err);
    }
});

client.on(Events.InteractionCreate, async interaction => {

    // Slash Command
    if (interaction.isChatInputCommand()) {

        if (interaction.commandName !== "setup-whitelist") return;

        const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("🛡️ NewEra Roleplay")
            .setDescription(
`<:${process.env.EMOJI_NAME}:${process.env.EMOJI_ID}> **Selamat datang di NewEra Roleplay!**

Silakan tekan tombol di bawah untuk mengambil **Role Whitelist**.

Selamat bermain dan semoga pengalaman Roleplay-mu menyenangkan! 🌆`
            )
            .setFooter({
                text: "NewEra Roleplay"
            })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("whitelist")
                .setLabel("Ambil Role Whitelist")
                .setEmoji({
                    id: process.env.EMOJI_ID,
                    name: process.env.EMOJI_NAME
                })
                .setStyle(ButtonStyle.Success)
        );

        await interaction.channel.send({
            embeds: [embed],
            components: [row]
        });

        return interaction.reply({
            content: "✅ Panel whitelist berhasil dibuat.",
            ephemeral: true
        });
    }

    // Button
    if (!interaction.isButton()) return;

    if (interaction.customId !== "whitelist") return;

    const role = interaction.guild.roles.cache.get(process.env.ROLE_ID);

    if (!role) {
        return interaction.reply({
            content: "❌ ROLE_ID tidak ditemukan.",
            ephemeral: true
        });
    }

    try {

        if (interaction.member.roles.cache.has(role.id)) {

            await interaction.member.roles.remove(role);

            return interaction.reply({
                content: "❌ Role **Whitelist** berhasil dihapus.",
                ephemeral: true
            });

        }

        await interaction.member.roles.add(role);

        return interaction.reply({
            content: "✅ Selamat! Role **Whitelist** berhasil diberikan.",
            ephemeral: true
        });

    } catch (err) {

        console.error(err);

        return interaction.reply({
            content: "❌ Terjadi kesalahan saat mengubah role.",
            ephemeral: true
        });

    }

});

client.login(process.env.TOKEN);

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

    console.log(`✅ ${c.user.tag} Online`);

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

        console.log("✅ Slash Command Loaded");

    } catch (err) {

        console.log(err);

    }

});

client.on(Events.InteractionCreate, async interaction => {

    if (interaction.isChatInputCommand()) {

        if (interaction.commandName === "setup-whitelist") {

            const embed = new EmbedBuilder()

                .setColor("#57F287")

                .setTitle("🛡️ NewEra Roleplay")

                .setDescription(
`👋 **Selamat datang di NewEra Roleplay!**

Silakan tekan tombol **✅** di bawah untuk mengambil **Role Whitelist**.

Selamat bermain dan Happy Roleplay! 🌆`
                )

                .setFooter({
                    text: "NewEra Roleplay"
                });

            const row = new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()

                        .setCustomId("whitelist")

                        .setLabel("Ambil Role Whitelist")

                        .setEmoji("✅")

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

    }

    if (!interaction.isButton()) return;

    if (interaction.customId !== "whitelist") return;

    const role = interaction.guild.roles.cache.get(process.env.ROLE_ID);

    if (!role) {

        return interaction.reply({

            content: "❌ ROLE_ID tidak ditemukan.",

            ephemeral: true

        });

    }

    if (interaction.member.roles.cache.has(role.id)) {

        await interaction.member.roles.remove(role);

        return interaction.reply({

            content: "❌ Role Whitelist berhasil dihapus.",

            ephemeral: true

        });

    }

    await interaction.member.roles.add(role);

    interaction.reply({

        content: "✅ Role Whitelist berhasil diberikan. Selamat datang di NewEra Roleplay!",

        ephemeral: true

    });

});

client.login(process.env.TOKEN);

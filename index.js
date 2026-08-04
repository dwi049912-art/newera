require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    REST,
    Routes,
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});

// Register Slash Command
(async () => {
    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    try {
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            {
                body: [
                    new SlashCommandBuilder()
                        .setName("setup")
                        .setDescription("Buat panel reaction role")
                        .setDefaultMemberPermissions(
                            PermissionFlagsBits.Administrator
                        )
                        .toJSON()
                ]
            }
        );

        console.log("Slash command registered.");
    } catch (err) {
        console.error(err);
    }
})();

client.once("ready", () => {
    console.log(`${client.user.tag} Online`);
});

client.on("interactionCreate", async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "setup") {

        const channel = await client.channels.fetch(process.env.CHANNEL_ID);

        const msg = await channel.send({
            content:
`Silahkan ambil role dibawah ini untuk bisa mengakses discord.`
        });

        const emoji = process.env.EMOJI;

        if (emoji.startsWith("<:") || emoji.startsWith("<a:")) {
            const emojiId = emoji.split(":")[2].replace(">", "");
            await msg.react(emojiId);
        } else {
            await msg.react(emoji);
        }

        await interaction.reply({
            content: "Reaction Role berhasil dibuat.",
            ephemeral: true
        });
    }
});

// ADD ROLE
client.on("messageReactionAdd", async (reaction, user) => {

    if (user.bot) return;

    if (reaction.partial) await reaction.fetch();

    const member = await reaction.message.guild.members.fetch(user.id);

    await member.roles.add(process.env.ROLE_ID);

});

// REMOVE ROLE
client.on("messageReactionRemove", async (reaction, user) => {

    if (user.bot) return;

    if (reaction.partial) await reaction.fetch();

    const member = await reaction.message.guild.members.fetch(user.id);

    await member.roles.remove(process.env.ROLE_ID);

});

client.login(process.env.TOKEN);

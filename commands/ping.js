const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')

module.exports = {
  // command options
  description: "Get T.B.T.D.A's ping",
  catagory: 'Utility Commands',
  aliases: ['latency'],
  guildOnly: false,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    let msgorint
    if(message) msgorint = message
    if(interaction) msgorint = interaction

    const ping = new EmbedBuilder()
    .setTitle("T.B.T.D.A's Ping:")
    .addFields(
        {name: "Ping (from input to reply in channel):", value: `${Date.now() - msgorint.createdTimestamp}ms.`},
        {name: "API Ping (Discord's API ping):", value: `${Math.round(client.ws.ping)}ms.`}
    )
    .setTimestamp()
    .setColor('#0059FF');

    if(message) message.channel.send({ embeds: [ping] })
    if(interaction) interaction.reply({ embeds: [ping] })
  },
}
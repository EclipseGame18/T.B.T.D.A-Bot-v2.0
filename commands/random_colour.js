const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')

module.exports = {
  // command options
  description: "Generates a random colour",
  catagory: 'Fun Commands',
  aliases: ['rand_colour'],
  guildOnly: false,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    let EmbedColour
    const randomColourHEX = Math.floor(Math.random()*16777215).toString(16);
    EmbedColour = randomColourHEX
    const randomColourRGB = parseInt(randomColourHEX, 16);

    const r = (randomColourRGB >> 16) & 255;
    const g = (randomColourRGB >> 8) & 255;
    const b = randomColourRGB & 255;

    const colour = new EmbedBuilder()
    .setTitle("Here is your colour!")
    .setDescription(`HEX: #${randomColourHEX}\nRGB: ${r}, ${g}, ${b}`)
    .setColor(`#${EmbedColour}`)
    .setFooter({ text: `You can see a preview on the embed colour strip` })

    if(interaction) interaction.reply({ embeds: [colour] })
    if(message) message.channel.send({ embeds: [colour] })
  },
}
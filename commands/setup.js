const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')

module.exports = {
  // command options
  description: "Setup the bot in your server.",
  catagory: 'Utility Commands',
  guildOnly: true,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    const SetUp = new EmbedBuilder()
			.setTitle('SetUp Manual')
			.setDescription('Click on the link to go to our website and see the setup manual. [Click to see setup manual](https://tbtda-the-discord-bot.webnode.com/setup/) ')
			.setTimestamp()
			.setColor('#00B9FF');

    if(message){
        message.channel.send({ embeds: [SetUp] });
    }
    if(interaction){
        interaction.reply({ embeds: [SetUp] })
    }
  },
}
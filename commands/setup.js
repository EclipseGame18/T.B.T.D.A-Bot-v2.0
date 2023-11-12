const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')

module.exports = {
  // command options
  description: "View T.B.T.D.A's setup manual",
  catagory: 'Utility Commands',
  guildOnly: true,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    const SetUp = new EmbedBuilder()
			.setTitle('Setup Manual')
			.setDescription('Click on the link to go to our documentation website and view the setup manual. [Click to see setup manual](https://docs.tbtda.xyz/general-info/setup-information) ')
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
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
    const lockDown = true
    const lockDownEmbed = new EmbedBuilder()
    .setTitle('T.B.T.D.A Beta Test is retiring')
    .setDescription(`As you probabely know, T.B.T.D.A Beta Test is retiring. We are now around 1-2 days away form switching back to the original T.B.T.D.A. This means that untill the switch occurs, I (T.B.T.D.A Beta Test) will be unavailable.\n\nIf you still havn't added T.B.T.D.A yet, you can do so with [this link](https://discord.com/api/oauth2/authorize?client_id=712958160620748820&permissions=8&scope=bot).`)
    .setColor('#0059FF');

    if(lockDown === true){
      if(message){
        message.channel.send({ embeds: [lockDownEmbed] })
      }
      if(interaction){
        interaction.reply({ embeds: [lockDownEmbed] })
      }
      return
    }
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
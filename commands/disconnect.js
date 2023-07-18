const { CommandType } = require("wokcommands");
const { PermissionsBitField, ChannelType, EmbedBuilder } = require('discord.js')
const {
	AudioPlayerStatus,
	AudioResource,
	entersState,
	joinVoiceChannel,
	VoiceConnectionStatus,
	VoiceConnection,
	VoiceConnectionDisconnectReason,
    getVoiceConnection,
} = require('@discordjs/voice');

module.exports = {
  // command options
  description: "Disconnects the bot form a voice channel",
  catagory: 'Utility Commands',
  aliases: ['leave'],
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
        // Get the connection object for the current guild
        const connection = getVoiceConnection(guild.id);
        if (connection) {
          // Disconnect from the voice channel
          connection.destroy();
          //console.log(`Disconnected from ${connection.joinConfig.channel.name} voice channel!`);
           return(`I have left the voice channel! :wave:`);
        } else {
           return(':x: Unable to comply, I am not currently connected to a voice channel.');
        }
      }
    
  }
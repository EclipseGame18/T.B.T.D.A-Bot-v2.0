const { CommandType } = require("wokcommands");
const { PermissionsBitField, ChannelType } = require('discord.js')
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
const { CommandType } = require("wokcommands");
const { PermissionsBitFieldm, ChannelType } = require('discord.js')
const {
	AudioPlayerStatus,
	AudioResource,
	entersState,
	joinVoiceChannel,
	VoiceConnectionStatus,
	VoiceConnection,
	VoiceConnectionDisconnectReason,
} = require('@discordjs/voice');

module.exports = {
  // command options
  description: "Joins your current voice channel",
  catagory: 'Utility Commands',
  aliases: ['connect'],
  guildOnly: true,
  
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    
    if (!member.voice.channel) {
        return ":x: Unable to comply, you need to be in a voice channel to use this command.";
      }
      
      const connection = await joinVoiceChannel({
        channelId: member.voice.channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      
      return `I have joined your voice channel! :wave:`;
      
         
  },
}
const { CommandType } = require("wokcommands");
const { PermissionsBitFieldm, ChannelType, EmbedBuilder } = require('discord.js')
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
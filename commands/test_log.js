const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const GuildWelcomeChannel = require('../Guild4')
const GuildWelcome = require('../Guild3')
const LogChannel = require('../Guild7')

module.exports = {
  // command options
  description: "Sends a test message to your specified log and welcome channels",
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
    if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return ':x: Unable to comply, you do not have \`Manage_Guild\` permision.'
    const welcomemessagechannel = await GuildWelcomeChannel.findOne({_id: guild.id}).catch(error =>{
		console.log(`There was a error: ${error}`)
	})
  const logChannel = await LogChannel.findOne({_id: guild.id}).catch(error =>{
		console.log(`There was a error: ${error}`)
	})
    const guildwelcome = await GuildWelcome.findOne({_id: guild.id}).catch(error =>{
		console.log(`There was a error`)
	})

    let welcomeToggle;
    try{
    if(guildwelcome.message === ''){
        welcomeToggle = 'off';
    } else{
        welcomeToggle = 'on';
    }
    } catch{
        welcomeToggle = 'Error retreving welcome message status';
    }

    let logtoggle
    try {
      if(logChannel.channel === ''){
        logtoggle = 'off'
      }else{
        logtoggle = 'on'
      }
    } catch {
      logtoggle = 'Error retreving log channel status'
    }
    let welcometogglechannel
    try {
      if(welcomemessagechannel.channel === ''){
        welcometogglechannel = 'off'
      }else{
        welcometogglechannel = 'on'
      }
    } catch {
      welcometogglechannel = 'Error retreving welcome channel status'
    }

    if(!welcomemessagechannel || !logChannel){
      return ':x: Unable to comply, there was an error retreaving either welcome channel or log channel.'
    }
    if(welcomemessagechannel.channel === ''){
      try{
      guild.channels.cache.get(logChannel.channel).send(`This is a log channel test, moderation logs will be sent here.`)
      return `Successfully sent a test message to the log channel. However, no message was sent to the welcome channel, either this is an error, or you have disabled guild welcomes.\nWelcome channel is currentaly: \`${welcometogglechannel}\`\nWelcome plugin is currentaly: \`${welcomeToggle}\``
      }catch{
        return ':x: Unable to comply, neither guild welcome channel, or guild log channel have been set, you can set these settings with their respectave commands: `/guild_log_channel`, `/guild_welcome_channel`.'
      }
    }
    if(logChannel.channel === ''){
      try{
        guild.channels.cache.get(welcomemessagechannel.channel).send(`This is a welcome channel test, guild welcomes will be sent here.\nWelcome message plugin is currentaly: \`${welcomeToggle}\`.`)
        return `Successfully sent a test message to the welcome channel. However, no message was sent to the log channel, either this is an error, or you have disabled guild logging.\nLog channel is currentaly: \`${logtoggle}\``
      }catch{
        return ':x: Unable to comply, neither guild welcome channel, or guild log channel have been set, you can set these settings with their respectave commands: `/guild_log_channel`, `/guild_welcome_channel`.'
      }
    }else{
      try {
        guild.channels.cache.get(logChannel.channel).send(`This is a log channel test, moderation logs will be sent here.`)
        guild.channels.cache.get(welcomemessagechannel.channel).send(`This is a welcome channel test, guild welcomes will be sent here.\nWelcome message plugin is currentaly: \`${welcomeToggle}\`.`)
        return 'Successfully sent a test message to the log and welcome channels.'
      } catch {
        return ':x: Unable to comply, I was unable to send a test log to welcome or log channels, try checking their indivisual channel IDs.'
      }
    }

  },
}
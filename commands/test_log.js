const { CommandType } = require("wokcommands");
const { PermissionsBitField } = require('discord.js')
const GuildWelcomeChannel = require('../Guild4')
const GuildWelcome = require('../Guild3')

module.exports = {
  // command options
  description: "Sends a test message to your specified log and welcome channel",
  catagory: 'Utility Commands',
  guildOnly: true,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    const welcomemessagechannel = await GuildWelcomeChannel.findOne({_id: guild.id}).catch(error =>{
		console.log(`There was a error: ${error}`)
	})
    const guildwelcome = await GuildWelcome.findOne({_id: guild.id}).catch(error =>{
		console.log(`There was a error`)
	})
    if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return ':x: Unable to comply, you do not have \`Manage_Guild\` permision.'
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
    if(!welcomemessagechannel) return ':x: Unable to comply, there is no log channel currentaly set.'
    if(welcomemessagechannel.channel === '') return ':x: Unable to comply, you have disabled guild logging. Use command \`/guild_log_channel\` to enable logging'
    try{
        guild.channels.cache.get(welcomemessagechannel.channel).send(`This is a log channel test, logs and welcomes will be sent here.\nWelcome message plugin is currentaly: \`${welcomeToggle}\`.`)
        return 'Test log message has been successfully sent!'
    } catch{
        return `:x: There was an error sending the test message, try checking my permissions or if the channel even exists.\nChannel ID: \`${welcomemessagechannel.channel}\``
    }

  },
}
const { CommandType } = require("wokcommands");
const { PermissionsBitField } = require('discord.js')
const GuildWelcome = require('../Guild3')

module.exports = {
  // command options
  description: "Sets the welcome message for your server. Leave blank to disable. Use {member} for users username",
  catagory: 'Mod/Admin Commands',
  maxArgs: 100,
  expectedArgs: "[message]",
  guildOnly: true,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, text, guild, user, member }) => {
    const guildwelcome = await GuildWelcome.findOne({_id: guild.id}).catch(error =>{
		console.log(`There was a error`)
	})
    if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return ':x: Unable to comply, you do not have \`Manage_Guild\` permision.'
    let newText
   if(!guildwelcome){
    await GuildWelcome.findOneAndUpdate({
        _id: guild.id
        },{
        _id: guild.id,
        message: '',
            
        },{
            upsert: true
        })
   }
   if(!text){
    newText = ''
   } else{
    newText = text
   }
   if(newText.length > 100){
    return 'Please enter a message less that 100 characters'
   }
   await GuildWelcome.findOneAndUpdate({
    _id: guild.id
    },{
    _id: guild.id,
    message: newText,
        
    },{
        upsert: true
    })
    if(newText === ''){
        return `Successfully toggled welcome message plugin to: \`off\``
    } else{
    return `Successfully toggled the welcome message plugin to: \`on\` and changed the server welcome message to: \`${newText}\``
    }
  },
}
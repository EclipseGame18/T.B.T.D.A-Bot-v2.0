const { CommandType } = require("wokcommands");
const { PermissionsBitField } = require('discord.js')
const GuildWelcomeChannel = require('../Guild4')

module.exports = {
  // command options
  description: "Input the channel ID ot be used as a welcome channel. Leave blank to disable",
  catagory: 'Utility Commands',
  aliases: ['welcome_channel'],
  maxArgs: 30,
  expectedArgs: "[channel ID]",
  guildOnly: true,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, text, guild, user, member }) => {
    const guildwelcomechannel = await GuildWelcomeChannel.findOne({_id: guild.id}).catch(error =>{
		console.log(`There was a error`)
	})
    if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return ':x: Unable to comply, you do not have \`Manage_Guild\` permision.'
    let newText
    if(!guildwelcomechannel){
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
       if(isNaN(newText)){
        return 'Please specify the channel ID as a number. e.g. 1234567891112131415'
       }
       if(newText.length > 30){
        return `Channel IDs usually arn't bigger than 30 characters`
       }
       await GuildWelcomeChannel.findOneAndUpdate({
        _id: guild.id
        },{
        _id: guild.id,
        channel: newText,
            
        },{
            upsert: true
        })
        if(newText === ''){
            return `Successfully toggled welcome channel to: \`off\``
        } else{
        return `Successfully toggled welcome channel plugin to: \`on\` and changed the server welcome channel to: \`${newText}\`.\nPlease run the \`/test_log\` command to confirm welcome channel.`
        }
  },
}
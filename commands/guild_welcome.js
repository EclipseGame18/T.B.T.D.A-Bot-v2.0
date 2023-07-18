const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
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
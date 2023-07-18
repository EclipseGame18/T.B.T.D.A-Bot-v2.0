const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const GuildLogChannel = require('../Guild7')

module.exports = {
  // command options
  description: "Input the channel ID ot be used as a log channel. Leave blank to disable",
  catagory: 'Mod/Admin Commands',
  aliases: ['log_channel'],
  maxArgs: 30,
  expectedArgs: "[channel ID]",
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
    const guildlogchannel = await GuildLogChannel.findOne({_id: guild.id}).catch(error =>{
		console.log(`There was a error`)
	})
    if (!member.permissions.has(PermissionsBitField.Flags.ManageGuild)) return ':x: Unable to comply, you do not have \`Manage_Guild\` permision.'
    let newText
    if(!guildlogchannel){
        await GuildLogChannel.findOneAndUpdate({
            _id: guild.id
            },{
            _id: guild.id,
            channel: '',
                
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
       await GuildLogChannel.findOneAndUpdate({
        _id: guild.id
        },{
        _id: guild.id,
        channel: newText,
            
        },{
            upsert: true
        })
        if(newText === ''){
            return `Successfully toggled log channel to: \`off\``
        } else{
        return `Successfully toggled log channel plugin to: \`on\` and changed the server log channel to: \`${newText}\`.\nPlease run the \`/test_log\` command to confirm log channel.`
        }
  },
}
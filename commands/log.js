const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const GuildWelcomeChannel = require('../Guild7')

module.exports = {
  // command options
  description: "Create a server log and post it in the server log channel.",
  catagory: 'Mod/Admin Commands',
  minArgs: 1,
  expectedArgs: "<log> <user>",
  expectedArgsTypes: ['STRING', 'USER'],
  guildOnly: true,
  options: [
    {
        name: 'log',
        description: 'Your log',
        type: 3,
        required: true,
    },
    {
        name: 'user',
        description: 'A user to include in your log (optional)',
        type: 6, // Set the option type to 6 (User mention)
        required: false,
      },
  ],
  
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
    if(!member.permissions.has(PermissionsBitField.Flags.ModerateMembers) || !member.permissions.has(PermissionsBitField.Flags.ManageMessages) || !member.permissions.has(PermissionsBitField.Flags.ManageRoles) || !member.permissions.has(PermissionsBitField.Flags.ManageNicknames) || !member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return ':x: Unable to comply, you do not have the required permisions.'
    const guildLog = await GuildWelcomeChannel.findOne({_id: guild.id}).catch(error =>{
		console.log(`There was a error`)
	})
    if(!guildLog){
        await GuildWelcomeChannel.findOneAndUpdate({
            _id: guild.id
            },{
            _id: guild.id,
            channel: '',
                
            },{
                upsert: true
            })
            return'There was an unexpected error, please try again. :shrug:'
    }
    if(guildLog.channel === '') return ':x: Unable to comply, guild logging is disabled on this server, use `/guild_log_channel {chanel ID}` to add a log channel.'

    let logmessage = args[0]
    let target = message ? message.mentions.members.first() : interaction.options.getMember('user')
    if(!target) target = false

    if(target === false){
        let noTarget = new EmbedBuilder()
        .setTitle(`${member.displayName}'s log`)
        .setDescription(`${logmessage}`)
        .setTimestamp()
        .setColor('#DAF000')

        try{
            guild.channels.cache.get(guildLog.channel).send({embeds: [noTarget]})
            }catch{
                return 'There was an error sending the log to the log channel, try checking if the channel ID is correct.'
            }
        return 'Log has been successfully sent.'
    }else{
        let withTarget = new EmbedBuilder()
        .setTitle(`${member.displayName}'s log`)
        .addFields(
            {name: 'Log', value: `${logmessage}`},
            {name: 'Guild member involved', value: `${target}`}
        )
        .setTimestamp()
        .setColor('#DAF000')
        
        try{
        guild.channels.cache.get(guildLog.channel).send({embeds: [withTarget]})
        }catch{
            return 'There was an error sending the log to the log channel, try checking if the channel ID is correct.'
        }
        return 'Log has been successfully sent.'
    }
  },
}
const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const GuildWelcomeChannel = require('../Guild7')

module.exports = {
  // command options
  description: "Warns a user in your guild.",
  catagory: 'Mod/Admin Commands',
  minArgs: 2,
  expectedArgs: "<user> <reason>",
  expectedArgsTypes: ['USER', 'STRING'],
  guildOnly: true,
  options: [
    {
      name: 'user',
      description: 'Select a user to warn',
      type: 6, // Set the option type to 6 (User mention)
      required: true,
    },
    {
        name: 'reason',
        description: 'Reason for warning the user',
        type: 3,
        required: true,
    }
  ],
  guildOnly: true,
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    if(!member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return ':x: Unable to comply, you do not have \`Moderate_Members\` permision.'
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
    let towarn = message ? message.mentions.members.first() : interaction.options.getMember('user')
    if(!towarn) return 'Please specify a user to warn'
    if(guild.ownerId === towarn.id) return ':x: You are not powerful enougth to warn the server owner!'
    args.shift()
    let reason = args[0]
    if(!reason){
        reason = 'NO_REASON_SPECIFYED'
    }

    const userwarn = new EmbedBuilder()
        .setTitle(`You were warned in ${guild.name}`)
        .addFields(
            {name: 'Warned by:', value: `${member}`},
            {name: 'Reason', value: `${reason}`}
        )
        .setTimestamp()
        .setColor('#FF6400')

    towarn.send({ embeds: [userwarn] })
    let canLog
                if(guildLog.channel !== ''){
                    canLog = true
                }else{
                    false
                }

                let x = new EmbedBuilder()
					.setTitle('User Warned')
                    .setDescription(`${canLog ? ` ` : 'No log was filed, reason: `There is currentaly no log channel in our records`'}`)
                    .addFields(
                        {name: 'Member Warned', value: `${towarn}`},
                        {name: 'Warned by', value: `${member}`},
                        {name: 'Reason', value: `${reason}`},
                    )
					.setColor('#FF6400')
                    .setTimestamp()

                    if(canLog === true){
                        try{
                            guild.channels.cache.get(guildLog.channel).send({embeds: [x]})
                            }catch{
                                return 'There was an error sending the log to the log channel, try checking if the channel ID is correct.'
                            }
                        }

                if(message){
				message.channel.send({embeds: [x]});
                }
                if(interaction){
                    interaction.reply({embeds: [x]});
                }
  },
}
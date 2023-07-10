const { CommandType } = require("wokcommands");
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const GuildWelcomeChannel = require('../Guild7')

module.exports = {
  // command options
  description: "Kicks a user from the guild.",
  catagory: 'Mod/Admin Commands',
  minArgs: 2,
  expectedArgs: "<user> <reason>",
  expectedArgsTypes: ['USER', 'STRING'],
  guildOnly: true,
  options: [
    {
      name: 'user',
      description: 'Select a user to kick',
      type: 6, // Set the option type to 6 (User mention)
      required: true,
    },
    {
        name: 'reason',
        description: 'Reason for kicking the user',
        type: 3,
        required: true,
    }
  ],
  
  // Create a legacy and slash command
  type: CommandType.BOTH,

  // Invoked when a user runs the command
  callback: async ({ message, client, channel, interaction, options, args, guild, user, member }) => {
    if(!member.permissions.has(PermissionsBitField.Flags.KickMembers)) return ':x: Unable to comply, you do not have \`Kick_Members\` permision.'
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
    let tokick = message ? message.mentions.members.first() : interaction.options.getMember('user')
            if(!tokick) return `${args[0]} is not a member.`;
            if (guild.ownerId === tokick.id) return ':x: You are not powerful enougth to kick the server owner!'
            if (!tokick.kickable) {
				return ':x: I cannot kick someone if they either have higher ranking permissions than myself, or they are server admins.'
			}
            args.shift()
            let reason = args.join(' ')

			if (!reason) reason = ('NO_REASON_SPECIFYED');

			const userwarn = new EmbedBuilder()
            .setTitle(`You were kicked in ${guild.name}`)
            .addFields(
                {name: 'Kicked by:', value: `${member}`},
                {name: 'Reason', value: `${reason}`}
            )
            .setTimestamp()
            .setColor('#E01212')

        tokick.send({ embeds: [userwarn] })
			
			if (tokick.kickable) {
                let canLog
                if(guildLog.channel !== ''){
                    canLog = true
                }else{
                    false
                }

				let x = new EmbedBuilder()
					.setTitle('User Successfully Kicked')
                    .setDescription(`${canLog ? ` ` : 'No log was filed, reason: `There is currentaly no log channel in our records`'}`)
                    .addFields(
                        {name: 'Member Kicked', value: `${tokick}`},
                        {name: 'Kicked by', value: `${member}`},
                        {name: 'Reason', value: `${reason}`}
                    )
					.setColor('#E01212')
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
				
				tokick.kick(reason).catch(error =>{
				console.log(`Failed to kick ${tokick.displayName} in ${guild.name}: ${error}`)
			    return `:x: Error: I was unable to kick the member due to an unknown error. :shrug:`
			});
			}

},
}